import { runAppleScript } from "@raycast/utils";
import { showToast, Toast } from "@raycast/api";

interface BrowserInfo {
  engine: "webkit" | "chromium" | "gecko";
}

const SUPPORTED_BROWSERS: Record<string, BrowserInfo> = {
  // WebKit
  "Safari": { engine: "webkit" },
  "Orion": { engine: "webkit" },
  "Orion RC": { engine: "webkit" },

  // Chromium
  "Google Chrome": { engine: "chromium" },
  "Microsoft Edge": { engine: "chromium" },
  "Arc": { engine: "chromium" },
  "Brave Browser": { engine: "chromium" },
  "Vivaldi": { engine: "chromium" },
  // "Dia": { engine: "chromium" },

  // Gecko
  // Firefox: { engine: "gecko" },
};

async function getActiveBrowserInfo(): Promise<{ name: string; engine: BrowserInfo["engine"] }> {
  const script = 'tell application "System Events" to get name of first application process whose frontmost is true';
  try {
    const frontmostAppName = await runAppleScript(script);
    const browserInfo = SUPPORTED_BROWSERS[frontmostAppName];

    if (browserInfo) {
      return { name: frontmostAppName, engine: browserInfo.engine };
    } else {
      await showToast({
        style: Toast.Style.Failure,
        title: "Unsupported Browser",
        message: `The frontmost application ('${frontmostAppName}') is not a supported browser or is not configured in the extension.`,
      });
      throw new Error("Frontmost application is not a supported browser.");
    }
  } catch (error) {
    // If runAppleScript fails or it's an unlisted browser
    console.error(error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to identify active browser",
      message: "Could not determine the active browser or it is unsupported.",
    });
    throw new Error("Could not get active browser information");
  }
}

export async function getCurrentTabURL(): Promise<string> {
  const browserInfo = await getActiveBrowserInfo();

  let script = "";
  if (browserInfo.engine === "webkit") {
    script = `tell application "${browserInfo.name}" to return URL of current tab of front window`;
  } else if (browserInfo.engine === "chromium") {
    // Most Chromium-based browsers use a similar script
    script = `tell application "${browserInfo.name}" to return URL of active tab of front window`;
  } else {
    // Fallback or error for unhandled engines
    await showToast({
      style: Toast.Style.Failure,
      title: "Unsupported Browser Engine",
      message: `The browser engine '${browserInfo.engine}' for '${browserInfo.name}' is not supported for getting current URL.`,
    });
    throw new Error(`Unsupported browser engine: ${browserInfo.engine}`);
  }

  try {
    return await runAppleScript(script);
  } catch (error) {
    console.error(error);
    await showToast({
      style: Toast.Style.Failure,
      title: `Failed to get URL from ${browserInfo.name}`,
      message: "Make sure the browser is running and a tab is active.",
    });
    throw new Error(`Could not get URL from ${browserInfo.name}`);
  }
}

export async function openURL(url: string): Promise<void> {
  const browserInfo = await getActiveBrowserInfo();
  // The open location script is generally the same for all supported browsers
  const script = `tell application "${browserInfo.name}" to open location "${url}"`;

  try {
    await runAppleScript(script);
    // await runAppleScript(`tell application "${browserInfo.name}" to activate`);
  } catch (error) {
    console.error(error);
    await showToast({
      style: Toast.Style.Failure,
      title: `Failed to open URL in ${browserInfo.name}`,
      message: "Make sure the browser is running.",
    });
    throw new Error(`Could not open URL in ${browserInfo.name}`);
  }
}

export function getBypassURL(currentURL: string): string {
  if (currentURL.includes("medium.com")) {
    return `https://freedium.cfd/${currentURL}`;
  } else {
    return `https://12ft.io/${currentURL}`;
  }
}