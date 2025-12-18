let loadedScripts = [];
let loadedStyles = [];

let elementalJSloaded = false;

let mainLayout;
let toastPanel;

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

function isDOM(Obj) {
    return Obj instanceof Element;
}

const stringToHTML = string => new DOMParser().parseFromString(string, 'text/html').body.firstChild

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

const getEjsAsset = (name) => `https://klimdanick.nl/elementaljs/assets/${name}.png`;

let OnElementalLoad;
let Interval;

AttachScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js");
AttachStyle("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css");
AttachStyle("https://klimdanick.nl/elementaljs/styles/default.css");

window.onpageshow = () => {
    setTimeout(() => { document.documentElement.classList.add('loaded'); }, 500);
}

window.onload = () => {
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

    OnElementalLoad();
    hljs.highlightAll();

    toastPanel = new Layout("column-reverse");
    toastPanel.htmlEl.id = "toastPanel";
    if (mainLayout) mainLayout.appendChild(toastPanel);

    elementalJSloaded = true;

    let taostPanelInterval = setInterval(() => {
        if (mainLayout && !mainLayout.htmlEl.contains(toastPanel.htmlEl)) {
            if (mainLayout) mainLayout.appendChild(toastPanel);
        }
    }, 1000);

    /*
    let animationFix = (el) => {
        let tmp = el.style.transitionDuration;
        el.style.transitionDuration = "0s";
        console.log(el.style);
        setTimeout(() => {el.style.transitionDuration = "200ms";}, 5000)
    }
    document.querySelectorAll("element").forEach(animationFix);
    document.querySelectorAll("layoput").forEach(animationFix);
    */
}

class Element {
    constructor(tagName = "Element") {
        this.htmlEl = document.createElement(tagName);
        this.style = this.htmlEl.style;
        this.htmlEl.addEventListener("click", (e) => this.onClick(e));
        this.htmlEl.addEventListener("mouseenter", (e) => this.onHover(e));
        this.htmlEl.addEventListener("mouseleave", (e) => this.onLeave(e));
    }

    appendChild(el) {
        console.log();
        if (el instanceof Element)
            this.htmlEl.appendChild(el.htmlEl);
        if (el instanceof Node)
            this.htmlEl.appendChild(el);
        if (typeof el == "string")
            this.htmlEl.innerHTML += el;
        return this;
    }

    removeChild(el) {
        if (el instanceof Element)
            this.htmlEl.removeChild(el.htmlEl);
        return this;
    }

    removeAllChildren() {
        while (this.htmlEl.firstChild) {
            this.htmlEl.removeChild(this.htmlEl.lastChild);
        }
    }

    onClick(e) { }

    onHover(e) { }

    onLeave(e) { }

    onScreen() { }
    offScreen() { }

    observe() {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
				if (entry.isIntersecting) this.onScreen();
                else this.offScreen();
            });
        });

        obs.observe(this.htmlEl);
    }
}

class Layout extends Element {
    constructor(direction) {
        super("Layout");
        if (direction == "grid") {
            this.htmlEl.classList.add("grid");
        } else {
            this.htmlEl.style.flexDirection = direction;
        }
        //this.htmlEl.style.height = "100%";
    }

    setGrid(options = {}) {
        this.htmlEl.style.display = "grid";
        if (options.columns) this.htmlEl.style.gridTemplateColumns = options.columns;
        if (options.rows) this.htmlEl.style.gridTemplateRows = options.rows;
        if (options.gap) this.htmlEl.style.gap = options.gap;
        if (options.align) this.htmlEl.style.alignItems = options.align;
        if (options.justify) this.htmlEl.style.justifyItems = options.justify;
        return this;
    }

    setAsMain() {
        let body = document.getElementsByTagName("body")[0]
        this.appendChild(body.innerHTML);
        body.innerHTML = "";
        body.appendChild(this.htmlEl);
        this.htmlEl.style.height = "100%";
        mainLayout = this;
        return this;
    }
}





const simpleLayout = (direction = "column") => {
    let el = document.createElement("div");
    el.classList.add("elemental");
    el.classList.add("layout");
    if (direction == "grid") {
        el.classList.add("grid");
    } else {
        el.style.flexDirection = direction;
    }
    return el;
}

