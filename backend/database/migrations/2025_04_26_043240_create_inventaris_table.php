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
        // Nama tabel 'inventaris' otomatis jamak dari model
        Schema::create('inventaris', function (Blueprint $table) {
            $table->id(); // Primary key 'id'

            // TAMBAHKAN DEFINISI KOLOM DI BAWAH INI:
            $table->string('nama_alat');

            // == Relasi ke Kategori ==
            // Kolom foreign key HARUS konsisten dengan relasi di Model Kategori.
            // Nama defaultnya: namamodel_id -> kategori_id
            $table->foreignId('kategori_id')
                  ->nullable() // Boleh null jika ada barang tanpa kategori
                  ->constrained('kategoris') // Merujuk ke tabel 'kategoris', kolom 'id'
                  ->onDelete('set null'); // Jika kategori dihapus, set 'kategori_id' jadi NULL di sini
                                          // Pilihan lain: ->onDelete('cascade') (hapus inventaris jika kategori dihapus)
                                          // Pilihan lain: ->onDelete('restrict') (larang hapus kategori jika masih ada inventaris)
                                          // 'set null' sering jadi pilihan aman.

            $table->enum('kondisi', ['Baik', 'Rusak Ringan', 'Rusak Berat', 'Dalam Perbaikan'])->default('Baik');
            $table->integer('jumlah')->default(1); // Jumlah item ini
            $table->string('lokasi')->nullable(); // Lokasi penyimpanan
            $table->text('deskripsi')->nullable(); // Deskripsi tambahan
            $table->string('nomor_seri')->unique()->nullable(); // Jika perlu nomor seri unik per unit
            $table->date('tanggal_pengadaan')->nullable(); // Kapan barang ini diadakan

            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventaris');
    }
};
