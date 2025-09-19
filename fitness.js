// stockage des données
let data = JSON.parse(localStorage.getItem("fitnessData")) || [];
let records = JSON.parse(localStorage.getItem("fitnessRecords")) || {};

function saveData() {
  const entry = {
    jour: new Date().toLocaleDateString(),
    poids: +document.getElementById("poids")?.value || 0,
    pas: +document.getElementById("pas")?.value || 0,
    pompes: +document.getElementById("pompes")?.value || 0,
    talons: +document.getElementById("talons")?.value || 0,
    genoux: +document.getElementById("genoux")?.value || 0,
    jambes: +document.getElementById("jambes")?.value || 0,
    calories: +document.getElementById("calories")?.value || 0,
    eau: +document.getElementById("eau")?.value || 0,
    km: +document.getElementById("km")?.value || 0
  };

  const todayIndex = data.findIndex(d=>d.jour===entry.jour);
  if(todayIndex>-1) data[todayIndex] = entry; 
  else data.push(entry);

  localStorage.setItem("fitnessData", JSON.stringify(data));
  updateRecords();
  alert("Données enregistrées ✅");
}

function clearHistory(){
  if(confirm("Supprimer tout l'historique ?")) {
    data=[]; localStorage.setItem("fitnessData", JSON.stringify(data));
    updateRecords();
    location.reload();
  }
}

function updateRecords(){
  let maxPas=0,maxEau=0,maxPompes=0,maxTalons=0,maxGenoux=0,maxJambes=0,totalKm=0;
  data.forEach(d=>{
    if(d.pas>maxPas) maxPas=d.pas;
    if(d.eau>maxEau) maxEau=d.eau;
    if(d.pompes>maxPompes) maxPompes=d.pompes;
    if(d.talons>maxTalons) maxTalons=d.talons;
    if(d.genoux>maxGenoux) maxGenoux=d.genoux;
    if(d.jambes>maxJambes) maxJambes=d.jambes;
    totalKm+=d.km;
  });
  records={maxPas,maxEau,maxPompes,maxTalons,maxGenoux,maxJambes,totalKm};
  localStorage.setItem("fitnessRecords",JSON.stringify(records));

  const recList=document.getElementById("records");
  if(recList){
    recList.innerHTML=`
      <li>Pas maximum : ${records.maxPas}</li>
      <li>Eau maximum : ${records.maxEau} L</li>
      <li>Pompes maximum : ${records.maxPompes}</li>
      <li>Levers de talon maximum : ${records.maxTalons}</li>
      <li>Levers de genoux maximum : ${records.maxGenoux}</li>
      <li>Levers de jambe maximum : ${records.maxJambes}</li>
      <li>Km total : ${records.totalKm}</li>
    `;
  }

  const badgesDiv=document.getElementById("badges");
  if(badgesDiv){
    badgesDiv.innerHTML="";
    data.forEach(d=>{
      if(d.pas>=15000) badgesDiv.innerHTML+="<span class='badge'>🔥 15000 pas atteints !</span>";
      if(d.eau>=2) badgesDiv.innerHTML+="<span class='badge'>💧 Objectif eau atteint !</span>";
    });
  }
}

function navigate(page){ window.location.href=page; }

updateRecords();
