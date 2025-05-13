<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{public function up(): void
    {
        // Laravel mungkin otomatis membuat nama tabel 'laboratoria' atau 'laboratoriums'
        // Kita bisa tentukan eksplisit jika perlu: Schema::create('laboratorium', ...)
        Schema::create('laboratoria', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lab');
            $table->string('lokasi_gedung')->nullable();
            $table->string('lokasi_ruang')->nullable();
            $table->time('jam_buka')->nullable();
            $table->time('jam_tutup')->nullable();
            $table->integer('kapasitas')->nullable();
            $table->enum('status', ['Open', 'Closed'])->default('Open');
            $table->text('deskripsi_singkat')->nullable();
            $table->text('fasilitas_utama')->nullable(); // Bisa juga JSON atau relasi
            // Tambahkan kolom lain jika perlu (foto, penanggung jawab, dll.)
            $table->timestamps();
        });
    }
    
    public function down(): void
    {
         Schema::dropIfExists('laboratoria'); // Sesuaikan nama tabel jika diubah
    }
};
