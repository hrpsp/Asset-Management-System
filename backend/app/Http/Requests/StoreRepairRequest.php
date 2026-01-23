<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRepairRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isITSupport();
    }

    public function rules(): array
    {
        return [
            'asset_id' => 'required|exists:assets,id',
            'allocation_id' => 'nullable|exists:allocations,id',
            'reported_by' => 'required|string|max:255',
            'reported_date' => 'required|date',
            'issue_description' => 'required|string',
            'issue_category' => 'required|in:Hardware,Software,Physical Damage,Performance,Other',
            'priority' => 'required|in:Low,Medium,High,Critical',
            'status' => 'required|in:Reported,Diagnosed,Sent for Repair,Repaired,Closed,Cannot Repair',
            'assigned_to' => 'nullable|exists:users,id',
            'diagnosis_notes' => 'nullable|string',
            'repair_vendor' => 'nullable|string|max:255',
            'sent_date' => 'nullable|date',
            'received_date' => 'nullable|date|after:sent_date',
            'repair_description' => 'nullable|string',
            'repair_cost' => 'nullable|numeric|min:0',
            'is_warranty_claim' => 'boolean',
            'warranty_claim_status' => 'nullable|in:Submitted,Approved,Rejected,Completed',
            'spare_asset_id' => 'nullable|exists:assets,id',
            'closed_date' => 'nullable|date',
            'resolution_notes' => 'nullable|string',
        ];
    }
}
