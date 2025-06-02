import { showHUD, closeMainWindow, showToast, Toast } from "@raycast/api";
import { getCurrentTabURL, openURL, getBypassURL } from "./utils";

export default async function Command() {
  try {
    await closeMainWindow();

    const currentURL = await getCurrentTabURL();
    const result = getBypassURL(currentURL);

    await openURL(result);

    await showHUD("Open bypassed URL")
  } catch (error) {
    console.error(error);
    // await showHUD("Failed to complete command");
  }
}