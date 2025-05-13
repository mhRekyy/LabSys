<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
        // Gate untuk memeriksa apakah user boleh mengelola inventaris
        Gate::define('manage-inventaris', function (User $user) {
            // Izinkan jika role user adalah Admin atau Aslab
            return in_array($user->role, ['Admin', 'Aslab']); // Pastikan role 'Aslab' sudah ada di DB/Model User
        });
        // Gate untuk memeriksa apakah user boleh mengelola settings
        Gate::define('manage-settings', function (User $user) {
            // Hanya Admin yang boleh (atau sesuaikan jika Aslab juga boleh)
            return in_array($user->role, ['Admin', 'Aslab']);
        });
    }
}
