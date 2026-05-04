<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $threshold = Setting::where('key', 'low_stock_threshold')->value('value') ?? 10;

        return Inertia::render('Settings/Index', [
            'currentThreshold' => $threshold
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'low_stock_threshold' => 'required|integer|min:1|max:1000'
        ]);

        Setting::updateOrCreate(
            ['key' => 'low_stock_threshold'],
            ['value' => $request->low_stock_threshold]
        );

        return redirect()->back()->with('message', 'Settings updated successfully');
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
        ]);

        $request->user()->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return redirect()->back()->with('status', 'profile-updated');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password'])
        ]);

        return redirect()->back()->with('message', 'Password successfully updated');
    }
}
