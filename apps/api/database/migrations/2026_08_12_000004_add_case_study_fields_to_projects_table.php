<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table): void {
            $table->text('role_summary')->nullable();
            $table->text('outcome')->nullable();
            $table->json('highlights')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table): void {
            $table->dropColumn(['role_summary', 'outcome', 'highlights']);
        });
    }
};
