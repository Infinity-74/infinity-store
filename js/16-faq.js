// ---------- FAQ accordion ----------
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-question');
        const ans = item.querySelector('.faq-answer');
        btn.addEventListener('click', () => {
            const open = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(o => {
                o.classList.remove('open');
                o.querySelector('.faq-answer').style.maxHeight = null;
                o.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!open) {
                item.classList.add('open');
                ans.style.maxHeight = ans.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
