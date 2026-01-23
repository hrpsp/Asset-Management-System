<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->canManageAssets();
    }

    public function rules(): array
    {
        return [
            'asset_tag' => 'required|string|max:100|unique:assets,asset_tag',
            'asset_type' => 'required|in:Laptop,Tablet,Phone,Monitor,Keyboard,Mouse,Headset,Other',
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'serial_number' => 'required|string|max:100|unique:assets,serial_number',
            'specifications' => 'nullable|array',
            'purchase_date' => 'required|date',
            'purchase_price' => 'required|numeric|min:0',
            'supplier' => 'nullable|string|max:255',
            'warranty_expiry' => 'nullable|date|after:purchase_date',
            'ownership_type' => 'required|in:Company-owned,Leased,Vendor-provided',
            'current_status' => 'required|in:Available,Allocated,In Repair,Written Off,Sold',
            'location' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ];
    }
}
