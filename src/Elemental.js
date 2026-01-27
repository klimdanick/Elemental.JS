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

const stringToHTML = string => new DOMParser().parseFromString(string, 'text/html').body.firstChild

const sleep = ms => new Promise(r => setTimeout(r, ms));

function AttachScript(src) {
    if (loadedScripts.includes(src)) return;
    loadedScripts.push(src);
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

const defaultLibURL = "http://127.0.0.1:8080/"

const getEjsAsset = (name, libURL = defaultLibURL) => `${defaultLibURL}/assets/${name}.png`;

let OnElementalLoad = () => { };
const reloadElemental = () => { console.log("reload!"); };

let body;

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


function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) setTheme(savedTheme);

function toggleTheme() {
    const current = root.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark");
}

function loadAddon(addon) {
    AttachScript(addon);
}

loadAddon(`${defaultLibURL}/src/addons/forms.js`)
loadAddon(`${defaultLibURL}/src/addons/layouts.js`)
loadAddon(`${defaultLibURL}/src/addons/menus.js`)
loadAddon(`${defaultLibURL}/src/addons/feedback.js`)
loadAddon(`${defaultLibURL}/src/addons/data.js`)

class Addon {
    constructor({ jsFiles = [], cssFiles = [], htmlFiles = [] }) {
        this.jsFiles = jsFiles;
        this.cssFiles = cssFiles;
        this.htmlFiles = htmlFiles;
        this.register();
    }

    register() {
        this.jsFiles.forEach(file => {
            AttachScript(file);
        })

        this.cssFiles.forEach(file => {
            AttachStyle(file);
        })
    }
}

const CoreAddon = new Addon({
    cssFiles: [`${defaultLibURL}/src/Elemental.css`]
})

class Element {
    constructor({ tag = "Element", id = "", classes = [], attributes = {}, listeners = {} }) {
        this.tag = tag;
        this.id = id;
        this.classes = classes;
        this.attributes = attributes;
        this.listeners = listeners;
        this.children = [];
        this.parent = null;
        this.level = 0;
        this.useLevelSystem = true;
        this.attached = false;

        this.html = document.createElement(this.tag);
    }

    append(...elements) {
        elements.flat().forEach(el => {
            if (el instanceof Element) {
                el.parent = this;
            }
            this.children.push(el)
        });
        return this;
    }

    remove(...elements) {
        const toRemove = new Set(elements.flat());

        this.children = this.children.filter(child => !toRemove.has(child));
        return this;
    }

    clear() {
        this.children = [];
        return this;
    }

    render() {

        while (this.html?.firstChild) {
            this.html.removeChild(this.html.lastChild);
        }

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
        for (let [event, handler] of Object.entries(this.listeners)) {
            this.html.addEventListener(event, handler);
        }

        if (!this.attached) {
            this.parent?.html.appendChild(this.html);
            this.attached = true;
        }

        if (this.useLevelSystem == true) {
            let cssLevel = getComputedStyle(this.html).getPropertyValue('--level');
            let inc = 0;
            if (!cssLevel) inc = 1;
            if (cssLevel == "increment") inc = 1;
            if (cssLevel == "decrement") inc = -1;
            this.level = this.parent?.level + (inc) || 0;

            if (this.level > 10) this.level = 0;

            if (cssLevel != "null")
                this.html.classList.add(`level${this.level}`);

        }

        this.renderChildren();

        return this;
    }

