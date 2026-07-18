const loginPage=document.querySelector(".admin-login");

const dashboard=document.querySelector(".admin-dashboard");

const loginBtn=document.getElementById("loginBtn");

loginBtn.addEventListener("click",()=>{

loginPage.style.display="none";

dashboard.style.display="block";

});
