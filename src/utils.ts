import { runAppleScript } from "@raycast/utils";

export async function getCurrentTabURL(): Promise<string> {
  return await runAppleScript('tell application "Safari" to return URL of current tab in window 1')
}

export async function openURL(url: string): Promise<void> {
  await runAppleScript(`tell application "Safari" to open location "${url}"`);
}