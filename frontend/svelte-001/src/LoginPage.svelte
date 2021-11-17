<script lang="ts">
  export let loggedIn = false;
  function logIn() {
    loggedIn = true;
  }
</script>

<div>
  <h1>The Internet Computer</h1>
  <h2>Network Nervous System</h2>
  <button on:click={logIn}>Login</button>
  <span>Beta</span>
</div>

<style>
  login-page > * {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  button {
    width: 200px;
    height: 80px;
    line-height: 80px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    background-color: #52545a;
    border: var(--widget-border);
    border-radius: var(--widget-border-radius);
    font-size: 30px;
    color: #aeb7b7;
  }
</style>
