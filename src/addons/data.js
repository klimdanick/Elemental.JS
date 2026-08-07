const dataAddon = new Addon({
    cssFiles: [`${defaultLibURL}/src/addons/data.css`],
})

class Table extends Element {
    constructor({ columns = [], data = [] } = {}) {
        super({ tag: "table", classes: ["table"] });

        this.columns = columns;
        this.data = data;
    }

    render() {
        this.clear();

        const thead = new Element({ tag: "thead" });
        const tbody = new Element({ tag: "tbody" });

        // Headers
        const headerRow = new Element({ tag: "tr" });
        this.columns.forEach(col => {
            const label = typeof col === "string" ? col : col.label;
            headerRow.append(new Element({ tag: "th" }).append(label));
        });
        thead.append(headerRow);

        // Rows
        this.data.forEach(row => {
            const tr = new Element({ tag: "tr" });

            this.columns.forEach(col => {
                const value =
                    !Array.isArray(row)
                        ? row[col.key]
                        : row[this.columns.indexOf(col)];

                tr.append(new Element({ tag: "td" }).append(value));
            });

            tbody.append(tr);
        });

        this.append(thead, tbody);

        super.render();
    }
}

class List extends Element {
    constructor(items = []) {
        super({ tag: "ul", classes: ["list"] });

        this.item = items;
    }

    render() {
        this.clear();

        items.forEach(item => {
            const li = new Element({ tag: "li", classes: ["list-item"] });
            li.append(item);
            this.append(li);
        });

        super.render();
    }
}

class BarGraph extends Element {
    constructor({ values = [], labels = [], max } = {}) {
        super({ tag: "div", classes: ["bar-graph"] });

        this.values = values;
        this.labels = labels;
        this.max = max;
    }

    render() {
        this.clear();

        const max = this.max ? this.max : Math.max(...this.values);

        this.values.forEach((value, i) => {
            const bar = new Element({
                tag: "div",
                classes: ["bar"],
                attributes: { style: `height: ${(value / max) * 100}%` }
            });

            bar.append(
                new Element({ tag: "span", classes: ["bar-label"] })
                    .append(this.labels[i] ?? "")
            );

            this.append(bar);
        });

        super.render();
    }
}

class ProgressBar extends Element {
    constructor({ value = 0 } = {}) {
        super({ tag: "div", classes: ["progress"] });

        this.value = value;
        this.fill = new Element({ classes: ["progress-fill"], attributes: { style: `width: ${value}%` } });

        this.append(this.fill);
    }

    render() {
        this.fill.attributes.style = `width: ${this.value}%`;
        super.render();
    }
}

class LineGraph extends Canvas {
    constructor({ values = [], min = { x: 0, y: 0 }, max = { x: 100, y: 100 }, n = 100} = {}) {
        super({classes: ["lineGraph"]});

        this.points = values;
        this.min = min;
        this.max = max;
        this.n = n;
    }

    update(ctx) {
        ctx.clearRect(0, 0, this.html.width, this.html.height);
        let color = getComputedStyle(this.html).getPropertyValue('color') || CURIOS_BLUE;
        ctx.strokeStyle = color;
        ctx.lineWidth  = 2;
        if (!this.points || this.points.length == 0) return;
        ctx.beginPath();
        let p = this.points[0]
        let calcPosX = (v) => (v.x-this.min.x)/(this.max.x-this.min.x)*this.html.width;
        let calcPosY = (v) => this.html.height-((v.y-this.min.y)/(this.max.y-this.min.y)*this.html.height);
        let calcPos = (v) => [calcPosX(v), calcPosY(v)];

        ctx.moveTo(...calcPos(p))
        for (let i = 1; i < this.points.length; i++) {
            p = this.points[i]
            ctx.lineTo(...calcPos(p))
        }
        ctx.stroke();
    }

    append(...val) {
        this.points.push(...val);
        while (this.points.length > this.n) this.points.shift();
    }
}
