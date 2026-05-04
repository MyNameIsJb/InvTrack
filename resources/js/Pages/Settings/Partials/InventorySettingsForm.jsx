import { useForm } from "@inertiajs/react";
import React from "react";

export default function InventorySettingsForm({ threshold }) {
    const { data, setData, post, processing } = useForm({
        low_stock_threshold: threshold,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("settings.update"));
    };

    return (
        <section className="max-w-xl">
            <h2 className="text-xl font-bold mb-4">Inventory Settings</h2>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Low Stock Alert Level
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        Ito ang basehan para sa "Low Stock" indicator sa
                        dashboard.
                    </p>
                    <input
                        type="number"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        value={data.low_stock_threshold}
                        onChange={(e) =>
                            setData("low_stock_threshold", e.target.value)
                        }
                    />
                </div>

                <button
                    disabled={processing}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                    {processing ? "Saving..." : "Update Settings"}
                </button>
            </form>
        </section>
    );
}
