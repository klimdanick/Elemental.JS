let loadedScripts = [];
let loadedStyles = [];

let elementalJSloaded = false;

let mainLayout;
let toastPanel;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function isDOM(Obj) {
    return Obj instanceof Element;
}

const stringToHTML =  string=> new DOMParser().parseFromString(string, 'text/html').body.firstChild

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

let OnElementalLoad;
let Interval;

AttachScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js");
//AttachScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js");
AttachStyle("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css");
//AttachStyle("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/javescript.min.js");
AttachStyle("https://vps.klimdanick.nl/elementaljs/styles/default.css");
window.onload = () => {
    document.documentElement.classList.add('loaded');
    OnElementalLoad();
    hljs.highlightAll();

    toastPanel = new Layout("column-reverse");
    toastPanel.htmlEl.id = "toastPanel";
    if (mainLayout) mainLayout.appendChild(toastPanel);

    elementalJSloaded = true;

    let taostPanelInterval = setInterval(() => {
        if (!mainLayout.htmlEl.contains(toastPanel.htmlEl)) {
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
    }

    appendChild(el) {
        if (el instanceof Element)
            this.htmlEl.appendChild(el.htmlEl);
        if (typeof el == "string")
            this.htmlEl.innerHTML += el;
        return this;
    }

    removeChild(el) {
        if (el instanceof Element)
            this.htmlEl.removeChild(el.htmlEl);
        return this;
    }
}

class Layout extends Element{
    constructor(direction) {
        super("Layout");
        if (direction == "grid") {
            this.htmlEl.classList.add("grid");
        } else {
            this.htmlEl.style.flexDirection = direction;
        }
        //this.htmlEl.style.height = "100%";
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

    return {sidebar, topbar, content: layout};
}

class Card extends Element {
    constructor(width, height) {
        super();
        this.htmlEl.classList.add("card");
        if (width) this.htmlEl.style.width = ""+width;
        if (height) this.htmlEl.style.height = ""+height;
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
        if (typeof(label) == "string") this.htmlEl.innerText = label;
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
        this.preload.onload = function() {
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

    size({width, height, full = true}) {
        setTimeout(() => {
            if (!width && !height) {
                width = "100%;";
                this.htmlEl.width = width;
            }
            setTimeout(() => {
                if (width && !height) {
                    this.htmlEl.style.width = width;
                    this.htmlEl.style.height = Math.floor(this.htmlEl.offsetWidth * (3/4)) + "px";
                }
                if (!width && height) {
                    this.htmlEl.style.height = height;
                    this.htmlEl.style.width = Math.min(Math.floor(this.htmlEl.offsetHeight * (4/3)) + "px", this.htmlEl.offsetWidth);
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
        setTimeout(() => {this.preload.src = src;}, 5);
        return this;
    }
}

class SimpleMenu extends Element {
    constructor(stick) {
        super();
        this.htmlEl.classList.add("menu");
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
        if (el instanceof SimpleMenuItem) {
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
                let inter = setInterval(()=>{
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
    constructor(stick) {
        super(stick);
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
    constructor(stick) {
        super(stick);
        this.htmlEl.classList.add("HamburgerMenu")
        setTimeout(() => {
            this.width = this.htmlEl.offsetWidth;
            this.htmlEl.style.maxWidth = this.htmlEl.offsetWidth;
            setTimeout(() => {
                this.open = false;
                this.htmlEl.classList.add("closed")
            }, 2);
        }, 2);
    }

    addHead(el) {
        super.addHead(new HeadMenuItem("/assets/menu.png", el, () => {
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
    constructor(stick) {
        super(stick);
        this.htmlEl.classList.add("closed");
    }

    addHead(el) {}
}



class SimpleMenuItem extends Button {
    constructor(icon = "menu.png", label = "", callback = () => {}) {
        super("", () => {this.menu.select(this, false); callback()});
        this.callback = callback;
        this.htmlEl.classList.add("MenuItem");
        this.icon = document.createElement("img");
        // this.htmlEl.appendChild(this.icon)
        this.appendChild(label)

        let that = this;
        this.preload = new Image;
        this.preload.onload = function() {
            that.icon.src = this.src;
            that.htmlEl.innerHTML = "";
            that.htmlEl.appendChild(that.icon)
            that.appendChild(label)
        }
        this.preload.src = icon;
    }
}

class TabMenuItem extends SimpleMenuItem {
    constructor(icon = "menu.png", callback = () => {}) {
        super(icon, "", callback);
    }
}

class HeadMenuItem extends Button {
    constructor(icon = "menu.png", label = "", callback = () => {}) {
        super("", callback);
        this.htmlEl.classList.add("MenuItem");
        this.icon = document.createElement("img");
        // this.htmlEl.appendChild(this.icon)
        this.appendChild(label)

        let that = this;
        this.preload = new Image;
        this.preload.onload = function() {
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