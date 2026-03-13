<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('client_id');
            $table->string('quotation_number');
            $table->string('reference_number')->nullable();
            $table->date('issue_date');
            $table->date('valid_until');
            $table->enum('status', ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted'])->default('draft');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->enum('discount_type', ['percentage', 'fixed'])->nullable();
            $table->decimal('discount_value', 12, 2)->nullable();
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->text('terms')->nullable();
            $table->uuid('converted_to_invoice_id')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('restrict');
            $table->foreign('converted_to_invoice_id')->references('id')->on('invoices')->onDelete('set null');
            $table->unique(['organization_id', 'quotation_number']);
            $table->index('organization_id');
            $table->index('client_id');
            $table->index('status');
        });

        Schema::create('quotation_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('quotation_id');
            $table->uuid('product_id')->nullable();
            $table->text('description');
            $table->decimal('quantity', 12, 2)->default(1);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->timestamps();

            $table->foreign('quotation_id')->references('id')->on('quotations')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
            $table->index('quotation_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotation_items');
        Schema::dropIfExists('quotations');
    }
};
