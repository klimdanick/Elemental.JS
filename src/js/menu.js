const simpleMenu = (content = [], width, height) => {
    let el = document.createElement("div");
    el.classList.add("elemental");
    el.classList.add("menu");
    if (width) el.style.width = ""+width;
    if (height) el.style.height = ""+height;
    content.forEach(element => {
        if (isDOM(element)) el.appendChild(element);
        if (typeof(element) == "string") {
            element = buttonElement(element, ()=>{});
            el.appendChild(element);
        }
    });
    return {el: el, content: content};
}

loadedScripts.push("/src/js/menu.js");