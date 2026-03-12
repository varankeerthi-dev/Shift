<?php

namespace App\Modules\Products\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
        'sku',
        'hsn_code',
        'category_id',
        'unit_id',
        'type',
        'price',
        'cost_price',
        'tax_rate',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public const TYPE_PRODUCT = 'product';
    public const TYPE_SERVICE = 'service';

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(ProductUnit::class, 'unit_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function makes(): HasMany
    {
        return $this->hasMany(ProductMake::class);
    }

    public function warehouseStocks(): HasMany
    {
        return $this->hasMany(WarehouseStock::class);
    }
}

class ProductCategory extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'name',
        'description',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}

class ProductUnit extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'name',
        'symbol',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }
}

class ProductVariant extends Model
{
    use HasUuids;

    protected $fillable = [
        'product_id',
        'name',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

class ProductMake extends Model
{
    use HasUuids;

    protected $fillable = [
        'product_id',
        'name',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

class Warehouse extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'name',
        'address',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(WarehouseStock::class);
    }
}

class WarehouseStock extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'warehouse_id',
        'product_id',
        'variant_id',
        'make_id',
        'quantity',
        'alert_quantity',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
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
