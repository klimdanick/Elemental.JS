const FeedbackAddon = new Addon({
    cssFiles: [`${defaultLibURL}/src/addons/feedback.css`],
})

const FEEDBACK_TYPES = {
    info:    { icon: getEjsAsset("info"), class: "info" },
    success: { icon: getEjsAsset("checkmark"), class: "success" },
    warning: { icon: getEjsAsset("warning"), class: "warning" },
    error:   { icon: getEjsAsset("error"), class: "error" }
  };

let ToastLayout;

class Toast extends Element {
    constructor({ type = FEEDBACK_TYPES.info, message = "", duration = 3000}) {
        super({ tag: "toast", classes: [type.class, "feedback"]});
        this.append(/*new Icon({ src:type.icon}),*/ message); // TODO add icon support
        this.type = type;
        this.message = message;
        this.duration = duration;

        if (!ToastLayout) {
            ToastLayout = Layout.column({ id: "toastLayout"});
            body.append(ToastLayout);
            body.render();
        }
    }

    buildToast = () => new Toast({type: this.type, message: this.message, duration: this.duration})

    show() {
        let toast = this.buildToast();
        ToastLayout.append(toast);
        body.render();
        setTimeout(() => {ToastLayout.remove(toast); body.render();}, this.duration);
    }
}