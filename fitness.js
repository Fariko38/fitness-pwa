// === SAUVEGARDE DES DONNÉES ===
function saveData() {
  const today = new Date().toLocaleDateString("fr-FR");
  let data = JSON.parse(localStorage.getItem("fitnessData")) || {};

  const entry = {
    poids: document.getElementById("poids")?.value || 0,
    calories: document.getElementById("calories")?.value || 0,
    eau: document.getElementById("eau")?.value || 0,
    pas: document.getElementById("pas")?.value || 0,
    km: document.getElementById("km")?.value || 0,
    jambes: document.getElementById("jambes")?.value || 0,
    genoux: document.getElementById("genoux")?.value || 0,
    talons: document.getElementById("talons")?.value || 0,
    pompes: document.getElementById("pompes")?.value || 0
  };

  data[today] = entry;
  localStorage.setItem("fitnessData", JSON.stringify(data));

  alert("✅ Données enregistrées !");
  updateProgressBars();
  updateBadges();
}

// === CHARGER L'HISTORIQUE ===
function loadHistorique() {
  const historiqueContainer = document.getElementById("historiqueContainer");
  if (!historiqueContainer) return;

  let data = JSON.parse(localStorage.getItem("fitnessData")) || {};
  historiqueContainer.innerHTML = "";

  Object.keys(data).forEach(day => {
    let e = data[day];
    let row = document.createElement("div");
    row.className = "historique-row";
    row.innerHTML = `
      <strong>${day}</strong> | 
      Poids: ${e.poids} kg | 
      Calories: ${e.calories} kcal | 
      Eau: ${e.eau} L | 
      Pas: ${e.pas} | 
      Course: ${e.km} km | 
      Jambes: ${e.jambes} | 
      Genoux: ${e.genoux} | 
      Talons: ${e.talons} | 
      Pompes: ${e.pompes}
      <button onclick="deleteEntry('${day}')">🗑️</button>
    `;
    historiqueContainer.appendChild(row);
  });
}

// === SUPPRIMER UNE ENTRÉE ===
function deleteEntry(day) {
  let data = JSON.parse(localStorage.getItem("fitnessData")) || {};
  delete data[day];
  localStorage.setItem("fitnessData", JSON.stringify(data));
  loadHistorique();
}

// === METTRE À JOUR LES RECORDS ===
function loadRecords() {
  const recordsContainer = document.getElementById("recordsContainer");
  if (!recordsContainer) return;

  let data = JSON.parse(localStorage.getItem("fitnessData")) || {};
  let records = {
    poids: 0, calories: 0, eau: 0, pas: 0, km: 0,
    jambes: 0, genoux: 0, talons: 0, pompes: 0
  };

  Object.values(data).forEach(e => {
    Object.keys(records).forEach(key => {
      if (parseFloat(e[key]) > parseFloat(records[key])) {
        records[key] = e[key];
      }
    });
  });

  recordsContainer.innerHTML = `
    <p>🏋️ Poids max : ${records.poids} kg</p>
    <p>🔥 Calories max : ${records.calories} kcal</p>
    <p>💧 Eau max : ${records.eau} L</p>
    <p>🚶 Pas max : ${records.pas}</p>
    <p>🏃 Course max : ${records.km} km</p>
    <p>🦵 Jambes max : ${records.jambes}</p>
    <p>🦿 Genoux max : ${records.genoux}</p>
    <p>🦶 Talons max : ${records.talons}</p>
    <p>💪 Pompes max : ${records.pompes}</p>
  `;
}

// === BARRES DE PROGRESSION ===
function updateProgressBars() {
  let calories = document.getElementById("calories")?.value || 0;
  let eau = document.getElementById("eau")?.value || 0;

  let caloriesBar = document.getElementById("caloriesBar");
  let eauBar = document.getElementById("eauBar");

  let caloriesValue = document.getElementById("caloriesValue");
  let eauValue = document.getElementById("eauValue");

  if (caloriesBar && caloriesValue) {
    let pourcentageCalories = Math.min((calories / 2000) * 100, 100);
    caloriesBar.style.width = pourcentageCalories + "%";
    caloriesValue.textContent = calories;
  }

  if (eauBar && eauValue) {
    let pourcentageEau = Math.min((eau / 2) * 100, 100);
    eauBar.style.width = pourcentageEau + "%";
    eauValue.textContent = eau;
  }
}

// === BADGES ===
function updateBadges() {
  const badgesContainer = document.getElementById("badgesContainer");
  if (!badgesContainer) return;

  badgesContainer.innerHTML = "";
  let pas = parseInt(document.getElementById("pas")?.value || 0);
  let km = parseInt(document.getElementById("km")?.value || 0);

  if (pas >= 15000) {
    let badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = "🔥 15000 pas atteints !";
    badgesContainer.appendChild(badge);
  }

  if (km >= 10) {
    let badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = "🏃 10 km courus !";
    badgesContainer.appendChild(badge);
  }
}

// === NAVIGATION ===
function navigate(page) {
  window.location.href = page;
}

// === MODE SOMBRE GLOBAL ===
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggleBtn = document.getElementById("toggleThemeBtn");

  // Charger depuis localStorage
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.textContent = "☀️ Désactiver le mode sombre";
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");

      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️ Désactiver le mode sombre";
      } else {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "🌙 Activer le mode sombre";
      }
    });
  }
});
