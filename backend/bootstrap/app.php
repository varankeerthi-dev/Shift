<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: [
            __DIR__.'/../app/Modules/Auth/Routes/api.php',
            __DIR__.'/../app/Modules/Clients/Routes/api.php',
            __DIR__.'/../app/Modules/ClientMeetings/Routes/api.php',
            __DIR__.'/../app/Modules/Settings/Routes/api.php',
            __DIR__.'/../app/Modules/SiteVisits/Routes/api.php',
        ],
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'organization' => \App\Http\Middleware\EnsureOrganizationSelected::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
