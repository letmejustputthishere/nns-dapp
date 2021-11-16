/**
 * Login page
 */
class LoginPage extends HTMLElement {
  /* Initialise */
  constructor() {
    super();
  }

  /**
   * Runs when the element is added to the DOM.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Populate HTML
   */
  render() {
    this.innerHTML = `
       <h1>The Internet Computer</h1>
       <h2>Network Nervous System</h2>
       <nav-button href="login">Login</nav-button>
       <span>Beta</span>
    `;
  }
}

customElements.define('login-page', LoginPage);
