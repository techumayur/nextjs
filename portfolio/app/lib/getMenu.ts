export async function getMenu(location: string = 'primary') {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;

    if (!baseUrl) {
        console.error("WP URL missing");
        return [];
    }

    try {
        const res = await fetch(`${baseUrl}/wp-json/custom/v1/menu?location=${location}`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            console.error("Menu fetch failed:", res.status);
            return [];
        }

        return await res.json();
    } catch (err) {
        console.error("Menu fetch error:", err);
        return [];
    }
}
