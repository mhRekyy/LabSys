<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Terapkan CORS ke path API dan Sanctum CSRF

    'allowed_methods' => ['*'], // Izinkan semua metode HTTP (GET, POST, PUT, DELETE, dll.)

    'allowed_origins' => [
         // GANTI DENGAN URL FRONTEND ANDA!
         'http://localhost:8080',
         'http://127.0.0.1:8080',
    ],

    'allowed_origins_patterns' => [], // Bisa pakai pola regex jika perlu

    'allowed_headers' => ['*'], // Izinkan semua header request

    'exposed_headers' => [], // Header tambahan yang boleh diakses frontend dari response

    'max_age' => 0, // Berapa lama hasil preflight request bisa dicache (detik)

    'supports_credentials' => false, // Izinkan cookies dikirim lintas domain (hati-hati, true jika pakai Sanctum cookie auth)
                                     // Set ke true jika frontend Anda SPA di subdomain yg sama dan pakai cookie auth Sanctum
                                     // Jika pakai token Bearer, false biasanya cukup. Coba true jika ada masalah cookie.

];