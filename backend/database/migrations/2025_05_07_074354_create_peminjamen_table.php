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
    Schema::create('peminjamen', function (Blueprint $table) {
        $table->id();

        $table->foreignId('user_id')->constrained('users')->onDelete('restrict'); // Jaga integritas data
        $table->foreignId('inventaris_id')->constrained('inventaris')->onDelete('restrict'); // Jaga integritas data

        $table->timestamp('tanggal_pinjam')->useCurrent();
        $table->timestamp('tanggal_kembali_rencana')->nullable();
        $table->timestamp('tanggal_kembali_aktual')->nullable();
        $table->integer('jumlah_pinjam')->default(1);

        $table->enum('status', [
            'Dipinjam',
            'Dikembalikan',
            'Terlambat',
            'Menunggu Persetujuan',
            'Ditolak'
        ])->default('Menunggu Persetujuan'); // Defaultnya menunggu persetujuan

        $table->text('tujuan_peminjaman')->nullable();
        $table->text('catatan_pengembalian')->nullable();
        $table->foreignId('petugas_id')->nullable()->constrained('users')->onDelete('set null'); // ID petugas yg proses (pinjam/kembali)

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjamen');
    }
};