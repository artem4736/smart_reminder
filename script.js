// ------------------ AUTH ------------------
if (!localStorage.getItem("sm_user")) {
  window.location.href = "login.html";
}

// ------------------ ELEMENTS ------------------
const btnAdd = document.getElementById("addGlobalBtn");
const btnLogoutSidebar = document.getElementById("btnLogoutSidebar");

const btnHome = document.getElementById("btnHome");
const btnCalendar = document.getElementById("btnCalendar");
const btnSettings = document.getElementById("btnSettings");

const screenHome = document.getElementById("screen-home");
const screenCreate = document.getElementById("screen-create-page");
const screenCalendar = document.getElementById("screen-calendar");
const screenSettings = document.getElementById("screen-settings");

const createForm = document.getElementById("createFormPage");
const cancelCreateBtn = document.getElementById("cancelCreateBtn");
const remindersContainer = document.getElementById("remindersContainer");

const filterButtons = document.querySelectorAll(".filter-btn");
let currentFilter = "all"; // default


// ------------------ SCREEN SWITCHING ------------------
function hideAllScreens() {
  document.querySelectorAll(".screen").forEach((s) => s.classList.add("hidden"));
}

function showScreen(screenEl) {
  hideAllScreens();
  screenEl.classList.remove("hidden");
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
}

function showHome() {
  showScreen(screenHome);
  btnHome.classList.add("active");
  renderReminders();
}

function showCreate() {
  showScreen(screenCreate);
}


// ------------------ INIT ------------------
document.addEventListener("DOMContentLoaded", () => {
  showHome();
  renderReminders();

  btnAdd.addEventListener("click", () => {
    createForm.reset();
    showCreate();
  });

  cancelCreateBtn.addEventListener("click", () => {
    showHome();
  });

  btnHome.addEventListener("click", showHome);

  btnCalendar.addEventListener("click", () => {
    showScreen(screenCalendar);
    btnCalendar.classList.add("active");
  });

  btnSettings.addEventListener("click", () => {
    showScreen(screenSettings);
    btnSettings.classList.add("active");
  });

  btnLogoutSidebar.addEventListener("click", () => {
    localStorage.removeItem("sm_user");
    window.location.href = "login.html";
  });

  // --- FILTER BUTTONS ---
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter; // today / week / all
      renderReminders();
    });
  });

  // --- CREATE FORM ---
  createForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("titleInput").value.trim();
    const description = document.getElementById("descriptionInput").value.trim();
    const date = document.getElementById("dateInput").value;
    const time = document.getElementById("timeInput").value;
    const isActive = document.getElementById("isActiveInput").checked;

    if (!title || !date) {
      alert("Вкажіть назву та дату.");
      return;
    }

    const reminders = JSON.parse(localStorage.getItem("sm_reminders") || "[]");

    reminders.push({
      id: Date.now(),
      title,
      description,
      date,
      time,
      isActive,
    });

    localStorage.setItem("sm_reminders", JSON.stringify(reminders));

    showHome();
  });
});


// ------------------ RENDER ------------------
function renderReminders() {
  const reminders = JSON.parse(localStorage.getItem("sm_reminders") || "[]");

  let filtered = [];

  const today = new Date().toISOString().split("T")[0];
  const now = new Date();

  if (currentFilter === "today") {
    filtered = reminders.filter((r) => r.date === today);

  } else if (currentFilter === "week") {
    filtered = reminders.filter((r) => {
      const eventDate = new Date(r.date);
      const diff = (eventDate - now) / (1000 * 60 * 60 * 24); // дні
      return diff >= 0 && diff <= 7;
    });

  } else {
    filtered = reminders; // "all"
  }

  remindersContainer.innerHTML = "";

  if (!filtered.length) {
    remindersContainer.innerHTML = `<p class="muted">Немає нагадувань.</p>`;
    return;
  }

  filtered.forEach((r) => {
    const card = document.createElement("div");
    card.className = "reminder-card";

    card.innerHTML = `
      <div class="card-title">${escapeHtml(r.title)}</div>
      <div class="card-sub">${escapeHtml(r.description || "")}</div>
      <div class="card-meta">${escapeHtml(r.date)}${
      r.time ? " • " + escapeHtml(r.time) : ""
    }</div>
    `;

    remindersContainer.appendChild(card);
  });
}


// ------------------ UTILS ------------------
function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
