<?php

namespace App\Modules\Updates\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProjectUpdate extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'project_id',
        'type',
        'title',
        'description',
        'location',
        'visited_by',
        'visited_at',
        'images',
        'status',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
        'images' => 'array',
    ];

    public const TYPE_SITE_VISIT = 'site_visit';
    public const TYPE_DAILY_UPDATE = 'daily_update';
    public const TYPE_PROGRESS = 'progress';
    public const TYPE_ISSUE = 'issue';

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
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
