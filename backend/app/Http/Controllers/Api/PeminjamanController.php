<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Peminjaman;
use App\Models\Inventaris; 
use App\Http\Resources\PeminjamanResource;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class PeminjamanController extends Controller
{
    /**
 * Display a listing of the resource.
 * Menampilkan riwayat peminjaman.
 */
public function index(Request $request)
{
    $user = Auth::user();
    $query = Peminjaman::query()->with(['user', 'inventaris', 'petugas']); // Eager load relasi

    // Jika user adalah Mahasiswa, hanya tampilkan peminjaman miliknya
    if ($user->role === 'Mahasiswa') {
        $query->where('user_id', $user->id);
    }
    // Jika Admin/Aslab, bisa melihat semua (dengan otorisasi tambahan jika perlu)
    // Kita bisa tambahkan filter berdasarkan role di sini jika UI Admin/Aslab punya filter user

    // Filter berdasarkan status (jika ada parameter 'status')
    if ($request->has('status') && $request->status != '') {
        $query->where('status', $request->status);
    }

    // Filter berdasarkan pencarian (nama alat atau npm peminjam)
    if ($request->has('search') && $request->search != '') {
        $searchTerm = $request->search;
        $query->where(function($q) use ($searchTerm) {
            $q->whereHas('inventaris', function($subQ) use ($searchTerm) {
                $subQ->where('nama_alat', 'like', '%' . $searchTerm . '%');
            })->orWhereHas('user', function($subQ) use ($searchTerm) {
                $subQ->where('name', 'like', '%' . $searchTerm . '%')
                     ->orWhere('npm', 'like', '%' . $searchTerm . '%');
            });
        });
    }

    // Urutkan berdasarkan tanggal pinjam terbaru (default)
    $sortBy = $request->input('sort_by', 'tanggal_pinjam');
    $sortDirection = $request->input('direction', 'desc');
    $allowedSorts = ['tanggal_pinjam', 'status']; // Kolom yg boleh disort
     if (in_array($sortBy, $allowedSorts)) {
         $query->orderBy($sortBy, $sortDirection);
    } else {
         $query->orderBy('tanggal_pinjam', 'desc');
    }

    // Pagination
    $perPage = $request->input('per_page', 10);
    $peminjamen = $query->paginate($perPage);

    return PeminjamanResource::collection($peminjamen)
           ->additional(['success' => true, 'message' => 'Riwayat peminjaman berhasil diambil.']);
}

    /**
 * Store a newly created resource in storage.
 * Membuat permintaan peminjaman baru.
 */
public function store(Request $request)
{
    // Validasi input dari request
    $validatedData = $request->validate([
        'inventaris_id' => 'required|integer|exists:inventaris,id',
        'jumlah_pinjam' => 'required|integer|min:1',
        'tanggal_kembali_rencana' => 'required|date|after_or_equal:today',
        'tujuan_peminjaman' => 'nullable|string|max:1000',
    ]);

    $user = Auth::user(); // Dapatkan user yang sedang login (peminjam)

    try {
        $inventaris = Inventaris::findOrFail($validatedData['inventaris_id']);

        // Cek ketersediaan stok (logika sederhana)
        if ($inventaris->jumlah < $validatedData['jumlah_pinjam']) {
            return response()->json([
                'success' => false,
                'message' => 'Stok inventaris tidak mencukupi. Sisa stok: ' . $inventaris->jumlah,
            ], 422); // Unprocessable Entity
        }

        // Buat record peminjaman baru
        $peminjaman = Peminjaman::create([
            'user_id' => $user->id,
            'inventaris_id' => $validatedData['inventaris_id'],
            'jumlah_pinjam' => $validatedData['jumlah_pinjam'],
            'tanggal_kembali_rencana' => $validatedData['tanggal_kembali_rencana'],
            'tujuan_peminjaman' => $validatedData['tujuan_peminjaman'],
            'status' => 'Menunggu Persetujuan', // Status awal
            // 'petugas_id' akan diisi saat approval/pengembalian
        ]);
        $peminjaman->refresh();

        // (Opsional) Kurangi stok inventaris langsung saat permintaan dibuat,
        // atau tunggu sampai status 'Disetujui'. Untuk sekarang, kita tidak kurangi dulu.
        // $inventaris->decrement('jumlah', $validatedData['jumlah_pinjam']);

        // Load relasi untuk response
        $peminjaman->load(['user', 'inventaris']);

        return (new PeminjamanResource($peminjaman))
               ->additional(['success' => true, 'message' => 'Permintaan peminjaman berhasil dibuat dan menunggu persetujuan.'])
               ->response()
               ->setStatusCode(201);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['success' => false, 'message' => 'Inventaris tidak ditemukan.'], 404);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal membuat permintaan peminjaman: ' . $e->getMessage(),
        ], 500);
    }
}

    /**
 * Display the specified resource.
 */
