document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const emailVal = document.getElementById("email").value.trim();
    const passVal = document.getElementById("password").value.trim();

    if (!emailVal || !passVal) {
        alert("Введіть email і пароль");
        return;
    }

    const user = { email: emailVal };
    localStorage.setItem("sm_user", JSON.stringify(user));
    window.location.href = "index.html";
});
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("sm_user");
    window.location.href = "login.html";
});
