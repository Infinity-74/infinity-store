const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwht6HzZSKt3nIfhGU6Cu7rquxuV77FtL3sLbnAoUq-S46xUpjqsy57OSADstgeToWa/exec";

const loginPage = document.querySelector(".admin-login");
const dashboard = document.querySelector(".admin-dashboard");
const SESSION_TIME = 30 * 60 * 1000; // 30 دقيقة
let logoutTimer;

let allOrders = [];

document.getElementById("loginBtn").onclick = () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch(`${WEB_APP_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)

        .then(r => r.json())

       .then(data => {

    if (data.success) {

        localStorage.setItem("adminLogged", "true");

        resetLogoutTimer();

        loginPage.style.display = "none";
        dashboard.style.display = "block";

        loadOrders();

    } else {

        alert("اسم المستخدم أو كلمة المرور غير صحيحة");

    }

});

};


document.getElementById("logoutBtn").onclick = logout;

function logout(){

    localStorage.removeItem("adminLogged");

    clearTimeout(logoutTimer);

    dashboard.style.display = "none";
    loginPage.style.display = "flex";

}

function loadOrders(){

document.getElementById("loadingOrders").style.display="flex";

fetch(`${WEB_APP_URL}?action=orders`)

.then(res=>res.json())

.then(data=>{

if(!data.success) return;

allOrders=data.orders;
sessionStorage.setItem("ordersCache",JSON.stringify(allOrders));    

document.getElementById("ordersCount").innerText=data.total;

drawOrders(allOrders);

document.getElementById("loadingOrders").style.display="none";

})

.catch(()=>{

document.getElementById("loadingOrders").style.display="none";

});

}

function drawOrders(orders) {

    let html = "";

    orders.forEach(order => {

        html += `

<tr>

<td>${order.orderId}</td>

<td>${order.name}</td>

<td>${order.product}</td>

<td>${order.city}</td>

<td>${order.status}</td>

<td>${order.date}</td>

<td>

<button class="view-btn" onclick="viewOrder('${order.orderId}')">

👁️

</button>

</td>

</tr>

`;

    });

    document.getElementById("ordersTable").innerHTML = html;

}


function searchOrders() {

    const value = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = allOrders.filter(order => {

        return (

            order.orderId.toLowerCase().includes(value) ||

            order.name.toLowerCase().includes(value) ||

            order.phone.toLowerCase().includes(value)

        );

    });

    drawOrders(filtered);

}


function viewOrder(orderId){

const order=allOrders.find(o=>o.orderId===orderId);

if(!order) return;

document.getElementById("mOrderId").innerText=order.orderId;
document.getElementById("mName").innerText=order.name;
document.getElementById("mPhone").innerText=order.phone;
document.getElementById("mProduct").innerText=order.product;
document.getElementById("mQty").innerText=order.qty;
document.getElementById("mCity").innerText=order.city;
document.getElementById("mDetails").innerText=order.details;
document.getElementById("mDate").innerText=order.date;
document.getElementById("mStatus").value=order.status;

document.getElementById("orderModal").style.display="flex";

}

function closeModal(){

document.getElementById("orderModal").style.display="none";

}
function resetLogoutTimer(){

    clearTimeout(logoutTimer);

    logoutTimer = setTimeout(() => {

        alert("تم تسجيل الخروج بسبب عدم النشاط");

        logout();

    }, SESSION_TIME);

}

["click","mousemove","keydown","scroll","touchstart"].forEach(event => {

    document.addEventListener(event, () => {

        if(localStorage.getItem("adminLogged")){

            resetLogoutTimer();

        }

    });

});

window.onload = () => {

    if(localStorage.getItem("adminLogged")){

        loginPage.style.display = "none";
        dashboard.style.display = "block";

const cache=sessionStorage.getItem("ordersCache");

if(cache){

allOrders=JSON.parse(cache);

drawOrders(allOrders);

document.getElementById("ordersCount").innerText=allOrders.length;

}
        
        loadOrders();

        resetLogoutTimer();

    }

};
document.getElementById("saveStatusBtn").onclick=()=>{

const id=document.getElementById("mOrderId").innerText;

const status=document.getElementById("mStatus").value;

fetch(`${WEB_APP_URL}?action=updateStatus&orderId=${encodeURIComponent(id)}&status=${encodeURIComponent(status)}`)

.then(r=>r.json())

.then(data=>{

if(data.success){

alert("تم تحديث الحالة");

closeModal();

loadOrders();

}else{

alert("حدث خطأ");

}

});

};
