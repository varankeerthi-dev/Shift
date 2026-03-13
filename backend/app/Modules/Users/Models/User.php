<?php

namespace App\Modules\Users\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasUuids;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar_path',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'password' => 'hashed',
    ];

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(\App\Modules\Organizations\Models\Organization::class, 'organization_users')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function getCurrentOrganizationAttribute()
    {
        return $this->organizations()->first();
    }

    public function isOwnerOfOrganization(string $organizationId): bool
    {
        return $this->organizations()
            ->wherePivot('organization_id', $organizationId)
            ->wherePivot('role', 'owner')
            ->exists();
    }

    public function belongsToOrganization(string $organizationId): bool
    {
        return $this->organizations()
            ->wherePivot('organization_id', $organizationId)
            ->exists();
    }
}
