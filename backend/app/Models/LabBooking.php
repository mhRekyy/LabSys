<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LabBooking extends Model
{
    use HasFactory;

    /**
     * Nama tabel jika tidak mengikuti konvensi jamak otomatis Laravel.
     * Jika nama tabel di migration adalah 'lab_bookings', baris ini tidak wajib.
     * protected $table = 'lab_bookings';
     */

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'lab_id',
        'start_time',
        'end_time',
        'purpose',
        'status',
        'admin_notes',
        'processed_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Get the user that made the booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the laboratory that was booked.
     */
    public function lab(): BelongsTo
    {
        // Sesuaikan 'lab_id' jika foreign key Anda berbeda di tabel lab_bookings
        return $this->belongsTo(Laboratorium::class, 'lab_id');
    }

    /**
     * Get the admin/aslab who processed the booking (optional).
     */
    public function processor(): BelongsTo // Menggunakan nama 'processor' agar tidak bentrok dengan relasi 'user'
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}