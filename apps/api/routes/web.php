<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\GithubLoginController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/loginauthentication');
Route::get('/loginauthentication', [AdminController::class, 'login'])->name('login');
Route::get('/admin/auth/github', [GithubLoginController::class, 'redirect'])->name('admin.github.redirect');
Route::get('/admin/auth/github/callback', [GithubLoginController::class, 'callback'])->name('admin.github.callback');
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
