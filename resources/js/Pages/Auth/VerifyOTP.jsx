import { useForm } from "@inertiajs/react";
import React from "react";

export default function VerifyOTP() {
    const { data, setData, post, processing, errors } = useForm({
        otp: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("otp.verify.check"));
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">OTP Verification</h2>
            <p className="text-sm text-gray-600 mb-6">
                I-check ang iyong email para sa 6-digit code.
            </p>

            <form onSubmit={submit}>
                <input
                    type="text"
                    value={data.otp}
                    onChange={(e) => setData("otp", e.target.value)}
                    className="w-full p-3 border rounded mb-2 text-center text-2xl tracking-widest"
                    maxLength="6"
                />
                {errors.otp && (
                    <p className="text-red-500 text-xs">{errors.otp}</p>
                )}

                <button
                    disabled={processing}
                    className="w-full bg-teal-500 text-white p-3 rounded hover:bg-teal-600"
                >
                    Verify Code
                </button>
            </form>
        </div>
    );
}
