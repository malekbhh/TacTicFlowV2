<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Models\User;

class MembershipController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'project_id' => 'required|exists:projects,id',
        ]);

        // Recherche de l'utilisateur par son adresse e-mail
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found with the provided email'], 404);
        }

        // Création de l'association entre l'utilisateur et le projet
        Membership::create([
            'user_id' => $user->id,
            'project_id' => $request->project_id,
            'user_role' => 'member',
        ]);

        return response()->json(['message' => 'User added as a member of the project'], 201);
    }
}
