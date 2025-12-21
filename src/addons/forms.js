const FormAddon = new Addon({
    cssFiles: [`${defaultLibURL}/src/addons/forms.css`],
})

class Form extends Layout {
    constructor({ onSubmit = null, ...opts } = {}) {
        super({ tag: "form", ...opts });

        this.onSubmit = onSubmit;
    }

    render() {
        super.render();
        if (this.onSubmit) {
            this.html.addEventListener("submit", (e) => {
                e.preventDefault();
                this.onSubmit(new FormData(this.html), e);
            });
        }
    }

    data() {
        return Object.fromEntries(new FormData(this.html));
    }
}

class Input extends Element {
    constructor({
        type = "text",
        name = "",
        value = "",
        placeholder = "",
        id = "",
        classes = [],
        attributes = {},
        listeners = {}
    } = {}) {
        super({
            tag: "input",
            id,
            classes: ["input", "formEl", ...classes],
            attributes: {
                type,
                name,
                value,
                placeholder,
                ...attributes
            },
            listeners
        });
    }

    value(val) {
        if (val === undefined) return this.html.value;
        this.html.value = val;
        return this;
    }
}

class TextInput extends Input {
    constructor(options = {}) {
        super({ ...options, type: "text" });
    }
}


class EmailInput extends Input {
    constructor(options = {}) {
        super({ ...options, type: "email" });
    }
}

class PasswordInput extends Input {
    constructor(options = {}) {
        super({ ...options, type: "password" });
    }
}

class NumberInput extends Input {
    constructor({
        type = "text",
        name = "",
        value = 0,
        min = 0,
        max = 100,
        placeholder = "",
        id = "",
        classes = [],
        attributes = {},
        listeners = {}
    }) {
        super({ type: "number", name, value, placeholder, id, classes: ["numberInput", ...classes], attributes: { min, max, ...attributes }, listeners });
    }
}

class Slider extends Input {
    constructor({
        name = "",
        value = 0,
        min = 0,
        max = 100,
        step = 1,
        id = "",
        classes = [],
        attributes = {},
        listeners = {}
    } = {}) {
        super({
            type: "range",
            name,
            value,
            id,
            classes: ["slider", ...classes],
            attributes: {
                min,
                max,
                step,
                ...attributes
            },
            listeners
        });
    }
}

function bindNumberAndSlider(numberInput, slider) {
    // Slider → Number
    slider.html.addEventListener("input", () => {
        numberInput.value(slider.value());
    });

    // Number → Slider
    numberInput.html.addEventListener("input", () => {
        let v = Number(numberInput.value());

        // Clamp value
        const min = Number(slider.html.min);
        const max = Number(slider.html.max);
        v = Math.min(max, Math.max(min, v));

        slider.value(v);
    });
}

class NumberSlider extends Layout {
    constructor({
        value = 0,
        min = 0,
        max = 100,
        step = 1,
        dir = "row",
        id = "",
        classes = [],
        name = ""
    } = {}) {
        super({
            classes: ["number-slider", "formEl", dir, ...classes]
        });

        this.number = new NumberInput({
            name,
            value,
            min,
            max
        });

        this.slider = new Slider({
            value,
            min,
            max,
            step
        });

        this.append(this.slider, this.number);
    }

    render() {
        super.render();
        bindNumberAndSlider(this.number, this.slider);
    }

    value(val) {
        if (val === undefined) return this.number.value();
        this.number.value(val);
        this.slider.value(val);
        return this;
    }
}



class TextArea extends Element {
    constructor({
        name = "",
        value = "",
        rows = 4,
        id = "",
        classes = [],
        attributes = {}
    } = {}) {
        super({
            tag: "textarea",
            id,
            classes: ["textarea", "formEl", ...classes],
            attributes: {
                name,
                rows,
                ...attributes
            }
        });

        this.html.value = value;
    }

    value(val) {
        if (val === undefined) return this.html.value;
        this.html.value = val;
        return this;
    }
}

