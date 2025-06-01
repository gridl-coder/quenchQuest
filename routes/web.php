<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\LocationController;

// Public homepage
Route::get('/', function () {
    return view('welcome');
})->name('home');

// Admin authentication
Route::get('admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('admin/login', [AuthController::class, 'login'])->name('admin.login.post');
Route::post('admin/logout', [AuthController::class, 'logout'])->name('admin.logout');
Route::get('admin/dashboard', function () {
    return redirect()->route('admin.locations.index');
})->name('admin.dashboard');


// Protect all admin routes under this group
Route::middleware('auth:admin')->prefix('admin')->name('admin.')->group(function () {
    // Dashboard & Location CRUD
    Route::resource('locations', LocationController::class)
        ->only(['index', 'store', 'destroy']);
});
