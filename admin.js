const WEB_APP_URL="https://script.google.com/macros/s/AKfycbwht6HzZSKt3nIfhGU6Cu7rquxuV77FtL3sLbnAoUq-S46xUpjqsy57OSADstgeToWa/exec";

const loginPage=document.querySelector(".admin-login");
const dashboard=document.querySelector(".admin-dashboard");

document.getElementById("loginBtn").onclick=()=>{

const username=document.getElementById("username").value;

const password=document.getElementById("password").value;

fetch(`${WEB_APP_URL}?action=login&username=${username}&password=${password}`)

.then(r=>r.json())

.then(data=>{

if(data.success){

loginPage.style.display="none";

dashboard.style.display="block";

}else{

alert("بيانات الدخول غير صحيحة");

}

});

};

document.getElementById("logoutBtn").onclick=()=>{

dashboard.style.display="none";

loginPage.style.display="flex";

};
loadOrders();

function loadOrders(){

fetch(`${WEB_APP_URL}?action=orders`)

.then(res=>res.json())

.then(data=>{

if(!data.success) return;

document.getElementById("ordersCount").innerText=data.total;

let html="";

data.orders.forEach(order=>{

html+=`

<tr>

<td>${order.orderId}</td>

<td>${order.name}</td>

<td>${order.product}</td>

<td>${order.city}</td>

<td>${order.status}</td>

<td>${order.date}</td>

<td>

<button onclick="viewOrder('${order.orderId}')">

👁

</button>

</td>

</tr>

`;

});

document.getElementById("ordersTable").innerHTML=html;

});

}
function viewOrder(orderId){

alert("رقم الطلب : "+orderId);

}
