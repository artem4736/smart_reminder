// ---- Утиліти ----
function $(id){return document.getElementById(id)}
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  $(id).classList.remove('hidden');
}

// API helper (налаштуй baseUrl під свій бекенд)
const baseUrl = "http://localhost:5000";
async function apiFetch(path, opts = {}){
  const res = await fetch(baseUrl + path, {
    headers: {"Content-Type":"application/json"},
    ...opts
  });
  if(!res.ok){
    const text = await res.text().catch(()=>null);
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  return res.json().catch(()=>null);
}

// ---- Логін / простий «аккаунт» ----
// У цій навчальній версії: при реєстрації / вході ми створюємо користувача через POST /users/register
// і зберігаємо user в localStorage (в реальному проєкті — робити через токени/сесії).
async function onLogin(e){
  e.preventDefault();
  const email = $('email').value.trim();
  const password = $('password').value.trim();
  if(!email || !password){ alert('Введіть email і пароль'); return; }

  try{
    // Для демо: реєстрація/логін одним запитом
    const payload = { name: email.split('@')[0], email };
    const user = await apiFetch('/users/register', { method: 'POST', body: JSON.stringify(payload) });
    localStorage.setItem('sm_user', JSON.stringify(user));
    $('password').value = '';
    loadReminders();
    showScreen('screen-home');
  }catch(err){
    alert('Не вдалося увійти: ' + err.message);
  }
}

// ---- Завантаження нагадувань ----
async function loadReminders(){
  const user = JSON.parse(localStorage.getItem('sm_user')||'null');
  try{
    const items = await apiFetch('/reminders'); // очікується масив reminders з полем user_id
    // фільтруємо по user_id, якщо бекенд повертає всі
    const mine = user ? items.filter(r => r.user_id == user.id) : items;
    renderReminders(mine);
  }catch(err){
    console.error(err);
    document.getElementById('remindersContainer').innerHTML = '<p class="card">Не вдалося завантажити нагадування.</p>';
  }
}

function renderReminders(arr){
  const container = $('remindersContainer');
  if(!arr.length){
    container.innerHTML = '<div class="card">Список порожній. Натисніть «+ Додати нагадування»</div>';
    return;
  }
  container.innerHTML = '';
  arr.forEach(r => {
    const div = document.createElement('div'); div.className = 'reminder';
    const left = document.createElement('div');
    left.innerHTML = `<strong>${r.title}</strong><div class="muted">${r.date} ${r.time} • ${r.priority||''}</div>`;
    const right = document.createElement('div');
    right.innerHTML = `<button class="secondary" onclick="openDetails(${r.id})">Деталі</button>`;
    div.appendChild(left); div.appendChild(right);
    container.appendChild(div);
  });
}

// ---- Створення нагадування ----
async function onCreate(e){
  e.preventDefault();
  const data = {
    title: $('title').value.trim(),
    date: $('date').value,
    time: $('time').value,
    type: $('type').value,
    is_active: $('isActive').checked,
    priority: 'medium'
  };
  if(!data.title || !data.date || !data.time){ alert('Заповніть усі поля'); return; }

  try{
    // Очікується, що бекенд реалізує POST /reminders і повертає створений об'єкт
    await apiFetch('/reminders', { method: 'POST', body: JSON.stringify(data) });
    $('createForm').reset();
    loadReminders();
    showScreen('screen-home');
  }catch(err){
    alert('Помилка збереження: ' + err.message);
  }
}

// ---- Події та ініціалізація ----
function openDetails(id){
  // Можна реалізувати показ детальної сторінки або модального вікна
  alert('Відкрити деталі нагадування id=' + id);
}

document.addEventListener('DOMContentLoaded', () => {
  // форми
  $('loginForm').addEventListener('submit', onLogin);
  $('createForm').addEventListener('submit', onCreate);
  $('newBtn')?.addEventListener && $('newBtn').addEventListener('click', ()=>showScreen('screen-create'));

  // глобальна кнопка додавання
  $('addGlobalBtn').addEventListener('click', ()=>showScreen('screen-create'));
  $('cancelCreate').addEventListener('click', ()=>{ $('createForm').reset(); showScreen('screen-home'); });

  // навігація
  $('btnHome').addEventListener('click', ()=>{ showScreen('screen-home'); loadReminders(); });
  $('btnCalendar').addEventListener('click', ()=>showScreen('screen-calendar'));
  $('btnSettings').addEventListener('click', ()=>showScreen('screen-settings'));
  $('btnLogoutSidebar').addEventListener('click', ()=>{ localStorage.removeItem('sm_user'); showScreen('screen-login'); });

  // profile button
  $('profileBtn').addEventListener('click', ()=>{ alert('Показати меню профілю (Профіль / Вийти)'); });

  // показати login або home в залежності від сесії
  const user = localStorage.getItem('sm_user');
  if(user){ showScreen('screen-home'); loadReminders(); } else { showScreen('screen-login'); }
});

