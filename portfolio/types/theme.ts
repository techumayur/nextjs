export interface Theme {
  theme_color: string;
  primary_color: string;
  body_color: string;
  white_color: string;
  black_color: string;

  gray_background: string;
  border_color: string;

  heading_color: string;
  paragraph_color: string;

  folder_color: string;
  folder_inner_color: string;

  white_lines_color: string;
  white_behind_color: string;

  pencil_top_color: string;
  pencil_bottom_color: string;

  window_red: string;
  window_yellow: string;
  window_green: string;

  header_bg: string;
  header_font: string;
  header_hover: string;

  footer_bg: string;
  footer_font: string;
  footer_hover: string;

  primary_button: string;
  primary_button_hover: string;

  secondary_button: string;
  secondary_button_hover: string;

  scrollbar_track: string;
  scrollbar_thumb: string;
  scrollbar_width?: number | string;
  scrollbar_mode?: string;

  selection_color: string;

  banner_font?: string;
  heading_font?: string;
  sub_heading_font?: string;
  small_heading_font?: string;
  paragraph_font?: string;
  body_font?: string;
  button_font?: string;
  small_button_font?: string;
  input_font?: string;
  navigation_font?: string;
  footer_font_css?: string;
  badge_font?: string;
  small_badge_font?: string;
  google_font?: string;

  section_spacing?: string;
  radius_lg?: string;
  radius_2xl?: string;
  fs_base?: string;

  body_color_dark?: string;
  heading_color_dark?: string;
  paragraph_color_dark?: string;
  primary_color_dark?: string;
  header_bg_dark?: string;
  footer_bg_dark?: string;
  border_color_dark?: string;
  gray_background_dark?: string;
  font_family?: string;
  card_shadow?: string;
  shadow_sm?: string;
  shadow_md?: string;
  card_shadow_hover?: string;
  back_to_top?: string;
  bg_color?: string;
  bg_color_dark?: string;
  loader?: boolean | string;
  bg_image?: string | boolean;
  bg_size?: string;
  bg_position?: string;
  bg_attachment?: string;
  header_logo?: {
    url?: string;
  };
  header_logo_white?: {
    url?: string;
  };
  header_logo_alt?: string;
  hire_me_text?: string;
  hire_me_button_url?: string;
  url?: string;

  // 📝 Newsletter & Footer
  newsletter_sub_icon?: string;
  newsletter_sub_text?: string;
  newsletter_heading?: string;
  newsletter_content?: string;
  newsletter_features?: { feature_icon?: string; text?: string }[];
  newsletter_counter?: { counter_number?: string; counter_heading?: string }[];
  newsletter_bg?: boolean | string;
  footer_logo?: string | { url?: string };
  footer_logo_alt?: string;
  footer_content?: string;
  credit?: string;
  copyright?: string;
  newsletter_form_bottom_text?: string;
  social_items?: { icon?: string; link?: string }[];
  email_icon?: string;
  contact_email?: string;
  phone_number_icon?: string;
  contact_phone?: string;
  address_icon?: string;
  contact_address?: string;
  
  // 404 Page data
  "svg_code"?: string;
  "404_error_code"?: string;
  "404_sub_heading_icon"?: string;
  "404_sub_heading"?: string;
  "404_title"?: string;
  "404_description"?: string;
  "404_primary_button_label"?: string;
  "404_primary_button_link"?: string;
  "404_secondary_button_label"?: string;
  "404_secondary_button_link"?: string;
  "404_quick_links_label"?: string;
  "404_quick_links"?: {
    label: string;
    quick_links: string;
    icon?: string | number | { url: string };
  }[];

  // 500 Page data
  "500_svg_code"?: string;
  "500_error_code"?: string;
  "500_sub_heading_icon"?: string;
  "500_sub_heading"?: string;
  "500_title"?: string;
  "500_description"?: string;
  "500_primary_button_label"?: string;
  "500_primary_button_link"?: string;
  "500_secondary_button_label"?: string;
  "500_secondary_button_link"?: string;
  "500_quick_links"?: {
    label?: string;
    quick_links: string;
    icon?: string | number | { url: string };
  }[];

  // Thank You Page data
  "thankyou_sub_heading_svg"?: string;
  "thankyou_sub_heading_icon"?: string;
  "thankyou_title"?: string;
  "thankyou_description"?: string;
  "thankyou_primary_button_label"?: string;
  "thankyou_primary_button_link"?: string;
  "thankyou_secondary_button_label"?: string;
  "thankyou_secondary_button_link"?: string;
  "thankyou_quick_links"?: {
    label?: string;
    quick_links: string;
    icon?: string | number | { url: string };
  }[];

  // Group settings for error pages (in case of nesting)
  "group_404_settings"?: Record<string, unknown>;
  "group_500_settings"?: Record<string, unknown>;
}