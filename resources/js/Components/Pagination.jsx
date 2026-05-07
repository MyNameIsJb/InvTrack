import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length === 0) return null;

    // Filter logic para hindi masyadong mahaba
    // Ipapakita lang natin ang First, Last, Previous, Next, at Active Page
    const filteredLinks = links.filter((link, index) => {
        if (index === 0 || index === links.length - 1) return true; // Previous & Next
        if (link.active) return true; // Current Page

        // Dagdag: Ipakita rin ang isa sa kaliwa at isa sa kanan ng active
        const activeIndex = links.findIndex((l) => l.active);
        if (index === activeIndex - 1 || index === activeIndex + 1) return true;

        return false;
    });
    return (
        <div className="flex flex-wrap justify-center mt-6 gap-1">
            {links.map((link, key) =>
                link.url === null ? (
                    <div
                        key={key}
                        className="px-4 py-2 text-sm border rounded-xl text-gray-400 border-gray-100"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        className={`px-4 py-2 text-sm border rounded-xl transition-all ${
                            link.active
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                                : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
                        }`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </div>
    );
}
