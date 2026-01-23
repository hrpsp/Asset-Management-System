<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_tag', 100)->unique();
            $table->enum('asset_type', ['Laptop', 'Tablet', 'Mobile', 'Accessory']);
            $table->string('brand', 100);
            $table->string('model');
            $table->string('serial_number')->unique()->nullable();
            $table->json('specifications')->nullable();
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_price', 12, 2)->nullable();
            $table->string('vendor')->nullable();
            $table->date('warranty_expiry')->nullable();
            $table->enum('status', ['Available', 'Assigned', 'In Repair', 'Retired', 'Lost', 'Transferred'])->default('Available');
            $table->enum('condition_status', ['Excellent', 'Good', 'Fair', 'Poor'])->default('Good');
            $table->string('current_location')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('asset_type');
            $table->index('asset_tag');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
