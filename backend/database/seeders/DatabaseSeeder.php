<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            UserRoleSeeder::class,     // User Admin, Aslab, dll.
            KategoriSeeder::class,     // Data Kategori dulu
            InventarisSeeder::class,   // Baru Data Inventaris
            LaboratoriumSeeder::class,
            SettingSeeder::class,
            LabBookingSeeder::class,
            // Tambahkan seeder lain di sini jika ada
        ]);
    }
}
