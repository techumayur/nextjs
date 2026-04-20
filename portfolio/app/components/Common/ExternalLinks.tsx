"use client";
import { useEffect } from "react";

export default function ExternalLinks() {
  useEffect(() => {
    const applyTargetBlank = () => {
      document.querySelectorAll('a').forEach((a) => {
        try {
          if (!a.href) return;
          const url = new URL(a.href, window.location.href);
          if (
            url.host !== window.location.host &&
            url.protocol !== "mailto:" &&
            url.protocol !== "tel:" &&
            url.protocol !== "javascript:" &&
            !a.hasAttribute("data-fancybox") &&
            a.target !== "_blank"
          ) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }
        } catch (e) {
          // Error parsing URL, ignore
        }
      });
    };

    // Run initially
    applyTargetBlank();

    // Run on mutations (useful for dynamic Next.js navigation and CMS content)
    const observer = new MutationObserver((mutations) => {
      let shouldRun = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldRun = true;
          break;
        }
      }
      if (shouldRun) {
        applyTargetBlank();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
