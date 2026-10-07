// ============================================
// التعديل المهم هنا - إرسال الصورة مع الطلب
// ============================================
async function submitOrder(event) {
    event.preventDefault();

    // Honeypot: حقل مخفي عن البني آدمين - لو اتملى يبقى الطلب من بوت، نتجاهله بهدوء
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
    const file = fileInput.files && fileInput.files[0];

    if (!name) {
        alert("❌ من فضلك أدخل اسمك بالكامل");
        return;
    }
    if (!phone) {
        alert("❌ من فضلك أدخل رقم الموبايل");
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

    const orderId = "INF-" + generateOrderSuffix();

    let message = `السلام عليكم 🌹\n\nتم إنشاء طلب جديد من موقع Infinity Store.\n\n🆔 رقم الطلب: ${orderId}\n👤 الاسم: ${name}\n📱 الهاتف: ${phone}\n📦 المنتج: ${product}\n🔢 الكمية: ${qty}\n📍 المحافظة: ${city}\n📝 التفاصيل:\n${details || "لا يوجد"}`;

    if (file) {
        const fileSize = (file.size / 1024).toFixed(1);
        message += `\n\n📎 الملف المرفق: ${file.name} (${fileSize} KB)\n(سيتم إرسال الملف يدوياً عبر واتساب بعد التأكيد)`;
    }

    message += `\n\nيرجى تأكيد الطلب.`;

    // مهم: لازم نفتح واتساب فوراً هنا (قبل أي await) عشان المتصفح
    // ما يعتبرش النافذة دي "popup" ويمنعها. لو فتحناها بعد await
    // المتصفح بيمنعها لأنها مبقتش مرتبطة مباشرة بضغطة الزرار.
    const whatsappWindow = window.open(
        `https://wa.me/${BRAND_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

    if (!whatsappWindow) {
        alert("⚠️ المتصفح منع فتح واتساب تلقائياً. من فضلك اسمح بالنوافذ المنبثقة (Pop-ups) لهذا الموقع وحاول تاني، أو اضغط على الرابط اللي هيظهر لك.");
    }

    const orderData = {
        action: "addOrder",
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

    document.getElementById("orderForm").reset();
    document.getElementById("fileNamePreview").innerText = "لم يتم اختيار ملف";
    closeOrderModal();
}
