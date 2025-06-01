<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWinnersTable extends Migration
{
    public function up()
    {
        Schema::create('winners', function (Blueprint $table) {
            $table->id();
            $table->string('name');                // Winner's name
            $table->string('social_tag')->nullable(); // Optional social tag
            $table->foreignId('location_id')
                ->constrained('locations')
                ->onDelete('cascade');
            $table->timestamp('won_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('winners');
    }
}
