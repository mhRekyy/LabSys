<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // <-- Tambahkan ini jika pakai type hinting

class Inventaris extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // TAMBAHKAN BLOK INI:
    protected $fillable = [
        'nama_alat',
        'kategori_id', // <-- Jangan lupa sertakan foreign key
        'kondisi',
        'jumlah',
        'lokasi',
        'deskripsi',
        'nomor_seri',
        'tanggal_pengadaan',
    ];

    /**
     * Get the kategori that owns the Inventaris.
     * (Mendefinisikan relasi bahwa satu inventaris dimiliki oleh satu kategori)
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function kategori(): BelongsTo // <-- Nama relasi tunggal
    {
        // Foreign key 'kategori_id' (default), owner key 'id' (default di tabel kategoris)
        return $this->belongsTo(Kategori::class);
    }

    public function peminjaman(): HasMany
{
    return $this->hasMany(Peminjaman::class, 'inventaris_id');
}

    // Nanti kita bisa tambahkan relasi ke Peminjaman di sini juga
    // public function peminjaman() {
    //     return $this->hasMany(Peminjaman::class);
    // }
}