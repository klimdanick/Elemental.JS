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
        this.open = true;
        this.html.classList.add("open");
        this.closeSiblings();
    }

    hide() {
        this.html.classList.remove("open");
        this.open = false;
    }

    toggle() {
        console.log(this.html);
        this.open ? this.hide() : this.show();
    }

    closeSiblings() {
        const siblings = this.html.parentElement?.querySelectorAll(".menu.open");
        siblings?.forEach(m => m !== this.html && m.classList.remove("open"));
    };
}

class MenuItem extends Element {
    constructor({ label = "", action = null, submenu = null } = {}) {
        super({
            tag: "li",
            classes: ["menu-item"]
        });

        this.button = new Button({
            classes: ["menu-button"],
            onClick: action
        }).append(label);

        this.append(this.button);

        if (submenu) {
            this.submenu = submenu;
            this.append(submenu);
            this.html.classList.add("has-submenu");
            if (!action) this.button.onClick = () => submenu.toggle()
        }
    }
}