import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import FloatingChat from "@/Components/FloatingChat";

export default function AuthenticatedLayout({ user, header, children }) {
    // Gagamitin natin ang usePage para malaman kung anong active route ngayon
    const { url } = usePage();
    const { flash } = usePage().props; // Kunin ang flash props mula sa Inertia
    const [showFlash, setShowFlash] = useState(false);
    const { auth } = usePage().props;

    // Watcher para sa flash message
    useEffect(() => {
        if (flash.message || flash.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000); // Mawawala after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* --- SIDEBAR --- */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
                {/* Logo Section */}
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <span className="text-xl font-bold">I</span>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-gray-800">
                            InvTrack
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Main Menu
                    </p>
                    {auth.isAdmin && (
                        <>
                            <MenuLink
                                href={route("users.index")}
                                active={route().current("users.index")}
                                icon="👥"
                                label="User Management"
                            />

                            <MenuLink
                                href={route("backups.index")}
                                active={route().current("backups.index")}
                                icon="💾" // Pwede mong palitan ang icon
                                label="Database Backup"
                            />
                        </>
                    )}

                    <MenuLink
                        href={route("dashboard")}
                        active={route().current("dashboard")}
                        icon="📊"
                        label="Dashboard"
                    />

                    <MenuLink
                        href={route("inventory.index")}
                        active={route().current("inventory.index")}
                        icon="📦"
                        label="Inventory List"
                    />

                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            System
                        </p>
                        <MenuLink
                            href={route("settings.index")}
                            active={route().current("settings.index")}
                            icon="⚙️"
                            label="Settings"
                        />
                    </div>
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full mt-2 flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                    >
                        <span>🚪</span> Log Out
                    </Link>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col">
                {showFlash && (flash.message || flash.error) && (
                    <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-4 duration-300">
                        <div className="bg-white border border-gray-200 shadow-xl rounded-xl p-4 min-w-[320px] flex items-start gap-4">
                            {/* Minimalist Icon */}
                            <div className="mt-0.5">
                                {flash.error ? (
                                    <div className="text-red-500 bg-red-50 p-1.5 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <line
                                                x1="12"
                                                y1="8"
                                                x2="12"
                                                y2="12"
                                            />
                                            <line
                                                x1="12"
                                                y1="16"
                                                x2="12.01"
                                                y2="16"
                                            />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="text-emerald-500 bg-emerald-50 p-1.5 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 pr-4">
                                <h4 className="text-[13px] font-semibold text-gray-900 mb-0.5">
                                    {flash.error ? "System Error" : "Success"}
                                </h4>
                                <p className="text-[13px] text-gray-500 leading-tight">
                                    {flash.message || flash.error}
                                </p>
                            </div>

                            {/* Simple Close Button */}
                            <button
                                onClick={() => setShowFlash(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors pt-1"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <main className="p-8">
                    {header && <div className="mb-8">{header}</div>}
                    {children}
                </main>
                <FloatingChat />
            </div>
        </div>
    );
}

// Helper Component para sa Menu Links (Para iwas ulit-ulit na code)
function MenuLink({ href, active, icon, label }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
        >
            <span
                className={`text-xl ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
            >
                {icon}
            </span>
            <span
                className={`font-semibold ${active ? "text-indigo-700" : "text-gray-600"}`}
            >
                {label}
            </span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
            )}
        </Link>
    );
}
