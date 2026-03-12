<?php

namespace App\Modules\Subcontracts\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Subcontract extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'project_id',
        'contractor_name',
        'contractor_email',
        'contractor_phone',
        'contractor_address',
        'work_description',
        'contract_value',
        'start_date',
        'end_date',
        'status',
        'payment_terms',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'contract_value' => 'decimal:2',
    ];

    public const STATUS_DRAFT = 'draft';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_TERMINATED = 'terminated';

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Projects\Models\Project::class);
    }
}
