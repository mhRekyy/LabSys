<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lab_bookings', function (Blueprint $table) {
            $table->id(); // Primary key auto-increment

            // Foreign key ke tabel 'users' (siapa yang booking)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Foreign key ke tabel 'laboratoria' (lab mana yang dibooking)
            // Sesuaikan 'laboratoria' jika nama tabel laboratorium Anda berbeda
            $table->foreignId('lab_id')->constrained('laboratoria')->onDelete('cascade');

            $table->dateTime('start_time'); // Waktu mulai booking
            $table->dateTime('end_time');   // Waktu selesai booking
            $table->text('purpose')->nullable(); // Tujuan booking

            // Status booking (misalnya: 'pending', 'approved', 'rejected', 'completed', 'cancelled')
            // Sesuaikan panjang string jika perlu
            $table->string('status', 50)->default('pending');

            $table->text('admin_notes')->nullable(); // Catatan dari admin/aslab (jika ada)
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null'); // ID Admin/Aslab yang memproses

            $table->timestamps(); // Kolom created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lab_bookings');
    }
};