<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInventarisRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $inventarisId = $this->route('inventaris') ? $this->route('inventaris')->id : null;
        
        return [
            // nama_alat: Opsional (jika tidak diisi, tidak diupdate), tapi jika ada harus string & max 255
        'nama_alat' => 'sometimes|required|string|max:255',
        // kategori_id: Opsional, jika ada harus integer & ada di tabel 'kategoris'
        'kategori_id' => 'sometimes|nullable|integer|exists:kategoris,id',
        // kondisi: Opsional, jika ada harus string & salah satu dari nilai enum
        'kondisi' => 'sometimes|required|string|in:Baik,Rusak Ringan,Rusak Berat,Dalam Perbaikan',
        // jumlah: Opsional, jika ada harus integer & minimal 0 atau 1 (sesuaikan kebutuhan)
        'jumlah' => 'sometimes|required|integer|min:0',
        // lokasi: Opsional, jika ada harus string & max 255
        'lokasi' => 'sometimes|nullable|string|max:255',
        // deskripsi: Opsional, jika ada harus string
        'deskripsi' => 'sometimes|nullable|string',
        // nomor_seri: Opsional, jika ada harus string, max 255,
        // unik di tabel 'inventaris' TAPI abaikan record dengan ID saat ini
        'nomor_seri' => [
            'sometimes',
            'nullable',
            'string',
            'max:255',
            Rule::unique('inventaris', 'nomor_seri')->ignore($inventarisId),
        ],
        // tanggal_pengadaan: Opsional, jika ada harus format tanggal YYYY-MM-DD
        'tanggal_pengadaan' => 'sometimes|nullable|date_format:Y-m-d',
        ];
    }
}
