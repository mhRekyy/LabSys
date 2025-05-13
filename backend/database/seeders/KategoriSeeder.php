<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Kategori;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategoris = [
            ['nama_kategori' => 'Peralatan Elektronik', 'deskripsi' => 'Komputer, proyektor, osiloskop, catu daya, dll.'],
            ['nama_kategori' => 'Peralatan Lab Gelas & Optik', 'deskripsi' => 'Gelas beaker, mikroskop, lensa, spektrofotometer, dll.'],
            ['nama_kategori' => 'Peralatan Lab Umum & Pendukung', 'deskripsi' => 'Timbangan, inkubator, sentrifugal, lemari asam (non-furnitur), dll.'],
            ['nama_kategori' => 'Furnitur Laboratorium & Kantor', 'deskripsi' => 'Meja, kursi, lemari, papan tulis, lemari asam (sebagai furnitur).'],
            ['nama_kategori' => 'Bahan Habis Pakai & Reagen', 'deskripsi' => 'Bahan kimia, media kultur, sarung tangan, masker, dll.'], // Jika dikelola
            ['nama_kategori' => 'Perlengkapan Kantor & ATK', 'deskripsi' => 'Printer, kertas, spidol, alat tulis, dll.'],
            ['nama_kategori' => 'Perangkat Lunak & Lisensi', 'deskripsi' => 'Lisensi software statistik, MATLAB, dll.'], // Jika dikelola
            ['nama_kategori' => 'Lain-lain', 'deskripsi' => 'Kategori untuk item yang tidak masuk kategori lain.'],
        ];

        foreach ($kategoris as $kategori) {
            Kategori::updateOrCreate(['nama_kategori' => $kategori['nama_kategori']], $kategori);
        }

        $this->command->info('Data kategori berhasil di-seed.');
    }
}