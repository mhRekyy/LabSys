<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LaboratoriumResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_lab' => $this->nama_lab,
            'lokasi_gedung' => $this->lokasi_gedung,
            'lokasi_ruang' => $this->lokasi_ruang,
            // Format jam (H:i) atau biarkan string sesuai DB
            'lantai' => $this->whenNotNull($this->lantai),
            'jam_buka' => $this->jam_buka ? date('H:i', strtotime($this->jam_buka)) : null,
            'jam_tutup' => $this->jam_tutup ? date('H:i', strtotime($this->jam_tutup)) : null,
            'kapasitas' => $this->kapasitas,
            'status' => $this->status,
            'deskripsi_singkat' => $this->deskripsi_singkat,
            'fasilitas_utama' => $this->fasilitas_utama,
            // Tambahkan field lain jika perlu
            'type_lab' => $this->whenNotNull($this->type_lab),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}