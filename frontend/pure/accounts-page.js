/**
 * Accounts page
 */
class AccountsPage extends HTMLElement {
  /* Initialise */
  constructor() {
    super();
    this.accounts = [{name: "Main", icp: 1.3, principal: "asfhslkjghsalkjghaslkgjahs", type: ""}];
  }

  /**
   * Runs when the element is added to the DOM.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Gets total ICP
   */
  total_icp() {
    return this.accounts.reduce((a,b) => a + b.icp, 0);
  }

  /**
   * Populate HTML
   */
  render() {
    this.innerHTML = `
       <div class="body-panel">
          <div class="accounts-header"><h2>Accounts</h2><span class="icp">${this.total_icp()}</span></div>
          ${this.accounts.map(account => `<div class="account"><span class="account-name">${account.name}</span><span class="icp">${account.icp}</span></div>`)}
       </div>
       <div class="accounts-button-bar">
         <button>New Transaction</button>
         <button>Add Account</button>
       </div>
    `;
  }
}

customElements.define('accounts-page', AccountsPage);
