<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; // <-- Tambahkan ini jika pakai type hinting

class Kategori extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // TAMBAHKAN BLOK INI:
    protected $fillable = [
        'nama_kategori',
        'deskripsi',
    ];

    /**
     * Get all of the inventaris for the Kategori
     * (Mendefinisikan relasi bahwa satu kategori bisa punya banyak inventaris)
     * Ini akan berguna nanti.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function inventaris(): HasMany // <-- Ini relasi, bisa ditambahkan sekarang atau nanti
    {
         // foreign key di tabel inventaris akan 'kategori_id' by convention
        return $this->hasMany(Inventaris::class);
    }
}