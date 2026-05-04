<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    // Idagdag itong line na ito:
    protected $fillable = ['message', 'user_id'];

    // Para makuha natin ang user info ng nag-send
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
