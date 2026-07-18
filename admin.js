const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwht6HzZSKt3nIfhGU6Cu7rquxuV77FtL3sLbnAoUq-S46xUpjqsy57OSADstgeToWa/exec";

const loginPage = document.querySelector(".admin-login");
const dashboard = document.querySelector(".admin-dashboard");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

loginBtn.addEventListener("click", login);

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("اكتب اسم المستخدم وكلمة المرور");
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = "جاري تسجيل الدخول...";

    fetch(`${WEB_APP_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
        .then(res => res.json())
        .then(data => {

            loginBtn.disabled = false;
            loginBtn.innerHTML = "Login";

            if (data.success) {

                sessionStorage.setItem("adminLogged", "true");

                loginPage.style.display = "none";
                dashboard.style.display = "block";

            } else {

                alert("اسم المستخدم أو كلمة المرور غير صحيحة");

            }

        })
        .catch(err => {

            console.error(err);

            loginBtn.disabled = false;
            loginBtn.innerHTML = "Login";

            alert("حدث خطأ أثناء الاتصال بالسيرفر");

        });

}

function logout() {

    sessionStorage.removeItem("adminLogged");

    dashboard.style.display = "none";
    loginPage.style.display = "flex";

}

window.onload = () => {

    if (sessionStorage.getItem("adminLogged") === "true") {

        loginPage.style.display = "none";
        dashboard.style.display = "block";

    }

};
