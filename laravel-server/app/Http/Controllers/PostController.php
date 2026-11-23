<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Post::latest()->orderByDesc('id')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $post = Post::create($request->validate([
            'message' => ['required', 'string', 'max:255'],
        ]));

        return response()->json(['data' => $post], 201);
    }
}
