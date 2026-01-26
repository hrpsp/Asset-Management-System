<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAllocationRequest;
use App\Http\Resources\AllocationResource;
use App\Models\Allocation;
use App\Models\Asset;
use App\Models\InstallmentPlan;
use App\Models\InstallmentSchedule;
use App\Models\RentalAgreement;
use App\Models\AllocationPhoto;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class AllocationController extends Controller
{
    public function index(Request $request)
    {
        $query = Allocation::with(['asset', 'employee', 'client']);

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('allocation_type')) {
            $query->where('allocation_type', $request->allocation_type);
        }

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        $sortBy = $request->get('sort_by', 'allocation_date');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $allocations = $query->paginate($perPage);

        return $this->paginatedResponse($allocations, AllocationResource::class);
    }

    public function store(StoreAllocationRequest $request)
    {
        $asset = Asset::findOrFail($request->asset_id);

        if ($asset->status !== 'Available') {
            return $this->errorResponse('Asset is not available for allocation', 400);
        }

        DB::beginTransaction();

        try {
            // Create allocation
            $allocation = Allocation::create([
                'asset_id' => $request->asset_id,
                'employee_id' => $request->employee_id,
                'client_id' => $request->client_id,
                'allocation_type' => $request->allocation_type,
                'allocation_date' => $request->allocation_date,
                'handover_condition' => $request->handover_condition,
                'handover_notes' => $request->handover_notes,
                'is_active' => true,
                'created_by' => auth()->id(),
            ]);

            // Create installment plan if applicable
            if ($request->allocation_type === 'Installment') {
                $downPayment = $request->down_payment ?? 0;
                $financedAmount = $request->total_amount - $downPayment;
                $installmentAmount = round($financedAmount / $request->number_of_installments, 2);

                $startDate = Carbon::parse($request->start_date);
                $expectedEndDate = $startDate->copy()->addMonths($request->number_of_installments - 1);

                $plan = InstallmentPlan::create([
                    'allocation_id' => $allocation->id,
                    'total_amount' => $request->total_amount,
                    'down_payment' => $downPayment,
                    'financed_amount' => $financedAmount,
                    'number_of_installments' => $request->number_of_installments,
                    'installment_amount' => $installmentAmount,
                    'start_date' => $startDate,
                    'expected_end_date' => $expectedEndDate,
                    'status' => 'Active',
                ]);

                // Generate schedule
                for ($i = 1; $i <= $request->number_of_installments; $i++) {
                    InstallmentSchedule::create([
                        'plan_id' => $plan->id,
                        'installment_number' => $i,
                        'due_date' => $startDate->copy()->addMonths($i - 1),
                        'amount' => $installmentAmount,
                        'status' => 'Pending',
                    ]);
                }
            }

            // Create rental agreement if applicable
            if ($request->allocation_type === 'Rental') {
                RentalAgreement::create([
                    'allocation_id' => $allocation->id,
                    'monthly_rental' => $request->monthly_rental,
                    'billing_day' => $request->billing_day ?? 1,
                    'security_deposit' => $request->security_deposit ?? 0,
                    'rental_start_date' => $request->rental_start_date,
                    'minimum_period_months' => $request->minimum_period_months ?? 0,
                    'status' => 'Active',
                ]);
            }

            // Update asset status
            $asset->update(['status' => 'Assigned']);

            DB::commit();

            ActivityLog::log('created', 'Allocation', $allocation->id, null, $allocation->toArray());

            $allocation->load([
                'asset', 'employee', 'client',
                'installmentPlan.schedules', 'rentalAgreement'
            ]);

            return $this->createdResponse(
                new AllocationResource($allocation),
                'Asset allocated successfully'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to allocate asset: ' . $e->getMessage(), 500);
        }
    }

    public function show(Allocation $allocation)
    {
        $allocation->load([
            'asset.photos',
            'employee',
            'client',
            'handoverPhotos',
            'returnPhotos',
            'installmentPlan.schedules',
            'rentalAgreement.periods',
            'transferRequests',
        ]);

        return $this->successResponse(new AllocationResource($allocation));
    }

    public function processReturn(Request $request, Allocation $allocation)
    {
        if (!$allocation->is_active) {
            return $this->errorResponse('Allocation is already closed', 400);
        }

        $request->validate([
            'return_date' => 'required|date',
            'return_condition' => 'required|in:Excellent,Good,Fair,Poor',
            'return_notes' => 'nullable|string',
            'asset_status' => 'required|in:Available,In Repair,Retired',
            'deposit_status' => 'nullable|in:Returned,Forfeited,Adjusted',
        ]);

        DB::beginTransaction();

        try {
            $oldValues = $allocation->toArray();

            // Update allocation
            $allocation->update([
                'is_active' => false,
                'return_date' => $request->return_date,
                'return_condition' => $request->return_condition,
                'return_notes' => $request->return_notes,
            ]);

            // Update asset status
            $allocation->asset->update([
                'status' => $request->asset_status,
                'condition_status' => $request->return_condition,
            ]);

            // Handle rental deposit if applicable
            if ($allocation->rentalAgreement && $request->filled('deposit_status')) {
                $allocation->rentalAgreement->update([
                    'status' => 'Terminated',
                    'termination_date' => $request->return_date,
                    'deposit_status' => $request->deposit_status,
                ]);
            }

            // Handle installment plan if applicable
            if ($allocation->installmentPlan && $allocation->installmentPlan->status === 'Active') {
                $pendingCount = $allocation->installmentPlan->schedules()
                    ->whereIn('status', ['Pending', 'Overdue'])
                    ->count();

                if ($pendingCount > 0) {
                    $allocation->installmentPlan->update(['status' => 'Defaulted']);
                }
            }

            DB::commit();

            ActivityLog::log('returned', 'Allocation', $allocation->id, $oldValues, $allocation->toArray());

            return $this->successResponse(
                new AllocationResource($allocation->fresh()->load('asset', 'employee', 'client')),
                'Asset returned successfully'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to process return: ' . $e->getMessage(), 500);
        }
    }

    public function update(Request $request, Allocation $allocation)
    {
        $request->validate([
            'handover_condition' => 'sometimes|in:Excellent,Good,Fair,Poor',
            'handover_notes' => 'nullable|string',
            'allocation_date' => 'sometimes|date',
        ]);

        DB::beginTransaction();

        try {
            $oldValues = $allocation->toArray();

            $allocation->update($request->only([
                'handover_condition',
                'handover_notes',
                'allocation_date',
            ]));

            DB::commit();

            ActivityLog::log('updated', 'Allocation', $allocation->id, $oldValues, $allocation->toArray());

            $allocation->load(['asset', 'employee', 'client', 'installmentPlan', 'rentalAgreement']);

            return $this->successResponse(
                new AllocationResource($allocation),
                'Allocation updated successfully'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update allocation: ' . $e->getMessage(), 500);
        }
    }

    public function destroy(Allocation $allocation)
    {
        if ($allocation->is_active) {
            return $this->errorResponse('Cannot delete an active allocation. Please process return first.', 400);
        }

        try {
            ActivityLog::log('deleted', 'Allocation', $allocation->id, $allocation->toArray(), null);

            // Delete related photos
            AllocationPhoto::where('allocation_id', $allocation->id)->delete();

            $allocation->delete();

            return $this->successResponse(null, 'Allocation deleted successfully');

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete allocation: ' . $e->getMessage(), 500);
        }
    }

    public function uploadPhotos(Request $request, Allocation $allocation)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*' => 'image|max:5120',
            'photo_type' => 'required|in:Handover,Return',
        ]);

        $uploadedPhotos = [];

        foreach ($request->file('photos') as $photo) {
            $path = $photo->store('allocations/' . $allocation->id, 'public');

            $allocationPhoto = AllocationPhoto::create([
                'allocation_id' => $allocation->id,
                'photo_type' => $request->photo_type,
                'file_path' => $path,
                'uploaded_at' => now(),
            ]);

            $uploadedPhotos[] = $allocationPhoto;
        }

        return $this->successResponse(
            $uploadedPhotos,
            count($uploadedPhotos) . ' photo(s) uploaded successfully'
        );
    }
}
