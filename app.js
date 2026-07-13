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

    // Remove active class from all thumbs, add to current
    thumbnails.forEach(thumb => thumb.classList.remove("active"));
    thumbnailElement.classList.add("active");

    // Fade transition effect
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
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
}

function closeOrderModal() {
    const modal = document.getElementById("orderModal");
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable scrolling
}

// Close modal when clicking outside the card
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
    const productKey = document.getElementById("calcProduct").value;
    const qty = parseInt(document.getElementById("calcQty").value) || 1;
    const printSides = document.getElementById("calcPrintSides").value;
    const discountAlert = document.getElementById("discountAlert");

    // Base price
    let basePrice = PRICING[productKey] || 0;
    
    // Add-on for double-sided printing (applicable to mugs, shirts, etc.)
    let extraCosts = 0;
    if (printSides === "double") {
        extraCosts = 30; // 30 EGP extra per item for double sides
    }

    let itemTotal = basePrice + extraCosts;
    let grandTotal = itemTotal * qty;

    // Bulk discount: 10% off for 10 or more items
    if (qty >= 10) {
        grandTotal = grandTotal * 0.9;
        discountAlert.style.display = "flex";
    } else {
        discountAlert.style.display = "none";
    }

    // Display total
    document.getElementById("totalPriceVal").innerText = Math.round(grandTotal);
}

window.addEventListener("DOMContentLoaded", () => {

    alert(window.location.search);

    if (!window.location.pathname.includes("product.html")) return;

    const params = new URLSearchParams(window.location.search);

    ...
    calculatePrice();
    
    // File upload preview listener
    const fileInput = document.getElementById("custFile");
    const namePreview = document.getElementById("fileNamePreview");
    
    if (fileInput) {
        fileInput.addEventListener("change", function() {
            if (this.files && this.files.length > 0) {
                namePreview.innerText = "📁 " + this.files[0].name;
            } else {
                namePreview.innerText = "لم يتم اختيار ملف";
            }
        });
    }

    // Dynamic Ripple Click Effect for all buttons
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
});

// --- Quick Order from Product Cards ---
function quickOrder(productName) {
    // Select the product in the modal dropdown
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
    
    // Map calculator option to modal product dropdown
    const productMapping = {
        "mug-regular": "مج سيراميك عادي",
        "mug-magic": "مج سحري",
        "stickers-pack": "شيت استيكرات A4",
        "sticker-single": "استيكر فردي داي-كت",
        "tshirt": "تيشرت قطن مطبوع",
        "hoodie": "هودي شتوي مطبوع"
    };

    const modalProductValue = productMapping[productKey] || "";
    
    // Pre-fill fields
    document.getElementById("custProduct").value = modalProductValue;
    document.getElementById("custQty").value = qty;
    
    // Pre-fill notes with calculator options
    const sidesText = printSides === "double" ? "على الوجهين" : "على وجه واحد";
    document.getElementById("custDetails").value = `طلب محدد من حاسبة الأسعار: طباعة ${sidesText} بسعر تقديري إجمالي ${totalPrice} EGP.`;
    
    openOrderModal();
}

// --- Order Submission (WhatsApp API Integration) ---
async function submitOrder(event) {
    event.preventDefault();

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const product = document.getElementById("custProduct").value;
    const qty = document.getElementById("custQty").value;
    const city = document.getElementById("custCity").value;
    const details = document.getElementById("custDetails").value.trim();

    // رقم طلب عشوائي
    const orderId =
        "INF-" +
        Date.now().toString().slice(-6) +
        Math.floor(Math.random() * 90 + 10);

    // البيانات التي سترسل إلى Google Sheets
    const orderData = {
        orderId,
        name,
        phone,
        product,
        qty,
        city,
        details,
        status: "قيد المراجعة"
    };

    try {

        await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(orderData)
});

        // رسالة الواتساب

        const message =
`السلام عليكم 🌹

تم إنشاء طلب جديد من موقع Infinity Store.

🆔 رقم الطلب: ${orderId}

👤 الاسم: ${name}

📱 الهاتف: ${phone}

📦 المنتج: ${product}

🔢 الكمية: ${qty}

📍 المحافظة: ${city}

📝 التفاصيل:
${details || "لا يوجد"}

يرجى تأكيد الطلب.`;

        window.open(
            `https://wa.me/${BRAND_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            "_blank"
        );

        alert(
`✅ تم إنشاء طلبك بنجاح

رقم طلبك هو:

${orderId}

احتفظ به لتتبع الطلب لاحقاً.`
        );

        document.getElementById("orderForm").reset();

        document.getElementById("fileNamePreview").innerText =
            "لم يتم اختيار ملف";

        closeOrderModal();

    } catch (err) {

            alert(err.message);


        console.error(err);

    }
}
    
// --- Scroll Reveal Animation Observer ---
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Stop observing after it has been revealed once for smoother performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes into view
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
        alert("من فضلك أدخل رقم الطلب");
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

        alert("حدث خطأ أثناء البحث.");

    }

}

function openProduct(product) {

    window.location.href = `product.html?id=${product}`;

}

const PRODUCTS = {

    mug: {
        title: "مج سيراميك مخصص",
        image: "./assets/custom_mugs.jpg",
        price: "120 EGP",
        description: "مج سيراميك عالي الجودة مع إمكانية الطباعة بصورة أو لوجو أو تصميم خاص."
    },

    stickers: {
        title: "استيكرات مخصصة",
        image: "./assets/custom_stickers.jpg",
        price: "45 EGP",
        description: "استيكرات مقاومة للمياه مناسبة للابتوب والموبايل والزجاجات."
    },

    tshirt: {
        title: "تيشرت مطبوع",
        image: "./assets/custom_sublimation.jpg",
        price: "280 EGP",
        description: "تيشرت قطني بطباعة احترافية بأعلى جودة."
    }

};

window.addEventListener("DOMContentLoaded", () => {

    if (!window.location.pathname.includes("product.html")) return;

    const params = new URLSearchParams(window.location.search);

    const productId = params.get("id");

    const product = PRODUCTS[productId];

    if (!product) return;

    document.getElementById("productTitle").textContent = product.title;

    document.getElementById("productDescription").textContent = product.description;

    document.getElementById("productPrice").textContent = product.price;

    document.getElementById("productImage").src = product.image;

    document.getElementById("productImage").alt = product.title;

});

