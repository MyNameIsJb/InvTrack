import { Head, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
            <Head title="Forgot Password" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-gray-100 p-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full text-indigo-600 text-2xl mb-4">
                        🔑
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        No worries! I-type lang ang iyong email address at
                        padadalhan ka namin ng password reset link.
                    </p>
                </div>

                {status && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl font-medium text-sm text-green-600 text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl py-3"
                            isFocused={true}
                            placeholder="I-enter ang iyong email"
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="flex flex-col gap-4">
                        <PrimaryButton
                            className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-md font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                            disabled={processing}
                        >
                            Email Password Reset Link
                        </PrimaryButton>

                        <a
                            href={route("login")}
                            className="text-center text-sm text-gray-500 hover:text-indigo-600 font-medium transition"
                        >
                            ← Back to Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
