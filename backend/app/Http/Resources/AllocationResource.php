<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AllocationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'asset_id' => $this->asset_id,
            'employee_id' => $this->employee_id,
            'client_id' => $this->client_id,
            'allocation_type' => $this->allocation_type,
            'allocation_date' => $this->allocation_date?->format('Y-m-d'),
            'handover_condition' => $this->handover_condition,
            'handover_document_path' => $this->handover_document_path,
            'handover_notes' => $this->handover_notes,
            'is_active' => $this->is_active,
            'return_date' => $this->return_date?->format('Y-m-d'),
            'return_condition' => $this->return_condition,
            'return_notes' => $this->return_notes,

            // Computed
            'is_installment' => $this->is_installment,
            'is_rental' => $this->is_rental,
            'duration_days' => $this->duration_days,

            // Relationships
            'asset' => new AssetResource($this->whenLoaded('asset')),
            'employee' => new EmployeeResource($this->whenLoaded('employee')),
            'client' => new ClientResource($this->whenLoaded('client')),
            'handover_photos' => AllocationPhotoResource::collection($this->whenLoaded('handoverPhotos')),
            'return_photos' => AllocationPhotoResource::collection($this->whenLoaded('returnPhotos')),
            'installment_plan' => new InstallmentPlanResource($this->whenLoaded('installmentPlan')),
            'rental_agreement' => new RentalAgreementResource($this->whenLoaded('rentalAgreement')),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
