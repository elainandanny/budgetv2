window.FGT = window.FGT || {};
FGT.version = "2.0-less-cards";
FGT.ui = FGT.ui || {};
FGT.state = FGT.state || {};
FGT.state.getActiveFinanceStep = function () { return document.body?.dataset?.financeStep || "merchant"; };
FGT.state.setActiveFinanceStep = function (step) { if (document.body) document.body.dataset.financeStep = step; };