<?php

use App\Modules\SiteVisits\Controllers\SiteVisitController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'organization'])->group(function () {
    Route::get('/site-visits', [SiteVisitController::class, 'index']);
    Route::post('/site-visits', [SiteVisitController::class, 'store']);
    Route::get('/site-visits/{siteVisit}', [SiteVisitController::class, 'show']);
    Route::put('/site-visits/{siteVisit}', [SiteVisitController::class, 'update']);
    Route::delete('/site-visits/{siteVisit}', [SiteVisitController::class, 'destroy']);
});