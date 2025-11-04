const saveBtn = document.getElementById("save-settings");
const compactEl = document.getElementById("pref-compact");
const currencyEl = document.getElementById("pref-currency");
const msg = document.getElementById("settings-msg");

function loadSettings(){
  const s = JSON.parse(localStorage.getItem("pfm_settings") || "{}");
  compactEl.checked = !!s.compact;
  currencyEl.value = s.currency || "INR";
}
function saveSettings(){
  const s = { compact: compactEl.checked, currency: currencyEl.value };
  localStorage.setItem("pfm_settings", JSON.stringify(s));
  msg.textContent = "Settings saved locally.";
}
saveBtn.addEventListener("click", ()=>{ saveSettings(); });
loadSettings();