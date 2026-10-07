// ============================================
// Brand WhatsApp Number
// ============================================
const BRAND_WHATSAPP_NUMBER = "201556284315";

// ============================================
// Google Apps Script API URL
// ============================================
const API_URL = "https://script.google.com/macros/s/AKfycbwht6HzZSKt3nIfhGU6Cu7rquxuV77FtL3sLbnAoUq-S46xUpjqsy57OSADstgeToWa/exec";

// ============================================
// Pricing Rules
// ============================================
const PRICING = {
    "mug-regular": 120,
    "mug-magic": 170,
    "stickers-pack": 45,
    "sticker-single": 15,
    "hoodie": 450,
    "graduation": 25
};

// ============================================
// Products Catalog
// (كان في 09-product-page.js - اتنقل هنا عشان 05-home.js تقدر تستخدمه)
// ============================================
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
    graduation: {
        title: "استيك تخرج مخصص",
        images: [
            "./assets/products/graduation/1.jpg",
            "./assets/products/graduation/2.jpg",
            "./assets/products/graduation/3.jpg"
        ],
        price: "25 EGP",
        description: "استيكرات تخرج بتصميمك الخاص، جودة طباعة ممتازة وألوان ثابتة."
    }
};