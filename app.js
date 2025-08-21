const form = document.getElementById("peaceForm");
const resultDiv = document.getElementById("result");
const clearBtn = document.getElementById("clearBtn");
const historyUl = document.getElementById("history");

const circle = document.getElementById("circle");
const progressText = document.getElementById("progressText");

let results = JSON.parse(localStorage.getItem("results")) || [];

// Chart.js Pie Chart
let chartCtx = document.getElementById("peaceChart").getContext("2d");
let peaceChart = new Chart(chartCtx, {
  type: "pie",
  data: {
    labels: ["Peaceful", "Neutral", "Stressed"],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ["#4cafef", "#ffd166", "#ef476f"]
    }]
  }
});

function renderHistory() {
  historyUl.innerHTML = "";
  results.forEach(r => {
    let li = document.createElement("li");
    li.innerText = `${r.time} → Score: ${r.peaceScore}/10`;
    historyUl.appendChild(li);
  });
}

function renderChart() {
  let peaceful = results.filter(r => r.peaceScore >= 7).length;
  let neutral = results.filter(r => r.peaceScore >= 4 && r.peaceScore < 7).length;
  let stressed = results.filter(r => r.peaceScore < 4).length;

  peaceChart.data.datasets[0].data = [peaceful, neutral, stressed];
  peaceChart.update();
}

// Form Submission
form.addEventListener("submit", function(e) {
  e.preventDefault();

  let mood = parseInt(document.getElementById("mood").value);
  let stress = parseInt(document.getElementById("stress").value);
  let sleep = parseInt(document.getElementById("sleep").value);

  let peaceScore = (mood + sleep - stress + 10) / 3;
  peaceScore = Math.max(0, Math.min(10, peaceScore));

  let resultText = "";
  if (peaceScore >= 7) {
    resultText = "You are Peaceful 😌";
    circle.style.stroke = "#4cafef";
  } else if (peaceScore >= 4) {
    resultText = "You are Neutral 🙂";
    circle.style.stroke = "#ffd166";
  } else {
    resultText = "You seem Stressed 😟";
    circle.style.stroke = "#ef476f";
  }
  resultDiv.innerText = resultText;

  let percent = (peaceScore / 10) * 100;
  circle.setAttribute("stroke-dasharray", `${percent}, 100`);
  progressText.innerText = peaceScore.toFixed(1) + "/10";

  let entry = {
    mood,
    stress,
    sleep,
    peaceScore: parseFloat(peaceScore.toFixed(2)),
    time: new Date().toLocaleString()
  };

  results.push(entry);
  localStorage.setItem("results", JSON.stringify(results));

  renderHistory();
  renderChart();

  form.reset();
});

// Reset Button
clearBtn.addEventListener("click", function() {
  if (confirm("Clear all data?")) {
    results = [];
    localStorage.removeItem("results");
    renderHistory();
    renderChart();
    resultDiv.innerText = "";
    form.reset();
    circle.setAttribute("stroke-dasharray", "0, 100");
    progressText.innerText = "0/10";
    circle.style.stroke = "#4cafef";
  }
});

// Initial Load
renderHistory();
renderChart();
