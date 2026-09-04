import { bootMinimal } from "boot/BootLoader";
import { applyCwspSku, stashSkuHandoff } from "com/config/ecosystem-skus";
import type { ViewId } from "shells/types";

const rawPre = document.getElementById("raw-md") as HTMLPreElement | null;
const appDiv = document.getElementById("app") as HTMLDivElement | null;

const VIRTUAL_VIEW_TOKEN = "${view}";
const markdownFallbackStorageKey = (key: string) => `md-fallback:${key}`;

const loadFromSessionKey = async (key: string): Promise<string | null> => {
    try {
        const data = await chrome.storage?.session?.get?.(key);
        const text = data?.[key];
        if (typeof text === "string" && text.trim()) return text;
    } catch (e) {
        console.warn("[Viewer] session storage read failed:", e);
    }
    try {
        const fallbackKey = markdownFallbackStorageKey(key);
        const data = await chrome.storage?.local?.get?.(fallbackKey);
        const payload = data?.[fallbackKey];
        const text = typeof payload === "string" ? payload : payload?.text;
        if (typeof text === "string" && text.trim()) return text;
    } catch (e) {
        console.warn("[Viewer] local fallback read failed:", e);
    }
    return null;
};

const sendSw = <T,>(payload: Record<string, unknown>, ms: number): Promise<T | null> =>
    new Promise((resolve) => {
        let done = false;
        const finish = (value: T | null) => {
            if (done) return;
            done = true;
            resolve(value);
        };
        const timer = globalThis.setTimeout(() => finish(null), ms);
        try {
            if (!chrome?.runtime?.id) {
                globalThis.clearTimeout(timer);
                finish(null);
                return;
            }
            chrome.runtime.sendMessage(payload, (response) => {
                globalThis.clearTimeout(timer);
                if (chrome.runtime.lastError) {
                    finish(null);
                    return;
                }
                finish((response || null) as T | null);
            });
        } catch {
            globalThis.clearTimeout(timer);
            finish(null);
        }
    });

const fetchViaServiceWorker = async (src: string): Promise<{ ok: boolean; key?: string; src?: string; error?: string }> => {
    const response = await sendSw<{ ok?: boolean; key?: string; src?: string; error?: string }>({ type: "md:load", src }, 8000);
    return response || { ok: false, error: "runtime-timeout" };
};

const fetchDirect = async (src: string): Promise<string | null> => {
    if (/^file:/i.test(src)) {
        // file:// pages are unique origins in Chromium; direct fetch is often blocked.
        return null;
    }
    try {
        const res = await fetch(src, { credentials: "omit", cache: "no-store", signal: AbortSignal.timeout(8000) });
        if (!res.ok) return null;
        const text = await res.text();
        const trimmed = text.trimStart().toLowerCase();
        if (trimmed.startsWith("<!doctype html") || trimmed.startsWith("<html") || trimmed.startsWith("<head") || trimmed.startsWith("<body")) {
            return null;
        }
        return text;
    } catch {
        return null;
    }
};

const loadMarkdown = async (src: string, sessionKey?: string | null): Promise<string> => {
    const fetchSrc = toFetchableMarkdownUrl(src);
    if (sessionKey) {
        const text = await loadFromSessionKey(sessionKey);
        if (text) return text;
    }

    const swResult = await fetchViaServiceWorker(fetchSrc);
    if (swResult.ok && swResult.key) {
        const text = await loadFromSessionKey(swResult.key);
        if (text) return text;
    }
    if (!swResult.ok && swResult.error === "not-markdown") {
        return "> Skipped loading: source appears to be HTML or is not confidently Markdown.";
    }

    const text = await fetchDirect(fetchSrc);
    if (text) return text;

    return `> Failed to load markdown from:\n> ${fetchSrc}`;
};

const isVirtualViewValue = (value?: string | null): boolean => {
    const normalized = (value || "").trim().toLowerCase();
    return !normalized || normalized === VIRTUAL_VIEW_TOKEN || normalized === "view" || normalized === "current" || normalized === "active";
};

const isBrowsableUrl = (url?: string): boolean => {
    if (!url) return false;
    return !url.startsWith("chrome-extension:")
        && !url.startsWith("chrome://")
        && !url.startsWith("about:")
        && !url.startsWith("edge://");
};

