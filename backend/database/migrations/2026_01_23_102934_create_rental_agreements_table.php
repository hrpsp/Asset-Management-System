<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('allocation_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('monthly_rental', 12, 2);
            $table->integer('billing_day')->default(1);
            $table->decimal('security_deposit', 12, 2)->default(0);
            $table->date('rental_start_date');
            $table->integer('minimum_period_months')->default(0);
            $table->enum('status', ['Active', 'Terminated'])->default('Active');
            $table->date('termination_date')->nullable();
            $table->enum('deposit_status', ['Held', 'Returned', 'Forfeited', 'Adjusted'])->default('Held');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_agreements');
    }
};
