<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Gumawa muna ng Categories (importante ito para sa products)
        // $categories = ['Electronics', 'Furniture', 'Grocery', 'Clothing'];
        // foreach ($categories as $cat) {
        //     \App\Models\Category::create(['name' => $cat]);
        // }

        // 2. Gumawa ng 50 na random Users
        // \App\Models\User::factory(1000)->create();

        // 3. Gumawa ng 100 na random Inventory Items
        // \App\Models\Product::factory(1000)->create();

        // 4. Magdagdag ng isang Admin account para sure na maka-login ka
        // \App\Models\User::factory()->create([
        //     'name' => 'Admin User',
        //     'email' => 'admin@example.com',
        //     'password' => bcrypt('password123'),
        // ]);

        Setting::updateOrCreate(
            ['key' => 'low_stock_threshold'],
            ['value' => '10'] // Default threshold gaya ng dati nating logic
        );
    }
}
