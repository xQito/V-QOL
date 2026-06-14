(function (CORE) {

const panel = CORE.ui.panel("Auto Potion");
const log = CORE.ui.createLogger(panel.body);

CORE.ui.makeDraggable(panel.el);
document.body.appendChild(panel.el);

log.log("Potion system active");

})(CORE);
