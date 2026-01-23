<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRepairRequest;
use App\Http\Resources\RepairRequestResource;
use App\Models\RepairRequest;
use App\Models\Asset;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class RepairController extends Controller
{
    public function index(Request $request)
    {
        $query = RepairRequest::with([
            'asset',
            'allocation.employee',
            'assignedToUser',
            'spareAsset',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('issue_category')) {
            $query->where('issue_category', $request->issue_category);
        }

        if ($request->filled('asset_id')) {
            $query->where('asset_id', $request->asset_id);
        }

        $repairs = $query->orderBy('reported_date', 'desc')->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($repairs, RepairRequestResource::class);
    }

    public function store(StoreRepairRequest $request)
    {
        $asset = Asset::findOrFail($request->asset_id);
        $allocation = $asset->activeAllocation;

        $repair = RepairRequest::create([
            'asset_id' => $request->asset_id,
            'allocation_id' => $allocation?->id,
            'reported_by' => $request->reported_by,
            'reported_date' => $request->reported_date,
            'issue_description' => $request->issue_description,
            'issue_category' => $request->issue_category,
            'priority' => $request->priority ?? 'Medium',
            'status' => 'Reported',
        ]);

        // Update asset status
        $asset->update(['status' => 'In Repair']);

        ActivityLog::log('created', 'RepairRequest', $repair->id, null, $repair->toArray());

        return $this->createdResponse(
            new RepairRequestResource($repair->load('asset', 'allocation.employee')),
            'Repair request created successfully'
        );
    }

    public function show(RepairRequest $repair)
    {
        $repair->load([
            'asset',
            'allocation.employee',
            'allocation.client',
            'assignedToUser',
            'spareAsset',
        ]);

        return $this->successResponse(new RepairRequestResource($repair));
    }

    public function updateStatus(Request $request, RepairRequest $repair)
    {
        $request->validate([
            'status' => 'required|in:Reported,Diagnosed,Sent for Repair,Repaired,Closed,Cannot Repair',
            'diagnosis_notes' => 'nullable|string',
            'repair_vendor' => 'nullable|string',
            'repair_description' => 'nullable|string',
            'repair_cost' => 'nullable|numeric|min:0',
            'resolution_notes' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'is_warranty_claim' => 'nullable|boolean',
            'warranty_claim_status' => 'nullable|in:N/A,Claimed,Approved,Rejected',
        ]);

        $oldValues = $repair->toArray();

        $updateData = $request->only([
            'status', 'diagnosis_notes', 'repair_vendor', 'repair_description',
            'repair_cost', 'resolution_notes', 'assigned_to',
            'is_warranty_claim', 'warranty_claim_status'
        ]);

        // Set dates based on status
        if ($request->status === 'Sent for Repair' && !$repair->sent_date) {
            $updateData['sent_date'] = now();
        }

        if ($request->status === 'Repaired' && !$repair->received_date) {
            $updateData['received_date'] = now();
        }

        if (in_array($request->status, ['Closed', 'Cannot Repair'])) {
            $updateData['closed_date'] = now();

            // Update asset status back
            if ($request->status === 'Closed') {
                $repair->asset->update(['status' => $repair->allocation ? 'Assigned' : 'Available']);
            } elseif ($request->status === 'Cannot Repair') {
                $repair->asset->update(['status' => 'Retired']);
            }
        }

        $repair->update($updateData);

        ActivityLog::log('status_updated', 'RepairRequest', $repair->id, $oldValues, $repair->toArray());

        return $this->successResponse(
            new RepairRequestResource($repair),
            'Repair status updated successfully'
        );
    }

    public function issueSpare(Request $request, RepairRequest $repair)
    {
        $request->validate([
            'spare_asset_id' => 'required|exists:assets,id',
        ]);

        $spareAsset = Asset::findOrFail($request->spare_asset_id);

        if ($spareAsset->status !== 'Available') {
            return $this->errorResponse('Spare asset is not available', 400);
        }

        $repair->update(['spare_asset_id' => $spareAsset->id]);
        $spareAsset->update(['status' => 'Assigned']);

        return $this->successResponse(
            new RepairRequestResource($repair->load('spareAsset')),
            'Spare asset issued successfully'
        );
    }

    public function queue()
    {
        $repairs = RepairRequest::with(['asset', 'allocation.employee', 'assignedToUser'])
            ->open()
            ->orderByRaw("FIELD(priority, 'Critical', 'High', 'Medium', 'Low')")
            ->orderBy('reported_date')
            ->get();

        return $this->successResponse(RepairRequestResource::collection($repairs));
    }

    public function assetHistory(Asset $asset)
    {
        $repairs = $asset->repairs()
            ->with('assignedToUser')
            ->orderBy('reported_date', 'desc')
            ->get();

        return $this->successResponse(RepairRequestResource::collection($repairs));
    }
}
