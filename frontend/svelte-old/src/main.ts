import App from "./App.svelte";
import { AccountIdentifier } from "@dfinity/nns";

const app = new App({
  target: document.getElementById("app"),
});

export default app;

		const accountIdentifier = AccountIdentifier.fromHex(
				"a2a794c66495083317e4be5197eb655b1e63015469d769e2338af3d3e3f3aa86"
		);

		console.log("Account Identifier");
		console.log(accountIdentifier.toHex());

