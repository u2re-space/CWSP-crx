/*
 * Filename: main.ts
 * FullPath: apps/CWSP-crx/src/crx/workcenter/main.ts
 * FIND:sku
 * Change date: 14.20.00_27.08.2026
 * Reason: Dedicated CRX WorkCenter page — process SKU + public /api/process.
 *
 * INVARIANT: Snip / SW AI stays in-process. This page is the same WorkCenter view, not a second extension.
 */

import { bootMinimal } from "boot/BootLoader";
import { applyCwspSku, stashSkuHandoff } from "com/config/ecosystem-skus";

applyCwspSku("process");
const root = document.documentElement;
root.dataset.cwspSku = "process";
root.dataset.cwspApp = "process";
root.dataset.cwspSurface = "cw-process-crx";
root.dataset.cwspEnabledViews = "workcenter,settings,history";
root.dataset.cwspDefaultView = "workcenter";
root.dataset.cwspNativeShell = "crx";

const params = new URLSearchParams(globalThis.location?.search || "");
const queryText = String(params.get("text") || params.get("content") || "").trim();
if (queryText) {
    stashSkuHandoff({ dest: "workcenter", content: queryText, filename: params.get("filename") || undefined });
}

const mount = document.getElementById("app") || document.body;
void bootMinimal(mount, "workcenter").catch((error: unknown) => {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    console.error("[CWSP-crx workcenter] boot failed", error);
    mount.replaceChildren();
    mount.style.cssText =
        "margin:0;padding:16px;font:14px/1.4 ui-monospace,monospace;background:#111;color:#f66;white-space:pre-wrap;";
    mount.textContent = `[CWSP-crx workcenter] boot failed\n\n${message}`;
});
