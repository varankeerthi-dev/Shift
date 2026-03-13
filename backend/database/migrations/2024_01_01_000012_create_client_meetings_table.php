<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_meetings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id')->index();
            $table->uuid('client_id')->nullable()->index();
            $table->string('meeting_title');
            $table->enum('meeting_type', ['initial', 'follow_up', 'discussion', 'presentation', 'negotiation', 'other'])->default('discussion');
            $table->date('meeting_date');
            $table->string('meeting_time', 10)->nullable();
            $table->string('location')->nullable();
            $table->text('agenda')->nullable();
            $table->json('attendees')->nullable();
            $table->string('organized_by')->nullable();
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->text('outcome')->nullable();
            $table->json('action_items')->nullable();
            $table->boolean('follow_up_required')->default(false);
            $table->date('follow_up_date')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_meetings');
    }
};