// script.js — робочий варіант з пошуком + календар + Профіль
window.addEventListener("DOMContentLoaded", () => {

  // ------------------ AUTH ------------------
  if (!localStorage.getItem("sm_user")) {
    window.location.href = "login.html";
    return;
  }

  // ------------------ ELEMENTS ------------------
  const btnAdd = document.getElementById("addGlobalBtn");
  const btnAddFromCalendar = document.getElementById("addFromCalendar");
  const btnLogoutSidebar = document.getElementById("btnLogoutSidebar");

  const btnHome = document.getElementById("btnHome");
  const btnCalendar = document.getElementById("btnCalendar");
  const btnSettings = document.getElementById("btnSettings");

  const screenHome = document.getElementById("screen-home");
  const screenCreate = document.getElementById("screen-create-page");
  const screenCalendar = document.getElementById("screen-calendar");
  const screenSettings = document.getElementById("screen-settings");
  const screenProfile = document.getElementById("screen-profile");

  const profileBtn = document.getElementById("profileBtn");

  const createForm = document.getElementById("createFormPage");
  const cancelCreateBtn = document.getElementById("cancelCreateBtn");
  const remindersContainer = document.getElementById("remindersContainer");

  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("searchInput");

  const calendarGrid = document.getElementById("calendarGrid");
  const calendarMonth = document.getElementById("calendarMonth");
  const btnCalPrev = document.getElementById("prevMonth");
  const btnCalNext = document.getElementById("nextMonth");

  const changePasswordBtn = document.getElementById("changePasswordBtn");
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");

// SETTINGS ELEMENTS
const themeLight = document.getElementById("themeLight");
const themeDark = document.getElementById("themeDark");
const langSelect = document.getElementById("languageSelect");
const notifyToggle = document.getElementById("notificationsToggle");
const dateFormatSel = document.getElementById("dateFormatSelect");
const timeFormatSel = document.getElementById("timeFormatSelect");
  // ------------------ STATE ------------------
  let currentFilter = "all";
  let currentSearch = "";
  let selectedCalendarDate = null;
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  // ------------------ HELPERS ------------------
  function hideAllScreens() {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  }

  function showScreen(screenEl) {
    hideAllScreens();
    if (screenEl) screenEl.classList.remove("hidden");
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  }

  function showHome() {
    showScreen(screenHome);
    btnHome.classList.add("active");
    renderReminders();
  }

  function showCreate() {
    showScreen(screenCreate);
  }

  function escapeHtml(t) {
    return String(t || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // ------------------ PROFILE SCREEN ------------------
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      hideAllScreens();
      screenSettings.classList.remove("hidden");
    });
  }

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", () => {
      alert("Функціонал зміни пароля ще не реалізований.");
    });
  }

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", () => {
      if (confirm("Ви впевнені, що хочете видалити акаунт?")) {
        localStorage.removeItem("sm_user");
        localStorage.removeItem("sm_reminders");
        window.location.href = "login.html";
      }
    });
  }

  // ------------------ MODAL EDIT ------------------
  function openEditModal(id) {
    const reminders = JSON.parse(localStorage.getItem("sm_reminders") || "[]");
    const reminder = reminders.find(r => String(r.id) === String(id));
    if (!reminder) return;

    const elName = document.getElementById("edit-name");
    const elDesc = document.getElementById("edit-desc");
    const elDate = document.getElementById("edit-date");
    const elTime = document.getElementById("edit-time");
    const modal = document.getElementById("editModal");

    elName.value = reminder.title || "";
    elDesc.value = reminder.description || "";
    elDate.value = reminder.date || "";
    elTime.value = reminder.time || "";

    document.getElementById("saveEdit").setAttribute("data-id", reminder.id);
    modal.classList.remove("hidden");
  }

  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("editModal").classList.add("hidden");
  });

  document.getElementById("saveEdit").addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    const reminders = JSON.parse(localStorage.getItem("sm_reminders") || "[]");
    const idx = reminders.findIndex(r => String(r.id) === id);
    if (idx === -1) return;

    reminders[idx].title = document.getElementById("edit-name").value;
    reminders[idx].description = document.getElementById("edit-desc").value;
    reminders[idx].date = document.getElementById("edit-date").value;
    reminders[idx].time = document.getElementById("edit-time").value;

    localStorage.setItem("sm_reminders", JSON.stringify(reminders));
    document.getElementById("editModal").classList.add("hidden");
    renderReminders();
  });

  // ------------------ CREATE NEW REMINDER ------------------
  if (createForm) {
    createForm.addEventListener("submit", (e) => {
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
        isActive
      });

      localStorage.setItem("sm_reminders", JSON.stringify(reminders));
      showHome();
    });
  }

  if (cancelCreateBtn) cancelCreateBtn.addEventListener("click", showHome);

  // ------------------ REMINDERS LIST ------------------
  function renderReminders() {
    const reminders = JSON.parse(localStorage.getItem("sm_reminders") || "[]");
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    let filtered = reminders.filter(r => {
      if (!r.date) return false;

      if (currentFilter === "today") return r.date === today;
      if (currentFilter === "week") {
        const diff = (new Date(r.date) - now) / 86400000;
        return diff >= 0 && diff <= 7;
      }

      return true;
    });

    if (currentSearch) {
      filtered = filtered.filter(r =>
        (r.title || "").toLowerCase().includes(currentSearch) ||
        (r.description || "").toLowerCase().includes(currentSearch)
      );
    }

    remindersContainer.innerHTML = "";

    if (!filtered.length) {
      remindersContainer.innerHTML = `<p class="muted">Немає нагадувань.</p>`;
      return;
    }

    filtered.sort((a, b) => a.date.localeCompare(b.date));

    filtered.forEach(r => {
      const card = document.createElement("div");
      card.className = "reminder-card";
      card.innerHTML = `
        <button class="edit-btn" data-id="${r.id}">✏️</button>
        <div class="card-title">${escapeHtml(r.title)}</div>
        <div class="card-sub">${escapeHtml(r.description)}</div>
        <div class="card-meta">${escapeHtml(r.date)}${r.time ? " • " + escapeHtml(r.time) : ""}</div>
      `;
      remindersContainer.appendChild(card);
    });
  }

  remindersContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      openEditModal(e.target.dataset.id);
    }
  });

  // ------------------ CALENDAR ------------------
  function renderCalendar(month, year) {
    calendarGrid.innerHTML = "";
    const monthNames = [
      "Січень","Лютий","Березень","Квітень","Травень","Червень",
      "Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"
    ];

    calendarMonth.innerText = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startIndex = (firstDay === 0 ? 6 : firstDay - 1);

    for (let i = 0; i < startIndex; i++) {
      const empty = document.createElement("div");
      empty.classList.add("empty");
      calendarGrid.appendChild(empty);
    }

    const today = new Date();
    const isThisMonth = today.getMonth() === month && today.getFullYear() === year;

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement("div");
      cell.classList.add("day");
      cell.innerText = d;

      if (isThisMonth && d === today.getDate()) {
        cell.classList.add("today");
      }

      if (selectedCalendarDate &&
          selectedCalendarDate.getFullYear() === year &&
          selectedCalendarDate.getMonth() === month &&
          selectedCalendarDate.getDate() === d) {
        cell.classList.add("active-day");
      }

      cell.addEventListener("click", () => {
        selectedCalendarDate = new Date(year, month, d);

        calendarGrid.querySelectorAll(".day").forEach(el => el.classList.remove("active-day"));
        cell.classList.add("active-day");
      });

      calendarGrid.appendChild(cell);
    }
  }

  btnCalPrev.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  btnCalNext.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  // ------------------ NAVIGATION ------------------
  btnHome.addEventListener("click", showHome);

  btnCalendar.addEventListener("click", () => {
    showScreen(screenCalendar);
    btnCalendar.classList.add("active");
    renderCalendar(currentMonth, currentYear);
  });

  btnSettings.addEventListener("click", () => {
    showScreen(screenSettings);
    btnSettings.classList.add("active");
  });

  if (btnLogoutSidebar) {
    btnLogoutSidebar.addEventListener("click", () => {
      localStorage.removeItem("sm_user");
      window.location.href = "login.html";
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderReminders();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      renderReminders();
    });
  }

  if (btnAdd) btnAdd.addEventListener("click", () => {
    createForm.reset();
    showCreate();
  });

  if (btnAddFromCalendar) btnAddFromCalendar.addEventListener("click", () => {
    createForm.reset();
    showCreate();

    if (selectedCalendarDate) {
      const yyyy = selectedCalendarDate.getFullYear();
      const mm = String(selectedCalendarDate.getMonth() + 1).padStart(2, "0");
      const dd = String(selectedCalendarDate.getDate()).padStart(2, "0");
      document.getElementById("dateInput").value = `${yyyy}-${mm}-${dd}`;
    }
  });

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem("sm_settings") || "{}");

  document.body.dataset.theme = settings.theme || "light";

  langSelect.value = settings.lang || "uk";
  notifyToggle.checked = settings.notify ?? true;
  dateFormatSel.value = settings.dateFormat || "DD/MM/YYYY";
  timeFormatSel.value = settings.timeFormat || "24";

  // кнопки теми
  themeLight.classList.toggle("active", settings.theme === "light");
  themeDark.classList.toggle("active", settings.theme === "dark");
}
function saveSettings() {
  const settings = {
    theme: document.body.dataset.theme,
    lang: langSelect.value,
    notify: notifyToggle.checked,
    dateFormat: dateFormatSel.value,
    timeFormat: timeFormatSel.value
  };
  localStorage.setItem("sm_settings", JSON.stringify(settings));
}

