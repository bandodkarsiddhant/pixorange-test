(() => {
    const html = document.documentElement;

    // Apply saved / system theme on load
    const saved       = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved === "dark" || (!saved && prefersDark)) {
        html.classList.add("dark");
    } else {
        html.classList.remove("dark");
    }

    // Toggle on click (event delegation — works with dynamic nav)
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#themeToggle")) return;

        const isDark = html.classList.contains("dark");

        if (isDark) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            syncOverlay(false);
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            syncOverlay(true);
        }
    });

    // System preference change
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (localStorage.getItem("theme")) return;
        e.matches ? html.classList.add("dark") : html.classList.remove("dark");
    });

    // Re-tint overlay keeping its current alpha when theme switches mid-scroll
    function syncOverlay(toDark) {
        const el = document.querySelector(".hero-overlay");
        if (!el || !el.style.backgroundColor) return;
        const match = el.style.backgroundColor.match(/[\d.]+(?=\s*\))/g);
        const alpha = match ? parseFloat(match[match.length - 1]) : 0;
        el.style.backgroundColor = toDark
            ? `rgba(0, 0, 0, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;
    }
})();