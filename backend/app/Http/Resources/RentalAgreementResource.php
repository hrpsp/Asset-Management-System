<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalAgreementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'allocation_id' => $this->allocation_id,
            'monthly_rental' => $this->monthly_rental,
            'billing_day' => $this->billing_day,
            'security_deposit' => $this->security_deposit,
            'rental_start_date' => $this->rental_start_date?->format('Y-m-d'),
            'minimum_period_months' => $this->minimum_period_months,
            'status' => $this->status,
            'termination_date' => $this->termination_date?->format('Y-m-d'),
            'deposit_status' => $this->deposit_status,
            'notes' => $this->notes,

            // Computed
            'months_active' => $this->months_active,
            'total_rental_paid' => $this->total_rental_paid,
            'can_terminate' => $this->can_terminate,

            // Relationships
            'periods' => RentalPeriodResource::collection($this->whenLoaded('periods')),
            'allocation' => new AllocationResource($this->whenLoaded('allocation')),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
