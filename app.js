// Brand WhatsApp Number (You can replace this with your actual Egyptian WhatsApp number)
const BRAND_WHATSAPP_NUMBER = "201556284315"; // Format: Country code (2) followed by number (e.g. 201012345678)

const API_URL = "https://script.google.com/macros/s/AKfycbwht6HzZSKt3nIfhGU6Cu7rquxuV77FtL3sLbnAoUq-S46xUpjqsy57OSADstgeToWa/exec";

// Pricing Rules
const PRICING = {
    "mug-regular": 120,
    "mug-magic": 170,
    "stickers-pack": 45,
    "sticker-single": 15,
    "tshirt": 280,
    "hoodie": 450
};

// --- Mobile Navigation Drawer ---
function toggleMobileMenu() {
    const drawer = document.getElementById("mobileDrawer");
    drawer.classList.toggle("active");
}

// --- Dynamic Hero Visual Switcher ---
function changeHeroImage(imgSrc, title, desc, thumbnailElement) {
    const mainImg = document.getElementById("heroImage");
    const overlayTitle = document.querySelector(".image-overlay-info h4");
    const overlayDesc = document.querySelector(".image-overlay-info p");
    const thumbnails = document.querySelectorAll(".hero-thumbnails .thumb");

    thumbnails.forEach(thumb => thumb.classList.remove("active"));
    thumbnailElement.classList.add("active");

    mainImg.style.opacity = "0.2";
    setTimeout(() => {
        mainImg.src = imgSrc;
        overlayTitle.innerText = title;
        overlayDesc.innerText = desc;
        mainImg.style.opacity = "1";
    }, 250);
}

