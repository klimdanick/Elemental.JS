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

const defaultLibURL = "../.."

const getEjsAsset = (name, libURL = defaultLibURL) => `${defaultLibURL}/assets/${name}.png`;

let OnElementalLoad = () => { };

let body;

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

const reloadElemental = () => { }

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
        for (let [event, handler] of Object.entries(this.listeners)) {
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
    }
}

class Form extends Layout {
    constructor({ onSubmit = null, ...opts } = {}) {
        super({ tag: "form", ...opts });

        this.onSubmit = onSubmit;
    }

    render() {
        super.render();
        if (this.onSubmit) {
            this.html.addEventListener("submit", (e) => {
                e.preventDefault();
                this.onSubmit(new FormData(this.html), e);
            });
        }
    }

    data() {
        return Object.fromEntries(new FormData(this.html));
    }
}

class Input extends Element {
    constructor({
        type = "text",
        name = "",
        value = "",
        placeholder = "",
        id = "",
        classes = [],
        attributes = {},
        listeners = {}
    } = {}) {
        super({
            tag: "input",
            id,
            classes: ["input", "formEl", ...classes],
            attributes: {
                type,
                name,
                value,
                placeholder,
                ...attributes
            },
            listeners
        });
    }

    value(val) {
        if (val === undefined) return this.html.value;
        this.html.value = val;
        return this;
    }
}

class TextInput extends Input {
    constructor(options = {}) {
        super({ ...options, type: "text" });
    }
}


class EmailInput extends Input {
    constructor(options = {}) {
        super({ ...options, type: "email" });
    }
}

class PasswordInput extends Input {
    constructor(options = {}) {
        super({ ...options, type: "password" });
    }
}

class NumberInput extends Input {
    constructor({
        type = "text",
        name = "",
        value = 0,
        min = 0,
        max = 100,
        placeholder = "",
        id = "",
        classes = [],
        attributes = {},
        listeners = {}
    }) {
        super({ type: "number", name, value, placeholder, id, classes: ["numberInput", ...classes], attributes: { min, max, ...attributes }, listeners });
    }
}

class Slider extends Input {
    constructor({
        name = "",
        value = 0,
        min = 0,
        max = 100,
        step = 1,
        id = "",
        classes = [],
        attributes = {},
        listeners = {}
    } = {}) {
        super({
            type: "range",
            name,
            value,
            id,
            classes: ["slider", ...classes],
            attributes: {
                min,
                max,
                step,
                ...attributes
            },
            listeners
        });
    }
}

function bindNumberAndSlider(numberInput, slider) {
    // Slider → Number
    slider.html.addEventListener("input", () => {
        numberInput.value(slider.value());
    });

    // Number → Slider
    numberInput.html.addEventListener("input", () => {
        let v = Number(numberInput.value());

        // Clamp value
        const min = Number(slider.html.min);
        const max = Number(slider.html.max);
        v = Math.min(max, Math.max(min, v));

        slider.value(v);
    });
}

class NumberSlider extends Layout {
    constructor({
        value = 0,
        min = 0,
        max = 100,
        step = 1,
        dir = "row",
        id = "",
        classes = [],
        name = ""
    } = {}) {
        super({
            classes: ["number-slider", "formEl", dir, ...classes]
        });

        this.number = new NumberInput({
            name,
            value,
            min,
            max
        });

        this.slider = new Slider({
            value,
            min,
            max,
            step
        });

        this.append(this.slider, this.number);
    }

    render() {
        super.render();
        bindNumberAndSlider(this.number, this.slider);
    }

    value(val) {
        if (val === undefined) return this.number.value();
        this.number.value(val);
        this.slider.value(val);
        return this;
    }
}



class TextArea extends Element {
    constructor({
        name = "",
        value = "",
        rows = 4,
        id = "",
        classes = [],
        attributes = {}
    } = {}) {
        super({
            tag: "textarea",
            id,
            classes: ["textarea", "formEl", ...classes],
            attributes: {
                name,
                rows,
                ...attributes
            }
        });

        this.html.value = value;
    }

    value(val) {
        if (val === undefined) return this.html.value;
        this.html.value = val;
        return this;
    }
}

