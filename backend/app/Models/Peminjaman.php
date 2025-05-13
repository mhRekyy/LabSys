<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Peminjaman extends Model
{
    use HasFactory;

    // Nama tabel otomatis diambil dari nama model jamak ('peminjamen')

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'inventaris_id',
        'tanggal_kembali_rencana',
        'tanggal_kembali_aktual',
        'jumlah_pinjam',
        'status',
        'tujuan_peminjaman',
        'catatan_pengembalian',
        'petugas_id', // ID Admin/Aslab/Staff yang memproses
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_pinjam' => 'datetime',
        'tanggal_kembali_rencana' => 'datetime',
        'tanggal_kembali_aktual' => 'datetime',
        'jumlah_pinjam' => 'integer',
    ];

    /**
     * Get the user that owns the peminjaman (peminjam).
     */
    public function user(): BelongsTo
    {
        // Relasi ke user yang meminjam
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the inventaris that is borrowed.
     */
    public function inventaris(): BelongsTo
    {
        // Relasi ke item inventaris yang dipinjam
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }

    /**
     * Get the petugas that processed the peminjaman/pengembalian.
     * (Opsional, jika ingin membedakan dengan user peminjam)
     */
    public function petugas(): BelongsTo
    {
        // Relasi ke user (Admin/Aslab/Staff) yang memproses
        return $this->belongsTo(User::class, 'petugas_id');
    }
}