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