<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->canManageAssets();
    }

    public function rules(): array
    {
        $assetId = $this->route('asset');

        return [
            'asset_tag' => 'sometimes|required|string|max:100|unique:assets,asset_tag,' . $assetId,
            'asset_type' => 'sometimes|required|in:Laptop,Tablet,Phone,Monitor,Keyboard,Mouse,Headset,Other',
            'brand' => 'sometimes|required|string|max:100',
            'model' => 'sometimes|required|string|max:100',
            'serial_number' => 'sometimes|required|string|max:100|unique:assets,serial_number,' . $assetId,
            'specifications' => 'nullable|array',
            'purchase_date' => 'sometimes|required|date',
            'purchase_price' => 'sometimes|required|numeric|min:0',
            'supplier' => 'nullable|string|max:255',
            'warranty_expiry' => 'nullable|date',
            'ownership_type' => 'sometimes|required|in:Company-owned,Leased,Vendor-provided',
            'current_status' => 'sometimes|required|in:Available,Allocated,In Repair,Written Off,Sold',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ];
    }
}
