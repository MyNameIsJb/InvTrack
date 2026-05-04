<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function store(Request $request)
    {
        $message = $request->user()->messages()->create([
            'message' => $request->message
        ]);

        // I-broadcast ang message real-time
        broadcast(new MessageSent($message->load('user')))->toOthers();

        return response()->json($message);
    }
}
