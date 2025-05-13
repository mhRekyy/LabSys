<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('settings', function (Blueprint $table) {
        $table->id();
        $table->string('key')->unique(); // Nama setting (harus unik)
        $table->longText('value')->nullable(); // Nilai setting (bisa panjang, boleh null)
        $table->string('type')->default('string'); // Tipe data (string, boolean, integer, json) - Opsional tapi membantu
        $table->timestamps(); // Kapan setting dibuat/diubah
    });
}

public function down(): void
{
    Schema::dropIfExists('settings');
}
};
