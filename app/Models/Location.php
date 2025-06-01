<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Location
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property float $latitude
 * @property float $longitude
 * @property string|null $image_path
 *
 * @property \Illuminate\Database\Eloquent\Collection|Winner[] $winners
 */
class Location extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'latitude',
        'longitude',
        'image_path',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    /**
     * Get the winners for this location.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function winners()
    {
        return $this->hasMany(Winner::class);
    }
}
