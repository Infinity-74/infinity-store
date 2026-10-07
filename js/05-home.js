document.addEventListener("DOMContentLoaded", () => {
    calculatePrice();

    document.querySelectorAll('button, .btn, a, .clickable, .thumb, .portfolio-item, .product-card, .feature-card, .payment-card, .testimonial-card, .step, .img-nav-btn').forEach(el => {
        el.addEventListener('click', playClickSound);
    });
    
    document.querySelectorAll('.qty-selector button').forEach(el => {
        el.addEventListener('click', playClickSound);
    });

    const fileInput = document.getElementById("custFile");
    const namePreview = document.getElementById("fileNamePreview");

    if (fileInput) {
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

    document.querySelectorAll(".product-img-holder[data-product]").forEach(holder => {
        const key = holder.dataset.product;
        const images = PRODUCTS[key] && PRODUCTS[key].images;
        if (!images || images.length === 0) return;

        holder.dataset.index = 0;
        const img = holder.querySelector(".product-slide-img");
        if (img) img.src = images[0];

        if (images.length <= 1) {
            holder.querySelectorAll(".img-nav-btn").forEach(btn => btn.style.display = "none");
        }
    });
});

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

function orderFromCalculator() {
    const productKey = document.getElementById("calcProduct").value;
    const qty = document.getElementById("calcQty").value;

    const productMapping = {
        "mug-regular": "مج سيراميك عادي",
        "mug-magic": "مج سحري",
        "stickers-pack": "شيت استيكرات A4",
        "sticker-single": "استيكر فردي داي-كت",
        "hoodie": "هودي شتوي مطبوع",
        "graduation": "استيك تخرج"
    };

    const modalProductValue = productMapping[productKey] || "";

    document.getElementById("custProduct").value = modalProductValue;
    document.getElementById("custQty").value = qty;

    openOrderModal();
}