class Checkbox extends Element {
    constructor({
        name = "",
        checked = false,
        id = "",
        classes = [],
        attributes = {}
    } = {}) {
        super({
            tag: "input",
            id,
            classes: ["checkbox", "formEl", ...classes],
            attributes: {
                type: "checkbox",
                name,
                checked,
                ...attributes
            }
        });
    }

    value(val) {
        if (val === undefined) return this.html.checked;
        this.html.checked = val;
        return this;
    }
}

class Select extends Element {
    constructor({
        name = "",
        options = [],
        value = "",
        id = "",
        classes = [],
        attributes = {}
    } = {}) {
        super({
            tag: "select",
            id,
            classes: ["select", "formEl", ...classes],
            attributes: { name, ...attributes }
        });

        this.options = options;
        // this.value_ = value;
    }

    render() {
        super.render();
        this.options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.label;
            if (opt.value === this.value) option.selected = true;
            this.html.appendChild(option);
        });
    }

    value(val) {
        if (val === undefined) return this.html.value;
        this.html.value = val;
        return this;
    }
}

class ToggleButton extends Element {
    constructor({
        labelOn = "On",
        labelOff = "Off",
        initial = false,
        id = "",
        classes = [],
        attributes = {},
        listeners = {},
        onChange = null
    } = {}) {
        super({
            tag: "button",
            id,
            classes: ["toggle-button", "formEl", ...classes],
            attributes: {
                type: "button",
                "aria-pressed": initial,
                ...attributes
            },
            listeners
        });

        this.state = Boolean(initial);
        this.labelOn = labelOn;
        this.labelOff = labelOff;
        this.onChange = onChange;
    }

    render() {
        super.render();

        this._renderLabel();

        this.html.addEventListener("click", () => {
            this.toggle();
        });
    }

    _renderLabel() {
        this.html.textContent = this.state ? this.labelOn : this.labelOff;
        this.html.setAttribute("aria-pressed", String(this.state));
        this.html.classList.toggle("is-on", this.state);
    }

    toggle() {
        this.state = !this.state;
        this._renderLabel();
        if (this.onChange) this.onChange(this.state);
        return this;
    }

    value(val) {
        if (val === undefined) return this.state;
        this.state = Boolean(val);
        this._renderLabel();
        return this;
    }
}

class ToggleSwitch extends Element {
    constructor({
        checked = false,
        id = "",
        classes = [],
        attributes = {},
        onChange = null,
        name = ""
    } = {}) {
        super({
            tag: "label",
            classes: ["toggle-switch", "formEl", ...classes]
        });

        this.input = new Element({
            tag: "input",
            attributes: {
                type: "checkbox",
                name,
                id,
                ...attributes
            }
        });

        this.slider = new Element({
            tag: "span",
            classes: ["slider"]
        });

        this.checked = checked;

        this.onChange = onChange;

        this.append(this.input, this.slider);
    }

    render() {
        super.render();
        this.input.html.checked = this.checked;
        if (this.onChange) {
            this.input.html.addEventListener("change", () => {
                this.onChange(this.input.html.checked);
            });
        }
    }

    value(val) {
        if (val === undefined) return this.input.html.checked;
        this.checked = Boolean(val);
        this.input.html.checked = Boolean(val);
        return this;
    }

    toggle() {
        this.value(!this.value());
        return this;
    }
}


class FormGroup extends Layout {
    constructor({
        icon = undefined,
        label = "",
        input,
        help = "",
        error = "",
        dir = "row"
    } = {}) {
        super({
            classes: [dir, "form-group"]
        });

        if (label) {
            this.append(
                new Header({
                    level: 3,
                }).append(...(icon ? [icon, label] : [label]))
            );
        }

        if (input) this.append(input);
        this.input = input;

        if (help) {
            this.append(
                new Element({ tag: "small", classes: ["form-help"] }).append(help)
            );
        }

        if (error) {
            this.append(
                new Element({ tag: "div", classes: ["form-error"] }).append(error)
            );
        }
    }

    value(val) {
        return this.input.value();
    }
}

class SubmitButton extends Button {
    constructor(options = {}) {
        super({ ...options, type: "submit", classes: ["submit", ...(options.classes || [])] });
    }
}