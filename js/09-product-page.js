function openProduct(product) {
    window.location.href = `product.html?id=${product}`;
}

const PRODUCTS = {
    mug: {
        title: "مج سيراميك مخصص",
        images: ["./assets/products/mug/1.jpg", "./assets/products/mug/2.jpg", "./assets/products/mug/3.jpg", "./assets/products/mug/4.jpg"],
        price: "120 EGP",
        description: "مج سيراميك عالي الجودة مع إمكانية الطباعة بصورة أو لوجو أو تصميم خاص."
    },
    stickers: {
        title: "استيكرات مخصصة",
        images: ["./assets/products/stickers/1.jpg", "./assets/products/stickers/2.jpg", "./assets/products/stickers/3.jpg"],
        price: "45 EGP",
        description: "استيكرات مقاومة للمياه مناسبة للابتوب والموبايل والزجاجات."
    },
    graduation: {
        title: "استيك تخرج مخصص",
        images: ["./assets/products/graduation/1.jpg", "./assets/products/graduation/2.jpg", "./assets/products/graduation/3.jpg"],
        price: "25 EGP",
        description: "استيكرات تخرج بتصميمك الخاص، جودة طباعة ممتازة وألوان ثابتة."
    }
};

let currentProductId = null;
let currentProduct = null;

window.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("product.html")) return;

    const params = new URLSearchParams(window.location.search);
    currentProductId = params.get("id");
    currentProduct = PRODUCTS[currentProductId];

    const productId = currentProductId;
    const product = currentProduct;

    if (!product) {
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

    if (!product.images || product.images.length <= 1) {
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
    } else {
        if (prevBtn) prevBtn.onclick = () => showImage(currentIndex - 1);
        if (nextBtn) nextBtn.onclick = () => showImage(currentIndex + 1);
    }

    // Interactive Live Customizer Logic
    const previewOverlay = document.getElementById("previewOverlay");
    const previewImage = document.getElementById("previewImage");
    const previewText = document.getElementById("previewText");
    const previewFileInput = document.getElementById("previewFileInput");
    const clearPreviewFileBtn = document.getElementById("clearPreviewFile");
    const previewFileSelectedName = document.getElementById("previewFileSelectedName");
    const previewTextInput = document.getElementById("previewTextInput");
    const previewTextColor = document.getElementById("previewTextColor");
    const previewTextFont = document.getElementById("previewTextFont");
    const previewDesignSize = document.getElementById("previewDesignSize");
    const previewDesignX = document.getElementById("previewDesignX");
    const previewDesignY = document.getElementById("previewDesignY");

    if (previewOverlay && productId) {
        previewOverlay.className = `preview-overlay preview-${productId}`;
    }

    function updateInteractivePreview() {
        if (!previewOverlay) return;
        const xVal = previewDesignX ? previewDesignX.value : 0;
        const yVal = previewDesignY ? previewDesignY.value : 0;
        const sizeVal = previewDesignSize ? previewDesignSize.value : 25;
        const scale = sizeVal / 25;

        if (previewImage && previewImage.style.display !== "none") {
            previewImage.style.transform = `translate(${xVal}px, ${yVal}px) scale(${scale})`;
        }

        if (previewText && previewTextInput) {
            const txt = previewTextInput.value.trim();
            if (txt !== "") {
                previewText.style.display = "block";
                previewText.textContent = txt;
                if (previewTextColor) previewText.style.color = previewTextColor.value;
                if (previewTextFont) previewText.style.fontFamily = previewTextFont.value;
                previewText.style.transform = `translate(${xVal}px, ${yVal}px) scale(${scale})`;
            } else {
                previewText.style.display = "none";
            }
        }
    }

    if (previewFileInput) {
        previewFileInput.addEventListener("change", function() {
            if (this.files && this.files.length > 0) {
                const file = this.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (previewImage) {
                        previewImage.src = e.target.result;
                        previewImage.style.display = "block";
                        updateInteractivePreview();
                    }
                };
                reader.readAsDataURL(file);
                if (previewFileSelectedName) {
                    previewFileSelectedName.textContent = `📁 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                }
                if (clearPreviewFileBtn) {
                    clearPreviewFileBtn.style.display = "inline-flex";
                }
            }
        });
    }

    if (clearPreviewFileBtn) {
        clearPreviewFileBtn.addEventListener("click", function() {
            if (previewFileInput) previewFileInput.value = "";
            if (previewImage) {
                previewImage.src = "";
                previewImage.style.display = "none";
            }
            if (previewFileSelectedName) previewFileSelectedName.textContent = "";
            this.style.display = "none";
            updateInteractivePreview();
        });
    }

    if (previewTextInput) previewTextInput.addEventListener("input", updateInteractivePreview);
    if (previewTextColor) previewTextColor.addEventListener("input", updateInteractivePreview);
    if (previewTextFont) previewTextFont.addEventListener("change", updateInteractivePreview);
    if (previewDesignSize) previewDesignSize.addEventListener("input", updateInteractivePreview);
    if (previewDesignX) previewDesignX.addEventListener("input", updateInteractivePreview);
    if (previewDesignY) previewDesignY.addEventListener("input", updateInteractivePreview);

    updateInteractivePreview();
});

function openOrderModalWithDesign() {
    openOrderModal();

    const selectElem = document.getElementById("custProduct");
    if (selectElem && currentProductId) {
        const productMapping = {
            "mug": "مج سيراميك عادي",
            "stickers": "شيت استيكرات A4",
            "graduation": "استيك تخرج مخصص"
        };
        const mappedVal = productMapping[currentProductId] || (currentProduct && currentProduct.title) || "";
        selectElem.value = mappedVal;
    }

    const customFileInput = document.getElementById("previewFileInput");
    const modalFileInput = document.getElementById("custFile");
    if (customFileInput && modalFileInput && customFileInput.files && customFileInput.files.length > 0) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(customFileInput.files[0]);
        modalFileInput.files = dataTransfer.files;
        modalFileInput.dispatchEvent(new Event("change"));
    }

}
