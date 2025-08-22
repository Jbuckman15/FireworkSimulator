const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

<div id="link">
    <a href="">
        <p></p>
    </a>
</div>
`;

class EasyLink extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        //Attributes
        this.address = this.shadowRoot.querySelector("a");
        this.display = this.shadowRoot.querySelector("p");
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
        return ["data-link"];
    }

    render() {
        //Highlighting the page the user is on
        let link = this.getAttribute('data-link') ? this.getAttribute('data-link') : "Link";

        this.address.href = link;
        this.display.innerHTML = link;
    }
}

customElements.define('easy-link', EasyLink);