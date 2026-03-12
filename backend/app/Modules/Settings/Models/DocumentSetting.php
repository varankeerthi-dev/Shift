<?php

namespace App\Modules\Settings\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DocumentSetting extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'key',
        'value',
        'type',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    public const TYPE_INVOICE = 'invoice';
    public const TYPE_QUOTATION = 'quotation';
    public const TYPE_DELIVERY_CHALLAN = 'delivery_challan';
    public const TYPE_PROJECT = 'project';
    public const TYPE_GENERAL = 'general';

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public static function getSetting(string $key, string $organizationId, $default = null)
    {
        $setting = static::where('key', $key)
            ->where('organization_id', $organizationId)
            ->first();

        return $setting ? $setting->value : $default;
    }

    public static function setSetting(string $key, $value, string $type, string $organizationId): self
    {
        return static::updateOrCreate(
            ['key' => $key, 'organization_id' => $organizationId],
            ['value' => $value, 'type' => $type]
        );
    }
}
