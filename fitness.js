function navigate(page) {
  window.location.href = page;
}

function saveData() {
  const entry = {
    date: new Date().toLocaleDateString(),
    poids: document.getElementById("poids").value,
    calories: document.getElementById("calories").value,
    eau: document.getElementById("eau").value,
    pas: document.getElementById("pas").value,
    km: document.getElementById("km").value,
    jambes: document.getElementById("jambes").value,
    genoux: document.getElementById("genoux").value,
    talons: document.getElementById("talons").value,
    pompes: document.getElementById("pompes").value
  };

  let data = JSON.parse(localStorage.getItem("fitnessData")) || [];
  const existingIndex = data.findIndex(e => e.date === entry.date);
  if (existingIndex >= 0) data[existingIndex] = entry;
  else data.push(entry);

  localStorage.setItem("fitnessData", JSON.stringify(data));
  alert("Données enregistrées !");
}

function updateProgressBars() {
  const calories = document.getElementById("calories").value || 0;
  const eau = document.getElementById("eau").value || 0;

  const caloriesPct = Math.min((calories / 2000) * 100, 100);
  const eauPct = Math.min((eau / 2) * 100, 100);

  document.getElementById("caloriesBar").style.width = caloriesPct + "%";
  document.getElementById("eauBar").style.width = eauPct + "%";

  document.getElementById("caloriesValue").textContent = calories;
  document.getElementById("eauValue").textContent = eau;
}

function updateBadges() {
  const pas = document.getElementById("pas").value || 0;
  const badgesContainer = document.getElementById("badgesContainer");
  badgesContainer.innerHTML = "";

  if (pas >= 10000) {
    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = "🔥 10000 pas atteints !";
    badgesContainer.appendChild(badge);
  }
}

// Mode sombre
document.getElementById("toggleThemeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Charger le thème au démarrage
window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
};
