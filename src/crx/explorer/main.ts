/*
 * Filename: main.ts
 * FullPath: apps/CWSP-crx/src/crx/explorer/main.ts
 * FIND:sku
 * Change date: 13.50.00_27.08.2026
 * Reason: Dedicated CRX explorer page — bookmarks + downloads + OPFS via fl.ui.
 */

import { bootMinimal } from "boot/BootLoader";
import { applyCwspSku } from "com/config/ecosystem-skus";
import { ensureDefaultFsBackends } from "fl-ui/explorer/path-router";

applyCwspSku("explorer");
const root = document.documentElement;
root.dataset.cwspSku = "explorer";
root.dataset.cwspApp = "explorer";
root.dataset.cwspSurface = "cw-explorer-crx";
root.dataset.cwspEnabledViews = "explorer,settings,history";
root.dataset.cwspDefaultView = "explorer";
root.dataset.cwspNativeShell = "crx";

ensureDefaultFsBackends();

const mount = document.getElementById("app") || document.body;
void bootMinimal(mount, "explorer").catch((error: unknown) => {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    console.error("[CWSP-crx explorer] boot failed", error);
    mount.replaceChildren();
    mount.style.cssText =
        "margin:0;padding:16px;font:14px/1.4 ui-monospace,monospace;background:#111;color:#f66;white-space:pre-wrap;";
    mount.textContent = `[CWSP-crx explorer] boot failed\n\n${message}`;
});
