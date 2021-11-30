<script lang="ts">
  import { onMount } from "svelte";
  import Auth from "./Auth.svelte";
  import AccountsPage from "./AccountsPage.svelte";
  import NeuronsPage from "./NeuronsPage.svelte";
  import VotingPage from "./VotingPage.svelte";
  import CanistersPage from "./CanistersPage.svelte";

  // Identity, shared with all tabs:
  let signedIn;
  let principal;

  /**
   * Navigates to a part of this page.
   */
  function go(target) {
    window.location.hash = target;
    document.getElementById(target).scrollIntoView();
  }

  onMount(async () => {
    let target = window.location.hash.slice(1);
    if (target) {
      go(target);
    }
  });

  // Navigation bar controls:
  let carousel;
  let nav_bar;
  let nav_background;
  const num_elements = 4; // Number of tabs.
  // This can be used but is compiled to an inline style element, which is bad for content security.
  // $: cssVarStyles = `--nav-background-width:${Math.round(100 / num_elements)}%`
  /**
   * Moves the nav bar background in response to swiping actions.
   */
  function onCarouselSwipe() {
    let carouselRatio =
      carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth);
    nav_background.style.left = `calc(${getComputedStyle(nav_bar).width} * ${
      ((num_elements - 1) / num_elements) * carouselRatio
    })`;
  }
</script>

<svelte:head>
  <!-- This is just a default; need to examine the CSP carefully and lock down accordingly. -->
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; child-src 'none';"
  />
</svelte:head>

<div class="App">
  <div class="header-bar">
    <h1 class="title">NETWORK NERVOUS SYSTEM</h1>
  </div>
  <Auth bind:signedIn bind:principal />
  <div class="nav-bar" bind:this={nav_bar}>
    <div class="background" bind:this={nav_background} />
    <div on:click={() => go("AccountsPage")}>ICP</div>
    <div on:click={() => go("NeuronsPage")}>NEURONS</div>
    <div on:click={() => go("VotingPage")}>VOTING</div>
    <div on:click={() => go("CanistersPage")}>CANISTERS</div>
  </div>
  <div class="content" bind:this={carousel} on:scroll={onCarouselSwipe}>
    <div id="AccountsPage"><AccountsPage /></div>
    <div id="NeuronsPage"><NeuronsPage /></div>
    <div id="VotingPage"><VotingPage /></div>
    <div id="CanistersPage"><CanistersPage /></div>
  </div>
</div>

<style global>
  :root {
    --widget-border: 25px;
    --widget-border-radius: 25px;
    --widget-border-radius-small: 10px;
    --widget-grey: #282a2d;
    --text-grey: #aeb7b7;
    --background-grey: #383c3c;
    --button-blue: #005fb7;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: white;
    background-color: black;
  }

  .header-bar {
    /* TODO: get the real values - this is just by picking colours imprecisely off the nns app */
    background-image: linear-gradient(
      to right,
      #f9a739,
      #ee3e4b,
      #502d89,
      #2b8ae0
    );
    height: 70px;
    width: 100%;
  }
  .header-bar h1 {
    text-align: center;
    line-height: 70px;
    font-size: 24px;
    letter-spacing: 2px;
    margin: 0;
  }

  .App {
    text-align: center;
  }

  .nav-bar {
    height: 70px;
    border-radius: var(--widget-border-radius);
    background-color: var(--widget-grey);
    margin: 10px;
    display: flex;
    justify-content: space-around;
    position: relative;
  }
  .nav-bar > * {
    margin-top: auto;
    margin-bottom: auto;
    z-index: 1;
    width: 200px;
  }
  .nav-bar > .background {
    height: 100%;
    width: 25%; /* 100 / 4 elements */
    background-color: var(--button-blue);
    border-radius: var(--widget-border-radius-small);
    position: absolute;
    left: 0;
    z-index: 0;
  }
  .content {
    width: 100vw;
    height: calc(100vh - 200px);
    display: flex;

    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    background: linear-gradient(#383c3c 80%, black);
  }
  .content > * {
    width: 100vw;
    height: calc(100vh - 200px);
    /* Make sure the full width is maintained */
    display: flex;
    flex-shrink: 0;
    /* Align the edge after swiping. */
    scroll-snap-align: start;
  }

  .content::-webkit-scrollbar {
    display: none;
  }
</style>
