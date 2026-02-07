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
        attributes = {},
        listeners = {}
    } = {}) {
        super({
            tag: "textarea",
            id,
            classes: ["textarea", "formEl", ...classes],
            attributes: {
                name,
                rows,
                ...attributes
            },
            listeners
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
        attributes = {},
        listeners = {},
    } = {}) {
        super({
            tag: "select",
            id,
            classes: ["select", "formEl", ...classes],
            attributes: { name, ...attributes },
            listeners
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

let lastPickers = [];
let lastInput;

class ColorPicker extends Layout {
    constructor({ id = "colorPicker", hue = true, sat = true, val = true } = {}) {
        super({
            classes: ["column", "colorPicker", "formEl"]
        });

        let row = Layout.row();

        this.pickers = {};

        if (hue) this.pickers.huePicker = new HuePicker({ binder: this });
        if (sat) this.pickers.satPicker = new SatPicker({ binder: this });
        if (val) this.pickers.valPicker = new ValPicker({ binder: this });

        this.hue = 0;
        this.sat = 100;
        this.val = 50;

        this.pickerList = Object.values(this.pickers);
        row.append(this.pickers.huePicker, this.pickers.valPicker);
        this.append(row, this.pickers.satPicker);

        this.input = new Input({
            type: "color",
            name: id,
            id: id + "_input"
        });

        this.append(this.input);
        lastInput = this.input;
    }

    onPick_() {
        const hex = getColorFromHSV(this.hue, this.sat, this.val);
        this.input.value(hex);
        this.pickerList.forEach(item => item.updateColor(this.hue, this.sat, this.val));
    }
}

class Picker extends Element {
    constructor(options = {}) {
        super(options)
        this.pointer = new Element({ classes: ["pointer"] })
        this.append(this.pointer);
        this.binder = options.binder;
        if (!this.binder) this.classes.push("formEl")
        this.listeners.click = (e) => this.onClick(e);

        this.colState = createState("#081017");
    }

    onClick(e) {
        if (!this.html) return;
        const rect = this.html.getBoundingClientRect(); // div's position & size
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        const dx = x - cx;
        const dy = y - cy;

        // angle in degrees
        let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angleDeg < 0) angleDeg += 360;


        x /= rect.width;
        x = Math.round(x * 100);

        y /= rect.height;
        y = Math.round(y * 100);

        this.onPick_(x, y, angleDeg);
    }

    onPick_(x, y, a) { }

    updateColor(hue, sat, val) { }
}

class HuePicker extends Picker {
    constructor(options = {}) {
        super({ ...options, tag: "huePicker" })
        this.pointer.angle = 0;
        if (!this.binder) {
            this.input = new Input({
                type: "number",
                name: options.id,
                id: options.id + "_input"
            });

            this.append(this.input);
        }
        this.attributes.color = "#081017";

        this.hueState = createState(0);
    }

    onPick_(x, y, a) {
        let a2 = this.pointer.angle;

        a %= 360;
        a2 %= 360;
        if (a < 0) a = 360 + a;
        if (a2 < 0) a2 = 360 + a2;

        let d = [-360, 0, 360];
        let minD = Infinity;

        for (let i = 0; i < d.length; i++) {
            let D = a - (a2 + d[i]);
            if (Math.abs(D) < Math.abs(minD)) minD = D;
        }

        this.pointer.angle = this.pointer.angle + minD;
        this.pointer.html.style.transform = `rotate(${this.pointer.angle}deg)`;

        this.hue = this.pointer.angle % 360;
        if (this.hue < 0) this.hue = 360 + this.hue;

        this.hueState.set(this.hue);

        if (this.binder) {
            this.binder.hue = Math.round(this.hue);
            this.binder.onPick_();
        } else {
            this.input.value(Math.round(this.hue));
        }
    }

    updateColor(hue, sat, val) {
        this.html.style.background = `conic-gradient(from 90deg, hsl(0, ${sat}%, ${val}%), hsl(60, ${sat}%, ${val}%), hsl(120, ${sat}%, ${val}%), hsl(180, ${sat}%, ${val}%), hsl(240, ${sat}%, ${val}%), hsl(300, ${sat}%, ${val}%), hsl(360, ${sat}%, ${val}%))`;
        const hex = getColorFromHSV(hue, sat, val);
        this.html.setAttribute("color", hex);
    }
}

class SatPicker extends Picker {
    constructor(options = {}) {
        super({ ...options, tag: "satPicker" })
        if (!this.binder) {
            this.input = new Input({
                type: "number",
                name: options.id,
                id: options.id + "_input"
            });

            this.append(this.input);

            this.satState = createState(0);
        }
    }

    onPick_(x, y, a) {
        this.pointer.pos = x;
        this.sat = x;
        this.pointer.html.style.left = `${this.pointer.pos}%`;

        this.satState.set(this.sat);

        if (this.binder) {
            this.binder.sat = Math.round(this.sat);
            this.binder.onPick_();
        } else {
            this.input.value(Math.round(this.sat));
        }
    }

    updateColor(hue, sat, val) {
        this.html.style.background = `linear-gradient(to right, hsl(${hue}, 0%, ${val}%), hsl(${hue}, 100%, ${val}%))`;
    }
}

class ValPicker extends Picker {
    constructor(options = {}) {
        super({ ...options, tag: "valPicker" })
        if (!this.binder) {
            this.input = new Input({
                type: "number",
                name: options.id,
                id: options.id + "_input"
            });

            this.append(this.input);

            this.valState = createState(0);
        }
    }

    onPick_(x, y, a) {
        this.pointer.pos = y;
        this.val = y;
        this.pointer.html.style.top = `${this.pointer.pos}%`;

        this.valState.set(this.val);

        if (this.binder) {
            this.binder.val = Math.round(this.val);
            this.binder.onPick_();
        } else {
            this.input.value(Math.round(this.val));
        }
    }

    updateColor(hue, sat, val) {
        this.html.style.background = `linear-gradient(hsl(${hue}, ${sat}%, 0%), hsl(${hue}, ${sat}%, 50%), hsl(${hue}, ${sat}%, 100%))`;
    }
}

function getColorFromHSV(h, s, v) {
    const { r, g, b } = hsvToRgb(h, s, v);
    const hex = rgbToHex(r, g, b);

    return hex;
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("");
}

function hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;

    let c = v * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = v - c;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}
