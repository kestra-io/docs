const getTheme = () => localStorage.getItem("theme") ?? "system";

const isDark = (t: string) =>
    t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);

const applyTheme = (t: string) => {
    const dark = isDark(t);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    document.querySelectorAll(".theme-switcher button")
        .forEach(btn => btn.classList.toggle("active", btn.id === `theme-${t}`));
};

document.addEventListener("click", ({ target }) => {
    const btn = (target as HTMLElement).closest(".theme-switcher button");
    if (!btn) return;
    const theme = btn.id.replace("theme-", "");
    theme === "system"
        ? localStorage.removeItem("theme")
        : localStorage.setItem("theme", theme);
    applyTheme(theme);
});

document.addEventListener("astro:before-swap", (e: any) => {
    const dark = isDark(getTheme());
    e.newDocument.documentElement.classList.replace(
        dark ? "light" : "dark",
        dark ? "dark" : "light"
    ) || e.newDocument.documentElement.classList.add(dark ? "dark" : "light");
});

["astro:page-load", "DOMContentLoaded"].forEach(e =>
    document.addEventListener(e, () => applyTheme(getTheme()))
);
applyTheme(getTheme());

