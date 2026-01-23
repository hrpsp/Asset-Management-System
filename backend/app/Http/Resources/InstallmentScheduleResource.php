<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstallmentScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'plan_id' => $this->plan_id,
            'installment_number' => $this->installment_number,
            'due_date' => $this->due_date?->format('Y-m-d'),
            'amount' => $this->amount,
            'status' => $this->status,
            'completed_date' => $this->completed_date?->format('Y-m-d'),
            'notes' => $this->notes,

            // Computed
            'is_overdue' => $this->is_overdue,

            // Relationships
            'plan' => new InstallmentPlanResource($this->whenLoaded('plan')),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
