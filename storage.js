window.FGT = window.FGT || {};
FGT.storage = FGT.storage || {};
FGT.storage.reloadAll = async function () {
  if (typeof loadEntriesFromCloud === "function") await loadEntriesFromCloud();
  if (typeof loadFinanceFromCloud === "function") await loadFinanceFromCloud();
};
FGT.storage.saveFinanceTransaction = async function () {
  if (typeof financeSaveTransaction === "function") return financeSaveTransaction();
};