const sideAndTopBarLayout = () => {
    let background = document.createElement("div");
    background.classList.add("fill");
    background.style.backgroundColor = "var(--level0)";
    document.getElementsByTagName("body")[0].appendChild(background);
    let topbar = simpleLayout(direction = "row");
    topbar.classList.add("topbar");
    document.getElementsByTagName("body")[0].appendChild(topbar);
    let sidebar = simpleLayout();
    sidebar.classList.add("sidebar");
    document.getElementsByTagName("body")[0].appendChild(sidebar);
    let layout = simpleLayout();
    layout.classList.add("fill");
    layout.classList.add("sideAndTopBarLayoutMain");
    document.getElementsByTagName("body")[0].appendChild(layout);

    return { sidebar, topbar, content: layout };
}

class Card extends Element {
    constructor(width, height) {
        super();
        this.htmlEl.classList.add("card");
        if (width) this.htmlEl.style.width = "" + width;
        if (height) this.htmlEl.style.height = "" + height;
    }
}
class Title extends Element {
    constructor(content) {
        super("h1");
        this.htmlEl.classList.add("title");
        this.htmlEl.innerText = content;
    }
}

class Text extends Element {
    constructor(content) {
        super("p");
        this.htmlEl.classList.add("text");
        this.htmlEl.innerText = content;
    }
}
class Button extends Element {
    constructor(label, callback) {
        super("div");
        if (typeof (label) == "string") this.htmlEl.innerText = label;
        else if (isDOM(label)) this.htmlEl.appendChild(label);
        this.htmlEl.classList.add("elemental");
        this.htmlEl.classList.add("button");
        this.htmlEl.onclick = callback;
    }
}

class ImageEl extends Element {
    constructor() {
        super();
        this.htmlEl.classList.add("image");
        this.image = document.createElement("img");
        this.htmlEl.appendChild(this.image);

        let that = this;
        this.preload = new Image;
        this.preload.onload = function () {
            that.image.src = this.src;

            if (that.full) {
                if (!that.height) {
                    that.image.width = that.htmlEl.offsetWidth;
                    let aspRatio = this.height / this.width;
                    that.htmlEl.style.height = Math.floor(that.htmlEl.offsetWidth * aspRatio) + "px";
                }
                if (!that.width) {
                    that.image.height = that.htmlEl.offsetHeight;
                    let aspRatio = this.width / this.height;
                    that.htmlEl.style.width = Math.floor(that.htmlEl.offsetHeight * aspRatio) + "px";
                }
            } else {
                that.image.style.height = that.htmlEl.offsetHeight;
                that.image.style.width = that.htmlEl.offsetWidth;
            }
        }
    }

    size({ width, height, full = true }) {
        setTimeout(() => {
            if (!width && !height) {
                width = "100%;";
                this.htmlEl.width = width;
            }
            if (width) this.image.style.widh = width;
            if (height) this.image.style.height = height;
            setTimeout(() => {
                if (width && !height) {
                    this.htmlEl.style.width = width;
                    this.htmlEl.style.height = Math.floor(this.htmlEl.offsetWidth * (3 / 4)) + "px";
                }
                if (!width && height) {
                    this.htmlEl.style.height = height;
                    this.htmlEl.style.width = Math.min(Math.floor(this.htmlEl.offsetHeight * (4 / 3)) + "px", this.htmlEl.offsetWidth);
                }
                if (width && height) {
                    this.htmlEl.style.width = width;
                    this.htmlEl.style.height = height;
                }
                this.widh = width;
                this.height = height;
                this.full = full;
            }, 2);
        }, 2);
        return this;
    }

    load(src = "") {
        setTimeout(() => { this.preload.src = src; }, 5);
        return this;
    }
}

class VideoEl extends Element {
    constructor() {
        super();
        this.htmlEl.classList.add("video");

        // Create <video> element
        this.video = document.createElement("video");
        this.video.setAttribute("playsinline", ""); // mobile safe
        this.video.setAttribute("preload", "auto");
        this.video.setAttribute("controls", "");   // show controls by default
        this.htmlEl.appendChild(this.video);

        this.full = true;
        this.width = null;
        this.height = null;

        // Preloader (we preload metadata instead of full video)
        this.preload = document.createElement("video");
        this.preload.preload = "metadata";

        this.preload.onloadedmetadata = () => {
            if (this.full) {
                if (!this.height) {
                    this.video.width = this.htmlEl.offsetWidth;
                    let aspRatio = this.preload.videoHeight / this.preload.videoWidth;
                    this.htmlEl.style.height = Math.floor(this.htmlEl.offsetWidth * aspRatio) + "px";
                }
                if (!this.width) {
                    this.video.height = this.htmlEl.offsetHeight;
                    let aspRatio = this.preload.videoWidth / this.preload.videoHeight;
                    this.htmlEl.style.width = Math.floor(this.htmlEl.offsetHeight * aspRatio) + "px";
                }
            } else {
                this.video.style.height = this.htmlEl.offsetHeight + "px";
                this.video.style.width = this.htmlEl.offsetWidth + "px";
            }

            // Once metadata is loaded, set src
            this.video.src = this.preload.src;
        };
    }

