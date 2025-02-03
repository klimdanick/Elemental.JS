class Card extends Element {
    constructor(width, height) {
        super();
        this.htmlEl.classList.add("card");
        if (width) this.htmlEl.style.width = ""+width;
        if (height) this.htmlEl.style.height = ""+height;
    }
}
class Title extends Element {
    constructor(content) {
        super("h1");
        this.htmlEl.classList.add("title");
        this.htmlEl.innerText = content;
    }
}

class Text extends Element {
    constructor(content) {
        super("p");
        this.htmlEl.classList.add("text");
        this.htmlEl.innerText = content;
    }
}
class Button extends Element {
    constructor(label, callback) {
        super("div");
        if (typeof(label) == "string") this.htmlEl.innerText = label;
        else if (isDOM(label)) this.htmlEl.appendChild(label);
        this.htmlEl.classList.add("elemental");
        this.htmlEl.classList.add("button");
        this.htmlEl.onclick = callback;
    }
}

class ImageEl extends Element {
    constructor() {
        super();
        this.htmlEl.classList.add("image");
        this.image = document.createElement("img");
        this.htmlEl.appendChild(this.image);

        let that = this;
        this.preload = new Image;
        this.preload.onload = function() {
            that.image.src = this.src;

            if (that.full) {
                if (!that.height) {
                    that.image.width = that.htmlEl.offsetWidth;
                    let aspRatio = this.height / this.width;
                    that.htmlEl.style.height = Math.floor(that.htmlEl.offsetWidth * aspRatio) + "px";
                }
                if (!that.width) {
                    that.image.height = that.htmlEl.offsetHeight;
                    let aspRatio = this.width / this.height;
                    that.htmlEl.style.width = Math.floor(that.htmlEl.offsetHeight * aspRatio) + "px";
                }
            } else {
                that.image.style.height = that.htmlEl.offsetHeight;
                that.image.style.width = that.htmlEl.offsetWidth;
            }
        }
    }

    size({width, height, full = true}) {
        setTimeout(() => {
            if (!width && !height) {
                width = "100%;";
                this.htmlEl.width = width;
            }
            setTimeout(() => {
                if (width && !height) {
                    this.htmlEl.style.width = width;
                    this.htmlEl.style.height = Math.floor(this.htmlEl.offsetWidth * (3/4)) + "px";
                    console.log(this.htmlEl.style.width);
                    console.log(this.htmlEl.style.height);
                }
                if (!width && height) {
                    this.htmlEl.style.height = height;
                    this.htmlEl.style.width = Math.min(Math.floor(this.htmlEl.offsetHeight * (4/3)) + "px", this.htmlEl.offsetWidth);
                }
                if (width && height) {
                    this.htmlEl.style.width = width;
                    this.htmlEl.style.height = height;
                }
                this.widh = width;
                this.height = height;
                this.full = full;
            }, 2);
        }, 2);
        return this;
    }

    load(src = "") {
        setTimeout(() => {this.preload.src = src;}, 5);
        return this;
    }
}



loadedScripts.push("/src/js/card.js");