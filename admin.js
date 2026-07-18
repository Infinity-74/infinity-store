const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwht6HzZSKt3nIfhGU6Cu7rquxuV77FtL3sLbnAoUq-S46xUpjqsy57OSADstgeToWa/exec";

const loginPage = document.querySelector(".admin-login");
const dashboard = document.querySelector(".admin-dashboard");

let allOrders = [];

document.getElementById("loginBtn").onclick = () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch(`${WEB_APP_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)

        .then(r => r.json())

        .then(data => {

            if (data.success) {

                loginPage.style.display = "none";
                dashboard.style.display = "block";

                loadOrders();

            } else {

                alert("اسم المستخدم أو كلمة المرور غير صحيحة");

            }

        });

};


document.getElementById("logoutBtn").onclick = () => {

    dashboard.style.display = "none";
    loginPage.style.display = "flex";

};


function loadOrders() {

    fetch(`${WEB_APP_URL}?action=orders`)

        .then(res => res.json())

        .then(data => {

            if (!data.success) return;

            allOrders = data.orders;

            document.getElementById("ordersCount").innerText = data.total;

            drawOrders(allOrders);

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


function viewOrder(orderId) {

    const order = allOrders.find(o => o.orderId === orderId);

    if (!order) return;

    alert(

`رقم الطلب : ${order.orderId}

العميل : ${order.name}

الهاتف : ${order.phone}

المنتج : ${order.product}

الكمية : ${order.qty}

المحافظة : ${order.city}

العنوان : ${order.details}

الحالة : ${order.status}

التاريخ : ${order.date}`

    );

}
