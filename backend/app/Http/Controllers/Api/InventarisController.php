<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventaris;
use App\Http\Resources\InventarisResource;
use App\Http\Requests\StoreInventarisRequest; 
use App\Http\Requests\UpdateInventarisRequest;
use Illuminate\Support\Facades\Gate; 
use Illuminate\Support\Facades\Storage;

class InventarisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) // Terima object Request
    {
        try {
            // Mulai query builder
            $query = Inventaris::query();

            // 1. Eager Load Relasi Kategori (agar tidak N+1 problem)
            $query->with('kategori');

            // 2. Filter berdasarkan Kategori (jika ada parameter 'kategori_id')
            if ($request->has('kategori_id') && $request->kategori_id != '') {
                 $query->where('kategori_id', $request->kategori_id);
            }

            // 3. Filter berdasarkan Lokasi (jika ada parameter 'lokasi')
            if ($request->has('lokasi') && $request->lokasi != '') {
                $query->where('lokasi', 'like', '%' . $request->lokasi . '%'); // Pencarian parsial
            }

            // 4. Filter berdasarkan Pencarian (jika ada parameter 'search')
            if ($request->has('search') && $request->search != '') {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('nama_alat', 'like', '%' . $searchTerm . '%')
                      ->orWhere('nomor_seri', 'like', '%' . $searchTerm . '%')
                      ->orWhere('deskripsi', 'like', '%' . $searchTerm . '%');
                      // Tambahkan pencarian di kolom lain jika perlu
                });
            }

            // 5. Sorting (jika ada parameter 'sort_by', default 'nama_alat')
            $sortBy = $request->input('sort_by', 'nama_alat'); // Default sort by nama_alat
            $sortDirection = $request->input('direction', 'asc'); // Default direction asc
            // Validasi kolom sort (opsional tapi aman)
            $allowedSorts = ['nama_alat', 'created_at', 'kondisi', 'lokasi'];
            if (in_array($sortBy, $allowedSorts)) {
                 $query->orderBy($sortBy, $sortDirection);
            } else {
                 $query->orderBy('nama_alat', 'asc'); // Fallback default
            }


            // 6. Pagination (misal 10 item per halaman)
            $perPage = $request->input('per_page', 10); // Ambil dari request atau default 10
            $inventaris = $query->paginate($perPage);

            // 7. Kembalikan response menggunakan Resource Collection
            return InventarisResource::collection($inventaris)
                   ->additional(['success' => true, 'message' => 'Daftar inventaris berhasil diambil']);


        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data inventaris: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
 * Store a newly created resource in storage.
 * Menyimpan data inventaris baru.
 *
 * @param  \App\Http\Requests\StoreInventarisRequest  $request Object request yang sudah divalidasi
 * @return \Illuminate\Http\JsonResponse|\App\Http\Resources\InventarisResource
 */
