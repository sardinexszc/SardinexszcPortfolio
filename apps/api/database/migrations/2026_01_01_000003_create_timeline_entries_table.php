<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void { Schema::create('timeline_entries', function (Blueprint $table): void { $table->id(); $table->string('type'); $table->string('organization'); $table->string('role'); $table->text('description'); $table->string('start_date'); $table->string('end_date')->nullable(); $table->unsignedInteger('sort_order')->default(0); $table->timestamps(); }); }
    public function down(): void { Schema::dropIfExists('timeline_entries'); }
};