<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained();
            $table->foreignId('employee_id')->constrained();
            $table->foreignId('client_id')->constrained();
            $table->enum('allocation_type', ['Installment', 'Rental']);
            $table->date('allocation_date');
            $table->enum('handover_condition', ['Excellent', 'Good', 'Fair', 'Poor'])->nullable();
            $table->string('handover_document_path', 500)->nullable();
            $table->text('handover_notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->date('return_date')->nullable();
            $table->enum('return_condition', ['Excellent', 'Good', 'Fair', 'Poor'])->nullable();
            $table->text('return_notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('asset_id');
            $table->index('employee_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('allocations');
    }
};
