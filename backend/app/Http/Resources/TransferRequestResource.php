<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransferRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'allocation_id' => $this->allocation_id,
            'transfer_type' => $this->transfer_type,
            'trigger_reason' => $this->trigger_reason,
            'reason_details' => $this->reason_details,
            'initiated_date' => $this->initiated_date?->format('Y-m-d'),
            'initiated_by' => $this->initiated_by,
            'deadline_date' => $this->deadline_date?->format('Y-m-d'),
            'assigned_to' => $this->assigned_to,
            'status' => $this->status,
            'completion_date' => $this->completion_date?->format('Y-m-d'),
            'checklist' => $this->checklist,
            'notes' => $this->notes,

            // Computed
            'is_overdue' => $this->is_overdue,
            'checklist_progress' => $this->checklist_progress,

            // Relationships
            'allocation' => new AllocationResource($this->whenLoaded('allocation')),
            'initiated_by_user' => new UserResource($this->whenLoaded('initiatedByUser')),
            'assigned_to_user' => new UserResource($this->whenLoaded('assignedToUser')),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