    size({ width, height, full = true }) {
        setTimeout(() => {
            if (!width && !height) {
                width = "100%";
                this.htmlEl.style.width = width;
            }
            if (width) this.video.style.width = width;
            if (height) this.video.style.height = height;

            setTimeout(() => {
                if (width && !height) {
                    this.htmlEl.style.width = width;
                    this.htmlEl.style.height = Math.floor(this.htmlEl.offsetWidth * (9 / 16)) + "px";
                }
                if (!width && height) {
                    this.htmlEl.style.height = height;
                    this.htmlEl.style.width = Math.min(Math.floor(this.htmlEl.offsetHeight * (16 / 9)) + "px", this.htmlEl.offsetWidth);
                }
                if (width && height) {
                    this.htmlEl.style.width = width;
                    this.htmlEl.style.height = height;
                }

                this.width = width;
                this.height = height;
                this.full = full;
            }, 2);
        }, 2);

        return this;
    }

    load(src = "", autoplay = false, loop = false) {
        setTimeout(() => {
            this.preload.src = src;
            this.video.autoplay = autoplay;
            this.video.loop = loop;
        }, 5);
        return this;
    }
}


class SimpleMenu extends Element {
    constructor(dir = "column", stick) {
        super();
        this.htmlEl.classList.add("menu");
        this.htmlEl.classList.add(dir);
        this.items = [];
        if (stick == "left") {
            this.style.marginRight = "auto";
        }
        if (stick == "right") {
            this.style.marginLeft = "auto";
        }
    }

    addHead(el) {
        if (typeof el == "string") el = stringToHTML(el)
        this.head = el;
        if (el instanceof Element) el = el.htmlEl;
        el.classList.add("menuHead");
        this.appendChild(el);
    }

    appendChild(el) {
        if (el instanceof SimpleMenuItem || el instanceof TextInputMenuItem) {
            this.htmlEl.appendChild(el.htmlEl);
            this.items.push(el);
            el.menu = this;
        } if (el instanceof HTMLElement) {
            this.htmlEl.appendChild(el);
            this.items.push(el);
            el.menu = this;
        } if (typeof el == "string")
            this.htmlEl.innerHTML += el;
        return this;
    }

    appendChildren(el) {
        for (let i = 0; i < el.length; i++) {
            this.appendChild(el[i]);
        }
    }

    select(el, exec = true) {
        for (let i = 0; i < this.items.length; i++) {
            let e = this.items[i];
            if (e instanceof SimpleMenuItem) e.htmlEl.classList.remove("selected");
            if (e instanceof HTMLElement) e.classList.remove("selected");
        }
        if (el instanceof SimpleMenuItem) {
            el.htmlEl.classList.add("selected");
            this.selected = el;
            if (exec) {
                let inter = setInterval(() => {
                    if (elementalJSloaded) {
                        el.callback();
                        clearInterval(inter);
                    }
                }, 10)
            }
        }
        if (el instanceof HTMLElement) {
            el.classList.add("selected");
            this.selected = el;
        }
    }
}

class DropDownMenu extends SimpleMenu {
    constructor(dir = "column", stick) {
        super(dir, stick);
        this.htmlEl.classList.add("DropDownMenu")
        setTimeout(() => {
            this.htmlEl.style.maxHeight = this.htmlEl.offsetHeight;
            setTimeout(() => {
                this.open = false;
                this.htmlEl.classList.add("closed")
            }, 2);
        }, 2);
    }

    addHead(el) {
        super.addHead(el);
        let that = this;
        this.head.onclick = () => {
            that.open = !that.open;
            that.htmlEl.classList.toggle("closed")
        }
    }
}

