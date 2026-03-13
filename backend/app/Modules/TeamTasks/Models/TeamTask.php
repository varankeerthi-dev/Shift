<?php

namespace App\Modules\TeamTasks\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TeamTask extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'project_id',
        'title',
        'description',
        'assigned_to',
        'assigned_by',
        'due_date',
        'priority',
        'status',
        'estimated_hours',
        'actual_hours',
    ];

    protected $casts = [
        'due_date' => 'date',
        'estimated_hours' => 'decimal:2',
        'actual_hours' => 'decimal:2',
    ];

    public const STATUS_PENDING = 'pending';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_URGENT = 'urgent';

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Projects\Models\Project::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Users\Models\User::class, 'assigned_to');
    }

    public function assigner(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Users\Models\User::class, 'assigned_by');
    }
}
