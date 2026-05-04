<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Message;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// Test route para makita kung abot ng Phone ang PC mo
Route::get('/inventory-test', function () {
    // Kukunin natin ang lahat ng products mula sa database
    // Pwede mong dagdagan ng ->latest() para yung bago ang nasa taas
    $products = Product::all();

    return response()->json([
        'status' => 'success',
        'data' => $products
    ]);
});

Route::post('/login', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Wrong email and password.'], 401);
    }

    return response()->json([
        'token' => $user->createToken('mobile-app')->plainTextToken,
        'user' => $user
    ]);
});

Route::middleware('auth:sanctum')->get('/dashboard-stats', function () {
    return response()->json([
        'total_users' => User::count(),
        'total_products' =>  Product::count(),
        'low_stock' => Product::where('quantity', '<', 10)->where('quantity', '>', 0)->count(),
        'out_of_stock' => Product::where('quantity', '<=', 0)->count()
    ]);
});

Route::middleware('auth:sanctum')->get('/dashboard-data', function () {
    // Kinukuha ang lahat ng categories at ang sum ng quantity ng products sa bawat isa
    $stats = DB::table('categories')
        ->leftJoin('products', 'categories.id', '=', 'products.category_id')
        ->select('categories.name', DB::raw('IFNULL(SUM(products.quantity), 0) as total_qty'))
        ->groupBy('categories.id', 'categories.name')
        ->get();

    // Inventory Status logic
    $inStock = \App\Models\Product::where('quantity', '>', 10)->count();
    $lowStock = \App\Models\Product::whereBetween('quantity', [1, 10])->count();
    $outOfStock = \App\Models\Product::where('quantity', '<=', 0)->count();

    return response()->json([
        'barChart' => [
            'labels' => $stats->pluck('name'), // ["Kitchenware", "Beverages", "Frozen Goods", etc.]
            'data' => $stats->pluck('total_qty'), // [6, 48, 0, 0, 0]
        ],
        'status' => [
            ['name' => 'In Stock', 'population' => $inStock, 'color' => '#48C6AB'],
            ['name' => 'Low Stock', 'population' => $lowStock, 'color' => '#F39C12'],
            ['name' => 'Out of Stock', 'population' => $outOfStock, 'color' => '#E74C3C'],
        ]
    ]);
});
