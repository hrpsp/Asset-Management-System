<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Client;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $zong = Client::where('code', 'ZONG')->first();
        $bafl = Client::where('code', 'BAFL')->first();
        $mepco = Client::where('code', 'MEPCO')->first();
        $bata = Client::where('code', 'BATA')->first();

        $employees = [
            // Zong Employees
            [
                'employee_code' => 'ZONG-001',
                'name' => 'Muhammad Hassan',
                'cnic' => '35201-1234567-1',
                'email' => 'hassan@hrpsp.com',
                'phone' => '+92-300-1111111',
                'client_id' => $zong->id,
                'department' => 'Call Center',
                'designation' => 'Customer Service Representative',
                'employment_status' => 'Active',
                'joining_date' => '2024-01-15',
            ],
            [
                'employee_code' => 'ZONG-002',
                'name' => 'Fatima Zahra',
                'cnic' => '35201-2345678-2',
                'email' => 'fatima@hrpsp.com',
                'phone' => '+92-300-2222222',
                'client_id' => $zong->id,
                'department' => 'Call Center',
                'designation' => 'Team Lead',
                'employment_status' => 'Active',
                'joining_date' => '2023-06-01',
            ],
            [
                'employee_code' => 'ZONG-003',
                'name' => 'Ahmed Raza',
                'cnic' => '35201-3456789-3',
                'email' => 'ahmed.raza@hrpsp.com',
                'phone' => '+92-300-3333333',
                'client_id' => $zong->id,
                'department' => 'Quality Assurance',
                'designation' => 'QA Analyst',
                'employment_status' => 'Active',
                'joining_date' => '2024-03-01',
            ],
            [
                'employee_code' => 'ZONG-004',
                'name' => 'Sana Malik',
                'cnic' => '35201-4567890-4',
                'email' => 'sana.malik@hrpsp.com',
                'phone' => '+92-300-4444444',
                'client_id' => $zong->id,
                'department' => 'Call Center',
                'designation' => 'Customer Service Representative',
                'employment_status' => 'Resigned',
                'joining_date' => '2023-09-15',
                'exit_date' => '2024-12-31',
            ],

            // Bank Alfalah Employees
            [
                'employee_code' => 'BAFL-001',
                'name' => 'Imran Khan',
                'cnic' => '35202-1234567-1',
                'email' => 'imran.khan@hrpsp.com',
                'phone' => '+92-321-1111111',
                'client_id' => $bafl->id,
                'department' => 'Operations',
                'designation' => 'Operations Officer',
                'employment_status' => 'Active',
                'joining_date' => '2024-02-01',
            ],
            [
                'employee_code' => 'BAFL-002',
                'name' => 'Nadia Hussain',
                'cnic' => '35202-2345678-2',
                'email' => 'nadia.hussain@hrpsp.com',
                'phone' => '+92-321-2222222',
                'client_id' => $bafl->id,
                'department' => 'Customer Service',
                'designation' => 'Branch Service Officer',
                'employment_status' => 'Active',
                'joining_date' => '2024-04-15',
            ],
            [
                'employee_code' => 'BAFL-003',
                'name' => 'Bilal Ahmed',
                'cnic' => '35202-3456789-3',
                'email' => 'bilal.ahmed@hrpsp.com',
                'phone' => '+92-321-3333333',
                'client_id' => $bafl->id,
                'department' => 'IT Support',
                'designation' => 'IT Support Specialist',
                'employment_status' => 'Active',
                'joining_date' => '2023-11-01',
            ],

            // MEPCO Employees
            [
                'employee_code' => 'MEPCO-001',
                'name' => 'Tariq Mahmood',
                'cnic' => '36302-1234567-1',
                'email' => 'tariq.mahmood@hrpsp.com',
                'phone' => '+92-333-1111111',
                'client_id' => $mepco->id,
                'department' => 'Field Operations',
                'designation' => 'Field Supervisor',
                'employment_status' => 'Active',
                'joining_date' => '2024-01-01',
            ],
            [
                'employee_code' => 'MEPCO-002',
                'name' => 'Amina Bibi',
                'cnic' => '36302-2345678-2',
                'email' => 'amina.bibi@hrpsp.com',
                'phone' => '+92-333-2222222',
                'client_id' => $mepco->id,
                'department' => 'Billing',
                'designation' => 'Billing Officer',
                'employment_status' => 'Active',
                'joining_date' => '2024-05-01',
            ],

            // Bata Employees
            [
                'employee_code' => 'BATA-001',
                'name' => 'Kashif Ali',
                'cnic' => '35101-1234567-1',
                'email' => 'kashif.ali@hrpsp.com',
                'phone' => '+92-311-1111111',
                'client_id' => $bata->id,
                'department' => 'Retail',
                'designation' => 'Store Manager',
                'employment_status' => 'Active',
                'joining_date' => '2024-03-15',
            ],
            [
                'employee_code' => 'BATA-002',
                'name' => 'Rabia Noor',
                'cnic' => '35101-2345678-2',
                'email' => 'rabia.noor@hrpsp.com',
                'phone' => '+92-311-2222222',
                'client_id' => $bata->id,
                'department' => 'Inventory',
                'designation' => 'Inventory Coordinator',
                'employment_status' => 'Active',
                'joining_date' => '2024-06-01',
            ],
            [
                'employee_code' => 'BATA-003',
                'name' => 'Usman Tariq',
                'cnic' => '35101-3456789-3',
                'email' => 'usman.tariq@hrpsp.com',
                'phone' => '+92-311-3333333',
                'client_id' => $bata->id,
                'department' => 'Sales',
                'designation' => 'Sales Associate',
                'employment_status' => 'Active',
                'joining_date' => '2024-07-01',
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}
