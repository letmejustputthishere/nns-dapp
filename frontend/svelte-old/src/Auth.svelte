<script lang="ts">
  import { onMount } from "svelte";
  import { AuthClient } from "@dfinity/auth-client";

  let client;
  export let signedIn = false;
  export let principal = "";
  let identityProvider = String(import.meta.env.VITE_IDENTITY_PROVIDER || "identity.ic0.app"); // Replaced at compile time

  const initAuth = async () => {
    client = await AuthClient.create();
    const isAuthenticated = await client.isAuthenticated();

    if (isAuthenticated) {
      const identity = client.getIdentity();
      principal = identity.getPrincipal().toString();
      signedIn = true;
    }
  };

  const signIn = async () => {
    await new Promise((resolve, reject) => {
      client.login({
        identityProvider,
        onSuccess: () => {
          resolve(null);
        },
        onError: reject,
      });
    });
    const identity = client.getIdentity();
    principal = identity.getPrincipal().toString();
    signedIn = true;
  };

  const signOut = async () => {
    await client.logout();
    signedIn = false;
    principal = "";
  };

  onMount(initAuth);
</script>

<div class="auth-expandable">
  {#if !signedIn && client}
    <div class="auth-overlay">
      <div />
      <h1>The Internet Computer</h1>
      <h2>Network Nervous System</h2>
      <div />
      <button on:click={signIn} class="auth-button">Login</button>
      <span>{import.meta.env.PROD?"":import.meta.env.MODE} Beta</span>
    </div>
  {/if}

  <div class="auth-section">
    {#if signedIn}
      <button on:click={signOut} class="auth-button">Logout</button>
    {/if}
  </div>
</div>

<style>
  .auth-section {
    padding: 1em;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: right;
    position: fixed;
    top: 0;
    right: 0;
  }

  .auth-button {
    background: white;
    padding: 0 2em;
    border-radius: 60px;
    font-size: 1em;
    line-height: 40px;
    height: 33px;
    outline: 0;
    border: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .auth-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background-color: var(--background-grey);
    display: grid;
    grid-template-rows: 87px 70px 40px auto 120px 140px;
  }
  .auth-overlay h1 {
    font-size: 39px;
  }
  .auth-overlay h2 {
    font-size: 32px;
  }
  .auth-overlay span {
    font-weight: bold;
  }

  .auth-overlay > * {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    color: #e4f0f0;
  }
  .auth-overlay button {
    padding-left: 10px;
    padding-right: 10px;
    width: 160px;
    height: 100px;
    line-height: 80px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    background-color: #52545a;
    border: var(--widget-border);
    border-radius: var(--widget-border-radius-small);
    font-size: 30px;
    color: #aeb7b7;
  }
</style>
