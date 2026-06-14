(function (CORE) {

const panel = CORE.ui.panel("Auto PvE");
const log = CORE.ui.createLogger(panel.body);

CORE.ui.makeDraggable(panel.el);
document.body.appendChild(panel.el);

log.log("Auto PvE loaded");

setInterval(() => {
    log.log("farming tick...");
}, 3000);

})(CORE);
