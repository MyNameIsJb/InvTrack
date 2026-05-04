<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class CategoryController extends Controller
{
    /**
     * I-save ang bagong category mula sa Slide-over.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string|max:500', // Bagong field
        ]);

        Category::create($validated);

        // Gagamit tayo ng back() para bumalik lang sa Inventory page
        // nang hindi naga-out ang Slide-over (Inertia handles this)
        return Redirect::back()->with('success', 'Category created successfully.');
    }

    /**
     * Burahin ang category.
     */
    // CategoryController.php
    public function destroy(Category $category)
    {
        if ($category->products()->count() > 0) {
            // Siguraduhin na 'name' ang key para mag-match sa form errors natin
            return back()->withErrors(['caterr' => 'Cannot delete: This category is currently linked to existing products.']);
        }

        $category->delete();
        return back();
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            // Siguraduhin na unique ang name maliban sa kasalukuyang ine-edit
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:500',
        ]);

        $category->update($validated);

        return back();
    }
}
