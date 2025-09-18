const objectifs = {pas:15000, eau:2, pompes:50, talon:50, genoux:50, jambe:50};
let data = JSON.parse(localStorage.getItem("fitnessData")) || [];
let records = JSON.parse(localStorage.getItem("fitnessRecords")) || {pas:0, eau:0, exercices:0};

const inputs = {
  poids: document.getElementById("poids"),
  pas: document.getElementById("pas"),
  pompes: document.getElementById("pompes"),
  talon: document.getElementById("talon"),
  genoux: document.getElementById("genoux"),
  jambe: document.getElementById("jambe"),
  calories: document.getElementById("calories"),
  eau: document.getElementById("eau")
};

const submitBtn = document.getElementById("submit");
const smiley = document.getElementById("smiley");
const tbody = document.querySelector("#history tbody");

function calcSmiley(entry){
  let objectifsAtteints = 0;
  if(entry.pas>=objectifs.pas) objectifsAtteints++;
  if(entry.eau>=objectifs.eau) objectifsAtteints++;
  if(entry.pompes>=objectifs.pompes) objectifsAtteints++;
  if(entry.talon>=objectifs.talon) objectifsAtteints++;
  if(entry.genoux>=objectifs.genoux) objectifsAtteints++;
  if(entry.jambe>=objectifs.jambe) objectifsAtteints++;
  if(objectifsAtteints<=2) return "😴";
  if(objectifsAtteints<=4) return "🙂";
  return "😃";
}

function updateRecords(entry){
  records.pas = Math.max(records.pas, entry.pas);
  records.eau = Math.max(records.eau, entry.eau);
  let totalExercices = entry.pompes + entry.talon + entry.genoux + entry.jambe;
  records.exercices = Math.max(records.exercices, totalExercices);
  localStorage.setItem("fitnessRecords", JSON.stringify(records));
  document.getElementById("recordPas").textContent = records.pas;
  document.getElementById("recordEau").textContent = records.eau;
  document.getElementById("recordExercices").textContent = records.exercices;
}

function updateProgress(entry){
  document.getElementById("progressPas").style.width = Math.min(entry.pas/objectifs.pas*100,100) + "%";
  document.getElementById("progressEau").style.width = Math.min(entry.eau/objectifs.eau*100,100) + "%";
  let totalEx = entry.pompes+entry.talon+entry.genoux+entry.jambe;
  document.getElementById("progressExercices").style.width = Math.min(totalEx/(objectifs.pompes*4)*100,100) + "%";
}

function renderHistory(){
  tbody.innerHTML = "";
  data.forEach((entry,index)=>{
    let row = document.createElement("tr");
    let date = new Date(entry.date).toLocaleDateString('fr-FR',{weekday:'long', day:'numeric', month:'short'});
    row.innerHTML = `
      <td>${date}</td>
      <td style="color:${entry.pas>=objectifs.pas?'green':'red'}">${entry.pas}</td>
      <td style="color:${entry.pompes>=objectifs.pompes?'green':'red'}">${entry.pompes}</td>
      <td style="color:${entry.talon>=objectifs.talon?'green':'red'}">${entry.talon}</td>
      <td style="color:${entry.genoux>=objectifs.genoux?'green':'red'}">${entry.genoux}</td>
      <td style="color:${entry.jambe>=objectifs.jambe?'green':'red'}">${entry.jambe}</td>
      <td>${entry.calories}</td>
      <td style="color:${entry.eau>=objectifs.eau?'green':'red'}">${entry.eau}</td>
      <td><button class="btn-clear" onclick="deleteEntry(${index})">Supprimer</button></td>
    `;
    tbody.appendChild(row);
  });
}

function deleteEntry(index){
  data.splice(index,1);
  localStorage.setItem("fitnessData", JSON.stringify(data));
  renderHistory();
  if(data.length>0) updateSmiley(data[data.length-1]);
}

function updateSmiley(entry){
  smiley.textContent = calcSmiley(entry);
}

submitBtn.addEventListener("click",()=>{
  let entry = {};
  for(let key in inputs) entry[key] = Number(inputs[key].value)||0;
  entry.date = new Date();
  data.push(entry);
  localStorage.setItem("fitnessData", JSON.stringify(data));
  renderHistory();
  updateSmiley(entry);
  updateRecords(entry);
  updateProgress(entry);
  for(let key in inputs) inputs[key].value="";
});

// Initialisation
if(data.length>0){
  renderHistory();
  updateSmiley(data[data.length-1]);
  updateRecords(data[data.length-1]);
  updateProgress(data[data.length-1]);
}

// Toggle mode sombre
const toggleTheme = document.querySelector(".btn-toggle-theme");
toggleTheme.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  toggleTheme.textContent = document.body.classList.contains("dark") ? "Mode clair" : "Mode sombre";
});
