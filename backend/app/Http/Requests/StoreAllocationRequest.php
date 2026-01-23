<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAllocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->canManageAllocations();
    }

    public function rules(): array
    {
        return [
            'asset_id' => 'required|exists:assets,id',
            'employee_id' => 'required|exists:employees,id',
            'allocation_date' => 'required|date',
            'expected_return_date' => 'nullable|date|after:allocation_date',
            'payment_arrangement' => 'required|in:Free,Installment,Rental',
            'security_deposit' => 'nullable|numeric|min:0',
            'deposit_paid_date' => 'nullable|date',
            'deposit_status' => 'nullable|in:Held,Refunded,Forfeited',
            'asset_condition_on_handover' => 'nullable|string',
            'asset_condition_on_return' => 'nullable|string',
            'status' => 'required|in:Active,Completed,Cancelled',
            'return_date' => 'nullable|date|after:allocation_date',
            'created_by' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ];
    }
}
