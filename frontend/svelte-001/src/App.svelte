<script lang="ts">
	import LoginPage from './LoginPage.svelte';

	export let name: string;

	let loggedIn: false;
	function toggle() {
		loggedIn = !loggedIn;
	}
</script>

<main>
	{#if loggedIn}
		<button on:click={toggle}>
			Log out
		</button>
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
</style>
