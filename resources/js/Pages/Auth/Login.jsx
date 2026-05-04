import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import Checkbox from "@/Components/Checkbox";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
            <Head title="Log in" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-gray-100 p-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white text-2xl font-bold shadow-lg shadow-indigo-200 mb-4">
                        I
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        I-manage ang iyong inventory nang mabilis at madali.
                    </p>
                </div>

                {status && (
                    <div className="mb-4 font-medium text-sm text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Email Address"
                            className="text-gray-700"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="text-gray-700"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm text-indigo-600 hover:underline font-medium"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <PrimaryButton
                        className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-lg font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        disabled={processing}
                    >
                        Sign In
                    </PrimaryButton>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Wala pang account?{" "}
                        <Link
                            href={route("register")}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
