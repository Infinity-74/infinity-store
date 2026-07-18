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
