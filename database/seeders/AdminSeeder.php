<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    public function run()
    {
        Admin::create([
            'email'    => env('ADMIN_EMAIL', 'admin@borestreetbistro.co.uk'),
            'password' => Hash::make(env('ADMIN_PASSWORD', 'password123')),
        ]);
    }
}
