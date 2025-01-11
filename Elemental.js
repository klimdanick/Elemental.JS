let loadedScripts = [];
let loadedStyles = [];

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

let OnElementalLoad;
let Interval;

window.onload = () => {
    AttachScript("/src/js/layout.js");
    AttachScript("/src/js/card.js");
    AttachStyle("/src/styles/default.css");
    Interval = setInterval(() => {console.log(1); if (loadedScripts.length >= 2) OnElementalLoad(); clearInterval(Interval);}, 10);
    setTimeout(() => {clearInterval(Interval)}, 500);
}