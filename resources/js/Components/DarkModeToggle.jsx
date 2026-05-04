import React from "react";

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(
        localStorage.getItem("theme") === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches),
    );

    useEffect(() => {
        // 2. I-apply ang 'dark' class sa <html> tag
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);
    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
            {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
    );
}
