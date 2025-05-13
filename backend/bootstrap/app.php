<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter; 

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(append: [
            // Pastikan middleware CORS ada di sini atau di konfigurasi defaultnya
            // Contoh: \Illuminate\Http\Middleware\HandleCors::class,
            // atau mungkin sudah dihandle oleh EnsureFrontendRequestsAreStateful
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    
        // ... middleware lain ...
    })
    
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
