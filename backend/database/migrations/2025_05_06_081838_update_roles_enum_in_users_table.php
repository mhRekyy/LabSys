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
        Schema::table('users', function (Blueprint $table) {
            // Ubah definisi enum untuk menyertakan 'Aslab'
            // Daftar lengkapnya sekarang: Admin, Staff, Aslab, Mahasiswa
            $table->enum('role', ['Admin', 'Staff', 'Aslab', 'Mahasiswa'])
                  ->default('Mahasiswa') // Pertahankan default jika perlu
                  ->change(); // Perintahkan untuk mengubah kolom yang ada
        });
    }

    /**
     * Reverse the migrations.
     * (Kembalikan ke state sebelum 'Aslab' ditambahkan)
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Kembalikan definisi enum ke versi lama
            $table->enum('role', ['Admin', 'Staff', 'Mahasiswa'])
                  ->default('Mahasiswa')
                  ->change();
             // PERHATIAN: Jika ada user yang role-nya sudah 'Aslab',
             // rollback ini akan GAGAL kecuali Anda handle datanya dulu.
             // Untuk development, biasanya tidak masalah.
        });
    }
};