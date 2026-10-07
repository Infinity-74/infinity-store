// Announcement bar: keep the fixed navbar right under the bar, then stick to top on scroll
(function () {
    const bar = document.getElementById('announcementBar');
    const nav = document.querySelector('.navbar');
    if (!bar || !nav) return;
    function syncNavbar() {
        const offset = Math.max(0, bar.offsetHeight - window.scrollY);
        nav.style.top = offset + 'px';
    }
    window.addEventListener('scroll', syncNavbar, { passive: true });
    window.addEventListener('resize', syncNavbar);
    syncNavbar();
})();
