import { showHUD, closeMainWindow, showToast, Toast } from "@raycast/api";
import { getCurrentTabURL, openURL } from "./utils";

function getBypassURL(currentURL: string): string {
  if (currentURL.includes("medium.com")) {
    return `https://freedium.cfd/${currentURL}`;
  } else {
    return `https://12ft.io/${currentURL}`;
  }
}

export default async function Command() {
  try {
    await closeMainWindow;

    const currentURL = await getCurrentTabURL();
    const result = getBypassURL(currentURL);

    await openURL(result);

    await showHUD("Open bypassed URL")
  } catch (error) {
    await showHUD("Failed to complete")
  }
}