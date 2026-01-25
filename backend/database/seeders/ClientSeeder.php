<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            [
                'name' => 'Zong (CMPak)',
                'code' => 'ZONG',
                'contract_reference' => 'HRPSP/ZONG/2024/001',
                'primary_contact_name' => 'Ali Ahmed',
                'primary_contact_email' => 'ali.ahmed@zong.com.pk',
                'primary_contact_phone' => '+92-321-1234567',
                'asset_policies' => [
                    'allowed_asset_types' => ['Laptop', 'Mobile'],
                    'approved_brands' => ['Dell', 'HP', 'Lenovo', 'Samsung'],
                    'max_asset_value' => 300000,
                    'replacement_policy' => 'Replace if repair cost > 40% of value',
                    'data_wipe_required' => true,
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Bank Alfalah Limited',
                'code' => 'BAFL',
                'contract_reference' => 'HRPSP/BAFL/2024/002',
                'primary_contact_name' => 'Sara Khan',
                'primary_contact_email' => 'sara.khan@bankalfalah.com',
                'primary_contact_phone' => '+92-300-9876543',
                'asset_policies' => [
                    'allowed_asset_types' => ['Laptop', 'Tablet'],
                    'approved_brands' => ['Dell', 'HP', 'Apple'],
                    'max_asset_value' => 400000,
                    'data_wipe_required' => true,
                    'insurance_required' => true,
                ],
                'is_active' => true,
            ],
            [
                'name' => 'MEPCO',
                'code' => 'MEPCO',
                'contract_reference' => 'HRPSP/MEPCO/2024/003',
                'primary_contact_name' => 'Usman Malik',
                'primary_contact_email' => 'usman.malik@mepco.com.pk',
                'primary_contact_phone' => '+92-333-5556677',
                'asset_policies' => [
                    'allowed_asset_types' => ['Laptop', 'Tablet', 'Mobile'],
                    'approved_brands' => ['Dell', 'HP', 'Lenovo'],
                    'max_asset_value' => 250000,
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Bata Pakistan',
                'code' => 'BATA',
                'contract_reference' => 'HRPSP/BATA/2024/004',
                'primary_contact_name' => 'Ayesha Tariq',
                'primary_contact_email' => 'ayesha.tariq@bata.com',
                'primary_contact_phone' => '+92-311-2223344',
                'asset_policies' => [
                    'allowed_asset_types' => ['Laptop', 'Mobile'],
                    'approved_brands' => ['Dell', 'HP', 'Samsung'],
                    'max_asset_value' => 200000,
                ],
                'is_active' => true,
            ],
        ];

        foreach ($clients as $client) {
            Client::create($client);
        }
    }
}
