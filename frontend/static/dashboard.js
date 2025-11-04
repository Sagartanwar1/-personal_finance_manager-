// Dashboard page script: charts + sample recent transactions + add transaction (posts to backend if available)
const BACKEND = "http://localhost:8000";

const SAMPLE_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const SAMPLE_INCOME = [1200,1500,1800,2300,2100,2600,3200,3000,3400,3800,3500,4000];
const SAMPLE_EXPENSE = [800,900,950,1100,1200,1000,1500,1300,1600,1500,1400,1600];
const CATEGORY_LABELS = ["Food","Rent","Utilities","Shopping","Transport"];
const CATEGORY_VALUES = [450,1200,300,220,180];
const CATEGORY_COLORS = ["#22c55e","#2f80ed","#f97316","#ef4444","#a78bfa"];

function renderLineChart(){
  const ctx = document.getElementById("lineChart").getContext("2d");
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: SAMPLE_MONTHS,
      datasets: [
        { label: 'Income', data: SAMPLE_INCOME, borderColor: '#2f80ed', backgroundColor: 'rgba(47,128,237,0.08)', fill:true, tension:0.35 },
        { label: 'Expense', data: SAMPLE_EXPENSE, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.04)', fill:true, tension:0.35 }
      ]
    },
    options: {
      plugins: { legend: { display:false }, tooltip: { mode:'index', intersect:false } },
      scales: {
        x: { grid: { display:false }, ticks: { color: '#9aa6b2' } },
        y: { grid: { color: 'rgba(255,255,255,0.02)' }, ticks: { color:'#9aa6b2' } }
      },
      maintainAspectRatio:false
    }
  });
}

function renderDoughnut(){
  const ctx = document.getElementById("doughnutChart").getContext("2d");
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: CATEGORY_LABELS,
      datasets: [{ data: CATEGORY_VALUES, backgroundColor: CATEGORY_COLORS, hoverOffset:6 }]
    },
    options: { plugins: { legend: { display:false } }, maintainAspectRatio:false }
  });
  const legend = document.getElementById("legend");
  legend.innerHTML = CATEGORY_LABELS.map((l,i)=>`<div class="legend-item"><span class="sw" style="background:${CATEGORY_COLORS[i]}"></span>${l}</div>`).join("");
}

const txBody = document.getElementById("tx-body");
const sampleTx = [
  { date:"20 Oct", category:"Salary", amount:"+₹65,000" },
  { date:"17 Oct", category:"Shopping", amount:"-₹4,000" },
  { date:"15 Oct", category:"Groceries", amount:"-₹2,500" },
  { date:"10 Oct", category:"Utility", amount:"-₹1,500" }
];
function populateTx(){
  txBody.innerHTML = sampleTx.map(t=>`<tr><td>${t.date}</td><td style="color:#a78bfa">${t.category}</td><td>${t.amount}</td></tr>`).join("");
}

async function tryPostTransaction(payload){
  try{
    const res = await fetch(`${BACKEND}/transactions`, {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    });
    return res.ok;
  }catch(e){
    return false;
  }
}

document.getElementById("addTx").addEventListener("click", async ()=>{
  const type = document.getElementById("tx-type").value;
  const category = document.getElementById("tx-category").value || "Uncategorized";
  const amount = Number(document.getElementById("tx-amount").value) || 0;
  const payload = { type, category, amount, date: new Date().toISOString().slice(0,10) };
  const ok = await tryPostTransaction(payload);
  const msg = document.getElementById("add-msg");
  if(ok){
    msg.textContent = "Transaction posted to backend.";
    msg.style.color = "#22c55e";
  }else{
    msg.textContent = "Offline: transaction added locally (demo).";
    msg.style.color = "#f59e0b";
    sampleTx.unshift({ date: new Date().toLocaleDateString(), category, amount: (type==="income"?"+":"-") + amount });
    populateTx();
  }
  document.getElementById("tx-category").value = "";
  document.getElementById("tx-amount").value = "";
  document.getElementById("tx-notes") && (document.getElementById("tx-notes").value = "");
});

renderLineChart();
renderDoughnut();
populateTx();