import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Headers/Header";
import Footer from "./components/Common/Footers/Footer";
import ScrollToTop from "./components/Common/ScrollToTop";
import ThemeProvider from "./providers";
import BootstrapJS from "./components/Common/BootstrapJS";
import { getTheme } from "@/app/lib/getTheme";
import { themeToCSS } from "@/app/lib/themeToCSS";
import { getMenu } from "@/app/lib/getMenu";
import "./globals.css";
import "./globals-responsive.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.techumayur.in"),
  title: {
    default: "Techu Mayur | Frontend Developer Portfolio & Engineering Blog",
    template: "%s | Techu Mayur",
  },
  description:
    "Explore the portfolio and engineering blog of Techu Mayur, a Frontend Developer with 6+ years of expertise. Modern web development tutorials, source code, and professional services.",
  keywords: [
    "Frontend Developer",
    "Web Development",
    "React Developer",
    "Next.js Portfolio",
    "JavaScript Engineering",
    "Techu Mayur",
    "UI/UX Design",
    "Software Engineer Portfolio"
  ],
  authors: [{ name: "Techu Mayur", url: "https://www.techumayur.in" }],
  creator: "Techu Mayur",
  publisher: "Techu Mayur",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.techumayur.in",
    siteName: "Techu Mayur Portfolio",
    title: "Techu Mayur | Frontend Developer & Content Creator",
    description: "Portfolio and engineering blog of Techu Mayur. 6+ years of software development experience.",
    images: [
      {
        url: "/og-image.jpg", // Make sure this exists in public folder
        width: 1200,
        height: 630,
        alt: "Techu Mayur Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Techu Mayur | Frontend Developer",
    description: "6+ years of expertise in building modern web applications.",
    creator: "@techumayur", // Update if user has a different handle
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.techumayur.in",
  },
  verification: {
    google: "XuvOb32JY9t5gT1mKt4vEayWFYUj8nHD2YQL8J9YkJc",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B666A",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, menuData, footerMenu, footerBottomMenu] = await Promise.all([
    getTheme(),
    getMenu('primary'),
    getMenu('footer_quick_links'),
    getMenu('footer_bottom_links')
  ]);
  const dynamicCSS = themeToCSS(theme);

  // 🔥 Dynamic Google Font
  const fontFamily = theme?.font_family || "Space Grotesk";
  // 🔥 PERFECT GOOGLE FONT URL
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily
    .trim()
    .replace(/\s+/g, "+")}:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* 🔥 Google Tag Manager - DEFERRED to improve TBT */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P93CCS6');`,
          }}
        />
        {/* 🔥 Google Font Dynamic */}
        <link rel="stylesheet" href={fontUrl} />
        {/* 🔥 Dynamic Theme (Colors + Fonts) */}
        <style
          id="dynamic-theme"
          dangerouslySetInnerHTML={{ __html: dynamicCSS }}
        />
      </head>

      <body suppressHydrationWarning>
        {/* 🔥 Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P93CCS6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <ThemeProvider initialTheme={theme}>
          <ScrollToTop />
          <Header menuData={menuData} />
          {children}
          <Footer menuData={footerMenu} bottomMenuData={footerBottomMenu} />
          <BootstrapJS />
        </ThemeProvider>
      </body>
    </html>
  );
}