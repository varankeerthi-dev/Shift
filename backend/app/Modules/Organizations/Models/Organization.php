<?php

namespace App\Modules\Organizations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Organization extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'tax_number',
        'logo_path',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(\App\Modules\Users\Models\User::class, 'organization_users')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function clients(): HasMany
    {
        return $this->hasMany(\App\Modules\Clients\Models\Client::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(\App\Modules\Products\Models\Product::class);
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
