// ============================================
// Home page initialization + interactions
// ============================================
document.addEventListener("DOMContentLoaded", () => {

    // ---- Initial calculator render ----
    if (typeof calculatePrice === "function") {
        calculatePrice();
    }

    // ---- Click sound on interactive elements ----
    document.querySelectorAll(
        'button, .btn, a, .clickable, .thumb, .portfolio-item, .product-card, .feature-card, .payment-card, .testimonial-card, .step, .img-nav-btn, .qty-selector button'
    ).forEach(el => {
        el.addEventListener('click', playClickSound);
    });

    // ---- File name preview in order modal ----
    const fileInput = document.getElementById("custFile");
    const namePreview = document.getElementById("fileNamePreview");

    if (fileInput && namePreview) {
        fileInput.addEventListener("change", function() {
            if (this.files && this.files.length > 0) {
                const file = this.files[0];
                const fileSize = (file.size / 1024).toFixed(1);
                namePreview.innerText = `📁 ${file.name} (${fileSize} KB)`;
            } else {
                namePreview.innerText = "لم يتم اختيار ملف";
            }
        });
    }

    // ---- Ripple effect on buttons ----
    document.querySelectorAll(".btn").forEach(button => {
        button.addEventListener("click", function(e) {
            const ripple = document.createElement("span");
            ripple.classList.add("ripple");

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;

            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ---- Product card image sliders ----
    document.querySelectorAll(".product-img-holder[data-product]").forEach(holder => {
        const key = holder.dataset.product;
        const images = (typeof PRODUCTS !== "undefined" && PRODUCTS[key] && PRODUCTS[key].images) || [];

        if (images.length === 0) return;

        holder.dataset.index = 0;
        const img = holder.querySelector(".product-slide-img");
        if (img) img.src = images[0];

        if (images.length <= 1) {
            holder.querySelectorAll(".img-nav-btn").forEach(btn => btn.style.display = "none");
        }
    });
});

// ============================================
// Product card image navigation
// ============================================
function cardChangeImage(btn) {
    const holder = btn.closest(".product-img-holder");
    if (!holder) return;

    const key = holder.dataset.product;
    const images = (typeof PRODUCTS !== "undefined" && PRODUCTS[key] && PRODUCTS[key].images) || [];
    if (images.length <= 1) return;

    let idx = parseInt(holder.dataset.index || "0", 10);
    const dir = parseInt(btn.dataset.dir, 10);
    idx = (idx + dir + images.length) % images.length;
    holder.dataset.index = idx;

    const img = holder.querySelector(".product-slide-img");
    if (img) img.src = images[idx];
}

// ============================================
// Quick Order: ربط اسم المنتج بالقيمة الحقيقية في الـ select
// (الطريقة القديمة كانت بتقارن نصوص عربية وبتفشل)
// ============================================
const PRODUCT_SELECT_MAPPING = {
    "مج مخصص":         "مج سيراميك عادي",
    "مج سيراميك":      "مج سيراميك عادي",
    "مج سحري":         "مج سحري",
    "استيكرات مخصصة":  "شيت استيكرات A4",
    "استيكرات":        "شيت استيكرات A4",
    "استيك تخرج":      "استيك تخرج مخصص",
    "استيك تخرج مخصص": "استيك تخرج مخصص",
    "هودي":            "هودي شتوي مطبوع",
    "هودي مطبوع":      "هودي شتوي مطبوع"
};

function quickOrder(productName) {
    const selectElem = document.getElementById("custProduct");
    if (!selectElem) return;

    // 1) جرّب mapping المباشر
    let targetValue = PRODUCT_SELECT_MAPPING[productName];

    // 2) لو مفيش mapping، جرّب مطابقة مباشرة مع أي option
    if (!targetValue) {
        const options = Array.from(selectElem.options);
        const match = options.find(o => o.value === productName);
        if (match) targetValue = match.value;
    }

    // 3) جرّب includes كحل أخير
    if (!targetValue) {
        const options = Array.from(selectElem.options);
        const match = options.find(o =>
            o.value && (o.value.includes(productName) || productName.includes(o.value))
        );
        if (match) targetValue = match.value;
    }

    if (targetValue) {
        selectElem.value = targetValue;
    }

    const qtyInput = document.getElementById("custQty");
    if (qtyInput) qtyInput.value = 1;

    openOrderModal();
}

// ============================================
// Order from calculator
// ============================================
function orderFromCalculator() {
    const calcProductEl = document.getElementById("calcProduct");
    const calcQtyEl = document.getElementById("calcQty");
    if (!calcProductEl || !calcQtyEl) return;

    const productKey = calcProductEl.value;
    const qty = calcQtyEl.value;

    const productMapping = {
        "mug-regular":    "مج سيراميك عادي",
        "mug-magic":      "مج سحري",
        "stickers-pack":  "شيت استيكرات A4",
        "sticker-single": "استيكر فردي داي-كت",
        "hoodie":         "هودي شتوي مطبوع",
        "graduation":     "استيك تخرج"
    };

    const modalProductValue = productMapping[productKey] || "";
    const selectElem = document.getElementById("custProduct");
    const qtyInput = document.getElementById("custQty");

    if (selectElem && modalProductValue) {
        selectElem.value = modalProductValue;
    }
    if (qtyInput) {
        qtyInput.value = qty;
    }

    openOrderModal();
}