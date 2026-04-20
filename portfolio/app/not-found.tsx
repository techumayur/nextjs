import NotFoundComponent from '@/app/components/NotFound/NotFound';
import { getTheme } from '@/app/lib/getTheme';

export const metadata = {
  title: "404 - Page Not Found",
  description: "Oops! The page you're looking for doesn't exist.",
};

export default async function NotFound() {
  const theme = await getTheme().catch(() => null);

  const data404 = theme ? {
    illustration: theme["svg_code"],
    error_code: theme["404_error_code"],
    sub_heading_icon: theme["404_sub_heading_icon"],
    sub_heading: theme["404_sub_heading"],
    title: theme["404_title"],
    description: theme["404_description"],
    primary_button_label: theme["404_primary_button_label"],
    primary_button_link: theme["404_primary_button_link"],
    secondary_button_label: theme["404_secondary_button_label"],
    secondary_button_link: theme["404_secondary_button_link"],
    quick_links_label: theme["404_quick_links_label"],
    quick_links: theme["404_quick_links"],
  } : undefined;

  return <NotFoundComponent data={data404} />;
}
