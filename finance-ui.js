window.FGT = window.FGT || {};
FGT.financeUI = FGT.financeUI || {};
FGT.financeUI.showOptionalDetails = function () {
  const extras = document.getElementById("fin-step-extras");
  if (extras) extras.classList.toggle("guided-open");
};
FGT.financeUI.scrollToAdd = function () { document.getElementById("finance-add")?.scrollIntoView({ behavior: "smooth", block: "start" }); };