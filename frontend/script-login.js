document.addEventListener("DOMContentLoaded", () => {

  // ---------- LOGIN ----------
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();

      const emailValue = document.getElementById("email").value.trim();
      const passwordValue = document.getElementById("password").value.trim();

      const savedUser = JSON.parse(localStorage.getItem("sm_user"));

      if (!savedUser) {
        alert("Користувача не знайдено");
        return;
      }

      if (
        savedUser.email === emailValue &&
        savedUser.password === passwordValue
      ) {
        alert("Успішний вхід");
        window.location.href = "index.html";
      } else {
        alert("Невірний email або пароль");
      }
    });
  }

  // ---------- REGISTER ----------
  const registerBtn = document.getElementById("registerBtn");

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {

      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value.trim();

      if (!name || !email || !password) {
        alert("Заповніть усі поля");
        return;
      }

      const user = {
        name,
        email,
        password
      };

      localStorage.setItem("sm_user", JSON.stringify(user));

      alert("Акаунт створено");
    });
  }

});

});
