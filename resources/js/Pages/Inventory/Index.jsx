import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal"; // Import mo ito mula sa Breeze Components
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import Pagination from "@/Components/Pagination";
import { Search, Layers, Plus, ChevronDown } from "lucide-react"; // Icon
import CategorySlideOver from "./Patials/CategorySlideOver";
import { Filter } from "lucide-react";

export default function Index({
    auth,
    products,
    categories,
    filters,
    threshold,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: "",
        name: "",
        sku: "",
        price: "",
        quantity: "",
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || "");
    const isFirstRender = useRef(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                "/inventory",
                {
                    search: search,
                    category: filters.category, // Isama ang current category filter
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true, // Maganda ito para hindi tumalon ang page
                },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);

        // Isama ang category rito para mag-trigger din ang effect pag nagpalit ng dropdown
    }, [search]);

    const handleFilterChange = (categoryId) => {
        router.get(
            "/inventory",
            {
                search: search,
                category: categoryId,
            },
            { preserveState: true, replace: true },
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post("/inventory", {
            onSuccess: () => closeModal(), // <--- Mas malinis na approach
        });
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        reset(); // Nililinis ang form pagka-close
        console.log(isAddModalOpen);
    };

    const handleDelete = (id) => {
        // Magandang practice na may confirmation bago mag-delete
        if (confirm("Sigurado ka bang gusto mong burahin ang item na ito?")) {
            // Ipapasa ang ID sa Laravel route natin
            router.delete(`/inventory/${id}`);
        }
    };

    // Setup ng useForm para sa Edit
    const editForm = useForm({
        id: "",
        name: "",
        sku: "",
        category_id: "",
        price: "",
        quantity: "",
    });

    // Bubuksan ang modal at "papakainin" ng data yung form
    const openEditModal = (product) => {
        editForm.setData({
            id: product.id,
            name: product.name,
            sku: product.sku,
            category_id: product.category_id,
            price: product.price,
            quantity: product.quantity,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        // Gagamit tayo ng PUT request para sa update
        editForm.put(`/inventory/${editForm.data.id}`, {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="min-h-screen bg-gray-50 p-6">
                <Head title="Inventory Management" />

                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">
                        📦 Stock Inventory
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-2 rounded-xl">
                        {/* LEFT SIDE: Title & Subtitle */}
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                Product Management
                            </h2>
                            <p className="text-sm text-gray-500">
                                Organize your stocks, prices, and categories
                                efficiently.
                            </p>
                        </div>

                        {/* RIGHT SIDE: Action Buttons Group */}
                        <div className="flex items-center gap-3">
                            {/* MANAGE CATEGORIES (Secondary Action) */}
                            <button
                                onClick={() => setIsCategoryOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 shadow-sm"
                            >
                                <Layers size={18} className="text-gray-400" />
                                Manage Categories
                            </button>

                            {/* ADD PRODUCT (Primary Action) */}
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:transform active:scale-95 transition-all duration-200 shadow-md shadow-blue-200"
                            >
                                <Plus size={20} />
                                Add New Product
                            </button>
                        </div>
                    </div>

                    {/* SEARCH & TABLE TOOLS */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        {/* LEFT SIDE: SEARCH & FILTER */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
                            {/* SEARCH INPUT */}
                            <div className="relative w-full sm:w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search products..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                />
                            </div>

                            {/* CATEGORY FILTER DROPDOWN */}
                            <div className="relative w-full sm:w-60">
                                <Filter
                                    size={16}
                                    className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                />
                                <select
                                    value={filters.category || ""}
                                    onChange={(e) =>
                                        handleFilterChange(e.target.value)
                                    }
                                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer hover:border-blue-300"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom Arrow for Select */}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3">SKU</th>
                                <th className="p-3">Product Name</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Stock</th>
                                <th className="p-3">Status</th>
                                <th className="p-4 font-semibold text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center p-10 text-gray-500"
                                    >
                                        No products found. Start by adding one!
                                        👆
                                    </td>
                                </tr>
                            ) : (
                                products?.data?.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={`border-b ${item.quantity <= 5 ? "bg-red-50 text-red-700" : "hover:bg-gray-50"}`}
                                    >
                                        <td className="p-3 font-mono text-sm">
                                            {item.sku}
                                        </td>
                                        <td className="p-3 font-semibold">
                                            {item.name}
                                        </td>
                                        <td className="p-3">
                                            {item.category.name}
                                        </td>
                                        <td className="p-3">₱{item.price}</td>
                                        <td className="p-3 font-bold">
                                            {item.quantity}
                                        </td>
                                        <td className="p-3">
                                            {item.quantity <= threshold ? (
                                                <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full border border-red-300">
                                                    ⚠️ Low Stock
                                                </span>
                                            ) : (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-300">
                                                    Good
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() =>
                                                    openEditModal(item)
                                                }
                                                className="text-blue-500 mr-4"
                                            >
                                                ✏️ Edit
                                            </button>
                                            {/* Ang Delete Button */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 font-medium text-sm px-3 py-1 rounded transition duration-200"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* --- PAGINATION LINKS --- */}
                    <Pagination links={products.links} />
                    {/* --- EDIT MODAL --- */}
                    <Modal
                        show={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                    >
                        <form onSubmit={handleUpdate} className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Edit Inventory Item
                            </h2>

                            <div className="space-y-4">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={editForm.data.name}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {editForm.errors.name && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {editForm.errors.name}
                                        </div>
                                    )}
                                </div>

                                {/* SKU Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={editForm.data.sku}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "sku",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {editForm.errors.sku && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {editForm.errors.sku}
                                        </div>
                                    )}
                                </div>

                                {/* Category Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={editForm.data.category_id}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "category_id",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {editForm.errors.category_id && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {editForm.errors.category_id}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Price (₱)
                                        </label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={editForm.data.price}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "price",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {editForm.errors.price && (
                                            <div className="text-red-500 text-xs mt-1">
                                                {editForm.errors.price}
                                            </div>
                                        )}
                                    </div>

                                    {/* Quantity/Stock */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={editForm.data.quantity}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "quantity",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {editForm.errors.quantity && (
                                            <div className="text-red-500 text-xs mt-1">
                                                {editForm.errors.quantity}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <SecondaryButton
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </SecondaryButton>

                                <PrimaryButton disabled={editForm.processing}>
                                    Update Product
                                </PrimaryButton>
                            </div>
                        </form>
                    </Modal>

                    <Modal show={isAddModalOpen} onClose={closeModal}>
                        <form onSubmit={submit} className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Add New Inventory Item
                            </h2>

                            <div className="space-y-4">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                {/* SKU Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        value={data.sku}
                                        onChange={(e) =>
                                            setData("sku", e.target.value)
                                        }
                                    />
                                    {errors.sku && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.sku}
                                        </div>
                                    )}
                                </div>

                                {/* Category Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                "category_id",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.category_id}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Price (₱)
                                        </label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            value={data.price}
                                            onChange={(e) =>
                                                setData("price", e.target.value)
                                            }
                                        />
                                        {errors.price && (
                                            <div className="text-red-500 text-xs mt-1">
                                                {errors.price}
                                            </div>
                                        )}
                                    </div>
                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            value={data.quantity}
                                            onChange={(e) =>
                                                setData(
                                                    "quantity",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.quantity && (
                                            <div className="text-red-500 text-xs mt-1">
                                                {errors.quantity}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <SecondaryButton onClick={closeModal}>
                                    Cancel
                                </SecondaryButton>

                                <PrimaryButton disabled={processing}>
                                    Save Product
                                </PrimaryButton>
                            </div>
                        </form>
                    </Modal>

                    <CategorySlideOver
                        isOpen={isCategoryOpen}
                        onClose={() => setIsCategoryOpen(false)}
                        categories={categories}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
