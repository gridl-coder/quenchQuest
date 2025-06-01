<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Class Admin
 *
 * Represents an admin user for the application.
 *
 * @property int $id
 * @property string $email
 * @property string|null $password
 *
 * Uses a custom guard for admin authentication.
 */
class Admin extends Authenticatable
{
    // Trait for model factories
    use HasFactory;

    /**
     * The authentication guard for admin users.
     *
     * @var string
     */
    protected $guard = 'admin'; // we'll set up a custom guard

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
}
