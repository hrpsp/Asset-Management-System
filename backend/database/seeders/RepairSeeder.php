<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\RepairRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class RepairSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@hrpsp.com')->first();
        $itSupport = User::where('email', 'rafay@hrpsp.com')->first();

        // Repair 1: Active repair for HRPSP-LT-006
        $asset1 = Asset::where('asset_tag', 'HRPSP-LT-006')->first();

        RepairRequest::create([
            'asset_id' => $asset1->id,
            'allocation_id' => null,
            'reported_by' => 'Admin',
            'reported_date' => '2024-06-05',
            'issue_description' => 'Screen flickering and blue screen errors. System crashes randomly during operation.',
            'issue_category' => 'Screen',
            'priority' => 'High',
            'status' => 'Sent for Repair',
            'assigned_to' => $itSupport->id,
            'diagnosis_notes' => 'Possible GPU failure or display connector issue. Requires professional diagnosis.',
            'repair_vendor' => 'Dell Service Center',
            'sent_date' => '2024-06-07',
            'is_warranty_claim' => true,
            'warranty_claim_status' => 'Claimed',
        ]);

        // Repair 2: Completed repair for HRPSP-LT-001
        $asset2 = Asset::where('asset_tag', 'HRPSP-LT-001')->first();

        RepairRequest::create([
            'asset_id' => $asset2->id,
            'allocation_id' => null,
            'reported_by' => 'Admin',
            'reported_date' => '2024-03-10',
            'issue_description' => 'Keyboard keys sticking, particularly spacebar and enter key.',
            'issue_category' => 'Hardware',
            'priority' => 'Medium',
            'status' => 'Closed',
            'assigned_to' => $itSupport->id,
            'diagnosis_notes' => 'Dust and debris accumulation under keys. Requires cleaning.',
            'repair_description' => 'Keyboard cleaned thoroughly. All keys functioning properly now.',
            'received_date' => '2024-03-10',
            'repair_cost' => 0,
            'is_warranty_claim' => false,
            'warranty_claim_status' => 'N/A',
            'closed_date' => '2024-03-11',
            'resolution_notes' => 'In-house repair completed successfully. Asset returned to service.',
        ]);

        // Repair 3: Diagnosed repair for HRPSP-LT-002
        $asset3 = Asset::where('asset_tag', 'HRPSP-LT-002')->first();

        RepairRequest::create([
            'asset_id' => $asset3->id,
            'allocation_id' => null,
            'reported_by' => 'Muhammad Tariq',
            'reported_date' => '2024-05-15',
            'issue_description' => 'Battery draining very quickly. Only lasts 1-2 hours on full charge.',
            'issue_category' => 'Battery',
            'priority' => 'Medium',
            'status' => 'Diagnosed',
            'assigned_to' => $itSupport->id,
            'diagnosis_notes' => 'Battery health degraded to 45%. Requires battery replacement under warranty.',
            'repair_vendor' => 'HP Service Center',
            'is_warranty_claim' => true,
            'warranty_claim_status' => 'Claimed',
        ]);
    }
}
