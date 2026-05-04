<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\User;
use App\Models\Product; // Siguraduhing tama ang model name mo
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stockPerCategory = Category::select('categories.name')
            ->selectRaw('SUM(products.quantity) as total_stock')
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->groupBy('categories.id', 'categories.name')
            ->get();

        $inventoryTrend = [
            'labels' => $stockPerCategory->pluck('name'),
            'data'   => $stockPerCategory->pluck('total_stock'),
        ];

        $thresholdSetting = Setting::where('key', 'low_stock_threshold')->first();

        $threshold = $thresholdSetting ? (int)$thresholdSetting->value : 10;

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'active_users' => User::where('is_active', 1)->count(),
                'total_products' => Product::count(), // Bilang ng lahat ng products
                'low_stock' => Product::whereBetween('quantity', [1, $threshold])->count(), // Low stock alerts
            ],
            // Ipadala natin ang data para sa Product Chart (Comparison)
            'product_chart' => [
                'labels' => ['In Stock', 'Low Stock', 'Out of Stock'],
                'data' => [
                    Product::where('quantity', '>', $threshold)->count(),
                    Product::whereBetween('quantity', [1, $threshold])->where('quantity', '>', 0)->count(),
                    Product::where('quantity', '<=', 0)->count(),
                ]
            ],
            'inventory_trend' => $inventoryTrend
        ]);
    }
}
