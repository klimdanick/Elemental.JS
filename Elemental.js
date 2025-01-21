let loadedScripts = [];
let loadedStyles = [];

const sleep = ms => new Promise(r => setTimeout(r, ms));

function isDOM(Obj) {
    return Obj instanceof Element;
}

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

window.onload = () => {
    AttachScript("/src/js/layout.js");
    AttachScript("/src/js/card.js");
    AttachScript("/src/js/menu.js");
    AttachStyle("/src/styles/default.css");
    Interval = setInterval(() => {if (loadedScripts.length >= 3) {OnElementalLoad(); clearInterval(Interval);}}, 5);
    setTimeout(() => {clearInterval(Interval); if (loadedScripts.length < 3) OnElementalLoad();}, 1000);
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
}

class Layout extends Element{
    constructor(direction) {
        super("Layout");
        if (direction == "grid") {
            this.htmlEl.classList.add("grid");
        } else {
            this.htmlEl.style.flexDirection = direction;
        }
        this.htmlEl.style.height = "100%";
    }

    setAsMain() {
        let body = document.getElementsByTagName("body")[0]
        this.appendChild(body.innerHTML);
        body.innerHTML = "";
        body.appendChild(this.htmlEl);
        return this;
    }
}