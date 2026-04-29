"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Theme } from "@/types/theme";
import Loader from "@/app/components/Common/Loader";

type ThemeType = Theme;

// ✅ helper (IMPORTANT)
const isTrue = (val: unknown) => {
    return val === true || val === "true" || val === 1 || val === "1";
};

const ThemeContext = createContext<{
    theme: ThemeType | null;
}>({
    theme: null,
});

export default function ThemeProvider({
    children,
    initialTheme = null,
}: {
    children: React.ReactNode;
    initialTheme?: ThemeType | null;
}) {
    const [theme, setTheme] = useState<ThemeType | null>(initialTheme);
    const [loading, setLoading] = useState(!initialTheme);

    useEffect(() => {
        const styles = document.querySelectorAll("#dynamic-theme");

        if (styles.length > 1) {
            styles.forEach((style, index) => {
                if (index !== styles.length - 1) style.remove(); // keep latest only
            });
        }
        // 🌙 DARK / LIGHT
        const saved = localStorage.getItem("theme") || "light";
        document.documentElement.dataset.theme = saved;

        // 🔒 prevent scroll during loader if no initial theme
        if (!initialTheme) {
            document.body.classList.add("loading");
        }

        // ⏱ safety timeout (max 3 sec)
        const safetyTimer = setTimeout(() => {
            setLoading(false);
            document.body.classList.remove("loading");
        }, 3000);

        const fetchTheme = async () => {
            if (initialTheme) return; // ✅ Skip if we already have data from SSR

            try {
                const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
                if (!baseUrl) return; 

                const res = await fetch(
                    `${baseUrl}/wp-json/custom/v1/theme`,
                    { cache: "no-store" }
                );

                const data = await res.json();
                if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                    setTheme(data);
                }

                if (!isTrue(data.loader)) {
                    // ❌ loader disabled
                    setLoading(false);
                    document.body.classList.remove("loading");
                    clearTimeout(safetyTimer);
                } else {
                    // ✅ loader enabled
                    setTimeout(() => {
                        setLoading(false);
                        document.body.classList.remove("loading");
                        clearTimeout(safetyTimer);
                    }, 800);
                }
            } catch (err) {
                console.error("Theme fetch error:", err);
                setLoading(false);
                document.body.classList.remove("loading");
                clearTimeout(safetyTimer);
            }
        };

        // If we already have initialTheme, we might still want to refresh it or just skip
        // For now, let's fetch it anyway to ensure client is in sync with latest CMS, 
        // but we start with initialTheme so there's no flicker.
        fetchTheme();

        return () => clearTimeout(safetyTimer);
    }, [initialTheme]);

    const isLoaderEnabled = isTrue(theme?.loader);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {/* {loading && isLoaderEnabled && <Loader />} */}
            {children}
        </ThemeContext.Provider>
    );
}

// 🔥 hook
export const useTheme = () => useContext(ThemeContext);
