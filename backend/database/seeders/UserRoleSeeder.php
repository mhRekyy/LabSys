<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- Membuat User Admin ---
        User::updateOrCreate(
            // Kunci untuk mencari user (harus unik)
            ['email' => 'admin@labsys.test'],
            // Data yang akan dimasukkan atau diupdate
            [
                'name' => 'Muhammad Reky',
                'npm' => 'ADMIN001', // Atau ID unik lain
                'role' => 'Admin',
                'password' => Hash::make('admin_password_123'), // GANTI dengan password aman!
                'email_verified_at' => now(), // Opsional: Anggap email sudah terverifikasi
            ]
        );

            // --- Membuat User Aslab (Contoh) ---
            User::updateOrCreate(
                // Kunci untuk mencari user
                ['email' => 'aslab.informatika@labsys.test'],
                // Data yang akan dimasukkan atau diupdate
            [
                    'name' => 'Aska Shahira',
                    'npm' => 'ASLAB001', // Atau ID unik lain
                    'role' => 'Aslab',
                    'password' => Hash::make('aslab_password_123'), // GANTI dengan password aman!
                    'email_verified_at' => now(), // Opsional
            ]
        );
            $this->command->info('User Admin dan Aslab berhasil dibuat/diupdate.');
    }
}
