const getTheme = () =>
    (typeof localStorage !== "undefined" && localStorage.getItem("theme")) || "system";

const applyTheme = (theme: string) => {
    const isDark =
        theme === "dark" ||
        (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
    
    document
        .querySelectorAll(".theme-switcher button")
        .forEach((btn) =>
            btn.classList.toggle("active", btn.id === `theme-${theme}`)
        );
};

document.addEventListener("click", ({ target }) => {
    const btn = (target as HTMLElement).closest(".theme-switcher button");
    if (!btn) return;

    const theme = btn.id.replace("theme-", "");
    
    if (theme === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);

    applyTheme(theme);
});

const init = () => applyTheme(getTheme());

document.addEventListener("astro:page-load", init);
document.addEventListener("DOMContentLoaded", init);
init();