class Checkbox extends Element {
    constructor({
        name = "",
        checked = false,
        id = "",
        classes = [],
        attributes = {}
    } = {}) {
        super({
            tag: "input",
            id,
            classes: ["checkbox", "formEl", ...classes],
            attributes: {
                type: "checkbox",
                name,
                checked,
                ...attributes
            }
        });
    }

    value(val) {
        if (val === undefined) return this.html.checked;
        this.html.checked = val;
        return this;
    }
}

class Toggle extends Checkbox {

}

class Select extends Element {
    constructor({
        name = "",
        options = [],
        value = "",
        id = "",
        classes = [],
        attributes = {}
    } = {}) {
        super({
            tag: "select",
            id,
            classes: ["select", "formEl", ...classes],
            attributes: { name, ...attributes }
        });

        this.options = options;
        // this.value_ = value;
    }

    render() {
        super.render();
        this.options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.label;
            if (opt.value === this.value) option.selected = true;
            this.html.appendChild(option);
        });
    }

    value(val) {
        if (val === undefined) return this.html.value;
        this.html.value = val;
        return this;
    }
}

class ToggleButton extends Element {
    constructor({
        labelOn = "On",
        labelOff = "Off",
        initial = false,
        id = "",
        classes = [],
        attributes = {},
        listeners = {},
        onChange = null
    } = {}) {
        super({
            tag: "button",
            id,
            classes: ["toggle-button", "formEl", ...classes],
            attributes: {
                type: "button",
                "aria-pressed": initial,
                ...attributes
            },
            listeners
        });

        this.state = Boolean(initial);
        this.labelOn = labelOn;
        this.labelOff = labelOff;
        this.onChange = onChange;
    }

    render() {
        super.render();

        this._renderLabel();

        this.html.addEventListener("click", () => {
            this.toggle();
        });
    }

    _renderLabel() {
        this.html.textContent = this.state ? this.labelOn : this.labelOff;
        this.html.setAttribute("aria-pressed", String(this.state));
        this.html.classList.toggle("is-on", this.state);
    }

    toggle() {
        this.state = !this.state;
        this._renderLabel();
        if (this.onChange) this.onChange(this.state);
        return this;
    }

    value(val) {
        if (val === undefined) return this.state;
        this.state = Boolean(val);
        this._renderLabel();
        return this;
    }
}

class ToggleSwitch extends Element {
    constructor({
        checked = false,
        id = "",
        classes = [],
        attributes = {},
        onChange = null,
        name = ""
    } = {}) {
        super({
            tag: "label",
            classes: ["toggle-switch", "formEl", ...classes]
        });

        this.input = new Element({
            tag: "input",
            attributes: {
                type: "checkbox",
                name,
                id,
                ...attributes
            }
        });

        this.slider = new Element({
            tag: "span",
            classes: ["slider"]
        });

        this.checked = checked;

        this.onChange = onChange;

        this.append(this.input, this.slider);
    }

    render() {
        super.render();
        this.input.html.checked = this.checked;
        if (this.onChange) {
            this.input.html.addEventListener("change", () => {
                this.onChange(this.input.html.checked);
            });
        }
    }

    value(val) {
        if (val === undefined) return this.input.html.checked;
        this.checked = Boolean(val);
        this.input.html.checked = Boolean(val);
        return this;
    }

    toggle() {
        this.value(!this.value());
        return this;
    }
}


class FormGroup extends Layout {
    constructor({
        icon = undefined,
        label = "",
        input,
        help = "",
        error = "",
        dir = "row"
    } = {}) {
        super({
            classes: [dir, "form-group"]
        });

        if (label) {
            this.append(
                new Header({
                    level: 3,
                }).append(...(icon ? [icon, label] : [label]))
            );
        }

        if (input) this.append(input);
        this.input = input;

        if (help) {
            this.append(
                new Element({ tag: "small", classes: ["form-help"] }).append(help)
            );
        }

        if (error) {
            this.append(
                new Element({ tag: "div", classes: ["form-error"] }).append(error)
            );
        }
    }

    value(val) {
        return this.input.value();
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

class SubmitButton extends Button {
    constructor(options = {}) {
        super({ ...options, type: "submit", classes: ["submit", ...(options.classes || [])] });
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