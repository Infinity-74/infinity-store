// ---------- Dark mode ----------
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    function applyTheme(dark) {
        if (dark) document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
        if (toggle) toggle.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        if (metaTheme) metaTheme.setAttribute('content', dark ? '#0b1120' : '#0D0D0D');
    }

    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark');

    if (toggle) {
        toggle.addEventListener('click', () => {
            const dark = document.documentElement.getAttribute('data-theme') !== 'dark';
            applyTheme(dark);
            try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
        });
    }
});