// Gunakan StoreInventarisRequest sebagai type hint untuk validasi otomatis
public function store(StoreInventarisRequest $request)
{
    // 1. Otorisasi: Periksa apakah user boleh 'manage-inventaris'
    if (!Gate::allows('manage-inventaris')) {
        // Jika tidak diizinkan, kembalikan error 403 Forbidden
        return response()->json(['success' => false, 'message' => 'Anda tidak memiliki izin untuk menambahkan inventaris.'], 403);
    }

    try {
        // 2. Ambil data yang sudah divalidasi dari request
        $validatedData = $request->validated();

        // 3. Buat record inventaris baru di database
        $inventaris = Inventaris::create($validatedData);

        // 4. (Opsional) Load relasi kategori agar muncul di response
        $inventaris->load('kategori');

        // 5. Kembalikan response sukses (201 Created) dengan data baru
        // Gunakan resource untuk format yang konsisten
        return (new InventarisResource($inventaris))
               ->additional(['success' => true, 'message' => 'Inventaris baru berhasil ditambahkan.'])
               ->response() // Dapatkan response JSON
               ->setStatusCode(201); // Set status code 201

    } catch (\Exception $e) {
        // Tangani jika ada error saat menyimpan ke database
        return response()->json([
            'success' => false,
            'message' => 'Gagal menambahkan inventaris: ' . $e->getMessage(),
        ], 500);
    }
}

        /**
     * Display the specified resource.
     * Menampilkan detail satu inventaris.
     *
     * @param  \App\Models\Inventaris  $inventaris Otomatis di-inject oleh Route Model Binding
     * @return \Illuminate\Http\JsonResponse|\App\Http\Resources\InventarisResource
     */
    // --- UBAH PARAMETER MENJADI TYPE HINTING MODEL ---
    public function show(Inventaris $inventaris)
    {
        // --- ISI BODY METHOD SEPERTI SEBELUMNYA ---
        try {
            // Pastikan data relasi kategori ikut dimuat (Eager Load)
            $inventaris->load('kategori');

            // Kembalikan data inventaris tunggal menggunakan Resource
            return (new InventarisResource($inventaris))
                   ->additional(['success' => true, 'message' => 'Detail inventaris berhasil diambil']);

        } catch (\Exception $e) {
            // Penanganan error jika ada masalah tak terduga
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail inventaris: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
 * Update the specified resource in storage.
 * Mengupdate data inventaris yang sudah ada.
 *
 * @param  \App\Http\Requests\UpdateInventarisRequest  $request Data request yang sudah divalidasi
 * @param  \App\Models\Inventaris  $inventaris Object Inventaris yang akan diupdate (via Route Model Binding)
 * @return \Illuminate\Http\JsonResponse|\App\Http\Resources\InventarisResource
 */
// Gunakan UpdateInventarisRequest dan Route Model Binding Inventaris $inventaris
public function update(UpdateInventarisRequest $request, Inventaris $inventaris)
{
    // 1. Otorisasi: Periksa apakah user boleh 'manage-inventaris'
    if (!Gate::allows('manage-inventaris')) {
        return response()->json(['success' => false, 'message' => 'Anda tidak memiliki izin untuk mengupdate inventaris.'], 403);
    }

    try {
        // 2. Ambil data yang sudah divalidasi dari request
        // Hanya field yang ada di request dan lolos validasi yang akan diambil
        $validatedData = $request->validated();

        // 3. Update record inventaris di database
        // $inventaris sudah merupakan objek model dari ID di URL
        $inventaris->update($validatedData);

        // 4. (Opsional) Load relasi kategori lagi untuk memastikan data terbaru ada di response
        // Terutama jika kategori_id diupdate
        $inventaris->load('kategori');

        // 5. Kembalikan response sukses dengan data yang sudah diupdate
        return (new InventarisResource($inventaris))
               ->additional(['success' => true, 'message' => 'Inventaris berhasil diupdate.']);

    } catch (\Exception $e) {
        // Tangani jika ada error saat mengupdate
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengupdate inventaris: ' . $e->getMessage(),
        ], 500);
    }
}
   /**
 * Remove the specified resource from storage.
 * Menghapus data inventaris.
 *
 * @param  \App\Models\Inventaris  $inventaris Object Inventaris yang akan dihapus (via Route Model Binding)
 * @return \Illuminate\Http\JsonResponse
 */
// Gunakan Route Model Binding Inventaris $inventaris
public function destroy(Inventaris $inventaris)
{
    // 1. Otorisasi: Periksa apakah user boleh 'manage-inventaris'
    if (!Gate::allows('manage-inventaris')) {
        return response()->json(['success' => false, 'message' => 'Anda tidak memiliki izin untuk menghapus inventaris.'], 403);
    }

    try {
        // 2. Hapus record inventaris dari database
        // $inventaris sudah merupakan objek model dari ID di URL
        $inventaris->delete();

        // 3. Kembalikan response sukses
        // Tidak ada data yang dikembalikan (standar untuk DELETE), jadi status 204 No Content
        // atau bisa juga 200 OK dengan pesan JSON
        return response()->json(['success' => true, 'message' => 'Inventaris berhasil dihapus.'], 200);
        // Alternatif jika ingin 204 No Content (tidak ada body response):
        // return response()->noContent();

    } catch (\Exception $e) {
        // Tangani jika ada error saat menghapus (misal: ada foreign key constraint yang melarang)
        return response()->json([
            'success' => false,
            'message' => 'Gagal menghapus inventaris: ' . $e->getMessage(),
        ], 500);
    }
}
}