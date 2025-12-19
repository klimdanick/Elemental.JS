let loadedScripts = [];
let loadedStyles = [];

const root = document.querySelector(':root');
let CINDER_BLACK;
let BLACK_PEARL;
let DEBIAN_RED;
let AQUA_GREEN;
let TURMERIC_YELLOW;
let CURIOS_BLUE;
let EMINENCE_PURPLE;
let STRAWBERRY_MAGENTA;
let level0;
let level1;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function AttachScript(src) {
    if (loadedScripts.includes(src)) return;
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
    script.src = src;
}

function AttachStyle(src) {
    if (loadedStyles.includes(src)) return;
    loadedStyles.push(src);
    var style = document.createElement("link");
    style.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(style);
    style.href = src;
}

const defaultLibURL = ""

const getEjsAsset = (name, libURL = defaultLibURL) => `${defaultLibURL}/assets/${name}.png`;

let OnElementalLoad = () => { };

let body;

AttachScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js");
AttachStyle("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css");
AttachStyle(`${defaultLibURL}/src/Elemental.css`);


window.addEventListener("load", (event) => {
    CINDER_BLACK = getComputedStyle(root).getPropertyValue('--CINDER_BLACK');
    BLACK_PEARL = getComputedStyle(root).getPropertyValue('--BLACK_PEARL');
    DEBIAN_RED = getComputedStyle(root).getPropertyValue('--DEBIAN_RED');
    AQUA_GREEN = getComputedStyle(root).getPropertyValue('--AQUA_GREEN');
    TURMERIC_YELLOW = getComputedStyle(root).getPropertyValue('--TURMERIC_YELLOW');
    CURIOS_BLUE = getComputedStyle(root).getPropertyValue('--CURIOS_BLUE');
    EMINENCE_PURPLE = getComputedStyle(root).getPropertyValue('--EMINENCE_PURPLE');
    STRAWBERRY_MAGENTA = getComputedStyle(root).getPropertyValue('--STRAWBERRY_MAGENTA');
    level0 = getComputedStyle(root).getPropertyValue('--level0');
    level1 = getComputedStyle(root).getPropertyValue('--level1');

    body = new BodyElement();

    OnElementalLoad();
    reloadElemental();
});

const reloadElemental = () => {
    hljs.highlightAll();
}

class Element {
    constructor({ tag = "Element", id = "", classes = [], attributes = {}, listeners = {} }) {
        this.tag = tag;
        this.id = id;
        this.classes = classes;
        this.attributes = attributes;
        this.listeners = listeners;
        this.children = [];
        this.parent = null;
    }

    append(...elements) {
        elements.flat().forEach(el => {
            if (el instanceof Element) {
                el.parent = this;
            }
            this.children.push(el)
        });
        body.render();
        return this;
    }

    remove(...elements) {
        const toRemove = new Set(elements.flat());

        this.children = this.children.filter(child => !toRemove.has(child));

        body.render();
        return this;
    }

    clear() {
        this.children = [];
        body.render();
        return this;
    }

    render() {
        this.html = document.createElement(this.tag);

        this.html.id = this.id;

        // Classes
        if (Array.isArray(this.classes)) {
            this.html.classList.add(...this.classes);
        }

        // Attributes
        for (const [key, value] of Object.entries(this.attributes)) {
            this.html.setAttribute(key, value);
        }

        // Event listeners
        for (const [event, handler] of Object.entries(this.listeners)) {
            this.html.addEventListener(event, handler);
        }

        this.renderChildren();

        return this;
    }

    renderChildren() {
        this.children.flat().forEach(el => {
            if (el instanceof Element) {
                el.render();
                this.html.appendChild(el.html);
            } else if (el instanceof Node) {
                this.html.appendChild(el);
            } else if (typeof el === "string" || typeof el === "number") {
                this.html.appendChild(document.createTextNode(el));
            }
        });

        return this;
    }

    end() {
        return this.parent ?? this;
    }

    root() {
        return this.parent ? this.parent.root() : this;
    }
}

class BodyElement extends Element {
    constructor() {
        super("body");
        this.html = document.body
    }

    render() {
        this.html.innerHTML = "";

        this.renderChildren();
    }
}

class Layout extends Element {

    constructor({ tag = "Layout", id = "", classes = [], attributes = {}, listeners = {} } = {}) {
        super({ tag, id, classes, attributes, listeners });
    }

    /* ---------- Root creators ---------- */

    static container(options = {}) {
        return new Layout({
            ...options,
            classes: ["container", ...(options.classes || [])]
        });
    }

    static row(options = {}) {
        return new Layout({
            ...options,
            classes: ["row", ...(options.classes || [])]
        });
    }

    static column(options = {}) {
        return new Layout({
            ...options,
            classes: ["column", ...(options.classes || [])]
        });
    }

    static grid(options = {}) {
        return new Layout({
            ...options,
            classes: ["grid", ...(options.classes || [])]
        });
    }

    /* ---------- Hybrid nested helpers ---------- */

    container(options = {}, fn) {
        const el = Layout.container(options);
        this.append(el);
        if (fn) fn(el);
        return el;
    }

    row(options = {}, fn) {
        const el = Layout.row(options);
        this.append(el);
        if (fn) fn(el);
        return el;
    }

    column(options = {}, fn) {
        const el = Layout.column(options);
        this.append(el);
        if (fn) fn(el);
        return el;
    }

    grid(options = {}, fn) {
        const el = Layout.grid(options);
        this.append(el);
        if (fn) fn(el);
        return el;
    }
}