const looksLikeMarkdownSourceUrl = (url: string): boolean =>
    /\.(?:md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)(?:$|[?#])/i.test(url);

const toFetchableMarkdownUrl = (candidate: string): string => {
    try {
        const url = new URL(candidate);
        const host = url.hostname.replace(/^www\./i, "").toLowerCase();
        if (host !== "github.com") return candidate;
        const blob = url.pathname.match(/^\/([^/]+)\/([^/]+)\/blob\/(.+)$/i);
        if (blob && looksLikeMarkdownSourceUrl(blob[3])) {
            return `https://raw.githubusercontent.com/${blob[1]}/${blob[2]}/${blob[3]}`;
        }
        const raw = url.pathname.match(/^\/([^/]+)\/([^/]+)\/raw\/(.+)$/i);
        if (raw && looksLikeMarkdownSourceUrl(raw[3])) {
            return `https://raw.githubusercontent.com/${raw[1]}/${raw[2]}/${raw[3]}`;
        }
        return candidate;
    } catch {
        return candidate;
    }
};

const CRX_MD_BOOT_KEY = "__CWSP_CRX_MD_BOOT__";
const EMPTY_MARKDOWN_PLACEHOLDER = "# No content\n\nOpen a markdown file or navigate to a `.md` URL.";

const httpSourceFromHash = (): string | null => {
    try {
        const raw = decodeURIComponent((location.hash || "").replace(/^#/, "")).trim();
        if (/^https?:\/\//i.test(raw) && !/^file:/i.test(raw)) return raw;
    } catch {
        /* ignore */
    }
    return null;
};

const isCrxExtensionPage = (): boolean =>
    typeof globalThis.location !== "undefined" && globalThis.location.protocol === "chrome-extension:";

/** Strip `file:` URL hints from the viewer query map — routing must not propagate them into chrome-extension origins. */
const sanitizeCrxViewerQueryParams = (collected: Record<string, string>): Record<string, string> => {
    if (!isCrxExtensionPage()) return collected;
    const next = { ...collected };
    for (const k of ["src", "url", "path", "view-src", "referrer"]) {
        const v = next[k];
        if (typeof v === "string" && /^file:/i.test(v.trim())) delete next[k];
    }
    return next;
};

const resolveSourceFromOpenTabs = async (): Promise<string | null> => {
    try {
        const currentTab = await chrome.tabs.getCurrent();
        const currentTabId = currentTab?.id;
        const tabs = await chrome.tabs.query({ lastFocusedWindow: true });
        const suppressFileTabs = isCrxExtensionPage();
        const candidates = tabs
            .filter((tab) => typeof tab.id === "number" && tab.id !== currentTabId)
            .map((tab) => tab.url)
            .filter((url): url is string => Boolean(url && isBrowsableUrl(url)))
            .filter((url) => !suppressFileTabs || !/^file:/i.test(url));

        const markdownCandidate = candidates.find(looksLikeMarkdownSourceUrl);
        return markdownCandidate || candidates[0] || null;
    } catch {
        return null;
    }
};

const resolveSource = async (params: URLSearchParams): Promise<{ source: string | null; key: string | null }> => {
    const sessionKey = params.get("mdk");
    const hashSource = httpSourceFromHash();
    if (hashSource) return { source: toFetchableMarkdownUrl(hashSource), key: sessionKey };

    const explicitSource = params.get("src");
    if (explicitSource && !isVirtualViewValue(explicitSource)) {
        if (
            isCrxExtensionPage() &&
            /^file:/i.test(explicitSource.trim())
        ) {
            return { source: null, key: sessionKey };
        }
        return { source: toFetchableMarkdownUrl(explicitSource), key: sessionKey };
    }

    // For file:// opens, service worker preloads markdown into session storage.
    // Avoid probing open tabs, which can re-introduce file:// fetch attempts.
    if (sessionKey) {
        return { source: null, key: sessionKey };
    }
    // Session-less file open (preload failed): never put file:// in ?src; ?origin=file only.
    if (params.get("origin") === "file") {
        return { source: null, key: null };
    }

    const sourceFromView = params.get("view-src") || params.get("view");
    if (sourceFromView && !isVirtualViewValue(sourceFromView)) {
        if (
            isCrxExtensionPage() &&
            /^file:/i.test(sourceFromView.trim())
        ) {
            return { source: null, key: null };
        }
        return { source: toFetchableMarkdownUrl(sourceFromView), key: null };
    }

    const pending = await sendSw<{ src?: string; key?: string }>({ type: "md:pending-src" }, 4000);
    const pendingSrc = typeof pending?.src === "string" ? pending.src.trim() : "";
    const pendingKey = typeof pending?.key === "string" && pending.key.trim() ? pending.key.trim() : null;
    if (pendingSrc && !/^file:/i.test(pendingSrc)) return { source: toFetchableMarkdownUrl(pendingSrc), key: pendingKey };
    if (pendingKey) return { source: null, key: pendingKey };

    const tabSrc = await resolveSourceFromOpenTabs();
    return { source: tabSrc ? toFetchableMarkdownUrl(tabSrc) : null, key: null };
};

const resolveTargetView = (params: URLSearchParams): ViewId | "markdown" | "markdown-viewer" => {
    const requestedView = params.get("launch-view") || params.get("view") || "viewer";
    if (isVirtualViewValue(requestedView)) {
        return "viewer";
    }
    return requestedView as ViewId;
};

const collectViewParams = (params: URLSearchParams): Record<string, string> => {
    const collected: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
        collected[key] = value;
    }
    return collected;
};

const hideRawLayer = (): void => {
    if (rawPre) rawPre.style.display = "none";
};

const showRawState = (message: string): void => {
    if (!rawPre) return;
    rawPre.style.display = "";
    rawPre.hidden = false;
    rawPre.textContent = message;
};

const init = async () => {
    if (!appDiv) {
        throw new Error("Missing #app mount element");
    }

    showRawState("Loading...");

    const params = new URLSearchParams(location.search);
    const filename = params.get("filename") || undefined;
    const appendContent = params.get("append") || params.get("extra") || "";
    const directContent = params.get("content") || params.get("text");
    const { source, key: mdk } = await resolveSource(params);
    const sanitizedParams = sanitizeCrxViewerQueryParams(collectViewParams(params));
    const payloadSource =
        source && !(isCrxExtensionPage() && /^file:/i.test(source.trim()))
            ? source || undefined
            : undefined;

    let markdown = "";
    if (directContent) {
        markdown = directContent;
    } else if (source) {
        markdown = await loadMarkdown(source, mdk);
    } else if (mdk) {
        markdown = (await loadFromSessionKey(mdk)) || "";
    }

    if (appendContent) {
        markdown = markdown ? `${markdown}\n\n${appendContent}` : appendContent;
    }

    if (!markdown.trim()) {
        markdown = EMPTY_MARKDOWN_PLACEHOLDER;
    }

    applyCwspSku("document");
    const root = document.documentElement;
    root.dataset.cwspSku = "document";
    root.dataset.cwspApp = "document";
    root.dataset.cwspSurface = "cw-document-crx";
    root.dataset.cwspEnabledViews = "viewer,editor,print,settings,history";
    root.dataset.cwspDefaultView = "viewer";
    root.dataset.cwspNativeShell = "crx";

    const target = resolveTargetView(params);
    const dest = target === "editor" ? "editor" : target === "print" ? "print" : "viewer";
    /* WHY: sessionStorage handoff can be consumed by a channel probe. Keep a same-tick bag for the view. */
    try {
        (globalThis as unknown as Record<string, unknown>)[CRX_MD_BOOT_KEY] = {
            content: markdown,
            src: payloadSource,
            filename,
        };
    } catch {
        /* ignore */
    }
    if (markdown.trim() && markdown !== EMPTY_MARKDOWN_PLACEHOLDER) {
        stashSkuHandoff({
            dest,
            content: markdown,
            filename,
            src: payloadSource
        });
    }

    /* WHY: Keep ?src= so BootLoader navigate params can fetch if the bag/handoff is missed. */
    try {
        const next = new URL(location.href);
        if (payloadSource) next.searchParams.set("src", payloadSource);
        if (mdk) next.searchParams.set("mdk", mdk);
        const hash = httpSourceFromHash() && !payloadSource ? location.hash : "";
        history.replaceState(null, "", `${next.pathname}${next.search}${hash}`);
    } catch {
        /* ignore */
    }

    const viewId = (dest === "editor" || dest === "print" ? dest : "viewer") as ViewId;
    await bootMinimal(appDiv, viewId);
    hideRawLayer();
};

void init().catch((e) => {
    console.error("[Viewer] init failed:", e);
    showRawState(`Failed to initialize viewer: ${e}`);
});
