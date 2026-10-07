// تعقيم أي نص قبل حقنه في الصفحة، لمنع هجمات XSS من بيانات قادمة من الشيت
function escapeHtml(value) {
    if (value === undefined || value === null) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// توليد رقم طلب عشوائي صعب التخمين (8 أحرف/أرقام) بدل الاعتماد على الوقت فقط
function generateOrderSuffix() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // من غير حروف/أرقام متشابهة بصريًا زي O و0 و I و1
    let result = "";
    if (window.crypto && window.crypto.getRandomValues) {
        const randomValues = new Uint32Array(8);
        window.crypto.getRandomValues(randomValues);
        for (let i = 0; i < 8; i++) {
            result += chars[randomValues[i] % chars.length];
        }
    } else {
        for (let i = 0; i < 8; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
    }
    return result;
}

// Sound Effects
const clickSound = new Audio();

try {
    clickSound.src = './assets/click.mp3';
    clickSound.volume = 0.3;
    clickSound.preload = 'auto';
} catch (e) {
    console.log('⚠️ ملف الصوت مش موجود');
}

function playClickSound() {
    try {
        if (clickSound.src) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        }
    } catch (e) {}
}
