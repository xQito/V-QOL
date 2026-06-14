window.VQOL_CORE = (() => {

const CORE = {};

/* ================= API ================= */

CORE.api = {
    async request(path, method = "GET", params) {
        const url = new URL(path, "https://demonicscans.org/");

        if (method === "GET" && params) {
            url.search = new URLSearchParams(params);
        }

        const res = await fetch(url, {
            method,
            body: method !== "GET" && params ? new URLSearchParams(params) : undefined,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const txt = await res.text();
        try { return JSON.parse(txt); }
        catch { return txt; }
    },

    get(p, q) { return this.request(p, "GET", q); },
    post(p, q) { return this.request(p, "POST", q); }
};

/* ================= STORAGE ================= */

CORE.storage = {
    get(k, d) {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : d;
    },
    set(k, v) {
        localStorage.setItem(k, JSON.stringify(v));
    }
};

/* ================= EVENTS ================= */

CORE.events = (() => {
    const map = {};
    return {
        on(e, fn) { (map[e] ||= []).push(fn); },
        emit(e, d) { (map[e] || []).forEach(f => f(d)); }
    };
})();

/* ================= DRAG ================= */

CORE.ui = {};

CORE.ui.makeDraggable = (el, handle = el) => {
    let drag = false, sx, sy, sl, st;

    handle.style.cursor = "move";

    handle.onmousedown = e => {
        drag = true;
        const r = el.getBoundingClientRect();
        sx = e.clientX;
        sy = e.clientY;
        sl = r.left;
        st = r.top;

        el.style.position = "fixed";
        el.style.left = sl + "px";
        el.style.top = st + "px";

        document.body.style.userSelect = "none";
    };

    document.onmousemove = e => {
        if (!drag) return;
        el.style.left = sl + (e.clientX - sx) + "px";
        el.style.top = st + (e.clientY - sy) + "px";
    };

    document.onmouseup = () => {
        drag = false;
        document.body.style.userSelect = "";
    };
};

/* ================= PANEL ================= */

CORE.ui.panel = (title) => {
    const el = document.createElement("div");
    el.style = `
        width:260px;
        background:rgba(0,0,0,.75);
        color:#fff;
        border-radius:10px;
        padding:10px;
        border:1px solid #333;
        font-family:Arial;
    `;

    el.innerHTML = `<b>${title}</b><div class="body"></div>`;

    return {
        el,
        body: el.querySelector(".body")
    };
};

/* ================= LOGGER ================= */

CORE.ui.createLogger = (container) => {
    const box = document.createElement("div");
    box.style = "font-size:12px;max-height:120px;overflow:auto;margin-top:6px;";

    container.appendChild(box);

    return {
        log(msg) {
            const el = document.createElement("div");
            el.textContent = msg;
            box.appendChild(el);
        }
    };
};

return CORE;

})();
