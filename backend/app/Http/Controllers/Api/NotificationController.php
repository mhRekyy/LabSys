<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\NotificationResource;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
   // Mendapatkan notifikasi user (misal: 10 terbaru atau yg belum dibaca)
   public function index()
   {
       $user = Auth::user();
       // Ambil notifikasi yg belum dibaca, urutkan terbaru dulu
       $notifications = $user->unreadNotifications()->latest()->paginate(10);
       // Atau ambil semua notifikasi: $notifications = $user->notifications()->latest()->paginate(10);

       return NotificationResource::collection($notifications)
              ->additional(['success' => true, 'message' => 'Notifikasi berhasil diambil.']);
   }

   // Menandai notifikasi sebagai sudah dibaca
   public function markAsRead(DatabaseNotification $notification)
   {
       // Pastikan notifikasi ini milik user yg sedang login
       if (Auth::id() !== $notification->notifiable_id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
       }

       if ($notification->unread()) {
           $notification->markAsRead();
       }

       return response()->json(['success' => true, 'message' => 'Notifikasi ditandai sudah dibaca.']);
   }

   // (Opsional) Menandai semua sebagai sudah dibaca
   public function markAllRead()
   {
        Auth::user()->unreadNotifications->markAsRead();
        return response()->json(['success' => true, 'message' => 'Semua notifikasi ditandai sudah dibaca.']);
   }
}
