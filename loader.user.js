// ==UserScript==
// @name         V-QOL
// @match        https://demonicscans.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(async () => {
'use strict';

const STORE = "VQOL_STATE";

const state = GM_getValue(STORE, {
    enabled: {},
    cache: {}
});

const MANIFEST_URL =
"https://raw.githubusercontent.com/xQito/V-QOL/main/manifest.json";

const CORE = window.VQOL_CORE;

/* ================= LOAD MANIFEST ================= */

const manifest = await fetch(MANIFEST_URL).then(r => r.json());

/* ================= UI DOCK ================= */

GM_addStyle(`
#vqol-dock {
    position:fixed;
    bottom:10px;
    left:10px;
    display:flex;
    flex-direction:column-reverse;
    gap:6px;
    z-index:999999;
}
.vqol-btn {
    width:54px;
    height:54px;
    border-radius:999px;
    background:rgba(0,0,0,.7);
    border:1px solid #333;
    color:white;
    cursor:pointer;
}
`);

const dock = document.createElement("div");
dock.id = "vqol-dock";
document.body.appendChild(dock);

/* ================= SETTINGS WINDOW ================= */

const settings = document.createElement("div");
settings.style = `
position:fixed;
bottom:80px;
left:10px;
width:240px;
background:#111;
color:#fff;
padding:10px;
border-radius:10px;
display:none;
z-index:999999;
`;

document.body.appendChild(settings);

const gear = document.createElement("button");
gear.className = "vqol-btn";
gear.innerHTML = "⚙️";

gear.onclick = () => {
    settings.style.display =
        settings.style.display === "none" ? "block" : "none";
};

dock.appendChild(gear);

/* ================= FORCE UPDATE ================= */

const updateBtn = document.createElement("button");
updateBtn.className = "vqol-btn";
updateBtn.innerHTML = "⟳";

updateBtn.onclick = async () => {
    GM_setValue(STORE, { enabled: {}, cache: {} });
    location.reload();
};

dock.appendChild(updateBtn);

/* ================= MODULE SYSTEM ================= */

function loadModule(mod) {
    if (!state.enabled[mod.id]) return;

    if (state.cache[mod.id]) {
        new Function("CORE", state.cache[mod.id])(CORE);
        return;
    }

    fetch(`https://raw.githubusercontent.com/xQito/V-QOL/main/${mod.file}`)
        .then(r => r.text())
        .then(code => {
            state.cache[mod.id] = code;
            GM_setValue(STORE, state);

            new Function("CORE", code)(CORE);
        });
}

/* ================= SETTINGS UI ================= */

manifest.modules.forEach(m => {

    const row = document.createElement("div");

    const checked = state.enabled[m.id] ? "checked" : "";

    row.innerHTML = `
        <label>
            <input type="checkbox" data-id="${m.id}" ${checked}>
            ${m.icon} ${m.name}
        </label>
    `;

    settings.appendChild(row);
});

settings.onchange = (e) => {
    const id = e.target.dataset.id;
    state.enabled[id] = e.target.checked;
    GM_setValue(STORE, state);
};

/* ================= BOOT MODULES ================= */

manifest.modules.forEach(loadModule);

})();
