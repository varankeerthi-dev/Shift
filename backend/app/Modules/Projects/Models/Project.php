<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Project extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'client_id',
        'status',
        'start_date',
        'end_date',
        'budget',
        'progress',
        'manager_id',
        'location',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'budget' => 'decimal:2',
        'progress' => 'integer',
    ];

    public const STATUS_PLANNING = 'planning';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_ON_HOLD = 'on_hold';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Clients\Models\Client::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Users\Models\User::class, 'manager_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(\App\Modules\TeamTasks\Models\TeamTask::class);
    }

    public function updates(): HasMany
    {
        return $this->hasMany(\App\Modules\Updates\Models\ProjectUpdate::class);
    }
}
