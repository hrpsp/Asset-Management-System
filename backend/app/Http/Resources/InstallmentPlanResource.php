<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstallmentPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'allocation_id' => $this->allocation_id,
            'total_amount' => $this->total_amount,
            'down_payment' => $this->down_payment,
            'financed_amount' => $this->financed_amount,
            'number_of_installments' => $this->number_of_installments,
            'installment_amount' => $this->installment_amount,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'expected_end_date' => $this->expected_end_date?->format('Y-m-d'),
            'status' => $this->status,
            'completed_at' => $this->completed_at?->format('Y-m-d H:i:s'),
            'notes' => $this->notes,

            // Computed
            'paid_count' => $this->paid_count,
            'pending_count' => $this->pending_count,
            'overdue_count' => $this->overdue_count,
            'progress_percentage' => $this->progress_percentage,
            'paid_amount' => $this->paid_amount,
            'remaining_amount' => $this->remaining_amount,

            // Relationships
            'schedules' => InstallmentScheduleResource::collection($this->whenLoaded('schedules')),
            'allocation' => new AllocationResource($this->whenLoaded('allocation')),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
