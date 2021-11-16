/**
 * Main geometry of the app.
 */
class MainLayout extends HTMLElement {
  /* Initialise */
  constructor() {
    super();
    this.loggedIn = false;
  }

  /**
   * Runs when the element is added to the DOM.
   */
  connectedCallback() {
    console.log("Connected");
    this.render();
  }

  /**
   * Populate HTML
   */
  render() {
    this.innerHTML = this.loggedIn ?`
      <div class="header-bar">
        <h1 class="title">NETWORK NERVOUS SYSTEM</h1><span class="logout"></span>
        <nav-button href="logout" class="logout"><span>Logout</span></nav-button>
      </div>
      <div class="nav-bar">
        <div class="background"></div>
        <nav-button href="accounts"><div>ICP</div></nav-button>
        <nav-button href="page-2"><div>NEURONS</div></nav-button>
        <nav-button href="page-3"><div>VOTING</div></nav-button>
        <nav-button href="page-4"><div>CANISTERS</div></nav-button>
      </div>
      <div class="content">
        <accounts-page id="accounts"></accounts-page>
        <div id="page-2">Page2</div>
        <div id="page-3">Page3</div>
        <div id="page-4">Page4</div>
      </div>
    `: `<login-page></login-page>`;

    let container = this.querySelector('.content');
    if (container) {
        let nav_bar = this.querySelector('.nav-bar');
        let nav_background = this.querySelector('.nav-bar .background');
        let num_elements = nav_bar.children.length - 1;
        nav_background.style.width = `${Math.round(100/num_elements)}%`;
        container.onscroll = (e) => nav_background.style.left = `calc(${getComputedStyle(nav_bar).width} * ${((num_elements-1) /num_elements) * container.scrollLeft / (container.scrollWidth - container.clientWidth)})`;
    }
  }

  /**
   * Navigates to a part of this page.
   */
  go(target) {
    if (target === 'login') {
       this.loggedIn = true;
       this.render();
    } else if (target === 'logout') {
       this.loggedIn = false;
       this.render();
    } else {
       document.getElementById(target).scrollIntoView();
    }
  }

  /**
   * Fancy sliding action of the button background.
   */
  slide_tab() {
    container.scrollLeft / (container.scrollWidth - container.clientWidth)
  }
}

customElements.define('main-layout', MainLayout);
