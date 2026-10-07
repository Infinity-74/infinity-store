function adjustQty(amount) {
    const qtyInput = document.getElementById("calcQty");
    let currentVal = parseInt(qtyInput.value) || 1;
    let newVal = currentVal + amount;
    if (newVal >= 1) {
        qtyInput.value = newVal;
        calculatePrice();
    }
}

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
