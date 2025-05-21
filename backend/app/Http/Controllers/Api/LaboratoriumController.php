<?php

namespace App\Http\Controllers\Api; // Atau App\Http\Controllers\API; sesuai struktur Anda

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Laboratorium;
use App\Http\Resources\LaboratoriumResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\Builder; // Impor Builder

class LaboratoriumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Laboratorium::query();

            // Filter: Search
            if ($request->filled('search')) {
                $searchTerm = $request->search;
                $query->where(function (Builder $q) use ($searchTerm) { // Gunakan Builder untuk type hint $q
                    $q->where('nama_lab', 'like', '%' . $searchTerm . '%')
                      ->orWhere('deskripsi_singkat', 'like', '%' . $searchTerm . '%')
                      ->orWhere('lokasi_gedung', 'like', '%' . $searchTerm . '%')
                      ->orWhere('lokasi_ruang', 'like', '%' . $searchTerm . '%');
                    // Tambahkan pencarian di 'type_lab' atau 'fasilitas_utama' jika field tersebut ada dan ingin dicari
                    // if (Schema::hasColumn('laboratoria', 'type_lab')) { // Cek jika kolom ada
                    //     $q->orWhere('type_lab', 'like', '%' . $searchTerm . '%');
                    // }
                });
            }

            // Filter: Status (dari dropdown utama/Tabs di frontend)
            if ($request->filled('status') && in_array($request->status, ['Open', 'Closed'])) {
                $query->where('status', $request->status);
            }

            // Filter: Lokasi Gedung
            if ($request->filled('lokasi_gedung') && strtolower($request->lokasi_gedung) !== 'all') {
                $query->where('lokasi_gedung', $request->lokasi_gedung);
            }

            // Filter: Lantai (memerlukan kolom 'lantai' di tabel 'laboratoria')
            if ($request->filled('lantai') && strtolower($request->lantai) !== 'all') {
                // Pastikan Anda memiliki kolom 'lantai' di model dan tabel
                // if (Schema::hasColumn('laboratoria', 'lantai')) {
                     $query->where('lantai', $request->lantai);
                // }
            }

            // Filter: Tipe Lab (dari dropdown)
            if ($request->filled('type_lab') && strtolower($request->type_lab) !== 'all') {
                // Pastikan Anda memiliki kolom 'type_lab' di model dan tabel
                // if (Schema::hasColumn('laboratoria', 'type_lab')) {
                    $query->where('type_lab', $request->type_lab);
                // }
            }

            // Filter: Tipe Lab (dari checkboxes, dikirim sebagai array 'types[]')
            if ($request->has('types') && is_array($request->types)) {
                $validTypes = array_filter($request->types, function($type) {
                    return !empty($type) && strtolower($type) !== 'all';
                });
                if (count($validTypes) > 0) {
                    // Pastikan Anda memiliki kolom 'type_lab'
                    // if (Schema::hasColumn('laboratoria', 'type_lab')) {
                        $query->whereIn('type_lab', $validTypes);
                    // }
                }
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'nama_lab');
            $sortDirection = $request->input('direction', 'asc');
            $allowedSortColumns = ['nama_lab', 'lokasi_gedung', 'status', 'kapasitas', 'created_at', 'type_lab', 'lantai']; // Tambahkan kolom baru jika bisa di-sort
            if (!in_array($sortBy, $allowedSortColumns)) {
                $sortBy = 'nama_lab';
            }
             if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
                $sortDirection = 'asc';
            }
            $query->orderBy($sortBy, $sortDirection);

            // Pagination
            $perPage = $request->input('per_page', 10); // Default 10 item per halaman
            $laboratoria = $query->paginate((int)$perPage);

            return LaboratoriumResource::collection($laboratoria)
                   ->additional(['success' => true, 'message' => 'Daftar laboratorium berhasil diambil.']);

        } catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data laboratorium.',
                'error' => $e->getMessage() // Sertakan pesan error untuk debugging (hanya di development)
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) // Jika Anda implementasi Tambah Lab
    {
        // if (!Gate::allows('manage-inventaris')) { // Sesuaikan Gate
        //     return response()->json(['success' => false, 'message' => 'Anda tidak memiliki izin.'], 403);
        // }
        // $validated = $request->validate([
        //     'nama_lab' => 'required|string|max:100|unique:laboratoria,nama_lab',
        //     'lokasi_gedung' => 'required|string|max:100',
        //     'lokasi_ruang' => 'required|string|max:50',
        //     'lantai' => 'nullable|string|max:20', // atau integer
        //     'jam_buka' => 'nullable|date_format:H:i',
        //     'jam_tutup' => 'nullable|date_format:H:i|after_or_equal:jam_buka',
        //     'kapasitas' => 'nullable|integer|min:0',
        //     'status' => ['required', 'string', Rule::in(['Open', 'Closed'])],
        //     'deskripsi_singkat' => 'nullable|string|max:255',
        //     'fasilitas_utama' => 'nullable|string|max:255',
        //     'type_lab' => 'nullable|string|max:50',
        // ]);
        // $lab = Laboratorium::create($validated);
        // return (new LaboratoriumResource($lab))
        //        ->additional(['success' => true, 'message' => 'Laboratorium berhasil ditambahkan.'])
        //        ->response()->setStatusCode(201);
        return response()->json(['message' => 'Fitur Tambah Lab belum aktif di backend.'], 501);
    }

    /**
     * Display the specified resource.
     */
    public function show(Laboratorium $laboratorium)
    {
        try {
            return (new LaboratoriumResource($laboratorium))
                   ->additional(['success' => true, 'message' => 'Detail laboratorium berhasil diambil.']);
        } catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Laboratorium tidak ditemukan atau gagal diambil.',
                'error' => $e->getMessage()
            ], 404); // Atau 500 tergantung penyebab
        }
    }

   /**
     * Update the status of a specific laboratorium.
     */
    public function updateStatus(Request $request, Laboratorium $laboratorium)
    {
        // Sesuaikan Gate dengan yang benar untuk aksi ini (misal 'manage-laboratorium' atau 'manage-inventaris')
        // if (!Gate::allows('manage-inventaris')) { // Contoh jika Aslab & Admin boleh
        //     return response()->json(['success' => false, 'message' => 'Anda tidak memiliki izin.'], 403);
        // }

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['Open', 'Closed'])],
        ]);

        try {
            $laboratorium->status = $validated['status'];
            $laboratorium->save();
            return (new LaboratoriumResource($laboratorium))
                   ->additional(['success' => true, 'message' => 'Status laboratorium berhasil diupdate.']);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate status laboratorium.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Laboratorium $laboratorium) // Gunakan Route Model Binding
    {
        // if (!Gate::allows('manage-inventaris')) { // Sesuaikan Gate
        //     return response()->json(['success' => false, 'message' => 'Anda tidak memiliki izin.'], 403);
        // }
        // try {
        //     $laboratorium->delete();
        //     return response()->json(['success' => true, 'message' => 'Laboratorium berhasil dihapus.'], 200);
        // } catch (\Exception $e) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Gagal menghapus laboratorium.',
        //         'error' => $e->getMessage()
        //     ], 500);
        // }
        return response()->json(['message' => 'Fitur Hapus Lab belum aktif di backend.'], 501);
    }
}