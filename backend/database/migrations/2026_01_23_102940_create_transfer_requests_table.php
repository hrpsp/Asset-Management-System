<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transfer_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('allocation_id')->constrained();
            $table->enum('transfer_type', ['Recovery', 'Client Transfer', 'Upgrade', 'Replacement']);
            $table->enum('trigger_reason', ['Resignation', 'Termination', 'Client Change', 'Asset Issue', 'Other'])->nullable();
            $table->text('reason_details')->nullable();
            $table->date('initiated_date');
            $table->foreignId('initiated_by')->constrained('users');
            $table->date('deadline_date')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['Pending', 'In Progress', 'Completed', 'Escalated', 'Cancelled'])->default('Pending');
            $table->date('completion_date')->nullable();
            $table->json('checklist')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transfer_requests');
    }
};
