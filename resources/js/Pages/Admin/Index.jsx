import React from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, backups }) {
    const handleCreate = () => {
        router.post(
            route("backups.create"),
            {},
            {
                onBefore: () =>
                    confirm(
                        "Sigurado ka bang gusto mong gumawa ng bagong backup?",
                    ),
                onSuccess: () => {
                    // Ito ang magpapatakbo uli ng index method para makuha ang bagong file list
                    // alert("Backup completed successfully!");
                },
                // Siguraduhin na hindi naka-cache ang request
                preserveScroll: true,
            },
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Database Backups</h1>
                    <button
                        onClick={handleCreate}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Generate New Backup
                    </button>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 border">File Name</th>
                            <th className="p-3 border">Size</th>
                            <th className="p-3 border">Date Created</th>
                            <th className="p-3 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {backups && backups.length > 0 ? (
                            backups?.map((backup, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-3 border">
                                        {backup.file_name}
                                    </td>
                                    <td className="p-3 border">
                                        {backup.file_size}
                                    </td>
                                    <td className="p-3 border">
                                        {backup.last_modified}
                                    </td>
                                    <td className="p-3 border text-center">
                                        <a
                                            href={backup.download_url}
                                            className="text-blue-600 font-bold"
                                        >
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No backups available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
