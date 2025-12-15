document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     ДОПОМІЖНІ ФУНКЦІЇ
  ===================== */
  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function openModal(id) {
    document.getElementById(id).style.display = "flex";
  }

  function closeModal(id) {
    document.getElementById(id).style.display = "none";
  }

  /* =====================
     МОДАЛКИ
  ===================== */
  document.getElementById("openRegister").addEventListener("click", e => {
    e.preventDefault();
    openModal("registerModal");
  });

  document.getElementById("openForgot").addEventListener("click", e => {
    e.preventDefault();
    openModal("forgotModal");
  });

  document.querySelectorAll(".close").forEach(btn => {
    btn.addEventListener("click", () => {
      closeModal(btn.dataset.close);
    });
  });

  window.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });

  /* =====================
     ЛОГІН
  ===================== */
  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Невірний email або пароль");
      return;
    }

    localStorage.setItem("sm_user", JSON.stringify(user));
    window.location.href = "index.html";
  });

  /* =====================
     РЕЄСТРАЦІЯ
  ===================== */
  document.getElementById("registerBtn").addEventListener("click", () => {
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (!name || !email || !password) {
      alert("Заповніть усі поля");
      return;
    }

    const users = getUsers();
    if (users.some(u => u.email === email)) {
      alert("Користувач з таким email вже існує");
      return;
    }

    users.push({ name, email, password });
    saveUsers(users);

    alert("Акаунт створено! Тепер увійдіть");
    closeModal("registerModal");
  });

});
