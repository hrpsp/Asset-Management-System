<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'contract_reference' => $this->contract_reference,
            'primary_contact_name' => $this->primary_contact_name,
            'primary_contact_email' => $this->primary_contact_email,
            'primary_contact_phone' => $this->primary_contact_phone,
            'sla_document_path' => $this->sla_document_path,
            'tor_document_path' => $this->tor_document_path,
            'asset_policies' => $this->asset_policies,
            'notes' => $this->notes,
            'is_active' => $this->is_active,

            // Computed
            'active_employee_count' => $this->when($this->relationLoaded('employees'), $this->active_employee_count),
            'active_asset_count' => $this->when($this->relationLoaded('allocations'), $this->active_asset_count),

            // Relationships
            'employees' => EmployeeResource::collection($this->whenLoaded('employees')),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
