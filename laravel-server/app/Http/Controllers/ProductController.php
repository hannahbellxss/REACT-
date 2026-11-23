<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $searchTerm = $request->string('search')->toString();
            $query->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('manufacturer', 'like', "%{$searchTerm}%")
                    ->orWhere('code', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        return response()->json($query->latest()->paginate(12), 200);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('products', 'public');
            $validated['photo'] = asset('storage/'.$path);
        }

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully!',
            'product' => $product,
        ], 201);
    }
}
