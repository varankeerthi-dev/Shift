<?php

namespace App\Modules\Roles\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Role extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'permissions',
        'is_default',
    ];

    protected $casts = [
        'permissions' => 'array',
        'is_default' => 'boolean',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(\App\Modules\Users\Models\User::class, 'user_roles')
            ->withTimestamps();
    }
}

class Permission extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'module',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permissions')
            ->withTimestamps();
    }
}

class UserRole extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'organization_id',
        'role_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Users\Models\User::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }
}
