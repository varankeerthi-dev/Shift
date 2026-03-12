<?php

namespace App\Modules\Clients\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Client extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'tax_number',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(\App\Modules\Invoices\Models\Invoice::class);
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(\App\Modules\Quotations\Models\Quotation::class);
    }
}