class HamburgerMenu extends SimpleMenu {
    constructor(dir = "column", stick) {
        super(dir, stick);
        this.htmlEl.classList.add("HamburgerMenu")
        setTimeout(() => {
            // this.width = this.htmlEl.offsetWidth;
            // this.htmlEl.style.maxWidth = this.htmlEl.offsetWidth;
            setTimeout(() => {
                this.open = false;
                this.htmlEl.classList.add("closed")
            }, 2);
        }, 2);
    }

    addHead(el) {
        super.addHead(new HeadMenuItem("https://klimdanick.nl/elementaljs/assets/menu.png", el, () => {
            that.open = !that.open;
            that.htmlEl.classList.toggle("closed")
        }));
        let that = this;
        this.head.onclick = () => {
            that.open = !that.open;
            that.htmlEl.classList.toggle("closed")
        }
    }
}

class TabMenu extends HamburgerMenu {
    constructor(dir = "column", stick) {
        super(dir, stick);
        this.htmlEl.classList.add("closed");
    }

    addHead(el) { }
}



class SimpleMenuItem extends Button {
    constructor(icon = "menu.png", label = "", callback = () => { }) {
        super("", () => { let cancel = callback(); if (!cancel) this.menu.select(this, false);});
        this.callback = callback;
        this.htmlEl.classList.add("MenuItem");
        this.icon = document.createElement("img");
        // this.htmlEl.appendChild(this.icon)
        this.appendChild(label)

        let that = this;
        this.preload = new Image;
        this.preload.onload = function () {
            that.icon.src = this.src;
            that.htmlEl.innerHTML = "";
            that.htmlEl.appendChild(that.icon)
            that.appendChild(label)
        }
        this.preload.src = icon;
    }
}

class TextInputMenuItem extends Element {
    constructor(id, icon = "menu.png", placeholder = "") {
        super("div");
        this.htmlEl.classList.add("MenuItem");
        this.htmlEl.classList.add("elemental");
        this.htmlEl.classList.add("button");
        this.htmlEl.classList.add("textInputMenuItem");

        // Create DOM elements
        this.icon = document.createElement("img");
        this.inputField = document.createElement("input");
        this.inputField.type = "search";
        this.inputField.placeholder = placeholder;
        this.inputField.id = id;

        // Preload icon image
        const preload = new Image();
        preload.onload = () => {
            this.icon.src = preload.src;
        };
        preload.src = icon;

        // Append elements (even before preload)
        this.htmlEl.appendChild(this.icon);
        this.htmlEl.appendChild(this.inputField);

        let that = this;
        this.icon.onclick = () => {
            this.onsearch(that.inputField.value);
        }
    }

    onsearch(value) { }
}

class InputMenuItem extends Element {
    constructor(icon = "menu.png", {id, placeholder = "", value = "", type = "text"}) {
        super("div");
        this.htmlEl.classList.add("MenuItem");
        this.htmlEl.classList.add("elemental");
        this.htmlEl.classList.add("button");
        this.htmlEl.classList.add("textInputMenuItem");

        // Create DOM elements
        this.icon = document.createElement("img");
        this.inputField = document.createElement("input");
        this.inputField.type = type;
        this.inputField.placeholder = placeholder;
        this.inputField.id = id;
        this.inputField.value = value;

        // Preload icon image
        const preload = new Image();
        preload.onload = () => {
            this.icon.src = preload.src;
        };
        preload.src = icon;

        // Append elements (even before preload)
        this.htmlEl.appendChild(this.icon);
        this.htmlEl.appendChild(this.inputField);

        let that = this;
        this.icon.onclick = () => {
            this.onsearch(that.inputField.value);
        }
    }

    onsearch(value) { }
}

class TabMenuItem extends SimpleMenuItem {
    constructor(icon = "menu.png", callback = () => { }) {
        super(icon, "", callback);
    }
}

class HeadMenuItem extends Button {
    constructor(icon = "menu.png", label = "", callback = () => { }) {
        super("", callback);
        this.htmlEl.classList.add("MenuItem");
        this.icon = document.createElement("img");
        // this.htmlEl.appendChild(this.icon)
        this.appendChild(label)

        let that = this;
        this.preload = new Image;
        this.preload.onload = function () {
            that.icon.src = this.src;
            that.htmlEl.innerHTML = "";
            that.htmlEl.appendChild(that.icon)
            that.appendChild(label)
        }
        this.preload.src = icon;
    }
}

class Input extends Element {
    constructor(type = "text") {
        super("input");
        this.htmlEl.type = type;
    }
}

