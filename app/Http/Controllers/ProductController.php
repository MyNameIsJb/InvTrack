<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    // 1. Para sa Dashboard (Charts & Stats)
    public function dashboard()
    {
        $totalValue = Product::selectRaw('SUM(price * quantity) as total')->value('total') ?? 0;
        $categoryData = Category::withCount('products')->get();
        $lowStock = Product::orderBy('quantity', 'asc')->take(5)->get();

        return Inertia::render('Dashboard', [ // Gagawa tayo ng Dashboard.jsx
            'stats' => [
                'totalValue' => (float)$totalValue,
                'categoryLabels' => $categoryData->pluck('name'),
                'categoryCounts' => $categoryData->pluck('products_count'),
                'lowStockLabels' => $lowStock->pluck('name'),
                'lowStockValues' => $lowStock->pluck('quantity'),
            ]
        ]);
    }

    // 2. Para sa Inventory List (Table & Search)
    public function index(Request $request)
    {
        $threshold = Setting::where('key', 'low_stock_threshold')->value('value') ?? 10;

        return Inertia::render('Inventory/Index', [
            'products' => Product::with('category')
                ->when($request->search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->when($request->category, function ($query, $categoryId) {
                    // Siguraduhin na 'category_id' (o 'cat_id') ang column name sa products table mo
                    $query->where('category_id', $categoryId);
                })
                ->latest()->paginate(10)->onEachSide(5)->withQueryString(),
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category']),
            'threshold' => $threshold
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'sku'         => 'required|unique:products,sku',
            'price'       => 'required|numeric|min:0',
            'quantity'    => 'required|integer|min:0',
        ]);

        Product::create($validated);

        return redirect()->back()->with('message', 'Product added successfully! 🚀');
    }

    public function destroy(Product $product)
    {
        // Buburahin ang product sa database
        $product->delete();

        // Babalik lang sa listahan at mag-rerefresh ang data nang kusa
        return redirect()->back()->with('message', 'Product has been deleted. 🗑️');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'sku'         => 'required|unique:products,sku,' . $product->id, // Hahayaan ang sarili niyang SKU
            'price'       => 'required|numeric|min:0',
            'quantity'    => 'required|integer|min:0',
        ]);

        $product->update($validated);

        return redirect()->back()->with('message', 'Product updated! ✨');
    }
}
