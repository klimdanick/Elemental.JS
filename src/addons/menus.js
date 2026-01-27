const menuAddon = new Addon({
    cssFiles: [`${defaultLibURL}/src/addons/menus.css`],
})

/* TODO: menu types
    [x] cascading
    [x] dropdown
    [x] hamburger
    [] tabs
    [] side
    x] Bento
*/

let lastMenu;


class Menu extends Element {
    constructor({ type = "menu", vertical = true } = {}) {
        super({
            tag: "ul",
            classes: ["menu", `menu-${type}`, vertical ? "vertical" : "horizontal"]
        });
        this.type = type;
        this.open = false;
        setTimeout(() => this.calcSize(), 500);
    }

    show() {
        this.open = true;
        this.closeSiblings();
        // this.closeChildren();
        this.html.classList.add("open");
        let animateHeight = this.type == "dropdown";
        if (animateHeight && this.height) {
            console.log(this);
            this.html.style.maxHeight = this.height;
        }
    }

    hide() {
        this.calcSize();
        this.parent.html.style.overflow = "hidden";
        this.open = false;
        this.closeChildren();
        this.html.classList.remove("open");
        let animateHeight = this.type == "dropdown";
        if (animateHeight && this.height) {
            this.html.style.maxHeight = 0 + 'px';
        }
    }

    toggle() {
        this.open ? this.hide() : this.show();
        console.log(this.html);
    }

    closeSiblings() {
        const siblings = this.parent?.parent?.children;
        siblings?.forEach(i => i.children.forEach(m => m != this && m instanceof Menu && m.hide()));
    };

    closeChildren() {
        this?.children?.forEach(i => i.children.forEach(m => m instanceof Menu && m.hide()));
    }

    calcSize() {
        this.height = this.html.scrollHeight + 'px';
        this.width = this.html.scrollWidth + 'px';
    }
}

class MenuItem extends Element {
    constructor({ label = null, icon = null, action = null, submenu = null } = {}) {
        super({
            tag: "li",
            classes: ["menu-item"]
        });

        this.button = new Button({
            classes: ["menu-button", ...(label ? ["has-label"] : [])],
            onClick: action
        }).append(...(icon ? [icon] : []), ...(label ? [label] : []));

        this.append(this.button);

        if (submenu) {
            this.submenu = submenu;
            this.submenu.classes.push("submenu");
            this.append(submenu);
            this.html.classList.add("has-submenu");
            if (!action) this.button.onClick = () => {
                submenu.toggle()
                if (submenu.open) setTimeout(()=> {
                    this.html.style.overflow = "visible";
                }, submenu.classes.includes("menu-cascading") ? 0 : 500);
            }
        }
    }
}

class Modal extends Element {
    constructor() {
      super({
        tag: "div",
        classes: ["modal"],
        attributes: {
          role: "dialog",
          "aria-modal": "true"
        }
      });
  
      this.backdrop = new Element({
        tag: "div",
        classes: ["modal-backdrop"],
        listeners: {"click": () => this.close()}
      });
  
      this.dialog = new Element({
        tag: "div",
        classes: ["modal-dialog"]
      });
  
      super.append(this.backdrop, this.dialog);
  
      // ESC closes
      this._onKeyDown = e => {
        if (e.key === "Escape") this.close();
      };
    }
  
    append(...children) {
      this.dialog.append(...children);
      return this;
    }
  
    open() {
      if (this.isOpen) return;
  
      this.isOpen = true;
      this._previousFocus = document.activeElement;
  
      body.append(this);
      document.body.classList.add("modal-open");
      document.addEventListener("keydown", this._onKeyDown);
  
      this.html.classList.add("open");
  
      // Focus first focusable element
      const focusable = this.html.querySelector(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      focusable?.focus();
    }
  
    close() {
      if (!this.isOpen) return;
  
      this.isOpen = false;
      this.html.classList.remove("open");
  
      document.removeEventListener("keydown", this._onKeyDown);
      document.body.classList.remove("modal-open");
  
      body.append(this);
      this._previousFocus?.focus();
    }
  }
  