<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Winner model represents a customer who has checked in and won a prize at a location.
 *
 * @property string $name
 * @property string $email // Winner's email address
 * @property string|null $social_tag
 * @property string|null $device_id // Device identifier for cookie-based check
 * @property int $location_id
 * @property string|null $prize  // The prize awarded to the winner
 */
class Winner extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Now includes 'prize' for winner's awarded drink.
     */
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'device_id',
        'social_tag',
        'location_id',
        'prize',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'location_id' => 'integer',
    ];

    /**
     * Get the location for this winner.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
