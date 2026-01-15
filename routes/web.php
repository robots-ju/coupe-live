<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', AppController::class . '@home');
Route::post('/toggle-task', TaskController::class . '@toggle');
