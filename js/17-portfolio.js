// ---------- Portfolio: بيقرأ الصور تلقائيًا من assets/portfolio.json ----------
// الـ JSON بيتحدّث لوحده عن طريق GitHub Action كل ما ترفع/تمسح صورة من assets/portfolio/
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    fetch('assets/portfolio.json?v=' + Date.now())
        .then(res => {
            if (!res.ok) throw new Error('portfolio.json not found');
            return res.json();
        })
        .then(items => {
            if (!Array.isArray(items) || items.length === 0) return; // سيب العرض الاحتياطي
            grid.textContent = '';

            const obs = 'IntersectionObserver' in window
                ? new IntersectionObserver((entries, o) => {
                    entries.forEach(e => {
                        if (e.isIntersecting) {
                            e.target.classList.add('active');
                            o.unobserve(e.target);
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
                : null;

            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'portfolio-item reveal';

                const img = document.createElement('img');
                img.loading = 'lazy';
                img.src = item.src;
                img.alt = item.title || 'عمل من أعمالنا';

                const overlay = document.createElement('div');
                overlay.className = 'portfolio-overlay';
                const h4 = document.createElement('h4');
                h4.textContent = item.title || '';
                overlay.appendChild(h4);
                if (item.subtitle) {
                    const span = document.createElement('span');
                    span.textContent = item.subtitle;
                    overlay.appendChild(span);
                }

                card.appendChild(img);
                card.appendChild(overlay);
                grid.appendChild(card);

                if (obs) obs.observe(card);
                else card.classList.add('active');
            });
        })
        .catch(() => { /* لو فشل التحميل (مثلاً فتح محلي) يفضل العرض الاحتياطي الموجود في HTML */ });
});
