<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Inventaris;
use App\Models\Kategori; // Import Kategori

class InventarisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil ID kategori untuk referensi
        // Pastikan KategoriSeeder dijalankan SEBELUM InventarisSeeder
        $elektronikId = Kategori::where('nama_kategori', 'Peralatan Elektronik')->first()->id ?? null;
        $gelasOptikId = Kategori::where('nama_kategori', 'Peralatan Lab Gelas & Optik')->first()->id ?? null;
        $labUmumId = Kategori::where('nama_kategori', 'Peralatan Lab Umum & Pendukung')->first()->id ?? null;
        $furniturId = Kategori::where('nama_kategori', 'Furnitur Laboratorium & Kantor')->first()->id ?? null;
        $atkId = Kategori::where('nama_kategori', 'Perlengkapan Kantor & ATK')->first()->id ?? null;

        $inventarisData = [
            // Lab Kimia
            ['nama_alat' => 'Gelas Beaker 250ml Schott Duran', 'kategori_id' => $gelasOptikId, 'kondisi' => 'Baik', 'jumlah' => 30, 'lokasi' => 'Lab Kimia Dasar A1', 'nomor_seri' => 'GB-SD250-001'],
            ['nama_alat' => 'Spektrofotometer UV-Vis Shimadzu UV-1800', 'kategori_id' => $gelasOptikId, 'kondisi' => 'Baik', 'jumlah' => 1, 'lokasi' => 'Lab Instrumen Kimia Lanjut', 'nomor_seri' => 'SHIM-UV1800-K01'],
            ['nama_alat' => 'Timbangan Analitik Ohaus Explorer EX224', 'kategori_id' => $labUmumId, 'kondisi' => 'Baik', 'jumlah' => 2, 'lokasi' => 'Ruang Timbang Kimia', 'nomor_seri' => 'OHS-EX224-K01'],
            ['nama_alat' => 'Lemari Asam Laboratorium', 'kategori_id' => $furniturId, 'kondisi' => 'Baik', 'jumlah' => 3, 'lokasi' => 'Lab Kimia Organik B1'],

            // Lab Fisika
            ['nama_alat' => 'Osiloskop Digital Tektronix TBS1052C', 'kategori_id' => $elektronikId, 'kondisi' => 'Baik', 'jumlah' => 8, 'lokasi' => 'Lab Fisika Dasar F1', 'nomor_seri' => 'TEK-TBS1052C-F01'],
            ['nama_alat' => 'Generator Fungsi GW Instek SFG-1013', 'kategori_id' => $elektronikId, 'kondisi' => 'Baik', 'jumlah' => 6, 'lokasi' => 'Lab Elektronika Dasar F2', 'nomor_seri' => 'GWI-SFG1013-F01'],
            ['nama_alat' => 'Catu Daya DC Variable 0-30V/5A', 'kategori_id' => $elektronikId, 'kondisi' => 'Rusak Ringan', 'jumlah' => 10, 'lokasi' => 'Lab Fisika Dasar F1'],

            // Lab Biologi
            ['nama_alat' => 'Mikroskop Binokuler Olympus CX23LED', 'kategori_id' => $gelasOptikId, 'kondisi' => 'Baik', 'jumlah' => 15, 'lokasi' => 'Lab Mikrobiologi Bio1', 'nomor_seri' => 'OLY-CX23-BIO01'],
            ['nama_alat' => 'Autoclave Hirayama HVE-50', 'kategori_id' => $labUmumId, 'kondisi' => 'Baik', 'jumlah' => 2, 'lokasi' => 'Ruang Sterilisasi Biologi', 'nomor_seri' => 'HIR-HVE50-BIO01'],
            ['nama_alat' => 'Sentrifugal Eppendorf 5424 R', 'kategori_id' => $labUmumId, 'kondisi' => 'Baik', 'jumlah' => 4, 'lokasi' => 'Lab Biokimia Bio2', 'nomor_seri' => 'EPP-5424R-BIO01'],

            // Lab Informatika
            ['nama_alat' => 'PC Desktop Core i7, RAM 16GB, SSD 512GB', 'kategori_id' => $elektronikId, 'kondisi' => 'Baik', 'jumlah' => 30, 'lokasi' => 'Lab Pemrograman Terpadu IF1', 'deskripsi' => 'Untuk praktikum dan riset mahasiswa Informatika'],
            ['nama_alat' => 'Proyektor Epson EB-FH06 Full HD', 'kategori_id' => $elektronikId, 'kondisi' => 'Baik', 'jumlah' => 5, 'lokasi' => 'Ruang Kelas IF & Lab (Mobile)', 'nomor_seri' => 'EPS-EBFH06-IF01'],
            ['nama_alat' => 'Switch Jaringan Cisco SG350-28MP', 'kategori_id' => $elektronikId, 'kondisi' => 'Baik', 'jumlah' => 2, 'lokasi' => 'Ruang Server Mini FMIPA', 'nomor_seri' => 'CIS-SG350-SRV01'],

            // Lab Statistika & Matematika
            ['nama_alat' => 'Komputer Workstation Analisis Data', 'kategori_id' => $elektronikId, 'kondisi' => 'Baik', 'jumlah' => 10, 'lokasi' => 'Lab Komputasi Statistik & Matematika', 'deskripsi' => 'Dilengkapi software SPSS, R, Python'],
            ['nama_alat' => 'Kalkulator Saintifik Casio FX-991ID Plus', 'kategori_id' => $elektronikId, 'kondisi' => 'Baik', 'jumlah' => 20, 'lokasi' => 'Dipinjamkan Jurusan Mat/Stat'],

            // Lab Farmasi
            ['nama_alat' => 'Mesin Tablet Manual TDP-5', 'kategori_id' => $labUmumId, 'kondisi' => 'Baik', 'jumlah' => 1, 'lokasi' => 'Lab Teknologi Farmasi', 'nomor_seri' => 'TDP5-FARM01'],
            ['nama_alat' => 'pH Meter Digital Hanna HI98107', 'kategori_id' => $labUmumId, 'kondisi' => 'Baik', 'jumlah' => 5, 'lokasi' => 'Lab Kimia Farmasi'],

            // Sekretariat BEM & Himpunan
            ['nama_alat' => 'Printer Epson L3210 EcoTank', 'kategori_id' => $atkId, 'kondisi' => 'Baik', 'jumlah' => 2, 'lokasi' => 'Sekretariat BEM FMIPA', 'nomor_seri' => 'EPS-L3210-BEM01'],
            ['nama_alat' => 'Meja Rapat Besar Oval', 'kategori_id' => $furniturId, 'kondisi' => 'Baik', 'jumlah' => 1, 'lokasi' => 'Ruang Rapat Ormawa FMIPA'],
            ['nama_alat' => 'Kursi Lipat Chitose', 'kategori_id' => $furniturId, 'kondisi' => 'Baik', 'jumlah' => 30, 'lokasi' => 'Gudang Ormawa / Dipinjamkan'],
            ['nama_alat' => 'Papan Pengumuman Gabus Besar', 'kategori_id' => $furniturId, 'kondisi' => 'Baik', 'jumlah' => 4, 'lokasi' => 'Sekretariat Himpunan (Berbagi)'],
        ];

        foreach ($inventarisData as $data) {
            // Menggunakan updateOrCreate berdasarkan nomor_seri jika ada, atau nama_alat & lokasi
            // Ini membantu mencegah duplikasi jika seeder dijalankan ulang
            $uniqueKey = isset($data['nomor_seri']) && $data['nomor_seri'] !== null
                ? ['nomor_seri' => $data['nomor_seri']]
                : ['nama_alat' => $data['nama_alat'], 'lokasi' => $data['lokasi']];

            Inventaris::updateOrCreate($uniqueKey, $data);
        }
        $this->command->info('Data inventaris FMIPA berhasil di-seed.');
    }
}