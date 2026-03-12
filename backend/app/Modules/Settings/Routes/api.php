<?php

use App\Modules\Settings\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'organization'])->group(function () {
    Route::get('/settings', [SettingsController::class, 'index']);
    
    Route::get('/settings/document/{type}', [SettingsController::class, 'getDocumentSettings']);
    Route::put('/settings/document/{type}', [SettingsController::class, 'updateDocumentSettings']);
    
    Route::get('/settings/templates/{type}', [SettingsController::class, 'getTemplateSettings']);
    Route::put('/settings/templates/{type}', [SettingsController::class, 'updateTemplateSettings']);
    Route::get('/settings/templates/{type}/preview', [SettingsController::class, 'previewTemplate']);
    Route::post('/settings/templates/{type}/upload', [SettingsController::class, 'uploadTemplate']);
});