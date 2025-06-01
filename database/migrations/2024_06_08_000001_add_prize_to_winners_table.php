<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('winners', function (Blueprint $table) {
            $table->string('prize')->nullable()->after('location_id');
        });
    }

    public function down()
    {
        Schema::table('winners', function (Blueprint $table) {
            $table->dropColumn('prize');
        });
    }
};
