<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Requests\RegisterRequest;
use App\Modules\Auth\Requests\ForgotPasswordRequest;
use App\Modules\Auth\Requests\ResetPasswordRequest;
use App\Modules\Auth\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            $request->validated('email'),
            $request->validated('password')
        );

        if (!$result) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        return response()->json($result);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json($result, 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $organizations = $user->organizations()->get();
        $currentOrganizationId = session('current_organization_id');
        
        if (!$currentOrganizationId && $organizations->isNotEmpty()) {
            $currentOrganizationId = $organizations->first()->id;
            session(['current_organization_id' => $currentOrganizationId]);
        }

        return response()->json([
            'user' => $user,
            'organizations' => $organizations,
            'current_organization_id' => $currentOrganizationId
        ]);
    }

    public function switchOrganization(Request $request): JsonResponse
    {
        $request->validate([
            'organization_id' => 'required|uuid'
        ]);

        $user = $request->user();
        
        if (!$user->belongsToOrganization($request->organization_id)) {
            return response()->json([
                'message' => 'Access denied to this organization'
            ], 403);
        }

        session(['current_organization_id' => $request->organization_id]);

        $organization = $user->organizations()->where('id', $request->organization_id)->first();

        return response()->json([
            'message' => 'Organization switched successfully',
            'organization' => $organization
        ]);
    }

    public function googleLogin(Request $request): JsonResponse
    {
        $request->validate([
            'google_token' => 'required|string',
        ]);

        $result = $this->authService->googleLogin($request->google_token);

        if (!$result) {
            return response()->json([
                'message' => 'Google authentication failed'
            ], 401);
        }

        return response()->json($result);
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $status = $this->authService->sendResetLink($request->validated('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent to your email'
            ]);
        }

        return response()->json([
            'message' => 'Unable to send reset link'
        ], 400);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = $this->authService->resetPassword(
            $request->validated('token'),
            $request->validated('email'),
            $request->validated('password')
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password reset successfully'
            ]);
        }

        return response()->json([
            'message' => 'Invalid or expired reset token'
        ], 400);
    }
}
