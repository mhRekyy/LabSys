<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * Display the application settings.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Middleware 'can:manage-settings' sudah berjalan sebelumnya

        try {
            // Ambil semua setting, jadikan key sebagai index array
            // dan value sebagai nilainya, lakukan casting sederhana
            $settings = Setting::all()->pluck('value', 'key')->map(function ($value, $key) {
                // Lakukan casting sederhana berdasarkan key atau tipe jika disimpan
                // Contoh casting boolean (sesuaikan key nya)
                if (in_array($key, [
                    'enable_inventory_alerts', 'enable_maintenance_reminders',
                    'confirm_before_deleting', 'require_admin_approval',
                    'auto_suspend_overdue', 'lab_allow_weekend_bookings',
                    'notify_inventory_updates', 'notify_low_stock',
                    'notify_student_due_reminders'
                    ])) {
                    return (bool)$value;
                }
                // Contoh casting integer (sesuaikan key nya)
                if (in_array($key, [
                    'items_per_page', 'max_borrowings_per_student',
                    'lab_booking_window_days', 'lab_max_booking_duration_hours'
                    ])) {
                    return (int)$value;
                }
                return $value; // Default as string
            });

            return response()->json([
                'success' => true,
                'message' => 'Settings berhasil diambil.',
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil settings: ' . $e->getMessage()
            ], 500);
        }
    }

   /**
     * Update the application settings.
     * Menerima request dengan key-value pairs.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        // Middleware 'can:manage-settings' sudah berjalan sebelumnya

        // Validasi dasar: pastikan input adalah array
        $validator = Validator::make($request->all(), [
            '*' => 'nullable', // Izinkan semua key, value bisa null/string/dll. Validasi spesifik per key jika perlu.
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Input tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $inputData = $request->all();

            foreach ($inputData as $key => $value) {
                // Konversi boolean dari frontend (true/false) ke 1/0 untuk disimpan
                // Cek berdasarkan key yang kita tahu tipenya boolean
                if (in_array($key, [
                    'enable_inventory_alerts', 'enable_maintenance_reminders',
                    'confirm_before_deleting', 'require_admin_approval',
                    'auto_suspend_overdue', 'lab_allow_weekend_bookings',
                    'notify_inventory_updates', 'notify_low_stock',
                    'notify_student_due_reminders'
                    ])) {
                    $value = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
                }

                // Gunakan updateOrCreate untuk menyimpan setting
                Setting::updateOrCreate(
                    ['key' => $key], // Cari berdasarkan key
                    ['value' => $value] // Update atau create dengan value baru
                );
            }

            // Opsional: Hapus cache settings jika Anda menggunakannya
            // Cache::forget('app_settings');

            return response()->json([
                'success' => true,
                'message' => 'Settings berhasil diupdate.'
            ]);

        } catch (\Exception $e) {
             return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate settings: ' . $e->getMessage()
            ], 500);
        }
    }
}