const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>

#footer {
    padding: 5px;
    position: fixed;
    bottom: 0px;
    width: 100%;
    background-color: rgb(72, 95, 199);
}

</style>

<div id="footer">
    <p>Created by Jack Buckman</p>
    <p>IGME 330</p>
</div>

`;

class FireworkFooter extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        this.render();
    }

    static get observedAttributes() {
    }

    render() {
    }
}

customElements.define('firework-footer', FireworkFooter);