public function show(Peminjaman $peminjaman)
{
    // Otorisasi: Mahasiswa hanya boleh lihat detail peminjamannya sendiri,
    // Admin/Aslab boleh lihat semua.
    $user = Auth::user();
    if ($user->role === 'Mahasiswa' && $peminjaman->user_id !== $user->id) {
        return response()->json(['success' => false, 'message' => 'Anda tidak memiliki izin untuk melihat detail peminjaman ini.'], 403);
    }
    // Atau gunakan Gate: Gate::authorize('view', $peminjaman);

    $peminjaman->load(['user', 'inventaris', 'petugas']);
    return (new PeminjamanResource($peminjaman))
           ->additional(['success' => true, 'message' => 'Detail peminjaman berhasil diambil.']);
}

    /**
 * Update the status of a specific peminjaman.
 * (For approval, rejection, return marking by Admin/Aslab)
 *
 * @param  \Illuminate\Http\Request  $request
 * @param  \App\Models\Peminjaman  $peminjaman
 * @return \Illuminate\Http\JsonResponse|\App\Http\Resources\PeminjamanResource
 */
public function updateStatus(Request $request, Peminjaman $peminjaman)
{
    // 1. Otorisasi: Hanya Admin atau Aslab yang boleh update status
    if (!Gate::allows('manage-inventaris')) { // Gunakan Gate yang sama? Atau buat Gate baru 'manage-peminjaman'
         return response()->json(['success' => false, 'message' => 'Anda tidak memiliki izin untuk mengupdate status peminjaman.'], 403);
    }

    // 2. Validasi Input Status Baru
    $validated = $request->validate([
        'status' => ['required', 'string', Rule::in([
            'Dipinjam',         // Disetujui dan diambil
            'Dikembalikan',     // Sudah dikembalikan
            'Terlambat',        // Dikembalikan tapi terlambat
            'Ditolak',          // Permintaan ditolak
            // 'Menunggu Persetujuan' // Biasanya tidak di-set manual ke sini
        ])],
        'catatan_pengembalian' => 'nullable|string|max:1000', // Opsional saat pengembalian
    ]);

    $newStatus = $validated['status'];
    $oldStatus = $peminjaman->status; // Simpan status lama untuk logika stok

    // --- Logika Tambahan (PENTING) ---
    try {
        // Dapatkan ID petugas yang melakukan aksi
        $petugasId = Auth::id();

        // Update status utama
        $peminjaman->status = $newStatus;
        $peminjaman->petugas_id = $petugasId; // Catat petugas

        // Penyesuaian Stok & Tanggal Kembali Aktual
        $inventaris = $peminjaman->inventaris; // Ambil item inventaris terkait

        // A. Jika status BARU adalah 'Dipinjam' (Approval)
        if ($newStatus === 'Dipinjam' && $oldStatus === 'Menunggu Persetujuan') {
            // Cek stok lagi sebelum mengurangi (untuk mencegah race condition)
            if ($inventaris->jumlah < $peminjaman->jumlah_pinjam) {
                // Batalkan perubahan status jika stok tiba-tiba habis
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menyetujui: Stok inventaris tidak mencukupi. Sisa stok: ' . $inventaris->jumlah,
                ], 422);
            }
            // Kurangi stok
            $inventaris->decrement('jumlah', $peminjaman->jumlah_pinjam);
        }

        // B. Jika status BARU adalah 'Dikembalikan' atau 'Terlambat'
        else if (in_array($newStatus, ['Dikembalikan', 'Terlambat'])) {
            // Hanya bisa dikembalikan jika status sebelumnya 'Dipinjam' atau 'Terlambat' (jika diedit lagi)
            if (!in_array($oldStatus, ['Dipinjam', 'Terlambat'])) {
                 return response()->json(['success' => false, 'message' => 'Peminjaman tidak dalam status yang bisa dikembalikan.'], 422);
            }
             // Isi tanggal kembali aktual
            $peminjaman->tanggal_kembali_aktual = now();
             // Tambahkan stok kembali
            $inventaris->increment('jumlah', $peminjaman->jumlah_pinjam);
             // Isi catatan jika ada
            if(isset($validated['catatan_pengembalian'])) {
                $peminjaman->catatan_pengembalian = $validated['catatan_pengembalian'];
            }
            // Cek keterlambatan jika perlu (membandingkan tanggal_kembali_aktual dan tanggal_kembali_rencana)
            // Jika terlambat dan status di set 'Dikembalikan', ubah jadi 'Terlambat'?
            if ($newStatus === 'Dikembalikan' && $peminjaman->tanggal_kembali_rencana && now()->greaterThan($peminjaman->tanggal_kembali_rencana)) {
                $peminjaman->status = 'Terlambat'; // Otomatis set jadi Terlambat
            }
        }

        // C. Jika status BARU adalah 'Ditolak'
        else if ($newStatus === 'Ditolak' && $oldStatus === 'Menunggu Persetujuan') {
            // Tidak perlu ubah stok karena barang tidak jadi dipinjam
        }

        // D. Jika pindah dari status 'Dipinjam' ke status lain selain 'Dikembalikan'/'Terlambat' (misal dibatalkan Admin)
        else if ($oldStatus === 'Dipinjam' && !in_array($newStatus, ['Dikembalikan', 'Terlambat'])) {
             // Kembalikan stok jika peminjaman aktif dibatalkan
             $inventaris->increment('jumlah', $peminjaman->jumlah_pinjam);
        }


        // Simpan perubahan pada peminjaman
        $peminjaman->save();

        // Load relasi untuk response
        $peminjaman->load(['user', 'inventaris', 'petugas']);

        return (new PeminjamanResource($peminjaman))
               ->additional(['success' => true, 'message' => 'Status peminjaman berhasil diupdate.']);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengupdate status peminjaman: ' . $e->getMessage(),
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
