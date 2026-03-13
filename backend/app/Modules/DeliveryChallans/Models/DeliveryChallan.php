<?php

namespace App\Modules\DeliveryChallans\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class DeliveryChallan extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'challan_number',
        'invoice_id',
        'project_id',
        'client_id',
        'issue_date',
        'transport_name',
        'vehicle_number',
        'driver_name',
        'driver_phone',
        'destination',
        'status',
        'notes',
    ];

    protected $casts = [
        'issue_date' => 'date',
    ];

    public const STATUS_PENDING = 'pending';
    public const STATUS_DISPATCHED = 'dispatched';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_CANCELLED = 'cancelled';

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Invoices\Models\Invoice::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Projects\Models\Project::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Clients\Models\Client::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(DeliveryChallanItem::class);
    }
}

class DeliveryChallanItem extends Model
{
    use HasUuids;

    protected $fillable = [
        'delivery_challan_id',
        'product_id',
        'description',
        'quantity',
        'unit',
        'remarks',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
    ];

    public function deliveryChallan(): BelongsTo
    {
        return $this->belongsTo(DeliveryChallan::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Products\Models\Product::class);
    }
}
