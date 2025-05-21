<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Inventaris;
use App\Models\Peminjaman;
use App\Models\Laboratorium;
use App\Models\LabBooking; // PASTIKAN MODEL INI ADA DAN SESUAI NAMANYA
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // Untuk manipulasi tanggal

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
        if (!$user) { // Selalu baik untuk cek jika user tidak ada (misal token tidak valid)
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401);
        }
        $data = [];

        try {
            // --- Data yang dibutuhkan baik oleh Admin/Aslab maupun Mahasiswa (tapi mungkin dengan scope berbeda) ---

            // A. Data untuk Riwayat Booking Laboratorium Terbaru
            $recentLabBookings = [];
            $myRecentLabBookings = [];

            // B. Data untuk Statistik Ringkas Terkait Booking Lab
            $labBookingsPendingApproval = 0;
            $labBookingsActiveToday = 0;
            $myLabBookingsPending = 0;
            $myLabBookingsApproved = 0; // atau myLabBookingsActiveToday

            // C. Data untuk Chart Aktivitas (7 hari terakhir)
            $peminjamanLast7Days = [];
            $labBookingsLast7Days = [];
            $myPeminjamanLast7Days = [];
            $myLabBookingsLast7Days = [];


            // --- Pengambilan Data Berdasarkan Role ---
            if (in_array($user->role, ['Admin', 'Aslab'])) {
                // Statistik Umum yang sudah ada
                $data['totalUsers'] = User::count();
                $data['totalInventarisItems'] = Inventaris::count(); // Jumlah jenis item
                $data['totalInventarisUnits'] = Inventaris::sum('jumlah'); // Total unit barang
                $data['totalLabs'] = Laboratorium::count();
                $data['labsOpen'] = Laboratorium::where('status', 'Open')->count();
                $data['peminjamanAktifTotal'] = Peminjaman::where('status', 'Dipinjam')->count();
                $data['pendingReturnsTotal'] = Peminjaman::where('status', 'Dipinjam')
                                            ->whereNotNull('tanggal_kembali_rencana') // Anda menggunakan 'tanggal_kembali_rencana'
                                            ->where('tanggal_kembali_rencana', '<', now()->toDateString()) // Pastikan format tanggal sesuai
                                            ->count();
                // Statistik baru: Peminjaman menunggu persetujuan (jika ada statusnya)
                $data['peminjamanMenungguPersetujuan'] = Peminjaman::where('status', 'Menunggu Persetujuan')->count();


                // A. Riwayat Booking Lab Terbaru (Admin/Aslab - Semua User)
                $data['recentLabBookings'] = LabBooking::with(['user:id,name', 'lab:id,nama_lab']) // Sesuaikan 'lab:id,nama_lab' dengan field Anda
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(['id', 'user_id', 'lab_id', 'start_time', 'end_time', 'status', 'purpose']);

                // B. Statistik Ringkas Booking Lab (Admin/Aslab - Global)
                $data['labBookingsPendingApproval'] = LabBooking::where('status', 'pending')->count(); // Sesuaikan status 'pending'
                $data['labBookingsActiveToday'] = LabBooking::where('status', 'approved') // Sesuaikan status 'approved'
                    ->where(function ($query) {
                        $query->whereDate('start_time', '=', now()->toDateString())
                              ->orWhere(function($q) {
                                  $q->where('start_time', '<=', now())
                                    ->where('end_time', '>=', now());
                              });
                    })
                    ->count();

                // C. Data Chart Aktivitas (Admin/Aslab - Global)
                $peminjamanQuery = Peminjaman::query();
                $data['peminjamanLast7Days'] = $this->getAggregatedDataForChart($peminjamanQuery, 'tanggal_pinjam'); // Sesuaikan 'tanggal_pinjam'

                $labBookingQuery = LabBooking::query();
                $data['labBookingsLast7Days'] = $this->getAggregatedDataForChart($labBookingQuery, 'start_time');


            } elseif ($user->role === 'Mahasiswa') {
                // Statistik yang sudah ada untuk Mahasiswa
                $data['activeBookings'] = Peminjaman::where('user_id', $user->id)
                                                ->where('status', 'Dipinjam')
                                                ->count();
                // Statistik baru: Peminjaman menunggu persetujuan milik mahasiswa (jika ada statusnya)
                $data['myPeminjamanMenungguPersetujuan'] = Peminjaman::where('user_id', $user->id)
                                                ->where('status', 'Menunggu Persetujuan')
                                                ->count();


                // A. Riwayat Booking Lab Terbaru (Mahasiswa - Milik Sendiri)
                $data['myRecentLabBookings'] = LabBooking::where('user_id', $user->id)
                    ->with(['lab:id,nama_lab']) // Sesuaikan 'lab:id,nama_lab' dengan field Anda
                    ->orderBy('created_at', 'desc')
                    ->take(3)
                    ->get(['id', 'lab_id', 'start_time', 'end_time', 'status', 'purpose']);

                // B. Statistik Ringkas Booking Lab (Mahasiswa - Milik Sendiri)
                $data['myLabBookingsPending'] = LabBooking::where('user_id', $user->id)
                                                ->where('status', 'pending') // Sesuaikan status 'pending'
                                                ->count();
                $data['myLabBookingsApproved'] = LabBooking::where('user_id', $user->id)
                                               ->where('status', 'approved') // Sesuaikan status 'approved'
                                               ->count();

                // C. Data Chart Aktivitas (Mahasiswa - Milik Sendiri)
                $myPeminjamanQuery = Peminjaman::where('user_id', $user->id);
                $data['myPeminjamanLast7Days'] = $this->getAggregatedDataForChart($myPeminjamanQuery, 'tanggal_pinjam'); // Sesuaikan 'tanggal_pinjam'

                $myLabBookingQuery = LabBooking::where('user_id', $user->id);
                $data['myLabBookingsLast7Days'] = $this->getAggregatedDataForChart($myLabBookingQuery, 'start_time');

            } else {
                // Handle jika ada role lain yang tidak terdefinisi atau tidak ada data spesifik
                return response()->json([
                    'success' => true,
                    'message' => 'Tidak ada data dashboard spesifik untuk role ini.',
                    'data' => (object)[] // Kirim objek kosong
                ]);
            }


            return response()->json([
                'success' => true,
                'message' => 'Data dashboard berhasil diambil.',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            \Log::error('Dashboard API Error: ' . $e->getMessage() . ' Stack: ' . $e->getTraceAsString()); // Log error untuk debugging
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data dashboard. Silakan coba lagi nanti.'
                // 'message' => 'Gagal mengambil data dashboard: ' . $e->getMessage() // Jangan ekspos detail error ke client di produksi
            ], 500);
        }
    }

    /**
     * Helper method untuk mengambil data agregat untuk chart.
     *
     * @param \Illuminate\Database\Eloquent\Builder $baseQuery Builder query dasar (bisa sudah di-filter user_id)
     * @param string $dateColumn Nama kolom tanggal yang akan diagregasi
     * @param int $days Jumlah hari ke belakang
     * @return \Illuminate\Support\Collection
     */
    protected function getAggregatedDataForChart($baseQuery, string $dateColumn, int $days = 7)
    {
        // Clone query agar tidak memodifikasi query asli jika digunakan lagi
        $query = clone $baseQuery;

        return $query
            ->select(
                DB::raw("DATE({$dateColumn}) as date"), // Menggunakan DATE() untuk MySQL agar formatnya YYYY-MM-DD
                DB::raw('count(*) as total')
            )
            ->where($dateColumn, '>=', Carbon::now()->subDays($days - 1)->startOfDay())
            ->where($dateColumn, '<=', Carbon::now()->endOfDay()) // Hingga akhir hari ini
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                // Pastikan tanggal dalam format YYYY-MM-DD dan total adalah integer
                $item->date = Carbon::parse($item->date)->format('Y-m-d');
                $item->total = (int) $item->total;
                return $item;
            })
            ->pipe(function ($collection) use ($days) { // Memastikan ada data untuk semua hari dalam rentang
                $filledData = collect();
                $startDate = Carbon::now()->subDays($days - 1)->startOfDay();
                $endDate = Carbon::now()->startOfDay(); // Data hingga hari ini

                for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                    $formattedDate = $date->format('Y-m-d');
                    $item = $collection->firstWhere('date', $formattedDate);
                    $filledData->push([
                        'date' => $formattedDate,
                        'total' => $item ? $item->total : 0,
                    ]);
                }
                return $filledData;
            });
    }

    // Method helper yang sudah ada bisa tetap di sini
    // protected function getEquipmentUsageStats() { ... }
    // protected function getWeeklyActivityStats() { ... }
}