<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LocationApiController;
use App\Http\Controllers\Api\CheckinApiController;

// Return JSON list of locations
Route::get('locations', [LocationApiController::class, 'index']);

// Handle check-in POST
Route::post('checkin', [CheckinApiController::class, 'checkin']);
