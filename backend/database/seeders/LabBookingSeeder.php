<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LabBooking;
use App\Models\User;
use App\Models\Laboratorium;
use Carbon\Carbon;

class LabBookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan ada User dan Laboratorium di database Anda
        // Ambil beberapa user (misal, mahasiswa dan admin/aslab)
        $mahasiswaUsers = User::where('role', 'Mahasiswa')->take(5)->get(); // Ambil 5 mahasiswa
        $adminAslabUsers = User::whereIn('role', ['Admin', 'Aslab'])->take(2)->get(); // Ambil 2 admin/aslab
        $laboratoria = Laboratorium::take(3)->get(); // Ambil 3 lab

        if ($mahasiswaUsers->isEmpty() || $laboratoria->isEmpty()) {
            $this->command->info('Tidak ada cukup data User (Mahasiswa) atau Laboratorium untuk membuat LabBooking dummy. Silakan seed User dan Laboratorium terlebih dahulu.');
            return;
        }

        $statuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
        $purposes = [
            'Praktikum Kimia Dasar',
            'Penelitian Skripsi Biologi',
            'Penggunaan Alat Spektrofotometer',
            'Sesi Belajar Mandiri Fisika',
            'Eksperimen Proyek Akhir Teknik Elektro',
        ];

        // Buat beberapa booking untuk mahasiswa
        foreach ($mahasiswaUsers as $mhsUser) {
            for ($i = 0; $i < rand(1, 4); $i++) { // Setiap mahasiswa buat 1-4 booking
                $lab = $laboratoria->random();
                $status = $statuses[array_rand($statuses)];
                $purpose = $purposes[array_rand($purposes)];
                $startDate = Carbon::now()->subDays(rand(0, 30))->addHours(rand(-12, 12)); // Waktu booking bisa di masa lalu atau dekat masa depan

                LabBooking::create([
                    'user_id' => $mhsUser->id,
                    'lab_id' => $lab->id,
                    'start_time' => $startDate,
                    'end_time' => $startDate->copy()->addHours(rand(1, 3)),
                    'purpose' => $purpose,
                    'status' => $status,
                    'admin_notes' => ($status === 'rejected' || $status === 'approved') ? 'Diproses oleh sistem.' : null,
                    'processed_by' => ($status === 'rejected' || $status === 'approved') && $adminAslabUsers->isNotEmpty() ? $adminAslabUsers->random()->id : null,
                ]);
            }
        }

        // Buat beberapa booking yang mungkin dibuat oleh admin/aslab untuk orang lain atau event
        if ($adminAslabUsers->isNotEmpty() && $mahasiswaUsers->isNotEmpty()) {
            for ($i = 0; $i < rand(2, 5); $i++) {
                $lab = $laboratoria->random();
                $status = $statuses[array_rand($statuses)];
                $purpose = "Jadwal Lab Terjadwal oleh " . $adminAslabUsers->random()->name;
                $startDate = Carbon::now()->addDays(rand(1, 15))->setHour(rand(8, 16));

                LabBooking::create([
                    'user_id' => $mahasiswaUsers->random()->id, // Booking untuk salah satu mahasiswa
                    'lab_id' => $lab->id,
                    'start_time' => $startDate,
                    'end_time' => $startDate->copy()->addHours(rand(2, 4)),
                    'purpose' => $purpose,
                    'status' => $status,
                    'processed_by' => $adminAslabUsers->random()->id,
                    'admin_notes' => 'Booking terjadwal.',
                ]);
            }
        }
        $this->command->info(LabBooking::count() . ' data LabBooking berhasil ditambahkan.');
    }
}