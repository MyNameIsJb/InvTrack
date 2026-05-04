import { Link, Head } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome | InvTrack System" />

            <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
                {/* Navigation */}
                <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
                    <div className="text-2xl font-bold text-indigo-600">
                        InvTrack
                    </div>
                    <div className="space-x-4">
                        {auth.user ? (
                            <Link
                                href={route("inventory.index")}
                                className="font-semibold text-gray-600 hover:text-indigo-600"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="font-semibold text-gray-600 hover:text-indigo-600"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="ms-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                            Manage your stocks{" "}
                            <span className="text-indigo-600">smarter</span>,
                            not harder.
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 pr-10">
                            Ang <strong>InvTrack</strong> ay isang modernong
                            inventory management solution. Mula sa pag-track ng
                            low stocks hanggang sa real-time analytics,
                            binibigay namin ang control na kailangan mo para
                            lumago ang iyong business.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href={route("register")}
                                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
                            >
                                Simulan ang Free Trial
                            </Link>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-indigo-600 mb-4 font-bold text-xl">
                                📊 Real-time Stats
                            </div>
                            <p className="text-sm text-gray-500">
                                Mabilisang view ng iyong total inventory value
                                at stock levels.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-indigo-600 mb-4 font-bold text-xl">
                                🔍 Easy Search
                            </div>
                            <p className="text-sm text-gray-500">
                                Mabilis mahanap ang items gamit ang advanced
                                filtering system.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-indigo-600 mb-4 font-bold text-xl">
                                🔔 Low Stock Alert
                            </div>
                            <p className="text-sm text-gray-500">
                                Automatic notification kapag malapit na maubos
                                ang mga items.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-indigo-600 mb-4 font-bold text-xl">
                                📱 Mobile Ready
                            </div>
                            <p className="text-sm text-gray-500">
                                I-manage ang iyong business kahit saan, gamit
                                ang anumang device.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="text-center py-10 text-gray-400 text-sm">
                    © 2026 InvTrack Management System. Built with Laravel, React
                    & Inertia.
                </footer>
            </div>
        </>
    );
}
