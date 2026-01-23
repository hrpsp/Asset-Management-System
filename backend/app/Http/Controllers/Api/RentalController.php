<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RentalAgreementResource;
use App\Models\RentalAgreement;
use App\Models\RentalPeriod;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    public function index(Request $request)
    {
        $query = RentalAgreement::with([
            'allocation.asset',
            'allocation.employee',
            'allocation.client',
            'periods'
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('client_id')) {
            $query->whereHas('allocation', function ($q) use ($request) {
                $q->where('client_id', $request->client_id);
            });
        }

        $rentals = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($rentals, RentalAgreementResource::class);
    }

    public function show(RentalAgreement $rental)
    {
        $rental->load([
            'allocation.asset',
            'allocation.employee',
            'allocation.client',
            'periods'
        ]);

        return $this->successResponse(new RentalAgreementResource($rental));
    }

    public function terminate(Request $request, RentalAgreement $rental)
    {
        if ($rental->status === 'Terminated') {
            return $this->errorResponse('Rental is already terminated', 400);
        }

        $request->validate([
            'termination_date' => 'required|date',
            'deposit_status' => 'required|in:Returned,Forfeited,Adjusted',
            'notes' => 'nullable|string',
        ]);

        $oldValues = $rental->toArray();

        $rental->update([
            'status' => 'Terminated',
            'termination_date' => $request->termination_date,
            'deposit_status' => $request->deposit_status,
            'notes' => $request->notes,
        ]);

        ActivityLog::log('terminated', 'RentalAgreement', $rental->id, $oldValues, $rental->toArray());

        return $this->successResponse(
            new RentalAgreementResource($rental),
            'Rental terminated successfully'
        );
    }

    public function markPeriodComplete(Request $request, RentalAgreement $rental)
    {
        $request->validate([
            'period_month' => 'required|string|size:7', // Format: 2026-01
        ]);

        $period = $rental->periods()->where('period_month', $request->period_month)->first();

        if (!$period) {
            $period = RentalPeriod::create([
                'rental_id' => $rental->id,
                'period_month' => $request->period_month,
                'status' => 'Completed',
            ]);
        } else {
            $period->update(['status' => 'Completed']);
        }

        return $this->successResponse($period, 'Rental period marked as complete');
    }
}
