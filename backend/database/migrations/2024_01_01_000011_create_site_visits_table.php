<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_visits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id')->index();
            $table->uuid('client_id')->nullable()->index();
            $table->uuid('project_id')->nullable()->index();
            $table->date('visit_date');
            $table->string('visit_time', 10)->nullable();
            $table->string('location')->nullable();
            $table->string('purpose')->nullable();
            $table->string('visited_by')->nullable();
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->text('remarks')->nullable();
            $table->string('next_action')->nullable();
            $table->date('follow_up_date')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('set null');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_visits');
    }
};