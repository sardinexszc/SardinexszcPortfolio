<?php

use App\Http\Controllers\Api\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('projects', [PortfolioController::class, 'projects']);
    Route::get('skills', [PortfolioController::class, 'skills']);
    Route::get('timeline', [PortfolioController::class, 'timeline']);
});