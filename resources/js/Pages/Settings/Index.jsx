import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import React, { useState } from "react";
import InventorySettingsForm from "./Partials/InventorySettingsForm";
import ProfileForm from "./Partials/ProfileForm";
import PasswordForm from "./Partials/PasswordForm";

export default function Index({ auth, currentThreshold }) {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 space-y-2">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "profile" ? "bg-teal-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                        >
                            👤 Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "security" ? "bg-teal-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                        >
                            🔒 Security & Password
                        </button>
                        <button
                            onClick={() => setActiveTab("inventory")}
                            className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === "inventory" ? "bg-teal-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                        >
                            📦 Inventory Logic
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        {activeTab === "profile" && (
                            <ProfileForm user={auth.user} />
                        )}
                        {activeTab === "security" && <PasswordForm />}
                        {activeTab === "inventory" && (
                            <InventorySettingsForm
                                threshold={currentThreshold}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
