let data = JSON.parse(localStorage.getItem('fitnessData')) || [];

function saveData() {
    const today = new Date().toLocaleDateString('fr-FR');
    const poids = parseFloat(document.getElementById('poids').value) || 0;
    const calories = parseInt(document.getElementById('calories').value) || 0;
    const eau = parseFloat(document.getElementById('eau').value) || 0;
    const pas = parseInt(document.getElementById('pas').value) || 0;
    const km = parseFloat(document.getElementById('km').value) || 0;
    const jambes = parseInt(document.getElementById('jambes').value) || 0;
    const genoux = parseInt(document.getElementById('genoux').value) || 0;
    const talons = parseInt(document.getElementById('talons').value) || 0;
    const pompes = parseInt(document.getElementById('pompes').value) || 0;

    let existing = data.find(d => d.jour === today);
    if(existing) {
        Object.assign(existing, {poids, calories, eau, pas, km, jambes, genoux, talons, pompes});
    } else {
        data.push({jour: today, poids, calories, eau, pas, km, jambes, genoux, talons, pompes});
    }

    localStorage.setItem('fitnessData', JSON.stringify(data));
    alert("Données enregistrées !");
    updateHistory();
    updateProgressBars();
    updateBadges();
}

function updateHistory() {
    const tbody = document.querySelector("#historyTable tbody");
    if(!tbody) return;
    tbody.innerHTML = "";
    data.forEach((d, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${d.jour}</td>
            <td>${d.poids}</td>
            <td>${d.calories}</td>
            <td>${d.eau}</td>
            <td>${d.pas}</td>
            <td>${d.km}</td>
            <td>${d.jambes}</td>
            <td>${d.genoux}</td>
            <td>${d.talons}</td>
            <td>${d.pompes}</td>
            <td><button onclick="deleteEntry(${index})">❌</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteEntry(index) {
    data.splice(index,1);
    localStorage.setItem('fitnessData', JSON.stringify(data));
    updateHistory();
}

function clearHistory() {
    if(confirm("Voulez-vous vraiment supprimer tout l'historique ?")) {
        data = [];
        localStorage.setItem('fitnessData', JSON.stringify(data));
        updateHistory();
    }
}

function updateProgressBars() {
    const caloriesInput = parseInt(document.getElementById('calories').value) || 0;
    const eauInput = parseFloat(document.getElementById('eau').value) || 0;

    const caloriesBar = document.getElementById('caloriesBar');
    const eauBar = document.getElementById('eauBar');

    const maxCalories = 2000;
    const maxEau = 2;

    let caloriesPercent = Math.min((caloriesInput / maxCalories) * 100, 100);
    let eauPercent = Math.min((eauInput / maxEau) * 100, 100);

    caloriesBar.style.width = caloriesPercent + '%';
    eauBar.style.width = eauPercent + '%';

    caloriesBar.style.background = caloriesInput > maxCalories ? '#ff4d4d' : '#4caf50';
    eauBar.style.background = eauInput >= maxEau ? '#4caf50' : '#2196F3';

    document.getElementById('caloriesValue').textContent = Math.min(caloriesInput, maxCalories);
    document.getElementById('eauValue').textContent = Math.min(eauInput, maxEau);
}

function updateBadges() {
    const container = document.getElementById('badgesContainer');
    if(!container) return;
    container.innerHTML = "";
    const calories = parseInt(document.getElementById('calories').value) || 0;
    const eau = parseFloat(document.getElementById('eau').value) || 0;
    const pas = parseInt(document.getElementById('pas').value) || 0;
    const km = parseFloat(document.getElementById('km').value) || 0;
    const pompes = parseInt(document.getElementById('pompes').value) || 0;

    if(calories <= 2000) container.innerHTML += '<span class="badge">🍽 Calories OK</span>';
    if(eau >= 2) container.innerHTML += '<span class="badge">💧 Eau OK</span>';
    if(pas >= 15000) container.innerHTML += '<span class="badge">🏃‍♂️ Pas atteints</span>';
    if(km >= 5) container.innerHTML += '<span class="badge">🏃 Course atteinte</span>';
    if(pompes >=50) container.innerHTML += '<span class="badge">💪 Pompes atteintes</span>';
}

function navigate(page) {
    window.location.href = page;
}

document.getElementById('toggleThemeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const dark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', dark);
});

if(localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

updateHistory();
updateProgressBars();
updateBadges();
