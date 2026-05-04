import { useForm, usePage } from "@inertiajs/react";

export default function ProfileForm({ user }) {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            _method: "PATCH", // Gagamitin ito para sa file upload support sa Laravel
        });

    const submit = (e) => {
        e.preventDefault();
        post(route("settings.profile.update"), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Optional: Magdagdag ng notification o log
                console.log("Profile updated successfully");
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return (
        <section className="max-w-xl">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Personal Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    I-update ang iyong account profile information at email
                    address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Name Input */}
                <div>
                    <label className="block font-medium text-sm text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    {errors.name && (
                        <div className="text-red-500 text-xs mt-1">
                            {errors.name}
                        </div>
                    )}
                </div>

                {/* Email Input */}
                <div>
                    <label className="block font-medium text-sm text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    {errors.email && (
                        <div className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        disabled={processing}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                    >
                        Save Changes
                    </button>

                    {recentlySuccessful && (
                        <p className="text-sm text-gray-600">Saved.</p>
                    )}
                </div>
            </form>
        </section>
    );
}
