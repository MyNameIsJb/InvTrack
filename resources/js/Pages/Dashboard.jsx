import ProductChart from "@/Components/ProductChart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Users, Package, Activity, AlertCircle } from "lucide-react";
import InventoryTrendChart from "@/Components/InventoryTrendChart";

export default function Dashboard({
    auth,
    stats,
    inventory_trend,
    product_chart,
}) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Overview
                </h2>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={stats.total_users}
                        icon={Users}
                        colorClass="bg-blue-50 text-blue-600"
                        description="System wide accounts"
                    />
                    <StatCard
                        title="Active Accounts"
                        value={stats.active_users}
                        icon={Activity}
                        colorClass="bg-emerald-50 text-emerald-600"
                        description="Currently active"
                    />
                    <StatCard
                        title="Total Products"
                        value={stats.total_products}
                        icon={Package}
                        colorClass="bg-indigo-50 text-indigo-600"
                        description="Inventory items"
                    />
                    <StatCard
                        title="Low Stock"
                        value={stats.low_stock}
                        icon={AlertCircle}
                        colorClass="bg-rose-50 text-rose-600"
                        description="Requires attention"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Trend (Mas malapad - span 2 columns) */}
                    <div className="lg:col-span-2">
                        <InventoryTrendChart trendData={inventory_trend} />
                    </div>

                    {/* Product Status (Mas maliit - span 1 column) */}
                    <div className="lg:col-span-1">
                        <ProductChart chartData={product_chart} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Reusable StatCard Component para malinis ang code
const StatCard = ({ title, value, icon: Icon, colorClass, description }) => (
    <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
        {/* Subtle Background Pattern/Glow */}
        <div
            className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700 ${colorClass.split(" ")[0]}`}
        ></div>

        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                    {title}
                </p>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {value.toLocaleString()}
                </h3>
                {description && (
                    <p className="text-xs font-medium mt-2 text-gray-400 flex items-center gap-1">
                        <Activity size={12} className="text-gray-300" />
                        {description}
                    </p>
                )}
            </div>

            {/* Icon Box */}
            <div className={`p-3 rounded-xl shadow-sm ${colorClass}`}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
        </div>
    </div>
);
