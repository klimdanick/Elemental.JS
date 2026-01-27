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

        const max = Math.max(...values);

        values.forEach((value, i) => {
            const bar = new Element({
                tag: "div",
                classes: ["bar"],
                attributes: { style: `height: ${(value / max) * 100}%` }
            });

            bar.append(
                new Element({ tag: "span", classes: ["bar-label"] })
                    .append(labels[i] ?? "")
            );

            this.append(bar);
        });
    }
}

class ProgressBar extends Element {
    constructor({ value = 0 } = {}) {
        super({ tag: "div", classes: ["progress"] });

        const fill = new Element({ classes: ["progress-fill"], attributes: {style: `width: ${value}%`} });

        this.append(fill);
    }
}