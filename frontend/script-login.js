document.addEventListener("DOMContentLoaded", () => {

  // ---------- LOGIN ----------
 loginForm.addEventListener("submit", e => {
  e.preventDefault();

  const emailValue = document.getElementById("email").value.trim();
  const passwordValue = document.getElementById("password").value.trim();

  if (!emailValue || !passwordValue) {
    alert("Введіть email і пароль");
    return;
  }

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


  // ---------- REGISTER ----------
document.getElementById("registerBtn").addEventListener("click", () => {

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
