const getTheme = () => localStorage.getItem("theme") ?? "light";

const isDark = (t: string) =>
    t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);

const applyTheme = (t: string = getTheme(), doc: Document = document) => {
    const dark = isDark(t);
    doc.documentElement.classList.toggle("dark", dark);
    doc.documentElement.classList.toggle("light", !dark);
    if (doc === document) {
        doc.querySelectorAll(".theme-switcher button")
            .forEach(btn => btn.classList.toggle("active", btn.id === `theme-${t}`));
    }
};

document.addEventListener("click", ({ target }) => {
    const btn = (target as HTMLElement).closest(".theme-switcher button");
    if (!btn) return;
    const theme = btn.id.replace("theme-", "");
    if (theme === "system") {
        localStorage.removeItem("theme");
    } else {
        localStorage.setItem("theme", theme);
    }
    applyTheme(theme);
});

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getTheme() === "system") applyTheme("system");
});

document.addEventListener("astro:before-swap", (e: any) => {
    applyTheme(getTheme(), e.newDocument);
});

document.addEventListener("astro:page-load", () => applyTheme());
applyTheme();
