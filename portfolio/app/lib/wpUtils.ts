
export async function wpFetch<T>(path: string, options: { fields?: string[], revalidate?: number, params?: Record<string, string | number> } = {}): Promise<T | null> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) {
        console.error("WP API URL not defined");
        return null;
    }

    const { fields, revalidate = 3600, params = {} } = options;
    
    const url = new URL(`${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`);
    
    if (fields && fields.length > 0) {
        url.searchParams.append('_fields', fields.join(','));
    }

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
    });

    try {
        const res = await fetch(url.toString(), {
            next: { revalidate },
        });

        if (!res.ok) {
            console.error(`WP Fetch failed: ${url.toString()} - Status: ${res.status}`);
            return null;
        }

        return await res.json();
    } catch (err) {
        console.error(`WP Fetch error: ${url.toString()}`, err);
        return null;
    }
}

export async function fetchMediaMap(ids: number[]): Promise<Record<number, string>> {
    if (ids.length === 0) return {};
    
    const uniqueIds = [...new Set(ids)].filter(id => typeof id === 'number' && id > 0);
    if (uniqueIds.length === 0) return {};

    const mediaData = await wpFetch<any[]>('/wp-json/wp/v2/media', {
        params: { include: uniqueIds.join(','), per_page: 100 },
        fields: ['id', 'source_url']
    });

    const map: Record<number, string> = {};
    mediaData?.forEach(m => {
        map[m.id] = m.source_url;
    });

    return map;
}

export function resolveMedia(value: any, mediaMap: Record<number, string>): string {
    if (typeof value === 'number') {
        return mediaMap[value] || '';
    }
    if (value && typeof value === 'object' && value.url) {
        return value.url;
    }
    if (typeof value === 'string') {
        return value;
    }
    return '';
}
