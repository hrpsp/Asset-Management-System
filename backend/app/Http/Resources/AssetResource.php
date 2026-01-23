<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'asset_tag' => $this->asset_tag,
            'asset_type' => $this->asset_type,
            'brand' => $this->brand,
            'model' => $this->model,
            'serial_number' => $this->serial_number,
            'specifications' => $this->specifications,
            'purchase_date' => $this->purchase_date?->format('Y-m-d'),
            'purchase_price' => $this->purchase_price,
            'vendor' => $this->vendor,
            'warranty_expiry' => $this->warranty_expiry?->format('Y-m-d'),
            'is_under_warranty' => $this->is_under_warranty,
            'status' => $this->status,
            'condition_status' => $this->condition_status,
            'current_location' => $this->current_location,
            'notes' => $this->notes,
            'display_name' => $this->display_name,

            // Relationships (when loaded)
            'photos' => AssetPhotoResource::collection($this->whenLoaded('photos')),
            'current_holder' => new EmployeeResource($this->whenLoaded('activeAllocation', fn() => $this->activeAllocation?->employee)),
            'current_client' => new ClientResource($this->whenLoaded('activeAllocation', fn() => $this->activeAllocation?->client)),
            'active_allocation' => new AllocationResource($this->whenLoaded('activeAllocation')),
            'allocations_count' => $this->when($this->allocations_count !== null, $this->allocations_count),
            'repairs_count' => $this->when($this->repairs_count !== null, $this->repairs_count),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
