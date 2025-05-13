<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventarisRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Untuk sekarang, izinkan semua yang terotentikasi
    // Otorisasi role akan kita handle via Gate/Policy nanti
    return true;
    // Atau jika ingin cek role sederhana di sini (kurang fleksibel):
    // return $this->user() && in_array($this->user()->role, ['Admin', 'Aslab']);
    }

    /**
 * Get the validation rules that apply to the request.
 *
 * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
 */
public function rules(): array
{
    return [
        // nama_alat: Wajib ada, berupa string, maksimal 255 karakter
        'nama_alat' => 'required|string|max:255',
        // kategori_id: Boleh null, tapi jika ada harus ada di tabel 'kategoris' kolom 'id'
        'kategori_id' => 'nullable|integer|exists:kategoris,id',
        // kondisi: Wajib ada, berupa string, harus salah satu dari nilai enum yg valid
        'kondisi' => 'required|string|in:Baik,Rusak Ringan,Rusak Berat,Dalam Perbaikan',
        // jumlah: Wajib ada, berupa integer, minimal 1
        'jumlah' => 'required|integer|min:1',
        // lokasi: Boleh null, jika ada berupa string, maksimal 255 karakter
        'lokasi' => 'nullable|string|max:255',
        // deskripsi: Boleh null, jika ada berupa string
        'deskripsi' => 'nullable|string',
        // nomor_seri: Boleh null, jika ada berupa string, maksimal 255, unik di tabel 'inventaris'
        'nomor_seri' => 'nullable|string|max:255|unique:inventaris,nomor_seri',
        // tanggal_pengadaan: Boleh null, jika ada harus format tanggal yang valid
        'tanggal_pengadaan' => 'nullable|date_format:Y-m-d', // Asumsi format YYYY-MM-DD
    ];
}
}