// --- Order Modal Logic ---
function openOrderModal() {
    const modal = document.getElementById("orderModal");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeOrderModal() {
    const modal = document.getElementById("orderModal");
    modal.classList.remove("active");
    document.body.style.overflow = "";
}

window.onclick = function(event) {
    const modal = document.getElementById("orderModal");
    if (event.target === modal) {
        closeOrderModal();
    }
}

// --- Quantity Incrementor / Decrementor ---
function adjustQty(amount) {
    const qtyInput = document.getElementById("calcQty");
    let currentVal = parseInt(qtyInput.value) || 1;
    let newVal = currentVal + amount;
    if (newVal >= 1) {
        qtyInput.value = newVal;
        calculatePrice();
    }
}

// --- Dynamic Price Calculator Logic ---
function calculatePrice() {
    const calcProductEl = document.getElementById("calcProduct");
    const calcQtyEl = document.getElementById("calcQty");
    const calcPrintSidesEl = document.getElementById("calcPrintSides");
    const discountAlert = document.getElementById("discountAlert");

    if (!calcProductEl || !calcQtyEl || !calcPrintSidesEl || !discountAlert) {
        return;
    }

    const productKey = calcProductEl.value;
    const qty = parseInt(calcQtyEl.value) || 1;
    const printSides = calcPrintSidesEl.value;

    let basePrice = PRICING[productKey] || 0;

    let extraCosts = 0;
    if (printSides === "double") {
        extraCosts = 30;
    }

    let itemTotal = basePrice + extraCosts;
    let grandTotal = itemTotal * qty;

    if (qty >= 10) {
        grandTotal = grandTotal * 0.9;
        discountAlert.style.display = "flex";
    } else {
        discountAlert.style.display = "none";
    }

    document.getElementById("totalPriceVal").innerText = Math.round(grandTotal);
}

document.addEventListener("DOMContentLoaded", () => {
    calculatePrice();

    const fileInput = document.getElementById("custFile");
    const namePreview = document.getElementById("fileNamePreview");

    if (fileInput) {
        fileInput.addEventListener("change", function() {
            if (this.files && this.files.length > 0) {
                const file = this.files[0];
                // عرض اسم الملف + الحجم
                const fileSize = (file.size / 1024).toFixed(1);
                namePreview.innerText = `📁 ${file.name} (${fileSize} KB)`;
            } else {
                namePreview.innerText = "لم يتم اختيار ملف";
            }
        });
    }

    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(button => {
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

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Initialize product card image sliders on the homepage
    document.querySelectorAll(".product-img-holder[data-product]").forEach(holder => {
        const key = holder.dataset.product;
        const images = PRODUCTS[key] && PRODUCTS[key].images;
        if (!images || images.length === 0) return;

        holder.dataset.index = 0;
        const img = holder.querySelector(".product-slide-img");
        if (img) img.src = images[0];

        // Hide the nav arrows if there's only one image
        if (images.length <= 1) {
            holder.querySelectorAll(".img-nav-btn").forEach(btn => btn.style.display = "none");
        }
    });
});

// --- Product Card Image Slider (homepage) ---
function cardChangeImage(btn) {
    const holder = btn.closest(".product-img-holder");
    const key = holder.dataset.product;
    const images = PRODUCTS[key] && PRODUCTS[key].images;
    if (!images || images.length <= 1) return;

    let idx = parseInt(holder.dataset.index || "0");
    const dir = parseInt(btn.dataset.dir);
    idx = (idx + dir + images.length) % images.length;
    holder.dataset.index = idx;

    const img = holder.querySelector(".product-slide-img");
    if (img) img.src = images[idx];
}

// --- Quick Order from Product Cards ---
function quickOrder(productName) {
    const selectElem = document.getElementById("custProduct");
    for (let i = 0; i < selectElem.options.length; i++) {
        if (selectElem.options[i].value.includes(productName) || productName.includes(selectElem.options[i].value)) {
            selectElem.selectedIndex = i;
            break;
        }
    }
    document.getElementById("custQty").value = 1;
    openOrderModal();
}

// --- Order Transition from Calculator ---
function orderFromCalculator() {
    const productKey = document.getElementById("calcProduct").value;
    const qty = document.getElementById("calcQty").value;
    const printSides = document.getElementById("calcPrintSides").value;
    const totalPrice = document.getElementById("totalPriceVal").innerText;

    const productMapping = {
        "mug-regular": "مج سيراميك عادي",
        "mug-magic": "مج سحري",
        "stickers-pack": "شيت استيكرات A4",
        "sticker-single": "استيكر فردي داي-كت",
        "tshirt": "تيشرت قطن مطبوع",
        "hoodie": "هودي شتوي مطبوع"
    };

    const modalProductValue = productMapping[productKey] || "";

    document.getElementById("custProduct").value = modalProductValue;
    document.getElementById("custQty").value = qty;

    const sidesText = printSides === "double" ? "على الوجهين" : "على وجه واحد";
    document.getElementById("custDetails").value = `طلب محدد من حاسبة الأسعار: طباعة ${sidesText} بسعر تقديري إجمالي ${totalPrice} EGP.`;

    openOrderModal();
}

// --- Order Submission (WhatsApp API Integration) ---
async function submitOrder(event) {
    event.preventDefault();

    // جمع البيانات
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const product = document.getElementById("custProduct").value;
    const qty = document.getElementById("custQty").value;
    const city = document.getElementById("custCity").value;
    const details = document.getElementById("custDetails").value.trim();
    const fileInput = document.getElementById("custFile");
    const file = fileInput.files && fileInput.files[0];

    // التحقق من الحقول المطلوبة
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

    // رقم الطلب
    const orderId =
        "INF-" +
        Date.now().toString().slice(-6) +
        Math.floor(Math.random() * 90 + 10);

    // بناء رسالة واتساب
    let message =
`السلام عليكم 🌹

تم إنشاء طلب جديد من موقع Infinity Store.

🆔 رقم الطلب: ${orderId}

👤 الاسم: ${name}

📱 الهاتف: ${phone}

📦 المنتج: ${product}

🔢 الكمية: ${qty}

📍 المحافظة: ${city}

📝 التفاصيل:
${details || "لا يوجد"}`;

    // إضافة معلومات الملف لو موجود
    if (file) {
        const fileSize = (file.size / 1024).toFixed(1);
        message += `\n\n📎 الملف المرفق: ${file.name} (${fileSize} KB)`;
        message += `\n⚠️ سيتم طلب إرسال الملف عبر واتساب بعد التأكيد.`;
    }

    message += `\n\nيرجى تأكيد الطلب.`;

    // إرسال الطلب إلى Google Sheets
    const orderData = {
        orderId,
        name,
        phone,
        product,
        qty,
        city,
        details,
        fileName: file ? file.name : "لا يوجد",
        status: "قيد المراجعة"
    };

    try {
        // محاولة إرسال البيانات إلى Google Sheets
        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(orderData)
        });
    } catch (err) {
        // حتى لو فشل الإرسال، هنكمل عشان العميل مش يتأثر
        console.warn("⚠️ فشل إرسال البيانات إلى Google Sheets:", err);
    }

    // فتح واتساب
    window.open(
        `https://wa.me/${BRAND_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

    // رسالة نجاح مع رقم الطلب
    alert(
`✅ تم إنشاء طلبك بنجاح ✅

🆔 رقم طلبك هو:
${orderId}

📌 احتفظ بهذا الرقم لتتبع طلبك لاحقاً.

📱 سيتم التواصل معك عبر واتساب لتأكيد الطلب واستلام التصميم.`
    );

    // مسح الفورم
    document.getElementById("orderForm").reset();
    document.getElementById("fileNamePreview").innerText = "لم يتم اختيار ملف";
    closeOrderModal();
}

// --- Scroll Reveal Animation Observer ---
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
});

/* ===========================
   Shipment Tracking
=========================== */

async function trackOrder() {

    const input = document
        .getElementById("trackingInput")
        .value
        .trim();

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

        let first = "";
        let second = "";
        let third = "";
        let fourth = "";

        first = "active";

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

<h3>
حالة الطلب :
<span id="statusText">${order.status}</span>
</h3>

</div>

<div class="tracking-progress">

<div class="step ${first}">
<i class="fa-solid fa-cart-shopping"></i>
<span>تم استلام الطلب</span>
</div>

<div class="step ${second}">
<i class="fa-solid fa-box"></i>
<span>جاري التجهيز</span>
</div>

<div class="step ${third}">
<i class="fa-solid fa-truck"></i>
<span>تم الشحن</span>
</div>

<div class="step ${fourth}">
<i class="fa-solid fa-house"></i>
<span>تم التسليم</span>
</div>

</div>

<div class="tracking-details">
<div><strong>رقم الطلب:</strong> ${order.orderId}</div>
<div><strong>الاسم:</strong> ${order.name}</div>
<div><strong>رقم الهاتف:</strong> ${order.phone}</div>
<div><strong>المنتج:</strong> ${order.product}</div>
<div><strong>الكمية:</strong> ${order.qty}</div>
<div><strong>المحافظة:</strong> ${order.city}</div>
</div>

`;

    } catch (error) {

        console.error(error);

        alert("❌ حدث خطأ أثناء البحث. تأكد من اتصال الإنترنت وحاول مرة أخرى.");

    }

}

function openProduct(product) {

    window.location.href = `product.html?id=${product}`;

}

const PRODUCTS = {

    mug: {
        title: "مج سيراميك مخصص",

        images: [
            "./assets/products/mug/1.jpg",
            "./assets/products/mug/2.jpg",
            "./assets/products/mug/3.jpg",
            "./assets/products/mug/4.jpg"
        ],

        price: "120 EGP",

        description: "مج سيراميك عالي الجودة مع إمكانية الطباعة بصورة أو لوجو أو تصميم خاص."
    },

    stickers: {

        title: "استيكرات مخصصة",

        images: [
            "./assets/products/stickers/1.jpg",
            "./assets/products/stickers/2.jpg",
            "./assets/products/stickers/3.jpg"
        ],

        price: "45 EGP",

        description: "استيكرات مقاومة للمياه مناسبة للابتوب والموبايل والزجاجات."

    },

    tshirt: {
        title: "تيشرت مطبوع",
        images: [
            "./assets/custom_sublimation.jpg"
        ],
        price: "280 EGP",
        description: "تيشرت قطني بطباعة احترافية بأعلى جودة."
    }

};

window.addEventListener("DOMContentLoaded", () => {

    if (!window.location.pathname.includes("product.html")) return;

    const params = new URLSearchParams(window.location.search);

    const productId = params.get("id");

    const product = PRODUCTS[productId];

    if (!product) {
        // لو المنتج مش موجود، نعرض رسالة
        document.getElementById("productTitle").textContent = "المنتج غير موجود";
        document.getElementById("productDescription").textContent = "عذراً، هذا المنتج غير متوفر حالياً.";
        document.getElementById("productPrice").textContent = "---";
        return;
    }

    document.getElementById("productTitle").textContent = product.title;
    document.getElementById("productDescription").textContent = product.description;
    document.getElementById("productPrice").textContent = product.price;

    const mainImage = document.getElementById("productImage");
    mainImage.alt = product.title;

    // إذا كانت الصورة الأولى غير موجودة، استخدم صورة افتراضية
    if (product.images && product.images.length > 0) {
        mainImage.src = product.images[0];
        mainImage.onerror = function() {
            this.src = "./assets/placeholder.jpg";
        };
    } else {
        mainImage.src = "./assets/placeholder.jpg";
    }

    const gallery = document.getElementById("productGallery");
    const prevBtn = document.getElementById("productPrevBtn");
    const nextBtn = document.getElementById("productNextBtn");

    gallery.innerHTML = "";

    let currentIndex = 0;

    function showImage(index) {
        if (!product.images || product.images.length === 0) return;
        currentIndex = (index + product.images.length) % product.images.length;
        mainImage.src = product.images[currentIndex];
        mainImage.onerror = function() {
            this.src = "./assets/placeholder.jpg";
        };

        document.querySelectorAll("#productGallery img").forEach((thumb, i) => {
            thumb.classList.toggle("active", i === currentIndex);
        });
    }

    if (product.images && product.images.length > 0) {
        product.images.forEach((img, index) => {

            const thumb = document.createElement("img");

            thumb.src = img;
            thumb.alt = product.title;
            thumb.onerror = function() {
                this.src = "./assets/placeholder.jpg";
            };
            thumb.onclick = function() {
                showImage(index);
            };

            gallery.appendChild(thumb);

        });
    }

    showImage(0);

    // Hide the arrows if there's only one image
    if (!product.images || product.images.length <= 1) {
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
    } else {
        if (prevBtn) prevBtn.onclick = () => showImage(currentIndex - 1);
        if (nextBtn) nextBtn.onclick = () => showImage(currentIndex + 1);
    }
});