themeLight.addEventListener("click", () => {
  document.body.dataset.theme = "light";
  themeLight.classList.add("active");
  themeDark.classList.remove("active");
  saveSettings();
});

themeDark.addEventListener("click", () => {
  document.body.dataset.theme = "dark";
  themeDark.classList.add("active");
  themeLight.classList.remove("active");
  saveSettings();
});

langSelect.addEventListener("change", saveSettings);
notifyToggle.addEventListener("change", saveSettings);
dateFormatSel.addEventListener("change", saveSettings);
timeFormatSel.addEventListener("change", saveSettings);



  // ------------------ INITIAL LOAD ------------------
  renderReminders();
  renderCalendar(currentMonth, currentYear);
  loadSettings();
  showHome();
});
// ---------- ELEMENTS ----------
const avatarImg = document.getElementById("profileAvatar");
const photoInput = document.getElementById("photoInput");
const uploadBtn = document.getElementById("uploadPhotoBtn");
const deletePhotoBtn = document.getElementById("deletePhotoBtn");

const nameInput = document.getElementById("profileName");
const emailInput = document.getElementById("profileEmail");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");

// ---------- LOAD DATA ----------
const profile = JSON.parse(localStorage.getItem("profile")) || {};

if (profile.photo) avatarImg.src = profile.photo;
if (profile.name) nameInput.value = profile.name;
if (profile.email) emailInput.value = profile.email;

// ---------- UPLOAD PHOTO ----------
uploadBtn.addEventListener("click", () => {
  photoInput.click();
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    avatarImg.src = reader.result;
    profile.photo = reader.result;
    localStorage.setItem("profile", JSON.stringify(profile));
  };
  reader.readAsDataURL(file);
});

// ---------- DELETE PHOTO ----------
deletePhotoBtn.addEventListener("click", () => {
  avatarImg.src = "";
  delete profile.photo;
  localStorage.setItem("profile", JSON.stringify(profile));
});

// ---------- SAVE PROFILE ----------
saveProfileBtn.addEventListener("click", () => {
  profile.name = nameInput.value;
  profile.email = emailInput.value;
  localStorage.setItem("profile", JSON.stringify(profile));
  alert("Зміни збережено");
});

// ---------- DELETE ACCOUNT ----------
deleteAccountBtn.addEventListener("click", () => {
  if (confirm("Ви впевнені? Усі дані буде видалено.")) {
    localStorage.clear();
    window.location.href = "login.html";
  }
});
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.add("hidden");
  });

  document.getElementById(screenId).classList.remove("hidden");
}