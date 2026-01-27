const dataAddon = new Addon({
    cssFiles: [`${defaultLibURL}/src/addons/data.css`],
})

class Table extends Element {
    constructor({ columns = [], data = [] } = {}) {
        super({ tag: "table", classes: ["table"] });

        const thead = new Element({ tag: "thead" });
        const tbody = new Element({ tag: "tbody" });

        // Headers
        const headerRow = new Element({ tag: "tr" });
        columns.forEach(col => {
            const label = typeof col === "string" ? col : col.label;
            headerRow.append(new Element({ tag: "th" }).append(label));
        });
        thead.append(headerRow);

        // Rows
        data.forEach(row => {
            const tr = new Element({ tag: "tr" });

            columns.forEach(col => {
                console.log(row);
                const value =
                    !Array.isArray(row)
                        ? row[col.key]
                        : row[columns.indexOf(col)];

                tr.append(new Element({ tag: "td" }).append(value));
            });

            tbody.append(tr);
        });

        this.append(thead, tbody);
    }
}

class List extends Element {
    constructor(items = []) {
        super({ tag: "ul", classes: ["list"] });

        items.forEach(item => {
            const li = new Element({ tag: "li", classes: ["list-item"] });
            li.append(item);
            this.append(li);
        });
    }
}

class BarGraph extends Element {
    constructor({ values = [], labels = [] } = {}) {
        super({ tag: "div", classes: ["bar-graph"] });

        this.values = values;
        this.labels = labels;
    }

    render() {
        this.clear();

        const max = Math.max(...this.values);

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
        this.fill = new Element({ classes: ["progress-fill"], attributes: {style: `width: ${value}%`} });

        this.append(this.fill);
    }

    render() {
        this.fill.attributes.style =`width: ${this.value}%`;
        super.render();
    }
}