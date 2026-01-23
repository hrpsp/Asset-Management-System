<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InstallmentPlanResource;
use App\Http\Resources\InstallmentScheduleResource;
use App\Models\InstallmentPlan;
use App\Models\InstallmentSchedule;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class InstallmentController extends Controller
{
    public function index(Request $request)
    {
        $query = InstallmentPlan::with([
            'allocation.asset',
            'allocation.employee',
            'allocation.client',
            'schedules'
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('client_id')) {
            $query->whereHas('allocation', function ($q) use ($request) {
                $q->where('client_id', $request->client_id);
            });
        }

        $plans = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($plans, InstallmentPlanResource::class);
    }

    public function show(InstallmentPlan $installmentPlan)
    {
        $installmentPlan->load([
            'allocation.asset',
            'allocation.employee',
            'allocation.client',
            'schedules'
        ]);

        return $this->successResponse(new InstallmentPlanResource($installmentPlan));
    }

    public function updateScheduleStatus(Request $request, InstallmentPlan $plan, $installmentNumber)
    {
        $request->validate([
            'status' => 'required|in:Pending,Completed,Overdue,Waived',
            'notes' => 'nullable|string|max:500',
        ]);

        $schedule = $plan->schedules()->where('installment_number', $installmentNumber)->firstOrFail();

        $oldValues = $schedule->toArray();

        $updateData = [
            'status' => $request->status,
            'notes' => $request->notes,
        ];

        if ($request->status === 'Completed') {
            $updateData['completed_date'] = now();
            $updateData['marked_by'] = auth()->id();
        }

        $schedule->update($updateData);

        // Check if all installments are completed
        $pendingCount = $plan->schedules()->whereIn('status', ['Pending', 'Overdue'])->count();
        if ($pendingCount === 0) {
            $plan->update([
                'status' => 'Completed',
                'completed_at' => now(),
            ]);

            // Update asset status to Transferred
            $plan->allocation->asset->update(['status' => 'Transferred']);

            // Close allocation
            $plan->allocation->update(['is_active' => false]);
        }

        ActivityLog::log('installment_updated', 'InstallmentSchedule', $schedule->id, $oldValues, $schedule->toArray());

        return $this->successResponse(
            new InstallmentScheduleResource($schedule),
            'Installment status updated successfully'
        );
    }

    public function overdue(Request $request)
    {
        $schedules = InstallmentSchedule::with([
            'plan.allocation.asset',
            'plan.allocation.employee',
            'plan.allocation.client',
        ])
            ->where('status', 'Pending')
            ->where('due_date', '<', now())
            ->orderBy('due_date')
            ->get();

        // Update status to Overdue
        foreach ($schedules as $schedule) {
            if ($schedule->status === 'Pending') {
                $schedule->update(['status' => 'Overdue']);
            }
        }

        return $this->successResponse(InstallmentScheduleResource::collection($schedules));
    }
}
