document.addEventListener("DOMContentLoaded", () => {

  // ---------- LOGIN ----------
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async e => {
    e.preventDefault();

    const emailValue = document.getElementById("email").value.trim();
    const passwordValue = document.getElementById("password").value.trim();

    if (!emailValue || !passwordValue) {
      alert("Введіть email і пароль");
      return;
    }

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Помилка входу");
      return;
    }

    localStorage.setItem("sm_user", JSON.stringify(data));
    window.location.href = "index.html";
  });


  // ---------- REGISTER ----------
  document.getElementById("registerBtn").addEventListener("click", async () => {
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (!name || !email || !password) {
      alert("Заповніть усі поля");
      return;
    }

    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Помилка реєстрації");
      return;
    }

    alert("Акаунт створено");
    closeModal("registerModal");
  });


  // ---------- MODALS ----------
  function openModal(id) {
    document.getElementById(id).style.display = "flex";
  }

  function closeModal(id) {
    document.getElementById(id).style.display = "none";
  }

  document.getElementById("openRegister").onclick = e => {
    e.preventDefault();
    openModal("registerModal");
  };

  document.getElementById("openForgot").onclick = e => {
    e.preventDefault();
    openModal("forgotModal");
  };

  document.querySelectorAll(".close").forEach(btn => {
    btn.onclick = () => closeModal(btn.dataset.close);
  });

  window.onclick = e => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  };

});