<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('winners', function (Blueprint $table) {
            $table->string('device_id', 64)->nullable()->after('email');
        });
    }

    public function down()
    {
        Schema::table('winners', function (Blueprint $table) {
            $table->dropColumn('device_id');
        });
    }
};
