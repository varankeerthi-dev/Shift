<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('name');
            $table->text('address')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->index('organization_id');
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->string('name');
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->index('product_id');
        });

        Schema::create('product_makes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->string('name');
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->index('product_id');
        });

        Schema::create('warehouse_stocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('warehouse_id');
            $table->uuid('product_id');
            $table->uuid('variant_id')->nullable();
            $table->uuid('make_id')->nullable();
            $table->integer('quantity')->default(0);
            $table->integer('alert_quantity')->default(10);
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('warehouse_id')->references('id')->on('warehouses')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->index(['warehouse_id', 'product_id']);
            $table->index('organization_id');
        });

        Schema::create('stock_transfers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('transfer_number');
            $table->uuid('from_warehouse_id');
            $table->uuid('to_warehouse_id');
            $table->date('transfer_date');
            $table->enum('status', ['pending', 'approved', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->uuid('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('from_warehouse_id')->references('id')->on('warehouses')->onDelete('cascade');
            $table->foreign('to_warehouse_id')->references('id')->on('warehouses')->onDelete('cascade');
            $table->unique(['organization_id', 'transfer_number']);
            $table->index('organization_id');
            $table->index('status');
        });

        Schema::create('stock_transfer_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('stock_transfer_id');
            $table->uuid('product_id');
            $table->uuid('variant_id')->nullable();
            $table->uuid('make_id')->nullable();
            $table->integer('quantity')->default(0);
            $table->timestamps();

            $table->foreign('stock_transfer_id')->references('id')->on('stock_transfers')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->index('stock_transfer_id');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('hsn_code')->nullable()->after('sku');
            $table->enum('type', ['product', 'service'])->default('product')->after('unit_id');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['hsn_code', 'type']);
        });

        Schema::dropIfExists('stock_transfer_items');
        Schema::dropIfExists('stock_transfers');
        Schema::dropIfExists('warehouse_stocks');
        Schema::dropIfExists('product_makes');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('warehouses');
    }
};
