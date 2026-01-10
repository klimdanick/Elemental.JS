const menuAddon = new Addon({
    cssFiles: [`${defaultLibURL}/src/addons/menus.css`],
})

class Menu extends Element {
    constructor({ type = "menu", vertical = true } = {}) {
        super({
            tag: "ul",
            classes: ["menu", `menu-${type}`, vertical ? "vertical" : "horizontal"]
        });

        this.open = false;
    }

    show() {
        this.html.classList.add("open");
        this.open = true;
    }

    hide() {
        this.html.classList.remove("open");
        this.open = false;
    }

    toggle() {
        this.open ? this.hide() : this.show();
    }
}

class MenuItem extends Element {
    constructor({ label = "", action = null, submenu = null } = {}) {
        super({
            tag: "li",
            classes: ["menu-item"]
        });

        this.button = new Element({
            tag: "button",
            classes: ["menu-button"]
        }).append(label);

        this.append(this.button);

        if (action) {
            this.button.html.addEventListener("click", action);
        }

        if (submenu) {
            this.submenu = submenu;
            this.append(submenu);
            this.html.classList.add("has-submenu");
        }
    }
}