class ColorPicker extends Element {
    constructor() {
        super();
        let rowLayout = new Layout("row");
        let colLayout = new Layout("column");
        rowLayout.style.background = "none";
        colLayout.style.background = "none";

        rowLayout.appendChild(colLayout);
        this.htmlEl.classList.add("ColorPicker");

        this.huePicker = new HuePicker();
        this.saturationPicker = new SaturationPicker();
        this.lightnessPicker = new LightnessPicker();

        this.huePicker.linkedColorPicker = this;
        this.saturationPicker.linkedColorPicker = this;
        this.lightnessPicker.linkedColorPicker = this;

        colLayout.appendChild(this.huePicker);
        colLayout.appendChild(this.saturationPicker);
        rowLayout.appendChild(this.lightnessPicker);

        this.appendChild(rowLayout);
        this.onPick_();
    }

    onPick_() {
        let h = this.huePicker.hue;
        let s = this.saturationPicker.saturation;
        let l = this.lightnessPicker.lightness;
        this.color = buildColor(h, s, l);
        this.saturationPicker.updateHue(this.color.h);
        this.lightnessPicker.updateHue(this.color.h);
        this.onPick(this.color);
    }

    onPick(color) { }
}

function buildColor(h, s, l) {
    let rgb = hslToRgb(h, s, l);
    let hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return { h: h, s: s, l: l, r: rgb.r, g: rgb.g, b: rgb.b, hex };
}

function rgbToHex(r, g, b) {
    return (
        "#" +
        [r, g, b]
            .map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex; // pad with 0 if needed
            })
            .join("")
    );
}

function hslToRgb(h, s, l) {
    // h: hue [0–360], s: saturation [0–100], l: lightness [0–100]
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s; // chroma
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}

function rgbToHsl(r, g, b) {
    // r,g,b in [0–255]
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0, s = 0, l = (max + min) / 2;

    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }

        h *= 60;
        if (h < 0) h += 360;

        s = delta / (1 - Math.abs(2 * l - 1));
    }

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}



class HuePicker extends Element {
    constructor() {
        super();
        this.htmlEl.classList.add("HuePicker");
        this.pointer = new Element();
        this.pointer.htmlEl.classList.add("pointer");
        this.appendChild(this.pointer);
        this.htmlEl.addEventListener("click", this.onClick);
        this.hue = 343;
        this.rgb = DEBIAN_RED;
    }

    onClick(e) {
        if (!this.htmlEl) return;
        const rect = this.htmlEl.getBoundingClientRect(); // div's position & size
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - cx;
        const dy = y - cy;

        // angle in degrees
        let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angleDeg < 0) angleDeg += 360;

        // rotate the pointer
        this.pointer.style.transform = `rotate(${angleDeg}deg)`;

        let rgb = this.getColor(x, y);
        let hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        this.hue = hsl.h;
        this.color = buildColor(hsl.h, hsl.s, hsl.l);

        if (this.linkedColorPicker) {
            this.linkedColorPicker.onPick_();
        }

        this.onPick(this.hue);
    }

    onPick(hue) { }

    getColor(x, y) {
        const size = this.htmlEl.offsetWidth;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        // this.htmlEl.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        // Build a conic gradient on canvas
        const gradient = ctx.createConicGradient(0, size / 2, size / 2);
        gradient.addColorStop(0 / 5, DEBIAN_RED);
        gradient.addColorStop(1 / 5, TURMERIC_YELLOW);
        gradient.addColorStop(2 / 5, AQUA_GREEN);
        gradient.addColorStop(3 / 5, CURIOS_BLUE);
        gradient.addColorStop(4 / 5, STRAWBERRY_MAGENTA);
        gradient.addColorStop(1, DEBIAN_RED);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        return ctx.getImageData(x, y, 1, 1).data;
    }
}

class SaturationPicker extends Element {
    constructor() {
        super();
        this.htmlEl.classList.add("SatPicker");
        this.pointer = new Element();
        this.pointer.htmlEl.classList.add("pointer");
        this.appendChild(this.pointer);
        this.htmlEl.addEventListener("click", this.onClick);
        this.saturation = 88;
    }

    onClick(e) {
        if (!this.htmlEl) return;
        const rect = this.htmlEl.getBoundingClientRect(); // div's position & size
        const x = e.clientX - rect.left;
        const p = x / rect.width;

        this.saturation = Math.round(p * 100);

        if (this.linkedColorPicker) {
            this.linkedColorPicker.onPick_();
        }

        this.pointer.style.left = `${this.saturation}%`;
        this.linkedColorPicker.onPick_();
        this.onPick(this.saturation);
    }

