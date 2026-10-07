// ---------- Back to top + staggered reveal ----------
document.addEventListener('DOMContentLoaded', () => {
    const topBtn = document.getElementById('backToTop');
    if (topBtn) {
        const onScroll = () => topBtn.classList.toggle('show', window.scrollY > 500);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // تتابع ظهور العناصر داخل الجريدات
    document.querySelectorAll('.features-grid, .products-grid, .steps-grid, .stats-grid, .payments-grid, .faq-list, .portfolio-grid')
        .forEach(grid => {
            grid.querySelectorAll('.reveal').forEach((el, i) => {
                el.style.transitionDelay = (i * 90) + 'ms';
            });
        });
});
