<?php

namespace App\Modules\SiteVisits\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SiteVisit extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'client_id',
        'project_id',
        'visit_date',
        'visit_time',
        'location',
        'purpose',
        'visited_by',
        'status',
        'notes',
        'remarks',
        'next_action',
        'follow_up_date',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'follow_up_date' => 'date',
    ];

    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_IN_PROGRESS = 'in_progress';
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

    public function project(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Projects\Models\Project::class);
    }

    public function visitor(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Users\Models\User::class, 'visited_by');
    }
}