    onPick(saturation) { }

    updateHue(hue) {
        this.style.background = `linear-gradient(to right, hsl(${hue}, 0%, 50%), hsl(${hue}, 100%, 50%))`;
    }
}

class LightnessPicker extends Element {
    constructor() {
        super();
        this.htmlEl.classList.add("LigPicker");
        this.pointer = new Element();
        this.pointer.htmlEl.classList.add("pointer");
        this.appendChild(this.pointer);
        this.htmlEl.addEventListener("click", this.onClick);
        this.lightness = 45;
    }

    onClick(e) {
        if (!this.htmlEl) return;
        const rect = this.htmlEl.getBoundingClientRect(); // div's position & size
        const y = e.clientY - rect.top;
        const p = y / rect.height;

        this.lightness = Math.round(p * 100);

        if (this.linkedColorPicker) {
            this.linkedColorPicker.onPick_();
        }

        this.pointer.style.top = `${this.lightness}%`;
        this.linkedColorPicker.onPick_();
        this.onPick(this.lightness);
    }

    onPick(lightness) { }

    updateHue(hue) {
        this.style.background = `linear-gradient(to bottom, hsl(${hue}, 100%, 0%), hsl(${hue}, 100%, 50%), hsl(${hue}, 100%, 100%))`;
    }
}

class Toast extends Element {
    constructor(message = "") {
        super("Toast");
        this.message = message;
        this.appendChild(this.message);
    }

    play(duration = 2000) {
        let clone = new Toast(this.message);
        toastPanel.appendChild(clone);
        toastPanel.htmlEl.style.justifyContent = "flex-start";
        let currentHeight = parseFloat(toastPanel.htmlEl.style.height) || 0;
        toastPanel.htmlEl.style.height = (currentHeight + 63) + "px";

        setTimeout(() => {
            toastPanel.removeChild(clone);
            toastPanel.htmlEl.style.justifyContent = "flex-end";
            let currentHeight = parseFloat(toastPanel.htmlEl.style.height) || 0;
            toastPanel.htmlEl.style.height = (currentHeight - 63) + "px";
        }, duration);
    }
}

class Panel extends Layout {
    constructor(tag) {
        super("column");
        this.htmlEl.classList.add("panel");
        this.htmlEl.classList.add(tag);
    }
}

class Canvas extends Element {
    constructor() {
        super();
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        this.htmlEl.appendChild(this.canvas);
        this.init();
        this.interval = setInterval(() => { this.update() }, 2);
    }

    init() { }

    update() { }
}

class Line extends Element {
    constructor(from, to) {
        super("line");
        this.from = from;
        this.to = to;

        this.style.left = Math.min(from.x, to.x);
        this.style.top = Math.min(from.y, to.y);

        this.style.width = Math.abs(to.x - from.x);
        this.style.height = Math.abs(to.y - from.y);
    }
}

class BlockLine extends Element {
    constructor(dir, from, to) {
        super();
        this.dir = dir;
        this.from = from;
        this.to = to;

        this.lines = [];

        if (dir == "h") {
            this.lines.push(new Line(from, { x: Math.min(from.x, to.x) + (Math.abs(to.x - from.x) / 2), y: from.y }));
            this.lines.push(new Line({ x: Math.min(from.x, to.x) + (Math.abs(to.x - from.x) / 2), y: from.y }, { x: Math.min(from.x, to.x) + (Math.abs(to.x - from.x) / 2), y: to.y }));
            this.lines.push(new Line({ x: Math.min(from.x, to.x) + (Math.abs(to.x - from.x) / 2), y: to.y }, to));
        }

        if (dir == "v") {
            this.lines.push(new Line(from, { x: from.x, y: Math.min(from.y, to.y) + (Math.abs(to.y - from.y) / 2) }));
            this.lines.push(new Line({ x: from.x, y: Math.min(from.y, to.y) + (Math.abs(to.y - from.y) / 2) }, { x: to.x, y: Math.min(from.y, to.y) + (Math.abs(to.y - from.y) / 2) }));
            this.lines.push(new Line(to, { x: to.x, y: Math.min(from.y, to.y) + (Math.abs(to.y - from.y) / 2) }));
        }

        for (let i = 0; i < this.lines.length; i++) {
            this.appendChild(this.lines[i]);
        }
    }
}