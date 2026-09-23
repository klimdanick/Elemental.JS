const layoutAddon = new Addon({
    cssFiles: [`${defaultLibURL}/src/addons/layouts.css`],
})

class Navbar extends Layout {
    constructor({
        tag = "Layout",
        id = "",
        classes = [],
        attributes = {},
        listeners = {}
    } = {}) {
        super({tag, id, classes: ["Navbar", "row", ...classes], attributes, listeners});
    }
}

class Footer extends Layout {
    constructor({
        tag = "Layout",
        id = "",
        classes = [],
        attributes = {},
        listeners = {}
    } = {}) {
        super({tag, id, classes: ["Footer", "row", ...classes], attributes, listeners});
    }
}

class Sidebar extends Layout {
    constructor({
        tag = "Layout",
        id = "",
        classes = [],
        attributes = {},
        listeners = {}
    } = {}) {
        super({tag, id, classes: ["Sidebar", "column", ...classes], attributes, listeners});
    }
}