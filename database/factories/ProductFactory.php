<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => \App\Models\Category::all()->random()->id,
            'name' => fake()->words(3, true),
            'sku' => strtoupper(fake()->unique()->bothify('PROD-####-????')),
            'price' => fake()->randomFloat(2, 100, 5000),
            'quantity' => fake()->numberBetween(0, 50),
        ];
    }
}
