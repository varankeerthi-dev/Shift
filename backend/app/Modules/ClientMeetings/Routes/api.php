<?php

use App\Modules\ClientMeetings\Controllers\ClientMeetingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'organization'])->group(function () {
    Route::get('/client-meetings', [ClientMeetingController::class, 'index']);
    Route::post('/client-meetings', [ClientMeetingController::class, 'store']);
    Route::get('/client-meetings/{clientMeeting}', [ClientMeetingController::class, 'show']);
    Route::put('/client-meetings/{clientMeeting}', [ClientMeetingController::class, 'update']);
    Route::delete('/client-meetings/{clientMeeting}', [ClientMeetingController::class, 'destroy']);
});