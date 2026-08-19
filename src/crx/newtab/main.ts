/*
 * Filename: main.ts
 * FullPath: apps/CWSP-crx/src/crx/newtab/main.ts
 * Change date and time: 10.05.00_16.08.2026
 * Reason for changes: NTP loads CWSP-shell environment + home speed-dial
 * (not immersive viewer). Respects core.ntpEnabled gate.
 */
import { bootEnvironment } from "shells/boot";
import { loadSettings } from "com/config/Settings";
import { initializeLayers } from "shared/routing/layer-manager";
import { getCrxNetworkCoordinator } from "crx/network/Coordinator";
import { ensureAppLayers } from "shared/routing/app-layers";
import { registerFsBackend } from "fl-ui/explorer/path-router";
import { createChromeBookmarksBackend } from "fl-ui/explorer/backends/chrome-bookmarks-backend";

// CRX-only: mount the live Chrome Bookmarks API under `/bookmarks/` so the
// Explorer Operative and SpeedDial mirror mode can browse/edit bookmarks.
// INVARIANT: register only when `chrome.bookmarks` exists; non-CRX hosts
// never get the `/bookmarks/` root.
const chromeAny: any = (globalThis as any)?.chrome;
if (chromeAny?.bookmarks) {
    const bookmarksBackend = createChromeBookmarksBackend(chromeAny.bookmarks);
    if (bookmarksBackend) {
        registerFsBackend(bookmarksBackend);
    }
}

const mount = document.getElementById("app") as HTMLElement | null;

const renderDisabled = () => {
    const root = document.createElement("div");
    root.style.cssText =
        "width:100%;height:100%;display:grid;place-items:center;background:#0b0b0c;color:#f5f5f5;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px;box-sizing:border-box;";
    const card = document.createElement("div");
    card.style.cssText =
        "max-width:680px;width:100%;border:1px solid rgba(255,255,255,0.14);border-radius:16px;padding:18px;background:rgba(255,255,255,0.04);display:grid;gap:10px;";
    const h = document.createElement("div");
    h.textContent = "New Tab Page is disabled";
    h.style.cssText = "font-size:18px;font-weight:700;";
    const p = document.createElement("div");
    p.textContent = "Enable it in Extension Settings → \"Enable New Tab Page (CWSP-shell speed dial)\".";
    p.style.cssText = "opacity:0.9;line-height:1.4;";
    const btn = document.createElement("button");
    btn.textContent = "Open Extension Settings";
    btn.style.cssText =
        "justify-self:start;border:1px solid rgba(255,255,255,0.18);border-radius:12px;background:rgba(255,255,255,0.06);color:#f5f5f5;padding:10px 12px;cursor:pointer;";
    btn.addEventListener("click", () => {
        try {
            chrome.runtime.openOptionsPage();
        } catch {
            // ignore
        }
    });

    card.append(h, p, btn);
    root.append(card);
    mount?.replaceChildren(root);
};

void loadSettings()
    .then(async (s) => {
        if (!mount) return;
        if (!s?.core?.ntpEnabled) {
            renderDisabled();
            return;
        }

        // Same CWSP-shell home surface as PWA/desktop: environment + speed dial.
        initializeLayers();
        void getCrxNetworkCoordinator().startFromStoredSettings().catch(() => undefined);

        const layers = ensureAppLayers(mount, {
            enableOrientLayer: true,
            enableCanvasLayer: true,
        });
        await bootEnvironment(layers.shellLayer, "home");
    })
    .catch(() => renderDisabled());
