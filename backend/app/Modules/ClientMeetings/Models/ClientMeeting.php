<?php

namespace App\Modules\ClientMeetings\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ClientMeeting extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'client_id',
        'meeting_title',
        'meeting_type',
        'meeting_date',
        'meeting_time',
        'location',
        'agenda',
        'attendees',
        'organized_by',
        'status',
        'notes',
        'outcome',
        'action_items',
        'follow_up_required',
        'follow_up_date',
    ];

    protected $casts = [
        'meeting_date' => 'date',
        'follow_up_date' => 'date',
        'attendees' => 'array',
        'action_items' => 'array',
        'follow_up_required' => 'boolean',
    ];

    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_RESCHEDULED = 'rescheduled';

    public const TYPE_INITIAL = 'initial';
    public const TYPE_FOLLOW_UP = 'follow_up';
    public const TYPE_DISCUSSION = 'discussion';
    public const TYPE_PRESENTATION = 'presentation';
    public const TYPE_NEGOTIATION = 'negotiation';
    public const TYPE_OTHER = 'other';

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Clients\Models\Client::class);
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Users\Models\User::class, 'organized_by');
    }
}