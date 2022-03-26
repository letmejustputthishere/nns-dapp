import { register } from '../common/register';
import { logout } from '../common/logout';
import { loginWithIdentity } from '../common/login';
import { getLoginButton } from '../components/auth';
import { getNeuronsBody, getStakingButton } from "../components/neurons";
import { waitForImages } from '../common/waitForImages';
import { waitForLoad } from '../common/waitForLoad';
import { getLogoutButton, getVotingTabButton, getNeuronTabButton } from '../components/header.ts';

describe("vote", () => {

  it("login", async () => {
    await browser.url("/");
    await waitForLoad(browser);
    await loginWithIdentity(browser, "10000");
  });

  it("getIcp", async () => {
    const balanceField = await browser.$('[data-tid="card"] [data-tid="icp-value"]');
    await balanceField.waitForExist({timeout: 10000});
    const balance = Number(await balanceField.getText());
    if (balance < 20){
	    const getIcpButton = await browser.$('[data-tid="get-icp-button"]');
	    await getIcpButton.waitForExist();
	    await getIcpButton.click();
	    const numIcp = await browser.$('[data-tid="get-icp-form"] input');
	    await numIcp.waitForExist();
	    await numIcp.setValue("10");
	    const submitButton = await browser.$('[data-tid="get-icp-submit"]');
	    await submitButton.waitForExist();
	    await browser.waitUntil(() => submitButton.isClickable(), {timeoutMsg: "Timeout waiting for submitButton to be clickable."});
	    await browser["screenshot"]("get-icp-form");
	    await submitButton.click();
	    //browser.pause(10000);
	    await browser.waitUntil(async () => !await browser.$('[data-tid="get-icp-form"]').isExisting(), {timeout: 20000, timeoutMsg: "Timeout waiting for the GetICP form to disappear."});
	    await browser["screenshot"]("get-icp-finished");
    } else {
        console.log("Balance is already sufficient:", balance);
    }
  });

  it("goToNeuronTab", async() => {
    const tabButton = await getNeuronTabButton(browser);
    await tabButton.waitForExist();
    await browser.waitUntil(() => tabButton.isClickable(), {timeoutMsg: "Timeout waiting for the neuron tab button."});
    await tabButton.click();
    const neuronsTab = await getNeuronsBody(browser);
    await neuronsTab.waitForExist();
  });

  it("waitForNeuronsToLoad", async() => {
    // const loadingSpinner = await browser.$('[data-tid="spinner"]');
    // await browser.waitUntil(async () => !loadingSpinner.isExisting(), {timeout: 10000});
    browser.pause(3000);
  });
  it("createNeuronIfNone", async () => {
    await browser["screenshot"]("looking-for-neuron");
    const neuron = await browser.$('[data-tid="neurons-body"] [data-tid="card"]');
    if (false && neuron.isExisting()) {
        console.log("We already have a neuron");
    } else {
        const stakingButton = await getStakingButton(browser);
        await stakingButton.waitForExist();
	await stakingButton.click();
	const accountButton = await browser.$('#modalContent [data-tid="card"]');
	await accountButton.waitForExist();
        await browser["screenshot"]("selecting-account");
        await accountButton.click();
	const stakeValue = await browser.$('#modalContent input[type="number"]');
        await stakeValue.waitForExist();
	await stakeValue.setValue(1);
	await browser.pause(1000);
        const createButton = await browser.$('#modalContent [data-tid="create-neuron-button"]');
	await createButton.waitForExist();
        await browser["screenshot"]("entered-neuron-amount");
	await createButton.click();
	await browser.waitUntil(async () => !await browser.$('#modalContent [data-tid="create-neuron-button"]').isExisting(), {timeout: 60000, timeoutMsg: "Timeout waiting for the create neuron button to disappear."});
        await browser["screenshot"]("neuron-created");
	const dissolveDelaySlider = await browser.$('#modalContent input[type="range"]');
	await dissolveDelaySlider.waitForExist();
        const maxDissolveDelay = await dissolveDelaySlider.getAttribute("max");
	await dissolveDelaySlider.setValue(maxDissolveDelay);
        const updateDissolveDelayButton = await browser.$('#modalContent button.primary');
	await browser.waitUntil(() => updateDissolveDelayButton.isClickable(), {timeoutMsg: "Timeout waiting for updateDissolveDelayButton to be clickable."});
	updateDissolveDelayButton.click();
	const confirmUpdateButton = await browser.$('#modalContent [data-tid="confirm-delay-button"]');
	await browser.waitUntil(() => confirmUpdateButton.isClickable(), {timeoutMsg: "Timeout waiting for confirmUpdateButton to be clickable."});
	confirmUpdateButton.click();
	await browser.waitUntil(async () => !await browser.$('#modalContent [data-tid="confirm-delay-button"]').isExisting(), {timeout: 60000, timeoutMsg: "Timeout waiting for confirmUpdateButton to disappear."});
	const closeFollowingModal = await browser.$('[data-tid="close-modal"]');
	closeFollowingModal.waitForExist();
	await browser.waitUntil(() => closeFollowingModal.isClickable(), {timeoutMsg: "Timeout waiting for the closeFollowingModal button to be clickable."});
	await closeFollowingModal.click();
	await browser.waitUntil(async () => !await browser.$('[data-tid="close-modal"]').isExisting(), {timeout: 60000, timeoutMsg: "Timeout waiting for the modal to disappear."});
    }
  });
  /*
  it("navigateToVotingTab", async () => {
    const votingTabButton = await getVotingTabButton(browser);
    await votingTabButton.waitForExist();
    await votingTabButton.click();
    await browser["screenshot"]("voting-page");
  }, 10000);

  it("canShowAllProposals", async () => {
    const result = await browser.execute(() =>
      document.querySelectorAll('.filters button')
    );

    console.log(result);
  });
*/
});
