"use client";

export function toggleTheme() {
  const html = document.documentElement;

  if (html.dataset.theme === "dark") {
    html.dataset.theme = "light";
    localStorage.setItem("theme", "light");
  } else {
    html.dataset.theme = "dark";
    localStorage.setItem("theme", "dark");
  }
}