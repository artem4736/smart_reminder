document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // MODALS
  // ======================

  const registerModal = document.getElementById("registerModal");
  const forgotModal = document.getElementById("forgotModal");

  function openModal(modal) {
    modal.style.display = "flex";
  }

  function closeModal(modal) {
    modal.style.display = "none";
  }

  document.getElementById("openRegister").addEventListener("click", e => {
    e.preventDefault();
    openModal(registerModal);
  });

  document.getElementById("openForgot").addEventListener("click", e => {
    e.preventDefault();
    openModal(forgotModal);
  });

  document.querySelectorAll(".close").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.close;
      document.getElementById(id).style.display = "none";
    });
  });

  window.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });

  // ======================
  // REGISTER
  // ======================

  const registerBtn = document.getElementById("registerBtn");

  registerBtn.addEventListener("click", () => {

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (!name || !email || !password) {
      alert("Заповніть усі поля");
      return;
    }

    const user = { name, email, password };

    localStorage.setItem("sm_user", JSON.stringify(user));

    alert("Акаунт створено");

    registerModal.style.display = "none";
  });

  // ======================
  // LOGIN
  // ======================

  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const savedUser = JSON.parse(localStorage.getItem("sm_user"));

    if (!savedUser) {
      alert("Користувача не знайдено");
      return;
    }

    if (savedUser.email === email && savedUser.password === password) {
      alert("Успішний вхід");
      window.location.href = "index.html";
    } else {
      alert("Невірний email або пароль");
    }
  });

});
});
