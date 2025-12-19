AttachScript("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js");
AttachStyle("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css");

let lastCodeEl;

class CodeBlock extends Element {
    constructor({
      code = "",
      language = "",
      classes = [],
      attributes = {}
    } = {}) {
      super({
        tag: "pre",
        classes: ["code-block", ...classes],
        attributes
      });
  
      this.codeEl = new Element({
        tag: "code",
        classes: language ? [`language-${language}`] : []
      });

      lastCodeEl = this
      console.log(code);
      this.codeEl.append(code);
      this.append(this.codeEl);
    }
  
    render() {
      super.render?.();
  
      // Highlight.js integration (safe + optional)
      if (window.hljs) {
        window.hljs.highlightElement(this.codeEl.html);
      }
    }
  }
  