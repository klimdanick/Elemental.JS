const simpleLayout = (direction = "column") => {
    let el = document.createElement("div");
    el.classList.add("elemental");
    el.classList.add("layout");
    if (direction == "grid") {
        el.classList.add("grid");
    } else {
        el.style.flexDirection = direction;
    }
    return el;
}

const sideAndTopBarLayout = () => {
    let background = document.createElement("div");
    background.classList.add("fill");
    background.style.backgroundColor = "var(--level0)";
    document.getElementsByTagName("body")[0].appendChild(background);
    let topbar = simpleLayout(direction = "row");
    topbar.classList.add("topbar");
    document.getElementsByTagName("body")[0].appendChild(topbar);
    let sidebar = simpleLayout();
    sidebar.classList.add("sidebar");
    document.getElementsByTagName("body")[0].appendChild(sidebar);
    let layout = simpleLayout();
    layout.classList.add("fill");
    layout.classList.add("sideAndTopBarLayoutMain");
    document.getElementsByTagName("body")[0].appendChild(layout);

    return {sidebar, topbar, content: layout};
}

loadedScripts.push("/src/js/layout.js");