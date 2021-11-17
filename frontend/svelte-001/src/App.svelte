<script lang="ts">
	import LoginPage from './LoginPage.svelte';
	import AccountsPage from './AccountsPage.svelte';
	import NeuronsPage from './NeuronsPage.svelte';
	import CanistersPage from './CanistersPage.svelte';
	import VotingPage from './VotingPage.svelte';

	let loggedIn = false;

	function go(target) {
		if (target === 'loginPage') { loggedIn = false; }
		else {
			document.getElementById(target).scrollIntoView();
		}
	}
</script>

<main>
	{#if loggedIn}
      <div class="header-bar">
        <h1 class="title">NETWORK NERVOUS SYSTEM</h1><span class="logout"></span>
        <span class="logout" on:click={() => go("loginPage")}>Logout</span>
      </div>
      <div class="nav-bar">
        <div class="background"></div>
        <div on:click={() => go('AccountsPage')}>ICP</div>
        <div on:click={() => go('NeuronsPage')}>NEURONS</div>
        <div on:click={() => go('VotingPage')}>VOTING</div>
        <div on:click={() => go('CanistersPage')}>CANISTERS</div>
      </div>
      <div class="content">
        <div id="AccountsPage"><AccountsPage></AccountsPage></div>
	<div id="NeuronsPage"><NeuronsPage></NeuronsPage></div>
	<div id="VotingPage"><VotingPage></VotingPage></div>
	<div id="CanistersPage"><CanistersPage></CanistersPage></div>
      </div>
	{:else}
		<LoginPage bind:loggedIn={loggedIn}>
		</LoginPage>
	{/if}
</main>

<style>
:global(:root){
  --widget-border: 25px;
  --widget-border-radius: 25px;
  --widget-border-radius-small: 10px;
  --widget-grey: #282a2d;
  --text-grey: #aeb7b7;
  --button-blue: #005fb7;
}

:global(body) {
    margin: 0;
    padding: 0;
}

	main {
		/* Svelte defaults: */
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		/* Imported from pure: */
    width: 100vw;
    height: 100vh;
    display: block;
    background-color: black;
    font-family: arial;
    color: white;
               /* trouble with overlow.. not sure why.  Hiding is not pretty but it works: */
               overflow: hidden;
               margin: 0;
               padding: 0;


	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

.header-bar {
  /* TODO: get the real values - this is just by picking colours imprecisely off the nns app */
  background-image: linear-gradient(to right, #f9a739, #ee3e4b, #502d89, #2b8ae0);
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
.header-bar .logout {
    width: 100px;
    height: 30px;
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
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
}
.nav-bar > .background {
  height: 100%;
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
