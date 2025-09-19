// Objectifs
const GOALS = {
  pas: 15000,
  eau: 2000,
  pompes: 50,
  talons: 50,
  genoux: 50,
  jambes: 50
};

function getMood(score) {
  if (score <= 2) return "😴";
  if (score <= 4) return "🙂";
  return "😃";
}

function saveData() {
  const data = {
    date: new Date().toLocaleDateString("fr-FR", { weekday: "long" }),
    poids: document.getElementById("poids").value,
    pas: +document.getElementById("pas").value,
    pompes: +document.getElementById("pompes").value,
    talons: +document.getElementById("talons").value,
    genoux: +document.getElementById("genoux").value,
    jambes: +document.getElementById("jambes").value,
    calories: +document.getElementById("calories").value,
    eau: +document.getElementById("eau").value
  };

  let score = 0;
  if (data.pas >= GOALS.pas) score++;
  if (data.eau >= GOALS.eau) score++;
  if (data.pompes >= GOALS.pompes) score++;
  if (data.talons >= GOALS.talons) score++;
  if (data.genoux >= GOALS.genoux) score++;
  if (data.jambes >= GOALS.jambes) score++;

  data.mood = getMood(score);

  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(data);
  localStorage.setItem("history", JSON.stringify(history));

  updateHistory();
  updateRecords();
}

function deleteEntry(index) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.splice(index, 1);
  localStorage.setItem("history", JSON.stringify(history));
  updateHistory();
  updateRecords();
}

function clearHistory() {
  if (confirm("Voulez-vous vraiment supprimer tout l'historique ?")) {
    localStorage.removeItem("history");
    updateHistory();
    updateRecords();
  }
}

function updateHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = "";

  history.forEach((entry, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.poids}</td>
      <td style="color:${entry.pas >= GOALS.pas ? "green":"red"}">${entry.pas}</td>
      <td style="color:${entry.pompes >= GOALS.pompes ? "green":"red"}">${entry.pompes}</td>
      <td style="color:${entry.talons >= GOALS.talons ? "green":"red"}">${entry.talons}</td>
      <td style="color:${entry.genoux >= GOALS.genoux ? "green":"red"}">${entry.genoux}</td>
      <td style="color:${entry.jambes >= GOALS.jambes ? "green":"red"}">${entry.jambes}</td>
      <td>${entry.calories}</td>
      <td style="color:${entry.eau >= GOALS.eau ? "green":"red"}">${entry.eau}</td>
      <td>${entry.mood}</td>
      <td><button onclick="deleteEntry(${index})">❌</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function updateRecords() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const records = {
    pas: 0,
    pompes: 0,
    talons: 0,
    genoux: 0,
    jambes: 0,
    eau: 0
  };

  history.forEach(entry => {
    records.pas = Math.max(records.pas, entry.pas);
    records.pompes = Math.max(records.pompes, entry.pompes);
    records.talons = Math.max(records.talons, entry.talons);
    records.genoux = Math.max(records.genoux, entry.genoux);
    records.jambes = Math.max(records.jambes, entry.jambes);
    records.eau = Math.max(records.eau, entry.eau);
  });

  const ul = document.getElementById("records");
  ul.innerHTML = `
    <li>Pas max : ${records.pas}</li>
    <li>Pompes max : ${records.pompes}</li>
    <li>Levers de talon max : ${records.talons}</li>
    <li>Levers de genoux max : ${records.genoux}</li>
    <li>Levers de jambe max : ${records.jambes}</li>
    <li>Eau max : ${records.eau} ml</li>
  `;
}

updateHistory();
updateRecords();
