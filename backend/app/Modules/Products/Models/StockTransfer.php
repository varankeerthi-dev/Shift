<?php

namespace App\Modules\Products\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class StockTransfer extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'transfer_number',
        'from_warehouse_id',
        'to_warehouse_id',
        'transfer_date',
        'status',
        'notes',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'transfer_date' => 'date',
        'approved_at' => 'datetime',
    ];

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id');
    }

    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(StockTransferItem::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Users\Models\User::class, 'approved_by');
    }
}

class StockTransferItem extends Model
{
    use HasUuids;

    protected $fillable = [
        'stock_transfer_id',
        'product_id',
        'variant_id',
        'make_id',
        'quantity',
    ];

    public function stockTransfer(): BelongsTo
    {
        return $this->belongsTo(StockTransfer::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class);
    }

    public function make(): BelongsTo
    {
        return $this->belongsTo(ProductMake::class);
    }
}
