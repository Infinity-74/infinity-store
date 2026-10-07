// ---------- Animated counters ----------
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
        counters.forEach(c => { c.textContent = c.dataset.target; });
        return;
    }

    const counterObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10) || 0;
            const duration = 1600;
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased).toLocaleString('en-US');
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            obs.unobserve(el);
        });
    }, { threshold: 0.4 });

    counters.forEach(c => counterObs.observe(c));
});
