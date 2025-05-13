<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeminjamanResource extends JsonResource
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
            'user_peminjam' => new UserResource($this->whenLoaded('user')),
            'inventaris' => new InventarisResource($this->whenLoaded('inventaris')),
            // tanggal_pinjam seharusnya selalu ada karena diisi ->useCurrent() di migration dan ada di $fillable
            'tanggal_pinjam' => $this->tanggal_pinjam ? $this->tanggal_pinjam->toIso8601String() : null, // Tambahkan pengecekan untuk jaga-jaga
            'tanggal_kembali_rencana' => $this->tanggal_kembali_rencana ? $this->tanggal_kembali_rencana->toIso8601String() : null,
            'tanggal_kembali_aktual' => $this->tanggal_kembali_aktual ? $this->tanggal_kembali_aktual->toIso8601String() : null,
            'jumlah_pinjam' => $this->jumlah_pinjam,
            'status' => $this->status,
            'tujuan_peminjaman' => $this->tujuan_peminjaman,
            'catatan_pengembalian' => $this->catatan_pengembalian,
            'petugas_pemroses' => new UserResource($this->whenLoaded('petugas')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}