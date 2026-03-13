<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organization_users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('organization_id');
            $table->enum('role', ['owner', 'admin', 'member', 'viewer'])->default('member');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->unique(['user_id', 'organization_id']);
            $table->index('organization_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_users');
    }
};
