<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_id')->constrained('rental_agreements')->cascadeOnDelete();
            $table->char('period_month', 7); // Format: 2026-01
            $table->enum('status', ['Active', 'Completed'])->default('Active');
            $table->string('notes', 500)->nullable();
            $table->timestamps();

            $table->unique(['rental_id', 'period_month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_periods');
    }
};
