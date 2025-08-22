const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>



</style>

<div id="header">
    <div class="navbar is-link">
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" style="margin-left: 0px">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>

        <div class="navbar is-link" id="navMenu">
            <a class="navbar-item is-hoverable" href="index.html" id="about">
                About
            </a>

            <a class="navbar-item is-hoverable" href="app.html" id="app">
                App
            </a>

            <a class="navbar-item is-hoverable" href="documentation.html" id="documentation">
                Documentation
            </a>
        </div>
    </div>
</div>

`;

class Navigation extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        //Attributes
        this.burger = this.shadowRoot.querySelector(".navbar-burger");
        this.navMenu = this.shadowRoot.querySelector("#navMenu");
    }

    connectedCallback() {
        this.render();

        //Hamburger menu for mobile
        this.burger.onclick = e => {
            //Hiding or showing the nav menu
            if(this.navMenu.style.display == "none") {
                this.navMenu.style.display = "";
            } else {
                this.navMenu.style.display = "none";
            }
        };
    }

    disconnectedCallback() {
        this.burger.onclick = null;
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        this.render();
    }

    static get observedAttributes() {
        return ["data-page"];
    }

    render() {
        //Highlighting the page the user is on
        let page = this.getAttribute('data-page') ? this.getAttribute('data-page') : "none";

        let pageButton = this.shadowRoot.querySelector("#" + page);
        if(pageButton != null) {
            pageButton.className = "navbar-item is-active border-radius";
        }
    }
}

customElements.define('header-nav', Navigation);