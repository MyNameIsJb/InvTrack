import { useForm } from "@inertiajs/react";
import React from "react";
import { useRef } from "react";

export default function PasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        put,
        errors,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route("settings.password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className="max-w-xl">
            <header>
                <h2 className="text-lg front-medium text-gray-900">
                    Security & Password
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Make sure that your account is using long and random
                    password to make it secured
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <label className="block font-medium text-sm text-gray-700">
                        Current Password
                    </label>
                    <input
                        type="password"
                        ref={currentPasswordInput}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                    />
                    {errors.current_password && (
                        <div className="text-red-500 text-xs mt-1">
                            {errors.current_password}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block font-medium text-sm text-gray-700">
                        New Password
                    </label>
                    <input
                        type="password"
                        ref={passwordInput}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    {errors.password && (
                        <div className="text-red-500 text-xs mt-1">
                            {errors.password}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block font-medium text-sm text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                    {errors.password_confirmation && (
                        <div className="text-red-500 text-xs mt-1">
                            {errors.password_confirmation}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        disabled={processing}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                    >
                        Update Password
                    </button>
                    {recentlySuccessful && (
                        <p className="text-sm text-gray-600">Saved.</p>
                    )}
                </div>
            </form>
        </section>
    );
}
