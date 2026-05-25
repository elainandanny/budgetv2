window.FGT = window.FGT || {};
FGT.ui = FGT.ui || {};

FGT.ui.safeText = function (value) { return String(value || "").trim(); };
FGT.ui.money = function (value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? "$" + n.toFixed(2) : "";
};
FGT.ui.getFinanceStepStatus = function () {
  const merchant = FGT.ui.safeText(document.getElementById("fin-store")?.value);
  const amount = FGT.ui.money(document.getElementById("fin-total")?.value);
  const catSelect = document.getElementById("fin-cat-quick");
  const category = catSelect?.selectedOptions?.[0]?.textContent || catSelect?.value || "";
  return { merchant, amount, category, hasMerchant: Boolean(merchant), hasAmount: Boolean(amount), hasCategory: Boolean(category && catSelect?.value) };
};
FGT.ui.currentFinanceStep = function () {
  const s = FGT.ui.getFinanceStepStatus();
  if (!s.hasMerchant) return "merchant";
  if (!s.hasAmount) return "amount";
  if (!s.hasCategory) return "category";
  return "review";
};
FGT.ui.setSummary = function (name, text) {
  const target = name === "merchant" ? document.getElementById("finance-expense-form")?.querySelector(".form-row") : name === "amount" ? document.getElementById("fin-step-amount") : name === "category" ? document.getElementById("fin-step-category") : null;
  if (!target) return;
  let el = document.getElementById("flow-summary-" + name);
  if (!el) { el = document.createElement("div"); el.id = "flow-summary-" + name; el.className = "flow-summary-line"; target.prepend(el); }
  el.textContent = text;
};
FGT.ui.updateStickySave = function (status) {
  const addPanel = document.getElementById("finance-add");
  if (!addPanel) return;
  let bar = document.getElementById("guided-save-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "guided-save-bar";
    bar.className = "guided-save-bar";
    bar.innerHTML = '<div><div class="guided-save-label">Transaction</div><div class="guided-save-summary" id="guided-save-summary">Enter details</div></div><button class="save-btn guided-save-btn" type="button" onclick="financeSaveTransaction()">Save</button>';
    addPanel.appendChild(bar);
  }
  const summary = [status.merchant, status.amount, status.category].filter(Boolean).join(" · ");
  const summaryEl = document.getElementById("guided-save-summary");
  if (summaryEl) summaryEl.textContent = summary || "Enter details";
  const btn = bar.querySelector(".guided-save-btn");
  if (btn) btn.disabled = !(status.hasMerchant && status.hasAmount && status.hasCategory);
};
FGT.ui.updateFinanceFlow = function () {
  const addPanel = document.getElementById("finance-add");
  if (!addPanel) return;
  addPanel.classList.add("guided-add-panel");
  const status = FGT.ui.getFinanceStepStatus();
  const step = FGT.ui.currentFinanceStep();
  if (FGT.state?.setActiveFinanceStep) FGT.state.setActiveFinanceStep(step);
  const wrappers = {
    merchant: document.getElementById("finance-expense-form")?.querySelector(".form-row"),
    amount: document.getElementById("fin-step-amount"),
    category: document.getElementById("fin-step-category"),
    extras: document.getElementById("fin-step-extras"),
    save: document.getElementById("fin-step-save")
  };
  Object.entries(wrappers).forEach(([name, el]) => {
    if (!el) return;
    el.classList.add("flow-block");
    el.classList.toggle("flow-active", name === step || (name === "save" && step === "review"));
    el.classList.toggle("flow-complete", (name === "merchant" && status.hasMerchant) || (name === "amount" && status.hasAmount) || (name === "category" && status.hasCategory));
  });
  FGT.ui.setSummary("merchant", status.merchant ? "Merchant · " + status.merchant : "1. Merchant");
  FGT.ui.setSummary("amount", status.amount ? "Amount · " + status.amount : "2. Amount");
  FGT.ui.setSummary("category", status.category ? "Category · " + status.category : "3. Category");
  FGT.ui.updateStickySave(status);
};
FGT.ui.attachFinanceFlowListeners = function () {
  ["fin-store", "fin-total", "fin-cat-quick", "fin-payment", "fin-notes", "fin-subcat"].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.dataset.guidedListener) {
      el.dataset.guidedListener = "true";
      el.addEventListener("input", FGT.ui.updateFinanceFlow);
      el.addEventListener("change", FGT.ui.updateFinanceFlow);
    }
  });
};
FGT.ui.enhanceFinanceAdd = function () { FGT.ui.attachFinanceFlowListeners(); FGT.ui.updateFinanceFlow(); };
document.addEventListener("DOMContentLoaded", () => {
  const run = () => {
    FGT.ui.enhanceFinanceAdd();
    const oldFinanceSwitch = window.financeSwitch;
    if (typeof oldFinanceSwitch === "function" && !oldFinanceSwitch.__guidedPatched) {
      window.financeSwitch = function () { const r = oldFinanceSwitch.apply(this, arguments); setTimeout(FGT.ui.enhanceFinanceAdd, 0); return r; };
      window.financeSwitch.__guidedPatched = true;
    }
    const oldSwitchTab = window.switchTab;
    if (typeof oldSwitchTab === "function" && !oldSwitchTab.__guidedPatched) {
      window.switchTab = function () { const r = oldSwitchTab.apply(this, arguments); setTimeout(FGT.ui.enhanceFinanceAdd, 0); return r; };
      window.switchTab.__guidedPatched = true;
    }
  };
  setTimeout(run, 0);
  setTimeout(run, 750);
});