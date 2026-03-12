<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->uuid('client_id')->nullable();
            $table->enum('status', ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'])->default('planning');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('budget', 12, 2)->nullable();
            $table->integer('progress')->default(0);
            $table->uuid('manager_id')->nullable();
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('set null');
            $table->foreign('manager_id')->references('id')->on('users')->onDelete('set null');
            $table->index('organization_id');
            $table->index('status');
        });

        Schema::create('project_updates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('project_id');
            $table->enum('type', ['site_visit', 'daily_update', 'progress', 'issue']);
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->uuid('visited_by')->nullable();
            $table->timestamp('visited_at')->nullable();
            $table->json('images')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('visited_by')->references('id')->on('users')->onDelete('set null');
            $table->index('organization_id');
            $table->index('project_id');
        });

        Schema::create('subcontracts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('project_id')->nullable();
            $table->string('contractor_name');
            $table->string('contractor_email')->nullable();
            $table->string('contractor_phone')->nullable();
            $table->text('contractor_address')->nullable();
            $table->text('work_description')->nullable();
            $table->decimal('contract_value', 12, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', ['draft', 'active', 'completed', 'terminated'])->default('draft');
            $table->text('payment_terms')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            $table->index('organization_id');
            $table->index('status');
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('permissions')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->index('organization_id');
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('module')->nullable();
            $table->timestamps();
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('organization_id');
            $table->uuid('role_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->unique(['user_id', 'organization_id', 'role_id']);
        });

        Schema::create('team_tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('project_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->uuid('assigned_to')->nullable();
            $table->uuid('assigned_by')->nullable();
            $table->date('due_date')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->decimal('estimated_hours', 5, 2)->nullable();
            $table->decimal('actual_hours', 5, 2)->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->foreign('assigned_by')->references('id')->on('users')->onDelete('set null');
            $table->index('organization_id');
            $table->index('status');
            $table->index('assigned_to');
        });

        Schema::create('delivery_challans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('challan_number');
            $table->uuid('invoice_id')->nullable();
            $table->uuid('project_id')->nullable();
            $table->uuid('client_id')->nullable();
            $table->date('issue_date');
            $table->string('transport_name')->nullable();
            $table->string('vehicle_number')->nullable();
            $table->string('driver_name')->nullable();
            $table->string('driver_phone')->nullable();
            $table->string('destination')->nullable();
            $table->enum('status', ['pending', 'dispatched', 'delivered', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('set null');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('set null');
            $table->unique(['organization_id', 'challan_number']);
            $table->index('organization_id');
            $table->index('status');
        });

        Schema::create('delivery_challan_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('delivery_challan_id');
            $table->uuid('product_id')->nullable();
            $table->string('description');
            $table->decimal('quantity', 12, 2)->default(1);
            $table->string('unit')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('delivery_challan_id')->references('id')->on('delivery_challans')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
        });

        Schema::create('document_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->string('key');
            $table->json('value')->nullable();
            $table->string('type')->default('general');
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->unique(['organization_id', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_settings');
        Schema::dropIfExists('delivery_challan_items');
        Schema::dropIfExists('delivery_challans');
        Schema::dropIfExists('team_tasks');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('subcontracts');
        Schema::dropIfExists('project_updates');
        Schema::dropIfExists('projects');
    }
};
