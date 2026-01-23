<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\AllocationResource;
use App\Models\Employee;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('client');

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->filled('employment_status')) {
            $query->where('employment_status', $request->employment_status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('employee_code', 'like', "%{$search}%")
                    ->orWhere('cnic', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $employees = $query->paginate($perPage);

        return $this->paginatedResponse($employees, EmployeeResource::class);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $employee = Employee::create($request->validated());

        ActivityLog::log('created', 'Employee', $employee->id, null, $employee->toArray());

        return $this->createdResponse(
            new EmployeeResource($employee->load('client')),
            'Employee created successfully'
        );
    }

    public function show(Employee $employee)
    {
        $employee->load([
            'client',
            'activeAllocations.asset',
            'activeAllocations.installmentPlan',
            'activeAllocations.rentalAgreement',
        ]);

        return $this->successResponse(new EmployeeResource($employee));
    }

    public function update(Request $request, Employee $employee)
    {
        $request->validate([
            'employee_code' => ['sometimes', 'string', 'max:50', Rule::unique('employees')->ignore($employee)],
            'name' => 'sometimes|string|max:255',
            'cnic' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'client_id' => 'sometimes|exists:clients,id',
            'department' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'employment_status' => 'sometimes|in:Active,Resigned,Terminated,On Notice',
            'joining_date' => 'nullable|date',
            'exit_date' => 'nullable|date',
        ]);

        $oldValues = $employee->toArray();
        $employee->update($request->all());

        ActivityLog::log('updated', 'Employee', $employee->id, $oldValues, $employee->toArray());

        return $this->successResponse(
            new EmployeeResource($employee->load('client')),
            'Employee updated successfully'
        );
    }

    public function destroy(Employee $employee)
    {
        $activeAllocations = $employee->allocations()->where('is_active', true)->count();

        if ($activeAllocations > 0) {
            return $this->errorResponse(
                "Cannot delete employee with {$activeAllocations} active allocation(s). Return assets first.",
                400
            );
        }

        $oldValues = $employee->toArray();
        $employee->delete();

        ActivityLog::log('deleted', 'Employee', $employee->id, $oldValues, null);

        return $this->successResponse(null, 'Employee deleted successfully');
    }

    public function assets(Employee $employee)
    {
        $allocations = $employee->allocations()
            ->with(['asset', 'installmentPlan.schedules', 'rentalAgreement'])
            ->orderBy('is_active', 'desc')
            ->orderBy('allocation_date', 'desc')
            ->get();

        return $this->successResponse(AllocationResource::collection($allocations));
    }

    public function active(Request $request)
    {
        $query = Employee::active()->with('client');

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        $employees = $query->orderBy('name')->get();

        return $this->successResponse(EmployeeResource::collection($employees));
    }
}
