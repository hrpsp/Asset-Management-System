<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee_code' => $this->employee_code,
            'name' => $this->name,
            'cnic' => $this->cnic,
            'email' => $this->email,
            'phone' => $this->phone,
            'client_id' => $this->client_id,
            'department' => $this->department,
            'designation' => $this->designation,
            'employment_status' => $this->employment_status,
            'joining_date' => $this->joining_date?->format('Y-m-d'),
            'exit_date' => $this->exit_date?->format('Y-m-d'),

            // Computed
            'full_details' => $this->full_details,
            'active_asset_count' => $this->active_asset_count,

            // Relationships
            'client' => new ClientResource($this->whenLoaded('client')),
            'active_allocations' => AllocationResource::collection($this->whenLoaded('activeAllocations')),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
