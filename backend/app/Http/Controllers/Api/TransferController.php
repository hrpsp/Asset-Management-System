<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransferRequest;
use App\Http\Resources\TransferRequestResource;
use App\Models\TransferRequest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class TransferController extends Controller
{
    public function index(Request $request)
    {
        $query = TransferRequest::with([
            'allocation.asset',
            'allocation.employee',
            'allocation.client',
            'initiatedByUser',
            'assignedToUser',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('transfer_type')) {
            $query->where('transfer_type', $request->transfer_type);
        }

        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        $transfers = $query->orderBy('initiated_date', 'desc')->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($transfers, TransferRequestResource::class);
    }

    public function store(StoreTransferRequest $request)
    {
        $transfer = TransferRequest::create([
            'allocation_id' => $request->allocation_id,
            'transfer_type' => $request->transfer_type,
            'trigger_reason' => $request->trigger_reason,
            'reason_details' => $request->reason_details,
            'initiated_date' => now(),
            'initiated_by' => auth()->id(),
            'deadline_date' => $request->deadline_date,
            'assigned_to' => $request->assigned_to,
            'status' => 'Pending',
            'checklist' => TransferRequest::getDefaultChecklist(),
            'notes' => $request->notes,
        ]);

        ActivityLog::log('created', 'TransferRequest', $transfer->id, null, $transfer->toArray());

        return $this->createdResponse(
            new TransferRequestResource($transfer->load('allocation.asset', 'allocation.employee')),
            'Transfer request created successfully'
        );
    }

    public function show(TransferRequest $transfer)
    {
        $transfer->load([
            'allocation.asset',
            'allocation.employee',
            'allocation.client',
            'allocation.installmentPlan',
            'allocation.rentalAgreement',
            'initiatedByUser',
            'assignedToUser',
        ]);

        return $this->successResponse(new TransferRequestResource($transfer));
    }

    public function updateStatus(Request $request, TransferRequest $transfer)
    {
        $request->validate([
            'status' => 'required|in:Pending,In Progress,Completed,Escalated,Cancelled',
            'notes' => 'nullable|string',
        ]);

        $oldValues = $transfer->toArray();

        $updateData = [
            'status' => $request->status,
        ];

        if ($request->status === 'Completed') {
            $updateData['completion_date'] = now();
        }

        if ($request->filled('notes')) {
            $updateData['notes'] = $request->notes;
        }

        $transfer->update($updateData);

        ActivityLog::log('status_updated', 'TransferRequest', $transfer->id, $oldValues, $transfer->toArray());

        return $this->successResponse(
            new TransferRequestResource($transfer),
            'Transfer status updated successfully'
        );
    }

    public function updateChecklist(Request $request, TransferRequest $transfer)
    {
        $request->validate([
            'checklist' => 'required|array',
        ]);

        $oldValues = $transfer->toArray();
        $transfer->update(['checklist' => $request->checklist]);

        ActivityLog::log('checklist_updated', 'TransferRequest', $transfer->id, $oldValues, $transfer->toArray());

        return $this->successResponse(
            new TransferRequestResource($transfer),
            'Checklist updated successfully'
        );
    }

    public function pending()
    {
        $transfers = TransferRequest::with([
            'allocation.asset',
            'allocation.employee',
            'allocation.client',
            'assignedToUser',
        ])
            ->pending()
            ->orderBy('deadline_date')
            ->get();

        return $this->successResponse(TransferRequestResource::collection($transfers));
    }

    public function update(Request $request, TransferRequest $transfer)
    {
        $request->validate([
            'transfer_type' => 'sometimes|in:Client Transfer,Employee Transfer,Department Transfer,Location Transfer,Return to Pool',
            'trigger_reason' => 'sometimes|in:Employee Change,Project End,Asset Upgrade,Client Request,Relocation,Other',
            'reason_details' => 'nullable|string',
            'deadline_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'sometimes|in:Pending,In Progress,Completed,Escalated,Cancelled',
            'notes' => 'nullable|string',
        ]);

        $oldValues = $transfer->toArray();

        $updateData = $request->only([
            'transfer_type', 'trigger_reason', 'reason_details',
            'deadline_date', 'assigned_to', 'status', 'notes'
        ]);

        if ($request->has('status') && $request->status === 'Completed') {
            $updateData['completion_date'] = now();
        }

        $transfer->update($updateData);

        ActivityLog::log('updated', 'TransferRequest', $transfer->id, $oldValues, $transfer->toArray());

        return $this->successResponse(
            new TransferRequestResource($transfer->load('allocation.asset', 'allocation.employee')),
            'Transfer request updated successfully'
        );
    }

    public function destroy(TransferRequest $transfer)
    {
        if (in_array($transfer->status, ['In Progress', 'Completed'])) {
            return $this->errorResponse('Cannot delete transfer request in current status', 400);
        }

        try {
            ActivityLog::log('deleted', 'TransferRequest', $transfer->id, $transfer->toArray(), null);

            $transfer->delete();

            return $this->successResponse(null, 'Transfer request deleted successfully');

        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete transfer request: ' . $e->getMessage(), 500);
        }
    }
}
