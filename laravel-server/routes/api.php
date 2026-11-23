<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::get('/products', [ProductController::class, 'index']);
Route::middleware('auth')->post('/products', [ProductController::class, 'store']);

Route::get('/posts', [PostController::class, 'index'])->withoutMiddleware(\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class);
Route::post('/posts', [PostController::class, 'store'])->withoutMiddleware(\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class);
