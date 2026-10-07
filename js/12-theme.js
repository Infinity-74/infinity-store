// ============================================
// Dark mode toggle + persistence
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    function applyTheme(dark) {
        if (dark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        if (toggle) {
            toggle.innerHTML = dark
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';
        }
        if (metaTheme) {
            metaTheme.setAttribute('content', dark ? '#0b1120' : '#0D0D0D');
        }
    }

    // ---- تطبيق الثيم المحفوظ فوراً ----
    let savedTheme = null;
    try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
    applyTheme(savedTheme === 'dark');

    // ---- تفعيل الـ transitions بعد التحميل (لمنع الوميض) ----
    requestAnimationFrame(() => {
        document.documentElement.classList.add('theme-ready');
    });

    if (toggle) {
        toggle.addEventListener('click', () => {
            const dark = document.documentElement.getAttribute('data-theme') !== 'dark';
            applyTheme(dark);
            try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
        });
    }
});