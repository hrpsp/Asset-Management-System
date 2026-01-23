<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_code', 50)->unique();
            $table->string('name');
            $table->string('cnic', 15)->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->string('department')->nullable();
            $table->string('designation')->nullable();
            $table->enum('employment_status', ['Active', 'Resigned', 'Terminated', 'On Notice'])->default('Active');
            $table->date('joining_date')->nullable();
            $table->date('exit_date')->nullable();
            $table->timestamps();

            $table->index('client_id');
            $table->index('employment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
