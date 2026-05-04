<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['message' => 'required|string']);

        $message = $request->user()->messages()->create([
            'message' => $request->message
        ]);

        // DAPAT MAY ->toOthers()
        // Ibig sabihin, lahat makakatanggap maliban sa IYO (kasi andun na sa screen mo)
        broadcast(new \App\Events\MessageSent($message->load('user')))->toOthers();

        return back();
    }
}
