<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained();
            $table->foreignId('allocation_id')->nullable()->constrained()->nullOnDelete();
            $table->string('reported_by');
            $table->date('reported_date');
            $table->text('issue_description');
            $table->enum('issue_category', ['Hardware', 'Software', 'Physical Damage', 'Battery', 'Screen', 'Other']);
            $table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->default('Medium');
            $table->enum('status', ['Reported', 'Diagnosed', 'Sent for Repair', 'Repaired', 'Closed', 'Cannot Repair'])->default('Reported');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->text('diagnosis_notes')->nullable();
            $table->string('repair_vendor')->nullable();
            $table->date('sent_date')->nullable();
            $table->date('received_date')->nullable();
            $table->text('repair_description')->nullable();
            $table->decimal('repair_cost', 12, 2)->nullable();
            $table->boolean('is_warranty_claim')->default(false);
            $table->enum('warranty_claim_status', ['N/A', 'Claimed', 'Approved', 'Rejected'])->default('N/A');
            $table->foreignId('spare_asset_id')->nullable()->constrained('assets')->nullOnDelete();
            $table->date('closed_date')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamps();

            $table->index('asset_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_requests');
    }
};
