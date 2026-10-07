// ============================================
// Mobile Drawer
// ============================================
function toggleMobileMenu() {
    const drawer = document.getElementById("mobileDrawer");
    if (drawer) drawer.classList.toggle("active");
}

// ============================================
// Hero Image Changer
// ============================================
function changeHeroImage(imgSrc, title, desc, thumbnailElement) {
    const mainImg = document.getElementById("heroImage");
    if (!mainImg) return;

    const overlayTitle = document.querySelector(".image-overlay-info h4");
    const overlayDesc = document.querySelector(".image-overlay-info p");
    const thumbnails = document.querySelectorAll(".hero-thumbnails .thumb");

    thumbnails.forEach(thumb => thumb.classList.remove("active"));
    if (thumbnailElement) thumbnailElement.classList.add("active");

    mainImg.style.opacity = "0.2";
    setTimeout(() => {
        mainImg.src = imgSrc;
        if (overlayTitle) overlayTitle.innerText = title;
        if (overlayDesc) overlayDesc.innerText = desc;
        mainImg.style.opacity = "1";
    }, 250);
}

// ============================================
// Order Modal
// ============================================
function openOrderModal() {
    const modal = document.getElementById("orderModal");
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeOrderModal() {
    const modal = document.getElementById("orderModal");
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
}

// ============================================
// Close modal on backdrop click
// (استخدمنا addEventListener بدل window.onclick
//  عشان نمنع تعارض أي onclick تاني)
// ============================================
document.addEventListener("click", function(event) {
    const modal = document.getElementById("orderModal");
    if (modal && event.target === modal) {
        closeOrderModal();
    }
});

// ============================================
// ESC key closes modal
// ============================================
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        const modal = document.getElementById("orderModal");
        if (modal && modal.classList.contains("active")) {
            closeOrderModal();
        }
    }
});