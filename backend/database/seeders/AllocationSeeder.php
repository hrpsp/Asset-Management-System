<?php

namespace Database\Seeders;

use App\Models\Allocation;
use App\Models\Asset;
use App\Models\Employee;
use App\Models\InstallmentPlan;
use App\Models\InstallmentSchedule;
use App\Models\RentalAgreement;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AllocationSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@hrpsp.com')->first();

        // Allocation 1: Installment - ZONG-001 with HRPSP-LT-001
        $employee1 = Employee::where('employee_code', 'ZONG-001')->first();
        $asset1 = Asset::where('asset_tag', 'HRPSP-LT-001')->first();

        $allocation1 = Allocation::create([
            'asset_id' => $asset1->id,
            'employee_id' => $employee1->id,
            'client_id' => $employee1->client_id,
            'allocation_type' => 'Installment',
            'allocation_date' => '2024-01-20',
            'handover_condition' => 'Excellent',
            'handover_notes' => 'New laptop issued for CSR duties',
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        // Create installment plan
        $plan1 = InstallmentPlan::create([
            'allocation_id' => $allocation1->id,
            'total_amount' => 185000,
            'down_payment' => 25000,
            'financed_amount' => 160000,
            'number_of_installments' => 12,
            'installment_amount' => 13334,
            'start_date' => '2024-02-01',
            'expected_end_date' => '2025-01-01',
            'status' => 'Active',
        ]);

        // Create schedule - some completed, some pending
        $startDate = Carbon::parse('2024-02-01');
        for ($i = 1; $i <= 12; $i++) {
            $dueDate = $startDate->copy()->addMonths($i - 1);
            $status = $i <= 11 ? 'Completed' : 'Pending'; // 11 paid, 1 pending

            InstallmentSchedule::create([
                'plan_id' => $plan1->id,
                'installment_number' => $i,
                'due_date' => $dueDate,
                'amount' => 13334,
                'status' => $status,
                'completed_date' => $status === 'Completed' ? $dueDate->copy()->addDays(rand(0, 5)) : null,
                'marked_by' => $status === 'Completed' ? $admin->id : null,
            ]);
        }

        // Allocation 2: Rental - ZONG-002 with HRPSP-LT-002
        $employee2 = Employee::where('employee_code', 'ZONG-002')->first();
        $asset2 = Asset::where('asset_tag', 'HRPSP-LT-002')->first();

        $allocation2 = Allocation::create([
            'asset_id' => $asset2->id,
            'employee_id' => $employee2->id,
            'client_id' => $employee2->client_id,
            'allocation_type' => 'Rental',
            'allocation_date' => '2024-02-15',
            'handover_condition' => 'Excellent',
            'handover_notes' => 'Laptop for Team Lead',
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        RentalAgreement::create([
            'allocation_id' => $allocation2->id,
            'monthly_rental' => 5000,
            'billing_day' => 15,
            'security_deposit' => 20000,
            'rental_start_date' => '2024-02-15',
            'minimum_period_months' => 6,
            'status' => 'Active',
        ]);

        // Allocation 3: Installment - BAFL-001 with HRPSP-LT-004
        $employee3 = Employee::where('employee_code', 'BAFL-001')->first();
        $asset3 = Asset::where('asset_tag', 'HRPSP-LT-004')->first();

        $allocation3 = Allocation::create([
            'asset_id' => $asset3->id,
            'employee_id' => $employee3->id,
            'client_id' => $employee3->client_id,
            'allocation_type' => 'Installment',
            'allocation_date' => '2024-04-10',
            'handover_condition' => 'Excellent',
            'handover_notes' => 'For operations work',
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        $plan3 = InstallmentPlan::create([
            'allocation_id' => $allocation3->id,
            'total_amount' => 125000,
            'down_payment' => 15000,
            'financed_amount' => 110000,
            'number_of_installments' => 10,
            'installment_amount' => 11000,
            'start_date' => '2024-05-01',
            'expected_end_date' => '2025-02-01',
            'status' => 'Active',
        ]);

        $startDate3 = Carbon::parse('2024-05-01');
        for ($i = 1; $i <= 10; $i++) {
            $dueDate = $startDate3->copy()->addMonths($i - 1);
            $status = $i <= 8 ? 'Completed' : ($i === 9 ? 'Overdue' : 'Pending');

            InstallmentSchedule::create([
                'plan_id' => $plan3->id,
                'installment_number' => $i,
                'due_date' => $dueDate,
                'amount' => 11000,
                'status' => $status,
                'completed_date' => $status === 'Completed' ? $dueDate : null,
                'marked_by' => $status === 'Completed' ? $admin->id : null,
            ]);
        }

        // Allocation 4: Rental - BAFL-003 with HRPSP-LT-005
        $employee4 = Employee::where('employee_code', 'BAFL-003')->first();
        $asset4 = Asset::where('asset_tag', 'HRPSP-LT-005')->first();

        $allocation4 = Allocation::create([
            'asset_id' => $asset4->id,
            'employee_id' => $employee4->id,
            'client_id' => $employee4->client_id,
            'allocation_type' => 'Rental',
            'allocation_date' => '2024-05-20',
            'handover_condition' => 'Excellent',
            'handover_notes' => 'Premium laptop for IT Support',
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        RentalAgreement::create([
            'allocation_id' => $allocation4->id,
            'monthly_rental' => 8000,
            'billing_day' => 20,
            'security_deposit' => 30000,
            'rental_start_date' => '2024-05-20',
            'minimum_period_months' => 12,
            'status' => 'Active',
        ]);

        // Allocation 5: Rental - MEPCO-001 with HRPSP-TB-001
        $employee5 = Employee::where('employee_code', 'MEPCO-001')->first();
        $asset5 = Asset::where('asset_tag', 'HRPSP-TB-001')->first();

        $allocation5 = Allocation::create([
            'asset_id' => $asset5->id,
            'employee_id' => $employee5->id,
            'client_id' => $employee5->client_id,
            'allocation_type' => 'Rental',
            'allocation_date' => '2024-03-15',
            'handover_condition' => 'Excellent',
            'handover_notes' => 'iPad for field work',
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        RentalAgreement::create([
            'allocation_id' => $allocation5->id,
            'monthly_rental' => 4000,
            'billing_day' => 15,
            'security_deposit' => 15000,
            'rental_start_date' => '2024-03-15',
            'minimum_period_months' => 3,
            'status' => 'Active',
        ]);

        // Allocation 6: Installment - ZONG-003 with HRPSP-MB-001
        $employee6 = Employee::where('employee_code', 'ZONG-003')->first();
        $asset6 = Asset::where('asset_tag', 'HRPSP-MB-001')->first();

        $allocation6 = Allocation::create([
            'asset_id' => $asset6->id,
            'employee_id' => $employee6->id,
            'client_id' => $employee6->client_id,
            'allocation_type' => 'Installment',
            'allocation_date' => '2024-03-05',
            'handover_condition' => 'Excellent',
            'handover_notes' => 'Company phone for QA duties',
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        $plan6 = InstallmentPlan::create([
            'allocation_id' => $allocation6->id,
            'total_amount' => 85000,
            'down_payment' => 10000,
            'financed_amount' => 75000,
            'number_of_installments' => 6,
            'installment_amount' => 12500,
            'start_date' => '2024-04-01',
            'expected_end_date' => '2024-09-01',
            'status' => 'Completed',
            'completed_at' => '2024-09-05',
        ]);

        $startDate6 = Carbon::parse('2024-04-01');
        for ($i = 1; $i <= 6; $i++) {
            InstallmentSchedule::create([
                'plan_id' => $plan6->id,
                'installment_number' => $i,
                'due_date' => $startDate6->copy()->addMonths($i - 1),
                'amount' => 12500,
                'status' => 'Completed',
                'completed_date' => $startDate6->copy()->addMonths($i - 1)->addDays(2),
                'marked_by' => $admin->id,
            ]);
        }

        // Allocation 7: Rental - BATA-001 with HRPSP-MB-003
        $employee7 = Employee::where('employee_code', 'BATA-001')->first();
        $asset7 = Asset::where('asset_tag', 'HRPSP-MB-003')->first();

        $allocation7 = Allocation::create([
            'asset_id' => $asset7->id,
            'employee_id' => $employee7->id,
            'client_id' => $employee7->client_id,
            'allocation_type' => 'Rental',
            'allocation_date' => '2024-06-20',
            'handover_condition' => 'Excellent',
            'handover_notes' => 'Store manager phone',
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        RentalAgreement::create([
            'allocation_id' => $allocation7->id,
            'monthly_rental' => 2500,
            'billing_day' => 20,
            'security_deposit' => 10000,
            'rental_start_date' => '2024-06-20',
            'minimum_period_months' => 6,
            'status' => 'Active',
        ]);
    }
}
