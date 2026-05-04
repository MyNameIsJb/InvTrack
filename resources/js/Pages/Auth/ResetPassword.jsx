import { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("password.store"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
            <Head title="Reset Password" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-gray-100 p-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white text-2xl shadow-lg mb-4">
                        🛡️
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        Set New Password
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        Halos tapos na tayo! I-type ang iyong bagong password
                        para ma-secure ang iyong account.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Hidden Email Field (Required by Laravel) */}
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Email Address"
                            className="text-gray-400 text-xs uppercase"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-gray-50 border-gray-200 text-gray-500 rounded-xl cursor-not-allowed"
                            autoComplete="username"
                            readOnly
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* New Password */}
                    <div>
                        <InputLabel htmlFor="password" value="New Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-3"
                            autoComplete="new-password"
                            isFocused={true}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm New Password"
                        />
                        <TextInput
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-3"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="pt-4">
                        <PrimaryButton
                            className="w-full justify-center py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-md font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                            disabled={processing}
                        >
                            Update Password
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
