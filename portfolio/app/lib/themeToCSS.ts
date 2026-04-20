import { Theme } from "@/types/theme";

export function themeToCSS(theme: Theme): string {
  const isCustom = theme.scrollbar_mode === "custom";
  const fontFamilyAlt = theme.font_family || "Space Grotesk";

  return `
/* ================= ROOT ================= */
:root {
  --theme-color: ${theme.theme_color || "#096C6C"};
  --primary-color: ${theme.primary_color || "#FF7518"};
  --body-color: ${theme.body_color || "#FFFAFA"};
  --site-bg: ${theme.bg_color || "#FFFAFA"};

  --white-color: ${theme.white_color || "#fff"};
  --black-color: ${theme.black_color || "#000"};

  --gray-bg: ${theme.gray_background || "#fafafa"};
  --border-color: ${theme.border_color || "#e8e8e8"};

  --heading-color: ${theme.heading_color || "#1C1C1C"};
  --para-color: ${theme.paragraph_color || "#5F6368"};

  --folder: ${theme.folder_color || "#F3E9CB"};
  --folder-inner: ${theme.folder_inner_color || "#BEB393"};

  --white-color-lines: ${theme.white_lines_color || "#BBC1E1"};
  --white-color-behind: ${theme.white_behind_color || "#E1E6F9"};

  --pencil-top: ${theme.pencil_top_color || "#275EFE"};
  --pencil-bottom: ${theme.pencil_bottom_color || "#5C86FF"};

  --window-red: ${theme.window_red || "#ff5f56"};
  --window-yellow: ${theme.window_yellow || "#ffbd2e"};
  --window-green: ${theme.window_green || "#27c93f"};

  --header-bg: ${theme.header_bg || "#ffffff"};
  --header-font: ${theme.header_font || "#000000"};

  --footer-bg: ${theme.footer_bg || "#096c6c"};
  --footer-font-color: ${theme.footer_font || "#ffffff"};

  --btn-primary: ${theme.primary_button || "#ff7518"};
  --btn-primary-hover: ${theme.primary_button_hover || "#096c6c"};

  --scrollbar-track: ${theme.scrollbar_track || "#ff7518"};
  --scrollbar-thumb: ${theme.scrollbar_thumb || "#096c6c"};

  --selection: ${theme.selection_color || "#096c6c"};

  --card-shadow: ${theme.card_shadow || "0 1px 3px rgba(0, 0, 0, 0.05)"};
  --shadow-sm: ${theme.shadow_sm || "0 4px 12px rgba(0, 0, 0, 0.06)"};
  --shadow-md: ${theme.shadow_md || "0 12px 30px rgba(0, 0, 0, 0.10)"};
  --card-shadow-hover: ${theme.card_shadow_hover || "0 10px 30px rgba(255, 107, 53, 0.15)"};

  --font-family: "${fontFamilyAlt}", sans-serif;
  font-family: var(--font-family);

  --scrollbar-width: ${theme.scrollbar_width || 6}px;
}

/* ================= SELECTION ================= */
::selection {
  color: var(--white-color);
  background: var(--selection);
}

/* ================= BODY BACKGROUND ================= */
body {
  background-color: var(--site-bg);
  background-image: ${theme.bg_image && typeof theme.bg_image === "string" ? `url("${theme.bg_image}")` : "none"};
  background-size: ${theme.bg_size || "cover"};
  background-position: ${theme.bg_position || "center"};
  background-attachment: ${theme.bg_attachment || "scroll"};
}

/* ================= SCROLLBAR ================= */
${isCustom
      ? `
/* CUSTOM SCROLLBAR */
::-webkit-scrollbar {
  width: 0.35rem;
}

::-webkit-scrollbar-track {
  background: var(--theme-color);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 10px;
}
`
      : ""
    }

/* ================= DARK MODE ================= */
[data-theme="dark"] {
  --body-color: ${theme.body_color_dark || "#0f172a"};
  --site-bg: ${theme.bg_color_dark || "#0f172a"};
  --heading-color: ${theme.heading_color_dark || "#ffffff"};
  --para-color: ${theme.paragraph_color_dark || "#cbd5e1"};
  --border-color: ${theme.border_color_dark || "#333"};
  --gray-bg: ${theme.gray_background_dark || "#111"};

  --primary-color: ${theme.primary_color_dark || theme.primary_color || "#FF7518"};

  --header-bg: ${theme.header_bg_dark || "#000"};
  --footer-bg: ${theme.footer_bg_dark || "#000"};

  --white-color: #000;
  --black-color: #fff;
}
`;
}
