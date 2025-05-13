<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    // Nama tabel otomatis 'settings'

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'value',
        'type', // Jika Anda menambahkan kolom type
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    // protected $casts = [
        // Jika Anda menyimpan array/objek sebagai JSON di kolom 'value'
        // 'value' => 'array', // Ini akan error jika tipe data value lain juga disimpan
    // ];

    /**
     * Kita bisa buat helper untuk mengambil nilai berdasarkan key
     * dengan casting otomatis berdasarkan kolom 'type'.
     * Tapi untuk API dasar, kita bisa handle di controller atau frontend.
     */
}