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
        el.classList.add("menuHead");
        this.appendChild(el);
    }

    appendChild(el) {
        if (el instanceof SimpleMenuItem)
            this.htmlEl.appendChild(el.htmlEl);
            this.items.push(el);
        if (typeof el == "string")
            this.htmlEl.innerHTML += el;
        return this;
    }

    appendChildren(el) {
        for (let i = 0; i < el.length; i++) {
            this.appendChild(el[i]);
        }
    }
}

class SimpleMenuItem extends Button {
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
        console.log(this.icon);
    }
}

loadedScripts.push("/src/js/menu.js");