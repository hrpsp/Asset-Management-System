<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RepairRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'asset_id' => $this->asset_id,
            'allocation_id' => $this->allocation_id,
            'reported_by' => $this->reported_by,
            'reported_date' => $this->reported_date?->format('Y-m-d'),
            'issue_description' => $this->issue_description,
            'issue_category' => $this->issue_category,
            'priority' => $this->priority,
            'status' => $this->status,
            'assigned_to' => $this->assigned_to,
            'diagnosis_notes' => $this->diagnosis_notes,
            'repair_vendor' => $this->repair_vendor,
            'sent_date' => $this->sent_date?->format('Y-m-d'),
            'received_date' => $this->received_date?->format('Y-m-d'),
            'repair_description' => $this->repair_description,
            'repair_cost' => $this->repair_cost,
            'is_warranty_claim' => $this->is_warranty_claim,
            'warranty_claim_status' => $this->warranty_claim_status,
            'spare_asset_id' => $this->spare_asset_id,
            'closed_date' => $this->closed_date?->format('Y-m-d'),
            'resolution_notes' => $this->resolution_notes,

            // Computed
            'is_open' => $this->is_open,
            'days_open' => $this->days_open,
            'turnaround_days' => $this->turnaround_days,

            // Relationships
            'asset' => new AssetResource($this->whenLoaded('asset')),
            'allocation' => new AllocationResource($this->whenLoaded('allocation')),
            'assigned_to_user' => new UserResource($this->whenLoaded('assignedToUser')),
            'spare_asset' => new AssetResource($this->whenLoaded('spareAsset')),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
