## What is an addon?

An addon should be able to do one or more of:

* register new Elements / Components
* add behavior (directives, helpers)
* inject CSS
* hook into lifecycle events

An addon is just a JS module with a known shape.

No bundler. No dependency graph. No global hacks.

---

## Core Idea

An addon consists of ``html``, ``css`` and ``js``.
There should always be 1 main js file for your addon.

This file should handle the loading of all the other source code of the addon.

---

## Loading addons

The main ``js`` file of the addon had an addon object like the following:

```js
const yourAddon = new Addon({
    jsFiles: ["addon_utils.js"],
    cssFiles: ["addon.css"],
    htmlFiles: [],
});
```

All paths to source files of your addon should be listed here.
Also dependencie paths can be added here.

Now to load the addon ad user can add this to their html file:

```html
<script>loadAddon("yourAddon.js")</script>
```