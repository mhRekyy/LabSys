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
    // Nama tabel 'kategoris' dibuat otomatis dari nama model jamak
    Schema::create('kategoris', function (Blueprint $table) {
        $table->id(); // Kolom primary key auto-increment bernama 'id'
        // TAMBAHKAN BARIS INI:
        $table->string('nama_kategori')->unique(); // Nama kategori (string), unique agar tidak ada nama yg sama
        // TAMBAHKAN BARIS INI (Opsional tapi bagus):
        $table->text('deskripsi')->nullable(); // Deskripsi (teks panjang), nullable() artinya boleh kosong
        $table->timestamps(); // Kolom created_at dan updated_at otomatis
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kategoris');
    }
};
