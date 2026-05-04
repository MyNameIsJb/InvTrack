import { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import Pagination from "@/Components/Pagination";
import { Search } from "lucide-react"; // Icon
import { router } from "@inertiajs/react";
import { Pencil, UserX, UserCheck } from "lucide-react";

export default function UserIndex({ auth, users, filters }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const userList = users.data;
    const [search, setSearch] = useState(filters.search || "");
    const isFirstRender = useRef(true);

    const { data, setData, post, patch, processing, reset, errors } = useForm({
        name: "",
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("users.store"), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    // Function para buksan ang Edit Modal
    const openEditModal = (user) => {
        setSelectedUser(user);
        setData({
            name: user.name,
            email: user.email,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        patch(route("users.update", selectedUser.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
        });
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("users.index"),
                { search: search },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="User Management" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        User Management
                    </h2>
                    <p className="text-sm text-gray-500">
                        Manage people who can access the system.
                    </p>
                </div>
                <PrimaryButton onClick={() => setIsAddModalOpen(true)}>
                    + Add New User
                </PrimaryButton>
            </div>

            <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm shadow-sm transition-all duration-200"
                />
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                                User
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {userList.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-50/50 transition"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-gray-700">
                                            {user.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {user.email}
                                </td>
                                <td>
                                    {user.is_active ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                            Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => openEditModal(user)}
                                        className="text-indigo-600 hover:text-indigo-900 font-bold bg-indigo-50 px-3 py-1 rounded-lg transition"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    `Are you sure you want to ${user.is_active ? "deactivate" : "activate"} this user?`,
                                                )
                                            ) {
                                                router.patch(
                                                    route(
                                                        "users.toggle",
                                                        user.id,
                                                    ),
                                                );
                                            }
                                        }}
                                        className={`p-2 rounded-lg transition-colors ${
                                            user.is_active
                                                ? "text-amber-600 hover:bg-amber-50"
                                                : "text-green-600 hover:bg-green-50"
                                        }`}
                                        title={
                                            user.is_active
                                                ? "Deactivate"
                                                : "Activate"
                                        }
                                    >
                                        {user.is_active ? (
                                            <UserX size={18} />
                                        ) : (
                                            <UserCheck size={18} />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination links={users.links} />

            {/* Modal for Adding User */}
            <Modal
                show={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            >
                <form onSubmit={submit} className="p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Create New User
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Full Name" />
                            <TextInput
                                className="w-full mt-1"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <InputLabel value="Email Address" />
                            <TextInput
                                type="email"
                                className="w-full mt-1"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            Save User
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* --- MODAL PARA SA EDIT --- */}
            <Modal
                show={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            >
                <form onSubmit={handleUpdate} className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
                            📝
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900">
                                Edit User Details
                            </h2>
                            <p className="text-sm text-gray-500">
                                I-update ang impormasyon ni {selectedUser?.name}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Full Name" />
                            <TextInput
                                className="w-full mt-1 border-gray-200 focus:ring-amber-500 focus:border-amber-500"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <InputLabel value="Email Address" />
                            <TextInput
                                type="email"
                                className="w-full mt-1 border-gray-200 focus:ring-amber-500 focus:border-amber-500"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            className="bg-amber-600 hover:bg-amber-700 shadow-amber-100"
                            disabled={processing}
                        >
                            Update User
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
