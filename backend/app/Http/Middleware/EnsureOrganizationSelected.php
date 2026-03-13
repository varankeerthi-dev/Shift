<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationSelected
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $organizationId = session('current_organization_id');

        if (!$organizationId) {
            $firstOrganization = $request->user()->organizations()->first();
            
            if (!$firstOrganization) {
                return response()->json([
                    'message' => 'No organization found',
                    'requires_organization' => true
                ], 403);
            }

            session(['current_organization_id' => $firstOrganization->id]);
        }

        if (!$request->user()->belongsToOrganization(session('current_organization_id'))) {
            session()->forget('current_organization_id');
            
            return response()->json([
                'message' => 'Access denied to this organization'
            ], 403);
        }

        return $next($request);
    }
}
