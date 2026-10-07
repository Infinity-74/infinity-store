function toggleMobileMenu() {
    const drawer = document.getElementById("mobileDrawer");
    drawer.classList.toggle("active");
}

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
