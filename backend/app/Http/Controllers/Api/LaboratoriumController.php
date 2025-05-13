<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Laboratorium;
use App\Http\Resources\LaboratoriumResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;


class LaboratoriumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Laboratorium::query();

            // Filter berdasarkan Status (Open/Closed)
            if ($request->has('status') && $request->status != '') {
                $query->where('status', $request->status);
            }

            // Filter berdasarkan Pencarian (nama lab, lokasi)
            if ($request->has('search') && $request->search != '') {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('nama_lab', 'like', '%' . $searchTerm . '%')
                      ->orWhere('lokasi_gedung', 'like', '%' . $searchTerm . '%')
                      ->orWhere('lokasi_ruang', 'like', '%' . $searchTerm . '%');
                });
            }

            // Sorting (default by nama_lab)
            $query->orderBy($request->input('sort_by', 'nama_lab'), $request->input('direction', 'asc'));

            // Tidak perlu pagination untuk daftar lab? Atau tambahkan jika perlu.
            $laboratoria = $query->get();
            // Jika ingin pagination:
            // $laboratoria = $query->paginate($request->input('per_page', 15));


            return LaboratoriumResource::collection($laboratoria)
                   ->additional(['success' => true, 'message' => 'Daftar laboratorium berhasil diambil.']);

        } catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data laboratorium: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
 * Display the specified resource.
 */
// Gunakan Route Model Binding
public function show(Laboratorium $laboratorium)
{
    try {
        // Tidak perlu load relasi spesifik untuk saat ini
        return (new LaboratoriumResource($laboratorium))
               ->additional(['success' => true, 'message' => 'Detail laboratorium berhasil diambil.']);
    } catch (\Exception $e) {
        // Seharusnya tidak terjadi jika model ditemukan oleh binding
         return response()->json([
            'success' => false,
            'message' => 'Gagal mengambil detail laboratorium: ' . $e->getMessage()
        ], 500);
    }
}

   /**
 * Update the status of a specific laboratorium.
 */
public function updateStatus(Request $request, Laboratorium $laboratorium)
{
    // Otorisasi (misal: gunakan Gate yang sama dengan inventaris/setting, atau buat baru)
    if (!Gate::allows('manage-settings')) { // Asumsi hanya Admin yg boleh ubah status lab
        return response()->json(['success' => false, 'message' => 'Anda tidak memiliki izin untuk mengupdate status laboratorium.'], 403);
    }

    // Validasi status baru
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
            'message' => 'Gagal mengupdate status laboratorium: ' . $e->getMessage(),
        ], 500);
    }
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
