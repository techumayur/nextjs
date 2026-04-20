import ServerErrorComponent from '@/app/components/ServerError/ServerError';
import { getTheme } from '@/app/lib/getTheme';

export const metadata = {
  title: "500 - Internal Server Error",
  description: "Oops! Something went wrong on our end.",
};

export default async function ErrorPage500() {
  const theme = await getTheme().catch(() => null);

  const source = (theme?.group_500_settings || theme) as unknown as Record<string, unknown>;

  const data500 = theme ? {
    illustration: source["500_svg_code"] as string,
    error_code: source["500_error_code"] as string,
    sub_heading_icon: source["500_sub_heading_icon"] as string,
    sub_heading: source["500_sub_heading"] as string,
    title: source["500_title"] as string,
    description: source["500_description"] as string,
    primary_button_label: source["500_primary_button_label"] as string,
    primary_button_link: source["500_primary_button_link"] as string,
    secondary_button_label: source["500_secondary_button_label"] as string,
    secondary_button_link: source["500_secondary_button_link"] as string,
    quick_links: (source["500_quick_links"] as Array<{
      label?: string;
      quick_links: string;
      icon?: string | number | { url: string };
    }>) || [],
  } : undefined;

  return <ServerErrorComponent data={data500} />;
}
