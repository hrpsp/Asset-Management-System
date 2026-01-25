<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Yousaf (Admin)',
                'email' => 'admin@hrpsp.com',
                'password' => Hash::make('password123'),
                'role' => 'Admin',
                'is_active' => true,
            ],
            [
                'name' => 'Humza Yousaf',
                'email' => 'humza@hrpsp.com',
                'password' => Hash::make('password123'),
                'role' => 'IT Manager',
                'is_active' => true,
            ],
            [
                'name' => 'Abdul Rafay',
                'email' => 'rafay@hrpsp.com',
                'password' => Hash::make('password123'),
                'role' => 'IT Support',
                'is_active' => true,
            ],
            [
                'name' => 'Muhammad Shaban',
                'email' => 'shaban@hrpsp.com',
                'password' => Hash::make('password123'),
                'role' => 'IT Support',
                'is_active' => true,
            ],
            [
                'name' => 'HR Operations User',
                'email' => 'hr@hrpsp.com',
                'password' => Hash::make('password123'),
                'role' => 'HR Operations',
                'is_active' => true,
            ],
            [
                'name' => 'Viewer User',
                'email' => 'viewer@hrpsp.com',
                'password' => Hash::make('password123'),
                'role' => 'Viewer',
                'is_active' => true,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