    renderChildren() {
        this.children.flat().forEach(el => {
            if (el instanceof Element) {
                el.attached = false;
                el.render();
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
        this.level = -1;
    }

    render() {
        reloadElemental();
        this.html.innerHTML = "";

        this.renderChildren();
    }
}

class Layout extends Element {

    constructor({ tag = "Layout", id = "", classes = [], attributes = {}, listeners = {} } = {}) {
        super({ tag, id, classes: ["layout", ...classes], attributes, listeners });
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

class ImageEl extends Element {
    constructor({
        src,
        alt = "",
        id = "",
        classes = [],
        attributes = {},
        listeners = {},
        lazy = true
    }) {
        if (!src) {
            throw new Error("Image element requires a `src`");
        }

        super({
            tag: "img",
            id,
            classes: ["image", ...classes],
            attributes: {
                src,
                alt,
                ...(lazy ? { loading: "lazy" } : {}),
                ...attributes
            },
            listeners
        });

        this.useLevelSystem = false;
    }
}

class Icon extends ImageEl {
    constructor({
        src,
        alt = "",
        id = "",
        classes = [],
        attributes = {},
        listeners = {},
        lazy = true
    }) {
        super({
            src,
            alt,
            id,
            classes: ["icon", ...classes],
            attributes,
            listeners,
            lazy
        });

    }
}

class Header extends Element {
    constructor({
        level = 1,
        id = "",
        classes = [],
        attributes = {},
        listeners = {},
    }) {
        super({
            tag: "h" + level,
            id,
            classes,
            attributes,
            listeners
        });
        this.useLevelSystem = false;
    }
}

class Button extends Element {
    constructor({
        type = "button",
        id = "",
        classes = [],
        attributes = {},
        listeners = {},
        onClick = (e) => { }
    } = {}) {
        super({
            tag: "button",
            id,
            classes: ["button", "formEl", ...classes],
            attributes: {
                type,
                ...attributes
            },
            listeners
        });

        this.disabled = false;

        this.onClick = onClick;
    }

    disable(val = true) {
        this.disabled = val;
        return this;
    }

    render() {
        super.render();
        this.html.disabled = this.disabled;
        this.html.addEventListener("click", this.onClick);
    }

    setLoading(isLoading = true) {
        this.disable(isLoading);
        if (!this.classes.includes("loading")) this.classes.push("loading");
        else {
            const index = this.classes.indexOf("loading");
            if (index > -1) { // only splice array when item is found
                this.classes.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        this.html?.classList.toggle("loading", isLoading);
        return this;
    }

    bindShortcut(key = "Enter") {
        document.addEventListener("keydown", e => {
            if (e.key === key) this.html.click();
        });
        return this;
    }

}

class Card extends Element {
    constructor({
        id = "",
        classes = [],
        attributes = {}
    } = {}) {
        super({
            tag: "div",
            id,
            classes: ["card", ...classes],
            attributes
        });
    }
}

class Badge extends Element {
    constructor({
        id = "",
        classes = [],
        attributes = {}
    } = {}) {
        super({
            tag: "span",
            id,
            classes: ["badge", ...classes],
            attributes
        });
    }
}

class Divider extends Element {
    constructor({
        id = "",
        classes = [],
        attributes = {}
    } = {}) {
        super({
            tag: "hr",
            id,
            classes: ["divider", ...classes],
            attributes
        });
    }
}

let temp;

class HTMLInclude extends Element {
    /**
     * @param {string} src - URL of the HTML file to load
     * @param {Array} classes - optional CSS classes
     */
    constructor({ src, classes = [], id = "" }) {
        super({ tag: "div", classes, attributes: { id } });
        if (src) this.load(src, id);
    }

    async load(url, id) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
            const htmlText = await res.text();
            // this.html.innerHTML = htmlText;
            let DOM = stringToHTML(htmlText);

            if (id) {
                DOM = DOM.querySelector(`#${id}`)
            }

            temp = DOM;

            this.id = DOM.id;
            this.tag = DOM.tagName;

            DOM.classList.forEach(x => this.classes.push(x))

            DOM.childNodes.forEach(x => this.children.push(x))

            for (let i = 0, atts = DOM.attributes; i < atts.length; i++) {
                this.attributes[atts[i].nodeName] = atts[i].nodeValue;
            }

            this.root().render();

        } catch (err) {
            console.error(err);
            this.html.innerHTML = `<div style="color:red;">Error loading content</div>`;
        }
        return this;
    }
}




/*------------------\
|      STATES       |
\------------------*/

function createState(initialValue) {
    let value = initialValue;
    const subscribers = new Set();

    return {
        get() {
            return value;
        },

        set(newValue) {
            if (Object.is(value, newValue)) return;
            value = newValue;
            subscribers.forEach(fn => fn(value));
        },

        subscribe(fn) {
            subscribers.add(fn);
            // fn(value); // optional: fire immediately
            return () => subscribers.delete(fn);
        }
    };
}