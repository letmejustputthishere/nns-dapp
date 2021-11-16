/**
 * HTML element for in-app navigation.
 */
class NavButton extends HTMLElement {
  /**
   * Create the data structures, do not render.
   */
  constructor() {
    super();
    this.onclick = this.click;
  }

  /**
   * Handles a click, by finding the closest router and executing the route.
   */
  click() {
    const router = this.closest(".router");
    if (router) {
      const target = this.getAttribute("href");
      console.log("Nav to:", target);
      router.go(target);
    } else {
      console.error({message: "Element has no ancestral router", target: this});
    }
  }
}

customElements.define("nav-button", NavButton);
