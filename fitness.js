// Objectifs
const OBJECTIFS = {
  pas: 15000,
  eau: 2,
  pompes: 50,
  talons: 50,
  genoux: 50,
  jambes: 50,
  km: 5
};

// Données historiques
let history = JSON.parse(localStorage.getItem("history")) || [];

// Enregistrer / Modifier une entrée
function saveData(){
  const poids = parseFloat(document.getElementById("poids").value)||0;
  const pas = parseInt(document.getElementById("pas").value)||0;
  const pompes = parseInt(document.getElementById("pompes").value)||0;
  const talons = parseInt(document.getElementById("talons").value)||0;
  const genoux = parseInt(document.getElementById("genoux").value)||0;
  const jambes = parseInt(document.getElementById("jambes").value)||0;
  const calories = parseInt(document.getElementById("calories").value)||0;
  const eau = parseFloat(document.getElementById("eau").value)||0;
  const km = parseFloat(document.getElementById("km").value)||0;
  const today = new Date().toLocaleDateString("fr-FR");

  let entryIndex = history.findIndex(h=>h.jour===today);
  if(entryIndex>-1){
    history[entryIndex]={poids,pas,pompes,talons,genoux,jambes,calories,eau,km,jour:today};
  } else {
    history.push({poids,pas,pompes,talons,genoux,jambes,calories,eau,km,jour:today});
  }

  localStorage.setItem("history",JSON.stringify(history));
  updateUI();
}

// Supprimer l'historique
function clearHistory(){
  if(confirm("❌ Voulez-vous vraiment supprimer tout l'historique ?")){
    history=[];
    localStorage.setItem("history",JSON.stringify(history));
    updateUI();
  }
}

// Supprimer un jour spécifique
function deleteDay(index){
  history.splice(index,1);
  localStorage.setItem("history",JSON.stringify(history));
  updateUI();
}

// Calcul humeur
function calcMood(entry){
  let score=0;
  if(entry.pas>=OBJECTIFS.pas)score++;
  if(entry.eau>=OBJECTIFS.eau)score++;
  if(entry.pompes>=OBJECTIFS.pompes)score++;
  if(entry.talons>=OBJECTIFS.talons)score++;
  if(entry.genoux>=OBJECTIFS.genoux)score++;
  if(entry.jambes>=OBJECTIFS.jambes)score++;
  if(entry.km>=OBJECTIFS.km)score++;

  if(score<=2) return "😴";
  if(score<=4) return "🙂";
  return "😃";
}

// Mettre à jour UI
function updateUI(){
  const tbody=document.querySelector("#historyTable tbody");
  tbody.innerHTML="";
  history.forEach((h,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${h.jour}</td>
      <td>${h.poids}</td>
      <td>${h.pas}</td>
      <td>${h.pompes}</td>
      <td>${h.talons}</td>
      <td>${h.genoux}</td>
      <td>${h.jambes}</td>
      <td>${h.calories}</td>
      <td>${h.eau}</td>
      <td>${h.km}</td>
      <td>${calcMood(h)}</td>
      <td><button onclick="deleteDay(${i})">❌</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Mise à jour barres de progression
  const today=history[history.length-1];
  if(today){
    setProgress("progressPas", today.pas/OBJECTIFS.pas);
    setProgress("progressEau", today.eau/OBJECTIFS.eau);
    const exercises = today.pompes+today.talons+today.genoux+today.jambes;
    const maxExercises = OBJECTIFS.pompes+OBJECTIFS.talons+OBJECTIFS.genoux+OBJECTIFS.jambes;
    setProgress("progressExercices", exercises/maxExercises);
    setProgress("progressCourse", today.km/OBJECTIFS.km);
  }

  updateRecords();
}

// Barres de progression
function setProgress(id, value){
  const el=document.getElementById(id);
  el.style.width=Math.min(value*100,100)+"%";
  el.style.background=value>=1?"green":"red";
}

// Records et badges
function updateRecords(){
  if(!history.length)return;
  let maxPas=0, maxEau=0, maxPompes=0, maxTalons=0, maxGenoux=0, maxJambes=0, maxKm=0;
  let totalKm=0, totalPas=0;
  history.forEach(h=>{
    if(h.pas>maxPas)maxPas=h.pas;
    if(h.eau>maxEau)maxEau=h.eau;
    if(h.pompes>maxPompes)maxPompes=h.pompes;
    if(h.talons>maxTalons)maxTalons=h.talons;
    if(h.genoux>maxGenoux)maxGenoux=h.genoux;
    if(h.jambes>maxJambes)maxJambes=h.jambes;
    if(h.km>maxKm)maxKm=h.km;
    totalKm+=h.km;
    totalPas+=h.pas;
  });
  const ul=document.getElementById("records");
  ul.innerHTML=`
    <li>Pas max: ${maxPas}</li>
    <li>Eau max: ${maxEau} L</li>
    <li>Pompes max: ${maxPompes}</li>
    <li>Talons max: ${maxTalons}</li>
    <li>Genoux max: ${maxGenoux}</li>
    <li>Jambes max: ${maxJambes}</li>
    <li>Course km max: ${maxKm}</li>
    <li>Course km total: ${totalKm}</li>
    <li>Total pas: ${totalPas}</li>
  `;

  // Badges
  const badgesDiv=document.getElementById("badges");
  badgesDiv.innerHTML="";
  const today=history[history.length-1];
  if(today){
    if(today.pas>=OBJECTIFS.pas)badgesDiv.innerHTML+='<span class="badge">🔥 Objectif pas atteint !</span>';
    if(today.eau>=OBJECTIFS.eau)badgesDiv.innerHTML+='<span class="badge">💧 Objectif eau atteint !</span>';
    const exercises = today.pompes+today.talons+today.genoux+today.jambes;
    const maxExercises = OBJECTIFS.pompes+OBJECTIFS.talons+OBJECTIFS.genoux+OBJECTIFS.jambes;
    if(exercises>=maxExercises)badgesDiv.innerHTML+='<span class="badge">💪 Objectif exercices atteint !</span>';
    if(today.km>=OBJECTIFS.km)badgesDiv.innerHTML+='<span class="badge">🏃 Objectif course atteint !</span>';
  }

  // Dernière mise à jour
  const lastUpdate=document.getElementById("lastUpdate");
  lastUpdate.textContent="Dernière mise à jour : "+(localStorage.getItem("lastUpdate")||"Jamais");
}

// Drag & drop historique
function enableDragDrop(){
  const tbody=document.querySelector("#historyTable tbody");
  let dragSrcEl=null;

  function handleDragStart(e){ dragSrcEl=this; e.dataTransfer.effectAllowed='move'; }
  function handleDragOver(e){ if(e.preventDefault)e.preventDefault(); return false; }
  function handleDrop(e){
    if(dragSrcEl!=this){
      const from=parseInt(dragSrcEl.dataset.index);
      const to=parseInt(this.dataset.index);
      const temp=history[from];
      history[from]=history[to];
      history[to]=temp;
      localStorage.setItem("history",JSON.stringify(history));
      updateUI();
    }
    return false;
  }

  function addDnD(tr,i){
    tr.setAttribute("draggable","true");
    tr.dataset.index=i;
    tr.addEventListener("dragstart",handleDragStart,false);
    tr.addEventListener("dragover",handleDragOver,false);
    tr.addEventListener("drop",handleDrop,false);
  }

  updateUI();
  tbody.querySelectorAll("tr").forEach(addDnD);
}

// Initialisation
updateUI();
enableDragDrop();
