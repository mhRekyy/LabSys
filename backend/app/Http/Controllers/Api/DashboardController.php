<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Inventaris;
use App\Models\Peminjaman;
use App\Models\Laboratorium;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
   /**
     * Fetch dashboard summary data.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $data = [];

        try {
            // --- Data Umum (Untuk Semua Role atau Admin/Aslab) ---
            $totalUsers = User::count();
            $totalInventaris = Inventaris::count(); // Jumlah jenis item, bukan total unit
            $totalUnitInventaris = Inventaris::sum('jumlah'); // Total unit barang
            $totalLabs = Laboratorium::count();
            $labsOpen = Laboratorium::where('status', 'Open')->count();
            $peminjamanAktifTotal = Peminjaman::where('status', 'Dipinjam')->count();
            // Pending returns bisa dihitung dari peminjaman 'Dipinjam' yang 'tanggal_kembali_rencana'-nya sudah lewat
            $pendingReturnsTotal = Peminjaman::where('status', 'Dipinjam')
                                        ->whereNotNull('tanggal_kembali_rencana')
                                        ->where('tanggal_kembali_rencana', '<', now())
                                        ->count();

            // --- Data Spesifik Mahasiswa ---
            $peminjamanAktifUser = 0;
            if ($user->role === 'Mahasiswa') {
                $peminjamanAktifUser = Peminjaman::where('user_id', $user->id)
                                            ->where('status', 'Dipinjam')
                                            ->count();
                // Anda bisa tambahkan query lain spesifik mahasiswa di sini
            }


            // --- Siapkan Data untuk Response ---
            if (in_array($user->role, ['Admin', 'Aslab'])) {
                // Data untuk Admin/Aslab
                $data = [
                    'totalUsers' => $totalUsers,
                    'totalInventarisItems' => $totalInventaris,
                    'totalInventarisUnits' => $totalUnitInventaris,
                    'totalLabs' => $totalLabs,
                    'labsOpen' => $labsOpen,
                    'peminjamanAktifTotal' => $peminjamanAktifTotal,
                    'pendingReturnsTotal' => $pendingReturnsTotal,
                    // Tambahkan data agregat lain untuk admin dashboard
                    // 'equipmentUsage' => $this->getEquipmentUsageStats(), // Contoh panggil method lain
                    // 'weeklyActivity' => $this->getWeeklyActivityStats(), // Contoh
                ];
            } else {
                // Data untuk Mahasiswa
                $data = [
                    'activeBookings' => $peminjamanAktifUser, // Asumsi active bookings = peminjaman aktif
                    // Tambahkan data lain untuk dashboard mahasiswa
                    // 'upcomingBookings' => [], // Data booking lab user
                    // 'recentAlerts' => [], // Notifikasi user
                    // 'labHours' => 0, // Perlu logika perhitungan sendiri
                ];
            }


            return response()->json([
                'success' => true,
                'message' => 'Data dashboard berhasil diambil.',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data dashboard: ' . $e->getMessage()
            ], 500);
        }
    }

    // --- Contoh Method Helper Tambahan (jika dashboard makin kompleks) ---
    // protected function getEquipmentUsageStats() {
    //     return Inventaris::select('kategori_id', DB::raw('count(*) as count'))
    //                 ->whereHas('peminjaman', fn($q) => $q->where('status', 'Dipinjam')) // Hanya yg sedang dipinjam
    //                 ->with('kategori:id,nama_kategori') // Ambil nama kategori
    //                 ->groupBy('kategori_id')
    //                 ->get()
    //                 ->map(function($item) {
    //                     return [
    //                         'category_name' => $item->kategori->nama_kategori ?? 'Tanpa Kategori',
    //                         'count' => $item->count,
    //                     ];
    //                 });
    // }

    // protected function getWeeklyActivityStats() {
    //     // Query peminjaman/pengembalian dalam 7 hari terakhir, group by day
    //     return []; // Implementasi query
    // }
}
