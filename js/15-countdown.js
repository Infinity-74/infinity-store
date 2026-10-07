// ---------- Offer countdown (عدّل data-end في index.html) ----------
document.addEventListener('DOMContentLoaded', () => {
    const strip = document.getElementById('offerStrip');
    if (!strip) return;

    const end = new Date(strip.dataset.end).getTime();
    const d = document.getElementById('cdDays');
    const h = document.getElementById('cdHours');
    const m = document.getElementById('cdMins');
    const sec = document.getElementById('cdSecs');
    const pad = n => String(n).padStart(2, '0');
    let timer;

    function updateCountdown() {
        const diff = end - Date.now();
        if (isNaN(end) || diff <= 0) {
            strip.style.display = 'none'; // العرض خلص → الشريط يختفي لوحده
            clearInterval(timer);
            return;
        }
        d.textContent = pad(Math.floor(diff / 86400000));
        h.textContent = pad(Math.floor(diff / 3600000) % 24);
        m.textContent = pad(Math.floor(diff / 60000) % 60);
        sec.textContent = pad(Math.floor(diff / 1000) % 60);
    }

    updateCountdown();
    timer = setInterval(updateCountdown, 1000);
});
