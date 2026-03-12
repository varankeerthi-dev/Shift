<?php

namespace App\Modules\Files\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class File extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'uploaded_by',
        'filename',
        'original_filename',
        'mime_type',
        'size',
        'path',
        'disk',
        'metadata',
    ];

    protected $casts = [
        'size' => 'integer',
        'metadata' => 'array',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Users\Models\User::class, 'uploaded_by');
    }
}
