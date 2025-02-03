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

    select(el) {
        for (let i = 0; i < this.items.length; i++) {
            let e = this.items[i];
            if (e instanceof SimpleMenuItem) e.htmlEl.classList.remove("selected");
            if (e instanceof HTMLElement) e.classList.remove("selected");
        }
        if (el instanceof SimpleMenuItem) {
            el.htmlEl.classList.add("selected");
            this.selected = el;
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
        super.addHead(new HeadMenuItem("/src/assets/menu.png", el, () => {
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
}



class SimpleMenuItem extends Button {
    constructor(icon = "menu.png", label = "", callback = () => {}) {
        super("", () => {this.menu.select(this); callback()});
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
        console.log(this.icon);
    }
}

loadedScripts.push("/src/js/menu.js");