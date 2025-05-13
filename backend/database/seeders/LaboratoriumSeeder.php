<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Laboratorium; // Import model

class LaboratoriumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $labs = [
            [
                'nama_lab' => 'Lab Kimia Dasar A1',
                'lokasi_gedung' => 'Gedung Kimia Lt. 1',
                'lokasi_ruang' => 'K1.01',
                'jam_buka' => '08:00:00',
                'jam_tutup' => '16:00:00',
                'kapasitas' => 20,
                'status' => 'Open',
                'deskripsi_singkat' => 'Laboratorium untuk praktikum kimia dasar semester awal.',
                'fasilitas_utama' => 'Meja praktikum, lemari asam, timbangan dasar, glassware',
            ],
            [
                'nama_lab' => 'Lab Instrumen Kimia Lanjut',
                'lokasi_gedung' => 'Gedung Kimia Lt. 2',
                'lokasi_ruang' => 'K2.05',
                'jam_buka' => '08:00:00',
                'jam_tutup' => '17:00:00',
                'kapasitas' => 10,
                'status' => 'Open',
                'deskripsi_singkat' => 'Lab untuk analisis menggunakan instrumen canggih.',
                'fasilitas_utama' => 'Spektrofotometer UV-Vis, HPLC, GC-MS',
            ],
             [
                'nama_lab' => 'Lab Fisika Dasar F1',
                'lokasi_gedung' => 'Gedung Fisika Lt. 1',
                'lokasi_ruang' => 'F1.10',
                'jam_buka' => '07:30:00',
                'jam_tutup' => '16:30:00',
                'kapasitas' => 24,
                'status' => 'Open',
                'deskripsi_singkat' => 'Praktikum mekanika, listrik, dan magnet dasar.',
                'fasilitas_utama' => 'Osiloskop, Catu Daya, Multimeter, Alat peraga mekanika',
            ],
             [
                'nama_lab' => 'Lab Pemrograman Terpadu IF1',
                'lokasi_gedung' => 'Gedung Informatika Lt. 3',
                'lokasi_ruang' => 'IF3.01-02',
                'jam_buka' => '08:00:00',
                'jam_tutup' => '20:00:00', // Mungkin buka lebih lama
                'kapasitas' => 30,
                'status' => 'Open',
                'deskripsi_singkat' => 'Praktikum pemrograman dasar hingga lanjut.',
                'fasilitas_utama' => 'Komputer Desktop, Proyektor, Jaringan Cepat',
            ],
            [
                'nama_lab' => 'Lab Mikrobiologi Bio1',
                'lokasi_gedung' => 'Gedung Biologi Lt. 2',
                'lokasi_ruang' => 'Bio2.08',
                'jam_buka' => '08:00:00',
                'jam_tutup' => '16:00:00',
                'kapasitas' => 18,
                'status' => 'Closed', // Contoh status Closed
                'deskripsi_singkat' => 'Praktikum terkait mikroorganisme.',
                'fasilitas_utama' => 'Mikroskop, Inkubator, Autoclave, Laminar Air Flow',
            ],
             // Tambahkan data lab lain di sini...
        ];

        foreach ($labs as $lab) {
            Laboratorium::updateOrCreate(['nama_lab' => $lab['nama_lab']], $lab);
        }

        $this->command->info('Data laboratorium berhasil di-seed.');
    }
}