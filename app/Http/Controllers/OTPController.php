<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OTPController extends Controller
{
    public function index()
    {
        // Check kung may user ID sa session, kung wala, balik sa login
        if (!session()->has('otp_user_id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/VerifyOTP');
    }

    public function verify(Request $request)
    {
        $request->validate(['otp' => 'required']);

        $userId = session('otp_user_id');
        $user = User::find($userId);

        if ($user && $user->otp == $request->otp && now()->isBefore($user->otp_expires_at)) {
            // Correct OTP! I-login na ang user
            Auth::login($user);

            // Linisin ang OTP data
            $user->update(['otp' => null, 'otp_expires_at' => null]);
            session()->forget('otp_user_id');

            return redirect()->route('dashboard');
        }

        return back()->withErrors(['otp' => 'Your OTP is wrong or expired']);
    }
}
