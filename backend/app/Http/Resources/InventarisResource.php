<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventarisResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $gambarFinalUrl = null;
        if ($this->gambar) { // Menggunakan $this->gambar
            if (Str::startsWith($this->gambar, ['http://', 'https://'])) {
                // Jika sudah URL lengkap (eksternal)
                $gambarFinalUrl = $this->gambar;
            } elseif (Storage::disk('public')->exists($this->gambar)) {
                // Jika path lokal dan file ada di storage
                $gambarFinalUrl = asset('storage/' . $this->gambar);
            } else {
            }
        }
        // return parent::toArray($request); // Hapus atau komentari baris ini

        // Definisikan struktur output JSON yang Anda inginkan
        return [
            'id' => $this->id,
            'nama_alat' => $this->nama_alat,
            'kategori' => new KategoriResource($this->whenLoaded('kategori')), // Muat data kategori jika di-load (Eager Load)
            'kondisi' => $this->kondisi,
            'jumlah' => $this->jumlah,
            'lokasi' => $this->lokasi,
            'deskripsi' => $this->deskripsi,
            'nomor_seri' => $this->nomor_seri,
            'tanggal_pengadaan' => $this->tanggal_pengadaan,
            'created_at' => $this->created_at->toIso8601String(), // Format tanggal standar
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}