const BACKEND = "http://localhost:8000";
const txList = document.getElementById("tx-list");
const txMsg = document.getElementById("tx-msg");

async function loadTransactions(){
  try{
    txMsg.textContent = "Loading...";
    const res = await fetch(`${BACKEND}/transactions`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const tx = await res.json();
    if(!tx || tx.length === 0){
      txList.innerHTML = "<tr><td colspan='5'>No transactions found.</td></tr>";
    }else{
      txList.innerHTML = tx.map(r=>`<tr><td>${r.id}</td><td>${r.type}</td><td>${r.category}</td><td style="text-align:right">${r.amount}</td><td>${r.date}</td></tr>`).join("");
    }
    txMsg.textContent = "";
  }catch(e){
    txMsg.textContent = "Error loading transactions: " + e.message;
    txList.innerHTML = "";
  }
}

loadTransactions();