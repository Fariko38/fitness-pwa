// ======== Données et stockage ========
let data = JSON.parse(localStorage.getItem("fitnessData")) || [];
let records = JSON.parse(localStorage.getItem("fitnessRecords")) || {};

function saveData() {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: 'long', day:'numeric', month:'numeric' });
  const entry = {
    day: today,
    poids: parseFloat(document.getElementById("poids").value) || 0,
    pas: parseInt(document.getElementById("pas").value) || 0,
    pompes: parseInt(document.getElementById("pompes").value) || 0,
    talons: parseInt(document.getElementById("talons").value) || 0,
    genoux: parseInt(document.getElementById("genoux").value) || 0,
    jambes: parseInt(document.getElementById("jambes").value) || 0,
    calories: parseInt(document.getElementById("calories").value) || 0,
    eau: parseFloat(document.getElementById("eau").value) || 0,
    km: parseFloat(document.getElementById("km").value) || 0
  };

  // Vérifie si le jour existe déjà
  const index = data.findIndex(d=>d.day===today);
  if(index>=0) data[index]=entry; 
  else data.push(entry);

  localStorage.setItem("fitnessData", JSON.stringify(data));
  updateUI();
  updateRecords();
  alert("✅ Données enregistrées !");
}

// ======== Mood / smiley ========
function getMood(entry){
  const targets = {pas:15000, eau:2, pompes:50, talons:50, genoux:50, jambes:50};
  let count=0;
  for(const key in targets){
    if(entry[key]>=targets[key]) count++;
  }
  if(count<=2) return "😴";
  if(count<=4) return "🙂";
  return "😃";
}

// ======== Mise à jour historique ========
function updateUI(){
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML="";
  data.forEach(d=>{
    const tr = document.createElement("tr");
    tr.innerHTML=`
      <td>${d.day}</td>
      <td>${d.poids}</td>
      <td>${d.pas}</td>
      <td>${d.pompes}</td>
      <td>${d.talons}</td>
      <td>${d.genoux}</td>
      <td>${d.jambes}</td>
      <td>${d.calories}</td>
      <td>${d.eau}</td>
      <td>${d.km}</td>
      <td>${getMood(d)}</td>
      <td><button onclick="deleteDay('${d.day}')">❌</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// ======== Supprimer une journée ========
function deleteDay(day){
  data = data.filter(d=>d.day!==day);
  localStorage.setItem("fitnessData", JSON.stringify(data));
  updateUI();
  updateRecords();
}

// ======== Supprimer tout ========
function clearHistory(){
  if(confirm("Voulez-vous vraiment supprimer tout l'historique ?")){
    data=[];
    localStorage.setItem("fitnessData", JSON.stringify(data));
    updateUI();
    updateRecords();
  }
}

// ======== Records ========
function updateRecords(){
  let maxPas=0, maxEau=0, maxPompes=0, maxTalons=0, maxGenoux=0, maxJambes=0, totalKm=0;
  data.forEach(d=>{
    if(d.pas>maxPas) maxPas=d.pas;
    if(d.eau>maxEau) maxEau=d.eau;
    if(d.pompes>maxPompes) maxPompes=d.pompes;
    if(d.talons>maxTalons) maxTalons=d.talons;
    if(d.genoux>maxGenoux) maxGenoux=d.genoux;
    if(d.jambes>maxJambes) maxJambes=d.jambes;
    totalKm += d.km;
  });
  records={maxPas,maxEau,maxPompes,maxTalons,maxGenoux,maxJambes,totalKm};
  localStorage.setItem("fitnessRecords", JSON.stringify(records));

  const recList=document.getElementById("records");
  recList.innerHTML=`
    <li>Pas maximum : ${records.maxPas}</li>
    <li>Eau maximum : ${records.maxEau} L</li>
    <li>Pompes maximum : ${records.maxPompes}</li>
    <li>Levers de talon maximum : ${records.maxTalons}</li>
    <li>Levers de genoux maximum : ${records.maxGenoux}</li>
    <li>Levers de jambe maximum : ${records.maxJambes}</li>
    <li>Km total : ${records.totalKm}</li>
  `;

  const badgesDiv=document.getElementById("badges");
  badgesDiv.innerHTML="";
  data.forEach(d=>{
    if(d.pas>=15000) badgesDiv.innerHTML+="<span class='badge'>🔥 15000 pas atteints !</span>";
    if(d.eau>=2) badgesDiv.innerHTML+="<span class='badge'>💧 Objectif eau atteint !</span>";
  });

  document.getElementById("lastUpdate").textContent = "Dernière mise à jour : "+new Date().toLocaleString();
}

// ======== Initialisation ========
updateUI();
updateRecords();
