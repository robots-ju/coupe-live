<?php

use App\Http\Controllers\UpdateController;
use Illuminate\Support\Facades\Route;

Route::post('/stream', UpdateController::class . '@stream');
//Route::post('/matches', UpdateController::class . '@matches');
// Not used in FLL mode
