import { Theme } from "@/types/theme";

export async function getTheme(): Promise<Theme> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;

  if (!baseUrl) {
    console.error("WP API URL not defined in .env");
    return {} as Theme;
  }

  try {
    const res = await fetch(`${baseUrl}/wp-json/custom/v1/theme`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Failed to fetch theme:", res.status);
      return {} as Theme;
    }

    return await res.json();
  } catch (err) {
    console.error("Theme fetch error:", err);
    return {} as Theme;
  }
}
