<?php

namespace App\Modules\Quotations\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Quotation extends Model
{
    use HasUuids;

    protected $fillable = [
        'organization_id',
        'client_id',
        'quotation_number',
        'reference_number',
        'issue_date',
        'valid_until',
        'status',
        'subtotal',
        'discount_type',
        'discount_value',
        'discount_amount',
        'tax_amount',
        'total',
        'notes',
        'terms',
        'converted_to_invoice_id',
        'sent_at',
        'viewed_at',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'valid_until' => 'date',
        'subtotal' => 'decimal:2',
        'discount_value' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'sent_at' => 'datetime',
        'viewed_at' => 'datetime',
    ];

    public const STATUS_DRAFT = 'draft';
    public const STATUS_SENT = 'sent';
    public const STATUS_VIEWED = 'viewed';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_EXPIRED = 'expired';
    public const STATUS_CONVERTED = 'converted';

    public function organization(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Organizations\Models\Organization::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Clients\Models\Client::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function convertedToInvoice(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Invoices\Models\Invoice::class, 'converted_to_invoice_id');
    }
}

class QuotationItem extends Model
{
    use HasUuids;

    protected $fillable = [
        'quotation_id',
        'product_id',
        'description',
        'quantity',
        'unit_price',
        'tax_rate',
        'tax_amount',
        'discount',
        'total',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Products\Models\Product::class);
    }
}
