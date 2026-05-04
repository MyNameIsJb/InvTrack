<?php

namespace App\Http\Controllers;

use App\Notifications\NewUserNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Ipakita ang listahan ng mga users.
     */
    public function index(Request $request)
    {
        return Inertia::render('Users/Index', [
            'users' => User::query()
                ->when($request->search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->latest()
                ->paginate(10)
                ->onEachSide(1)
                ->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * I-save ang bagong user sa database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
        ]);

        $generatedPassword = \Illuminate\Support\Str::random(8);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($generatedPassword),
        ]);

        // I-send ang notification sa bagong user
        $user->notify(new NewUserNotification($generatedPassword));

        return redirect()->back()->with('message', 'A new user has been successfully onboarded!');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return redirect()->back()->with('message', "Updated profile of {$user->name} successfully.");
    }

    public function toggleStatus(User $user)
    {
        // Prevent self-deactivation
        if (Auth::id() === $user->id) {
            return back()->with('error', 'Action denied. You cannot deactivate your own account.');
        }

        // Toggle the status
        $user->update([
            'is_active' => !$user->is_active
        ]);

        $status = $user->is_active ? 'activated' : 'deactivated';

        return back()->with('message', "User {$user->name} has been {$status} successfully.");
    }
}
