<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laboratorium extends Model
{
    use HasFactory;

    /**
     * Nama tabel jika tidak mengikuti konvensi jamak otomatis Laravel.
     * Sesuaikan dengan nama tabel di file migration Anda.
     * Jika nama tabel di migration adalah 'laboratoria' atau 'laboratoriums', baris ini tidak wajib.
     * protected $table = 'laboratorium'; // Contoh jika nama tabel 'laboratorium'
     */
     protected $table = 'laboratoria'; // Sesuaikan jika nama tabel Anda berbeda


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_lab',
        'lokasi_gedung',
        'lokasi_ruang',
        'jam_buka',
        'jam_tutup',
        'kapasitas',
        'status', // 'Open', 'Closed'
        'deskripsi_singkat',
        'fasilitas_utama',
        // Tambahkan field lain jika perlu
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'kapasitas' => 'integer',
         // 'fasilitas_utama' => 'array', // Jika Anda menyimpan sebagai JSON
         // 'jam_buka' => 'datetime:H:i:s', // Atau biarkan string jika formatnya konsisten
         // 'jam_tutup' => 'datetime:H:i:s',
    ];

    // Definisikan relasi di sini jika ada nanti
    // public function inventarisUtama() { ... }
    // public function penanggungJawab() { ... }
}