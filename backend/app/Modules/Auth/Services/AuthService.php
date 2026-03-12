<?php

namespace App\Modules\Auth\Services;

use App\Modules\Organizations\Models\Organization;
use App\Modules\Users\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

class AuthService
{
    public function login(string $email, string $password): ?array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }

        if (!$user->is_active) {
            return null;
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $organizations = $user->organizations()->get();
        $currentOrganizationId = $organizations->first()?->id;

        return [
            'token' => $token,
            'user' => $user,
            'organizations' => $organizations,
            'current_organization_id' => $currentOrganizationId
        ];
    }

    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? null,
            ]);

            $organization = Organization::create([
                'name' => $data['organization_name'] ?? $data['name'] . "'s Organization",
                'email' => $data['email'],
            ]);

            $user->organizations()->attach($organization->id, ['role' => 'owner']);

            $token = $user->createToken('auth-token')->plainTextToken;

            session(['current_organization_id' => $organization->id]);

            return [
                'token' => $token,
                'user' => $user->load('organizations'),
                'organization' => $organization
            ];
        });
    }

    public function googleLogin(string $googleToken): ?array
    {
        try {
            $googleUser = Socialite::driver('google')->userFromToken($googleToken);
            
            if (!$googleUser) {
                return null;
            }

            $user = User::where('email', $googleUser->email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Hash::make(uniqid()),
                    'avatar_path' => $googleUser->avatar,
                    'google_id' => $googleUser->id,
                ]);

                $organization = Organization::create([
                    'name' => $user->name . "'s Organization",
                    'email' => $user->email,
                ]);

                $user->organizations()->attach($organization->id, ['role' => 'owner']);
            }

            if (!$user->is_active) {
                return null;
            }

            $token = $user->createToken('google-auth')->plainTextToken;
            $organizations = $user->organizations()->get();
            $currentOrganizationId = $organizations->first()?->id;

            return [
                'token' => $token,
                'user' => $user,
                'organizations' => $organizations,
                'current_organization_id' => $currentOrganizationId,
                'is_new_user' => $user->wasRecentlyCreated
            ];
        } catch (\Exception $e) {
            return null;
        }
    }

    public function sendResetLink(string $email): string
    {
        $status = Password::sendResetLink(
            ['email' => $email]
        );

        return $status;
    }

    public function resetPassword(string $token, string $email, string $password): string
    {
        return Password::reset(
            [
                'email' => $email,
                'password' => $password,
                'password_confirmation' => $password,
                'token' => $token
            ],
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();

                event(new PasswordReset($user));
            }
        );
    }
}
