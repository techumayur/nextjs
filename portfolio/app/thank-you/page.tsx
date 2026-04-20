import ThankYouComponent from '@/app/components/ThankYou/ThankYou';
import { getTheme } from '@/app/lib/getTheme';

export const metadata = {
  title: "Thank You | Techu Mayur",
  description: "Message received! Thanks for reaching out.",
};

export default async function ThankYouPage() {
  const theme = await getTheme().catch(() => null);
  const source = theme as unknown as Record<string, unknown>;

  const dataThankYou = theme ? {
    sub_heading_svg: source["thankyou_sub_heading_svg"] as string,
    sub_heading_icon: source["thankyou_sub_heading_icon"] as string,
    title: source["thankyou_title"] as string,
    description: source["thankyou_description"] as string,
    primary_button_label: source["thankyou_primary_button_label"] as string,
    primary_button_link: source["thankyou_primary_button_link"] as string,
    secondary_button_label: source["thankyou_secondary_button_label"] as string,
    secondary_button_link: source["thankyou_secondary_button_link"] as string,
    quick_links: source["thankyou_quick_links"] as Array<{
      label?: string;
      quick_links: string;
      icon?: string | number | { url: string };
    }>,
  } : undefined;

  return <ThankYouComponent data={dataThankYou} />;
}
