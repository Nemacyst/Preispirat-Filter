const STORAGE_KEY = "blockedUsers";

const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const inputEl = document.getElementById("newUser");
const addBtn = document.getElementById("addBtn");

function render(list) {
  listEl.innerHTML = "";
  emptyEl.style.display = list.length === 0 ? "block" : "none";
  list.forEach((user, idx) => {
    const row = document.createElement("div");
    row.className = "user-row";

    const span = document.createElement("span");
    span.textContent = user;

    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.title = "Entfernen";
    btn.addEventListener("click", () => removeUser(idx));

    row.appendChild(span);
    row.appendChild(btn);
    listEl.appendChild(row);
  });
}

function load() {
  chrome.storage.sync.get([STORAGE_KEY], (result) => {
    render(result[STORAGE_KEY] || []);
  });
}

function addUser() {
  const value = inputEl.value.trim();
  if (!value) return;
  chrome.storage.sync.get([STORAGE_KEY], (result) => {
    const list = result[STORAGE_KEY] || [];
    const exists = list.some((u) => u.toLowerCase() === value.toLowerCase());
    if (!exists) {
      list.push(value);
      chrome.storage.sync.set({ [STORAGE_KEY]: list }, load);
    }
    inputEl.value = "";
    inputEl.focus();
  });
}

function removeUser(idx) {
  chrome.storage.sync.get([STORAGE_KEY], (result) => {
    const list = result[STORAGE_KEY] || [];
    list.splice(idx, 1);
    chrome.storage.sync.set({ [STORAGE_KEY]: list }, load);
  });
}

addBtn.addEventListener("click", addUser);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addUser();
});

load();
