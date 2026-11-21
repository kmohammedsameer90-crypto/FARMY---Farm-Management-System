
let animals = JSON.parse(localStorage.getItem("animals")) || [];
let vaccines = JSON.parse(localStorage.getItem("vaccines")) || [];
let visitors = JSON.parse(localStorage.getItem("visitors")) || [];

function saveData() {
    localStorage.setItem("animals", JSON.stringify(animals));
    localStorage.setItem("vaccines", JSON.stringify(vaccines));
    localStorage.setItem("visitors", JSON.stringify(visitors));
}

function showSection(id) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");

    if (id === "reports") showReports();
}

function addAnimal() {
    const name = document.getElementById("animalName").value.trim();
    const type = document.getElementById("animalType").value.trim();
    const health = document.getElementById("animalHealth").value;

    if (!name || !type) {
        alert("Enter animal name and type");
        return;
    }

    animals.push({id: Date.now(), name, type, health});
    saveData();
    renderAnimals();
    updateDashboard();

    document.getElementById("animalName").value = "";
    document.getElementById("animalType").value = "";
}

function renderAnimals() {
    document.getElementById("animalList").innerHTML =
        animals.map(a => `
        <div class="item">
            <b>${escapeHTML(a.name)}</b> |
            ${escapeHTML(a.type)} |
            ${escapeHTML(a.health)}
            <button onclick="deleteAnimal(${a.id})">Delete</button>
        </div>`).join("");
}

function deleteAnimal(id) {
    animals = animals.filter(a => a.id !== id);
    saveData();
    renderAnimals();
    updateDashboard();
}

function addVaccine() {
    const animal = document.getElementById("vaccineAnimal").value.trim();
    const name = document.getElementById("vaccineName").value.trim();
    const date = document.getElementById("vaccineDate").value;

    if (!animal || !name || !date) {
        alert("Enter all vaccination details");
        return;
    }

    vaccines.push({animal, name, date, status: "Pending"});
    saveData();
    renderVaccines();
}

function renderVaccines() {
    document.getElementById("vaccineList").innerHTML =
        vaccines.map((v, i) => `
        <div class="item">
            Animal: ${escapeHTML(v.animal)} |
            ${escapeHTML(v.name)} |
            ${escapeHTML(v.date)} |
            ${v.status}
            <button onclick="completeVaccine(${i})">Completed</button>
            <button onclick="deleteVaccine(${i})">Delete</button>
        </div>`).join("");
}

function completeVaccine(i) {
    vaccines[i].status = "Completed";
    saveData();
    renderVaccines();
}

function deleteVaccine(i) {
    vaccines.splice(i, 1);
    saveData();
    renderVaccines();
}

function addVisitor() {
    const name = document.getElementById("visitorName").value.trim();
    const purpose = document.getElementById("visitorPurpose").value.trim();

    if (!name || !purpose) {
        alert("Enter visitor details");
        return;
    }

    visitors.push({
        name,
        purpose,
        date: new Date().toLocaleString()
    });

    saveData();
    renderVisitors();
}

function renderVisitors() {
    document.getElementById("visitorList").innerHTML =
        visitors.map(v => `
        <div class="item">
            ${escapeHTML(v.name)} |
            ${escapeHTML(v.purpose)} |
            ${escapeHTML(v.date)}
        </div>`).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

let chart;

function updateDashboard() {
    const counts = ["Normal", "Sick", "Isolated", "Dead"].map(
        status => animals.filter(a => a.health === status).length
    );

    document.getElementById("total").textContent = animals.length;
    document.getElementById("normal").textContent = counts[0];
    document.getElementById("sick").textContent = counts[1];
    document.getElementById("isolated").textContent = counts[2];
    document.getElementById("dead").textContent = counts[3];

    if (chart) {
        chart.data.datasets[0].data = counts;
        chart.update();
    } else {
        chart = new Chart(document.getElementById("healthChart"), {
            type: "doughnut",
            data: {
                labels: ["Normal", "Sick", "Isolated", "Dead"],
                datasets: [{data: counts}]
            }
        });
    }
}

function showReports() {
    document.getElementById("reportData").innerHTML = `
        <div class="item">
            <h3>Total Animals: ${animals.length}</h3>
            <p>Total Vaccinations: ${vaccines.length}</p>
            <p>Completed Vaccinations:
            ${vaccines.filter(v => v.status === "Completed").length}</p>
            <p>Total Visitors: ${visitors.length}</p>
        </div>`;
}

function printReport() {
    showReports();
    window.print();
}

renderAnimals();
renderVaccines();
renderVisitors();
updateDashboard();
