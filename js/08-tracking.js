async function trackOrder() {
    const input = document.getElementById("trackingInput").value.trim();
    const result = document.getElementById("trackingResult");

    if (!input) {
        alert("❌ من فضلك أدخل رقم الطلب");
        return;
    }

    try {
        const response = await fetch(`${API_URL}?orderId=${encodeURIComponent(input)}`);
        const order = await response.json();

        if (!order.found) {
            result.style.display = "block";
            result.innerHTML = `
                <div style="text-align:center;padding:30px;">
                    <h2 style="color:#ff4d4f;">❌ لم يتم العثور على الطلب</h2>
                    <p>تأكد من رقم الطلب ثم حاول مرة أخرى.</p>
                </div>
            `;
            return;
        }

        let first = "active";
        let second = "";
        let third = "";
        let fourth = "";

        if (order.status === "جاري التجهيز") {
            second = "active";
        }
        if (order.status === "تم الشحن") {
            second = "active";
            third = "active";
        }
        if (order.status === "تم التسليم") {
            second = "active";
            third = "active";
            fourth = "active";
        }

        result.style.display = "block";
        result.innerHTML = `
            <div class="tracking-status">
                <h3>حالة الطلب : <span id="statusText">${escapeHtml(order.status)}</span></h3>
            </div>
            <div class="tracking-progress">
                <div class="step ${first}"><i class="fa-solid fa-cart-shopping"></i><span>تم استلام الطلب</span></div>
                <div class="step ${second}"><i class="fa-solid fa-box"></i><span>جاري التجهيز</span></div>
                <div class="step ${third}"><i class="fa-solid fa-truck"></i><span>تم الشحن</span></div>
                <div class="step ${fourth}"><i class="fa-solid fa-house"></i><span>تم التسليم</span></div>
            </div>
            <div class="tracking-details">
                <div><strong>رقم الطلب:</strong> ${escapeHtml(order.orderId)}</div>
                <div><strong>الاسم:</strong> ${escapeHtml(order.name)}</div>
                <div><strong>رقم الهاتف:</strong> ${escapeHtml(order.phone)}</div>
                <div><strong>المنتج:</strong> ${escapeHtml(order.product)}</div>
                <div><strong>الكمية:</strong> ${escapeHtml(order.qty)}</div>
                <div><strong>المحافظة:</strong> ${escapeHtml(order.city)}</div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        alert("❌ حدث خطأ أثناء البحث. تأكد من اتصال الإنترنت وحاول مرة أخرى.");
    }
}
