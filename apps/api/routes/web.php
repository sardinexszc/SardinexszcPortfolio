<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/admin/login');
Route::get('/admin/login', [AdminController::class, 'login'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'authenticate'])->name('admin.authenticate');
Route::middleware('auth')->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::post('/logout', [AdminController::class, 'logout'])->name('logout');
    Route::post('/projects', [AdminController::class, 'storeProject'])->name('projects.store');
    Route::put('/projects/{project}', [AdminController::class, 'updateProject'])->name('projects.update');
    Route::delete('/projects/{project}', [AdminController::class, 'destroyProject'])->name('projects.destroy');
    Route::post('/skills', [AdminController::class, 'storeSkill'])->name('skills.store');
    Route::put('/skills/{skill}', [AdminController::class, 'updateSkill'])->name('skills.update');
    Route::delete('/skills/{skill}', [AdminController::class, 'destroySkill'])->name('skills.destroy');
    Route::post('/timeline', [AdminController::class, 'storeTimeline'])->name('timeline.store');
    Route::put('/timeline/{timelineEntry}', [AdminController::class, 'updateTimeline'])->name('timeline.update');
    Route::delete('/timeline/{timelineEntry}', [AdminController::class, 'destroyTimeline'])->name('timeline.destroy');
});