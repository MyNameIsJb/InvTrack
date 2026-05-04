import { useForm, router } from "@inertiajs/react";
import { X, Plus, Trash2, Tag, AlignLeft, Edit2, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function CategorySlideOver({ isOpen, onClose, categories }) {
    const [editingId, setEditingId] = useState(null);

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        errors,
        clearErrors,
        setError,
    } = useForm({
        name: "",
        description: "",
        caterr: "",
    });

    // --- FUNCTION PARA SA DELETE (Dito ka nag-error) ---
    const handleDelete = (id) => {
        clearErrors();

        if (confirm("Are you sure you want to delete this category?")) {
            // Gamitin ang router para sa delete
            router.delete(route("categories.destroy", id), {
                preserveScroll: true,
                onError: (err) => {
                    // Kukunin natin ang error galing sa server at ipapasok sa useForm manually
                    if (err.caterr) {
                        setError("caterr", err.caterr);
                    }
                },
            });
        }
    };

    // --- FUNCTION PARA SA EDIT ---
    const handleEdit = (category) => {
        setEditingId(category.id);
        setData({
            name: category.name,
            description: category.description || "",
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route("categories.update", editingId), {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post(route("categories.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    useEffect(() => {
        if (errors.caterr) {
            const timer = setTimeout(() => {
                clearErrors();
            }, 5000); // 5 seconds
            return () => clearTimeout(timer);
        }
    }, [errors.caterr]);

    return (
        <>
            {/* OVERLAY */}
            <div
                className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity z-40 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => {
                    onClose();
                    cancelEdit();
                }}
            />

            {/* SIDE PANEL */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    {/* HEADER */}
                    <div className="p-6 border-b flex justify-between items-center bg-white">
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingId ? "Edit Category" : "Manage Categories"}
                        </h2>
                        <button
                            onClick={() => {
                                onClose();
                                cancelEdit();
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    {errors.caterr && (
                        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-red-700">
                            <span className="font-bold">!</span>
                            <span className="text-sm">{errors.caterr}</span>
                            <button
                                onClick={() => clearErrors()}
                                className="ml-auto font-bold"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* FORM */}
                    <form
                        onSubmit={submit}
                        className={`p-6 border-b space-y-4 ${editingId ? "bg-blue-50/30" : "bg-gray-50"}`}
                    >
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="w-full px-4 py-2 border-gray-200 rounded-xl text-sm focus:ring-blue-500"
                                placeholder="e.g. Electronics"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="w-full px-4 py-2 border-gray-200 rounded-xl text-sm focus:ring-blue-500 min-h-[80px]"
                                placeholder="Optional details..."
                            />
                        </div>

                        <button
                            disabled={processing}
                            className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2 ${
                                editingId
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {editingId ? (
                                <Check size={18} />
                            ) : (
                                <Plus size={18} />
                            )}
                            {editingId ? "Update Category" : "Save Category"}
                        </button>
                    </form>

                    {/* LIST */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {categories.length === 0 && (
                            <p className="text-center text-gray-400 text-sm py-10">
                                No categories found.
                            </p>
                        )}
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="group relative p-4 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 transition-all"
                            >
                                <div className="pr-16">
                                    <h4 className="text-sm font-bold text-gray-800">
                                        {category.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                        {category.description ||
                                            "No description"}
                                    </p>
                                </div>

                                <div className="absolute top-4 right-4 flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(category)}
                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    >
                                        <Edit2 size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(category.id)
                                        } // <--- Tatawag dito
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
