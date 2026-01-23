<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isHROperations();
    }

    public function rules(): array
    {
        return [
            'client_id' => 'required|exists:clients,id',
            'employee_code' => 'required|string|max:50|unique:employees,employee_code',
            'full_name' => 'required|string|max:255',
            'national_id' => 'nullable|string|max:50',
            'email' => 'required|email|max:255|unique:employees,email',
            'phone' => 'nullable|string|max:50',
            'position' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'hire_date' => 'required|date',
            'employment_status' => 'required|in:Active,On Leave,Resigned,Terminated',
            'exit_date' => 'nullable|date|after:hire_date',
            'notes' => 'nullable|string',
        ];
    }
}
