// Theme toggle functionality (works with dynamically loaded nav)
(() => {
    const htmlElement = document.documentElement;

    // Apply initial theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // 🔥 Event delegation (KEY FIX)
    document.addEventListener('click', (e) => {
    const toggle = e.target.closest('#themeToggle');
    if (!toggle) return;

    const isDark = htmlElement.classList.contains('dark');

    if (isDark) {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    });

    // Optional: system theme change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('theme')) return;

        if (e.matches) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    });
})();