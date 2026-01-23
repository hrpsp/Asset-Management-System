<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->canManageAllocations();
    }

    public function rules(): array
    {
        return [
            'allocation_id' => 'required|exists:allocations,id',
            'transfer_type' => 'required|in:Return Asset,Employee Exit,Asset Transfer',
            'trigger_reason' => 'required|in:Resignation,Termination,Contract End,Relocation,Asset Upgrade,Other',
            'reason_details' => 'nullable|string',
            'initiated_date' => 'required|date',
            'initiated_by' => 'required|exists:users,id',
            'deadline_date' => 'nullable|date|after:initiated_date',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'required|in:Pending,In Progress,Completed,Cancelled',
            'completion_date' => 'nullable|date',
            'checklist' => 'nullable|array',
            'notes' => 'nullable|string',
        ];
    }
}
