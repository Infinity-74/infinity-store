// ============================================
// Submit Order + Send to WhatsApp + Save to Sheet
// ============================================
let isSubmittingOrder = false; // قفل لمنع الإرسال المزدوج

async function submitOrder(event) {
    event.preventDefault();

    // ---- حماية من الضغط المتكرر ----
    if (isSubmittingOrder) return;

    // ---- Honeypot: لو اتملى يبقى بوت ----
    const honeypot = document.getElementById("custWebsite");
    if (honeypot && honeypot.value.trim() !== "") {
        document.getElementById("orderForm").reset();
        closeOrderModal();
        return;
    }

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const product = document.getElementById("custProduct").value;
    const qty = document.getElementById("custQty").value;
    const city = document.getElementById("custCity").value;
    const details = document.getElementById("custDetails").value.trim();
    const fileInput = document.getElementById("custFile");
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;

    // ---- Validation ----
    if (!name) {
        alert("❌ من فضلك أدخل اسمك بالكامل");
        return;
    }
    if (!phone || !/^01[0-2,5]{1}[0-9]{8}$/.test(phone)) {
        alert("❌ من فضلك أدخل رقم موبايل صحيح (مثال: 01012345678)");
        return;
    }
    if (!product) {
        alert("❌ من فضلك اختر المنتج");
        return;
    }
    if (!city) {
        alert("❌ من فضلك اختر المحافظة");
        return;
    }

    // ---- reCAPTCHA ----
    const recaptchaResponse = typeof grecaptcha !== "undefined"
        ? grecaptcha.getResponse()
        : "";

    // لو reCAPTCHA موجود في الصفحة، لازم المستخدم يدوس عليه
    const recaptchaWidget = document.querySelector(".g-recaptcha");
    if (recaptchaWidget && !recaptchaResponse) {
        alert("❌ من فضلك أكد إنك مش روبوت (اضغط على المربع)");
        return;
    }

    // ---- اقفل الإرسال ----
    isSubmittingOrder = true;

    const submitBtn = document.querySelector('#orderForm button[type="submit"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';
    }

    try {
        const orderId = "INF-" + generateOrderSuffix();

        let message = `السلام عليكم 🌹\n\nتم إنشاء طلب جديد من موقع Infinity Store.\n\n🆔 رقم الطلب: ${orderId}\n👤 الاسم: ${name}\n📱 الهاتف: ${phone}\n📦 المنتج: ${product}\n🔢 الكمية: ${qty}\n📍 المحافظة: ${city}\n📝 التفاصيل:\n${details || "لا يوجد"}`;

        if (file) {
            const fileSize = (file.size / 1024).toFixed(1);
            message += `\n\n📎 الملف المرفق: ${file.name} (${fileSize} KB)\n(سيتم إرسال الملف يدوياً عبر واتساب بعد التأكيد)`;
        }

        message += `\n\nيرجى تأكيد الطلب.`;

        // ---- فتح واتساب فوراً قبل أي await ----
        const whatsappWindow = window.open(
            `https://wa.me/${BRAND_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            "_blank"
        );

        if (!whatsappWindow) {
            alert("⚠️ المتصفح منع فتح واتساب تلقائياً. من فضلك اسمح بالنوافذ المنبثقة (Pop-ups) لهذا الموقع وحاول تاني.");
        }

        // ---- إرسال البيانات للشيت ----
        const orderData = {
            action: "addOrder",
            recaptchaToken: recaptchaResponse,
            order: {
                "Order ID": orderId,
                "Name": name,
                "Phone": phone,
                "Product": product,
                "Qty": qty,
                "City": city,
                "Details": details || "لا يوجد",
                "Status": "قيد المراجعة"
            }
        };

        try {
            await fetch(API_URL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(orderData)
            });
        } catch (err) {
            console.warn("⚠️ فشل إرسال البيانات إلى Google Sheets:", err);
        }

        alert(`✅ تم إنشاء طلبك بنجاح ✅\n\n🆔 رقم طلبك هو: ${orderId}\n\n📌 احتفظ بهذا الرقم لتتبع طلبك لاحقاً.\n\n📱 سيتم التواصل معك عبر واتساب لتأكيد الطلب واستلام التصميم.`);

        // ---- تنظيف الفورم ----
        document.getElementById("orderForm").reset();
        const namePreview = document.getElementById("fileNamePreview");
        if (namePreview) namePreview.innerText = "لم يتم اختيار ملف";
        if (typeof grecaptcha !== "undefined") grecaptcha.reset();
        closeOrderModal();

    } finally {
        // ---- فتح القفل في كل الحالات ----
        isSubmittingOrder = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    }
}