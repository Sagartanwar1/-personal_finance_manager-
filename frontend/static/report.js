const BACKEND = "http://localhost:8000";
const genBtn = document.getElementById("gen");
const monthInput = document.getElementById("month");
const reportEl = document.getElementById("report");

genBtn.addEventListener("click", async ()=>{
  const month = monthInput.value; // YYYY-MM
  if(!month){
    reportEl.textContent = "Select a month first.";
    return;
  }
  reportEl.textContent = "Generating...";
  try{
    const res = await fetch(`${BACKEND}/transactions?month=${month}`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const tx = await res.json();
    let income = 0, expense = 0;
    tx.forEach(t=>{
      if(t.type === "income" || t.type === "Income" || t.type === "INCOME") income += Number(t.amount);
      else expense += Number(t.amount);
    });
    reportEl.innerHTML = `<div><strong>Month:</strong> ${month}</div>
      <div><strong>Total Income:</strong> ${income}</div>
      <div><strong>Total Expense:</strong> ${expense}</div>
      <div><strong>Remaining:</strong> ${income - expense}</div>`;
  }catch(e){
    reportEl.textContent = "Error generating report: " + e.message;
  }
});