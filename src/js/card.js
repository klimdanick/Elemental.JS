const simpleCard = (content = [], width, height) => {
    let el = document.createElement("div");
    el.classList.add("elemental");
    el.classList.add("card");
    if (width) el.style.width = ""+width;
    if (height) el.style.height = ""+height;
    content.forEach(element => {
        el.appendChild(element);
    });
    return {el: el, content: content};
}

const titleElement = (text) => {
    let el = document.createElement("h1");
    el.innerText = text;
    el.classList.add("elemental");
    el.classList.add("title");
    return el;
}

const textElement = (text) => {
    let el = document.createElement("p");
    el.innerText = text;
    el.classList.add("elemental");
    el.classList.add("text");
    return el;
}

const buttonElement = (label, callback) => {
    let el = document.createElement("span");
    if (typeof(label) == "string") el.innerText = label;
    else if (isDOM(label)) el.appendChild(label);
    el.classList.add("elemental");
    el.classList.add("button");
    el.onclick = callback;
    return el;
}

const imageElement = (src = "", {alt, width, height, full = true}) => {
    let el = document.createElement("div");
    el.classList.add("elemental");
    el.classList.add("image");
    if (alt) {
        alt.classList.add("alt");
        el.appendChild(alt);
    }
    let image = document.createElement("img");
    el.appendChild(image);
    let preload = new Image;
    preload.onload = function() {
        if (alt) alt.style.display = "none";
        image.src = this.src;

        if (full) {
            if (!height) {
                image.width = el.offsetWidth;
                let aspRatio = preload.height / preload.width;
                el.style.height = Math.floor(el.offsetWidth * aspRatio) + "px";
            }
            if (!width) {
                image.height = el.offsetHeight;
                let aspRatio = preload.width / preload.height;
                el.style.width = Math.floor(el.offsetHeight * aspRatio) + "px";
            }
        } else {
            image.style.height = el.offsetHeight;
            image.style.width = el.offsetWidth;
        }
    }

    setTimeout(()=> {
    if (!width && !height) {
        width = "100%";
        console.table({elWidth: el.offsetWidth, elHeight: el.offsetHeight});
    }el.style.width = "100%";}, 1);
    setTimeout(()=> {
    if (width && !height) {
        el.style.width = width;
        el.style.height = Math.floor(el.offsetWidth * (3/4)) + "px";
        console.table({elWidth: el.offsetWidth, elHeight: el.offsetHeight});
    }}, 2);
    setTimeout(()=> {
    if (!width && height) {
        el.style.height = height;
        el.style.width = Math.min(Math.floor(el.offsetHeight * (4/3)) + "px", el.offsetWidth);
        console.table({elWidth: el.offsetWidth, elHeight: el.offsetHeight});
    }}, 3);
    setTimeout(()=> {
    if (width && height) {
        el.style.width = width;
        el.style.height = height;
        console.table({elWidth: el.offsetWidth, elHeight: el.offsetHeight});
    }}, 4);
    setTimeout(()=> {
        if (alt) {
            alt.style.width = el.offsetWidth;
            alt.style.height = el.offsetHeight;
        }
    }, 5);
    setTimeout(()=> {
        preload.src = src;
    }, 6);

    return el;
}

loadedScripts.push("/src/js/card.js");