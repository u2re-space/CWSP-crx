/*
 * Filename: environment-shell.ts
 * FullPath: apps/CWSP-shell/src/frontend/ai-slop/window/environment-shell.ts
 * Change date and time: 10.35.00_02.08.2026
 * Reason for changes: Mono native deep link keeps `/settings?...` (not root `/?view=`).
 */
/**
 * WHY: Hybrid SoT (plan 1C): wallpaper / SpeedDial / OrientDesktop / taskbar / statusbar /
 * `ui-window` layer come from `environment-shell` modules; CWSP views load from app `views/*`.
 *
 * INVARIANT: Do **not** mount workspace under `cw-shell-*` closed/open shadow. Document-adopted
 * SpeedDial + viewer SCSS cannot pierce that shadow — labels/toolbars look “unstyled”.
 * Match `environment-shell/demo/boot.ts`: `<env-shell-container>` + light-DOM slotted layers.
 */
import { observe, ref } from "@fest-lib/object";
import { preloadStyle, loadInlineStyle } from "@fest-lib/dom";
import { ensureStyleSheet } from "@fest-lib/icon";
import { initializeAppCanvasLayer, restoreWallpaperThemeCache } from "@fest-lib/image";
import type { ShellId, ShellLayoutConfig, ViewId, ViewOptions } from "shells/types";
import { ShellBase } from "boot/shells";
import { SHELL_SLOT } from "boot/shell-slots";
import { initBootShellWindowActivity } from "boot/shell-preference";
import { isEnabledView } from "com/routing/core/views";
import {
    createEnvironmentShellContainer,
    createWorkspaceWindowLayer,
    defineEnvironmentShellContainer,
    mountEnvironmentChrome,
    seedEnvironmentWallpaperIfUnset,
    type EnvWindowTaskDescriptor,
    type WorkspaceViewLoaderMap
} from "shells/environment/index";
import { mountViewModule } from "shells/environment/window/views/view-mount";

// @ts-ignore — Material-ish tokens used by env chrome / home
import wfDemoCss from "../../../../../../modules/shells/window-frame/public/demo/wf-demo.css?inline";
// @ts-ignore — shell chrome styles (document-level)
// WHY: alias (not ../../shells/…) — window tree is shared via CRX realpath; relative shells break in transfer/control builds.
import envShellStyles from "shells/environment/scss/main.scss?inline";

defineEnvironmentShellContainer();

function isNativeCapacitorShell(): boolean {
    try {
        if (document.documentElement.dataset.cwspNativeShell === "capacitor") return true;
        const c = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
        return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
    } catch {
        return false;
    }
}

/** `?native=1` or path `/explorer` with native query → mono native start set. */
function readStartNativeViewIds(): string[] {
    try {
        const sp = new URLSearchParams(globalThis.location?.search || "");
        if (sp.get("native") !== "1" && sp.get("native") !== "true") return [];
        const view = (sp.get("view") || "").trim().toLowerCase();
        /* Strip VDS mounts (`/cwsp/settings` → `settings`). */
        let path = String(globalThis.location?.pathname || "")
            .replace(/^\/+|\/+$/g, "")
            .toLowerCase();
        const mount = path.match(/^(cwsp|markdown|kvm)\/(.+)$/);
        if (mount?.[2]) path = mount[2];
        /* Prefer path segment when present; `view=` survives rewrite to `/`. */
        const fromPath = path.split("/")[0] || "";
        const id = ((fromPath && fromPath !== "home" ? fromPath : view) || "explorer")
            .split("/")[0] || "explorer";
        if (!id || id === "home") return ["explorer"];
        return [id === "markdown" ? "viewer" : id];
    } catch {
        return [];
    }
}

function wantsNative(opts?: ViewOptions | null): boolean {
    const p = (opts as { params?: Record<string, string>; native?: unknown }) || {};
    return (
        p.native === 1 ||
        p.native === "1" ||
        p.native === true ||
        p.params?.native === "1" ||
        p.params?.native === "true"
    );
}

function mergeNativeOpt(viewId: string, opts?: ViewOptions): ViewOptions {
    const startNative = readStartNativeViewIds();
    if (!startNative.includes(viewId) && !wantsNative(opts)) return opts || {};
    const base = { ...(opts || {}) } as ViewOptions & { native?: string; params?: Record<string, string> };
    base.native = "1";
    base.params = { ...(base.params || {}), native: "1" };
    return base;
}

const CWSP_VIEW_LOADERS: WorkspaceViewLoaderMap = {
    network: () => import("views/network") as any,
    settings: () => import("views/settings") as any,
    explorer: () => import("views/explorer") as any,
    viewer: () => import("views/viewer") as any,
    markdown: () => import("views/viewer") as any,
    history: () => import("views/history") as any,
    workcenter: () => import("views/workcenter") as any,
    editor: () => import("views/editor") as any,
    home: () => import("views/home") as any
};

/** Views allowed as Speed Dial / floating windows (no airpad). */
const CWSP_LAUNCHER_VIEWS = [
    "home",
    "network",
    "settings",
    "explorer",
    "viewer",
    "history",
    "workcenter",
    "editor"
] as const;

async function seedCwspLauncherTiles(): Promise<void> {
    try {
        const mod = await import("views/home/ts/launcher-state");
        const items = mod.speedDialItems as any;
        if (!items || typeof items.findIndex !== "function") return;

        let removedAirpad = false;
        for (let i = items.length - 1; i >= 0; i--) {
            const it = items[i];
            const view = String(it?.meta?.view || "").toLowerCase();
            const id = String(it?.id || "").toLowerCase();
            if (view === "airpad" || id.includes("airpad")) {
                items.splice(i, 1);
                removedAirpad = true;
            }
        }

        const ensure = (
            id: string,
            cell: [number, number],
            icon: string,
            label: string,
            view: string
        ): void => {
            if (!isEnabledView(view) && view !== "home") return;
            const exists = items.find?.(
                (it: any) =>
                    String(it?.id) === id ||
                    String(it?.meta?.view || "").toLowerCase() === view
            );
            if (exists) return;
            mod.addSpeedDialItem({
                id,
                cell: observe(cell) as any,
                icon,
                label,
                action: "open-view",
                meta: { view }
            } as any);
        };

        /*ensure("shortcut-settings", [0, 0], "gear-six", "Settings", "settings");
        ensure("shortcut-explorer", [1, 0], "books", "Explorer", "explorer");
        ensure("shortcut-viewer", [2, 0], "article", "Markdown", "viewer");*/

        if (removedAirpad) mod.persistSpeedDialItems?.();
    } catch (err) {
        console.warn("[EnvironmentShell] speed-dial seed skipped", err);
    }
}

export class EnvironmentShell extends ShellBase {
    id: ShellId = "environment";
    name = "Environment";
    layout: ShellLayoutConfig = {
        hasSidebar: false,
        hasToolbar: false,
        hasTabs: false,
        supportsMultiView: true,
        supportsWindowing: true
    };

    private workspaceEl: HTMLElement | null = null;
    private homeMountEl: HTMLElement | null = null;
    private windowLayer: ReturnType<typeof createWorkspaceWindowLayer> | null = null;
    private chromeDispose: (() => void) | null = null;
    private homeUnmount: (() => void) | null = null;
    private shellActivityDispose: (() => void) | null = null;
    private focusedTaskId = ref<string>("home");
    private setFocusedTaskId: ((id: string) => void) | null = null;
    private syncWindowTasks: ((windows: EnvWindowTaskDescriptor[]) => void) | null = null;
    private navEcho = ref("");
    private mqLabel = ref("desktop");
    /** Mono `?native=1` boot — Home desktop deferred until exit-native / explicit Home. */
    private _monoNativeBoot = false;
    private _pendingHomeMount: {
        homeMount: HTMLElement;
        shellContext: ViewOptions;
    } | null = null;

    /** Unused — light-DOM mount builds nodes imperatively (see {@link mount}). */
    protected createLayout(): HTMLElement {
        return document.createElement("div");
    }

    protected getStylesheet(): string | null {
        return envShellStyles as unknown as string;
    }

    /**
     * Light-DOM environment host (demo parity). Avoids `cw-shell-environment` shadow so
     * document-adopted SpeedDial / viewer / veela styles reach launcher + window bodies.
     */
    async mount(container: HTMLElement): Promise<void> {
        if (this.mounted) {
            console.warn(`[${this.id}] Shell already mounted`);
            return;
        }
        this.container = container;
        // WHY: CWSP ships `assets/wallpaper.jpg`; stock.jpg is optional demo parity symlink.
        seedEnvironmentWallpaperIfUnset("/assets/wallpaper.jpg");
        defineEnvironmentShellContainer();

        // Document-level styles (not shadow-only).
        try {
            await preloadStyle(wfDemoCss as unknown as string);
            loadInlineStyle(wfDemoCss as unknown as string);
        } catch (err) {
            console.warn("[EnvironmentShell] wf-demo tokens failed", err);
        }
        const envCss = this.getStylesheet();
        if (envCss) {
            try {
                await preloadStyle(envCss);
                loadInlineStyle(envCss);
            } catch (err) {
                console.warn("[EnvironmentShell] env shell styles failed", err);
            }
        }
        try {
            ensureStyleSheet();
        } catch {
            /* icons optional */
        }

        // WHY: never set attrs inside CE constructor; create via factory then style host here.
        // WHY: settings profile `environment` prunes CWSP / Server / Extension tabs.
        try {
            document.documentElement.dataset.cwspSurface = "environment";
        } catch {
            /* ignore */
        }

        const host = createEnvironmentShellContainer();
        host.className = "env-shell-root wf-demo-root";
        host.setAttribute("data-shell", "environment");
        host.setAttribute("data-shell-system", "task-tab");
        host.style.gridColumn = "content-column";
        host.style.gridRow = "content-row";
        host.style.alignSelf = "stretch";
        host.style.justifySelf = "stretch";
        host.style.minInlineSize = "0";
        host.style.minBlockSize = "0";
        host.style.inlineSize = "100%";
        host.style.blockSize = "100%";
        host.style.pointerEvents = "auto";

        const wallpaper = document.createElement("div");
        wallpaper.slot = SHELL_SLOT.underlying;
        wallpaper.className = "env-shell-wallpaper";
        wallpaper.setAttribute("data-env-wallpaper", "");

        const workspace = document.createElement("div");
        workspace.className = "env-shell-workspace";
        workspace.setAttribute("data-shell-content", "");

        const homeMount = document.createElement("div");
        homeMount.className = "env-shell-home-mount";
        homeMount.style.display = "flex";
        homeMount.style.flex = "1 1 auto";
        homeMount.style.flexDirection = "column";
        homeMount.style.alignSelf = "stretch";
        homeMount.style.minHeight = "0";
        homeMount.style.minWidth = "0";
        workspace.appendChild(homeMount);

        host.append(wallpaper, workspace);
        container.replaceChildren(host);

        this.rootElement = host as any;
        this.workspaceEl = workspace;
        this.homeMountEl = homeMount;
        this.contentContainer = workspace;
        this.overlayContainer =
            (host as any).overlayMount ??
            host.shadowRoot?.querySelector?.("[data-shell-overlays]") ??
            null;
        this.mounted = true;
        this.shellActivityDispose = initBootShellWindowActivity(this.id);

        const nativeCapacitor = isNativeCapacitorShell();
        if (nativeCapacitor) {
            host.dataset.capacitorNative = "";
            document.documentElement.dataset.cwspNativeShell =
                document.documentElement.dataset.cwspNativeShell || "capacitor";
        }

        try {
            restoreWallpaperThemeCache();
            if (nativeCapacitor) {
                seedEnvironmentWallpaperIfUnset("/assets/wallpaper.jpg");
            }
            initializeAppCanvasLayer(wallpaper);
        } catch (err) {
            console.warn("[EnvironmentShell] wallpaper init failed", err);
        }

        const loaders: WorkspaceViewLoaderMap = {};
        for (const id of CWSP_LAUNCHER_VIEWS) {
            if (id === "home") continue;
            if (!isEnabledView(id) && id !== "viewer") continue;
            const loader = CWSP_VIEW_LOADERS[id];
            if (loader) loaders[id] = loader;
        }
        if (loaders.viewer) loaders.markdown = loaders.viewer;

        const mobileMq = matchMedia("(max-width: 640px)");
        this.mqLabel.value = mobileMq.matches ? "mobile" : "desktop";
        mobileMq.addEventListener("change", () => {
            this.mqLabel.value = mobileMq.matches ? "mobile" : "desktop";
        });

        const chrome = mountEnvironmentChrome(host, {
            shell: {
                selectedPath: ref(""),
                viewerStatus: ref(""),
                navEcho: this.navEcho,
                mqLabel: this.mqLabel
            },
            introHtml: `<p><strong>CWSP environment</strong> — Speed Dial / desktop launcher. Views open in <code>ui-window</code>.</p>`,
            taskbar: {
                focusedTaskId: this.focusedTaskId,
                onHome: () => this.focusHome(),
                onViewer: () => {
                    void this.openInWindow("viewer");
                },
                onWindowTask: (viewId) => {
                    void this.openInWindow(viewId);
                },
                onMinimizeWindow: (viewId) => {
                    const id = String(viewId || "").trim().toLowerCase();
                    if (!id) return;
                    if (this.windowLayer?.minimizeWindow?.(id)) {
                        this.setFocusedTaskId?.("home");
                        this.focusedTaskId.value = "home";
                    }
                },
                onCloseWindow: (viewId) => {
                    const id = String(viewId || "").trim().toLowerCase();
                    if (!id) return;
                    this.windowLayer?.closeWindow?.(id);
                    if (String(this.focusedTaskId.value || "") === id) {
                        this.setFocusedTaskId?.("home");
                        this.focusedTaskId.value = "home";
                    }
                }
            }
        });
        this.setFocusedTaskId = chrome.taskbar?.setFocusedTaskId ?? null;
        this.syncWindowTasks = chrome.taskbar?.syncWindowTasks ?? null;

        if (
            document.documentElement.dataset.cwspShellRole === "launcher" ||
            (globalThis as { __RS_SHELL_ROLE__?: string }).__RS_SHELL_ROLE__ === "launcher"
        ) {
            void import("com/routing/native/launcher-home-lifecycle")
                .then((m) => {
                    m.registerLauncherHomeLifecycleHooks({
                        navigateHome: () => this.focusHome(),
                        closeAppMenu: () => chrome.taskbar?.appMenu?.close(),
                        isAppMenuOpen: () => Boolean(chrome.taskbar?.appMenu?.isOpen()),
                        focusSpeedDial: () => m.focusLauncherSpeedDial()
                    });
                })
                .catch(() => {
                    /* optional on non-Capacitor hosts */
                });
        }

        this.chromeDispose = () => {
            chrome.disposeDevice();
            chrome.taskbar?.dispose?.();
            chrome.root.remove();
        };

        const startNativeViewIds = readStartNativeViewIds();
        this.windowLayer = createWorkspaceWindowLayer(workspace, {
            overlayMountHost: host,
            environmentShellHost: host,
            viewLoaders: loaders,
            startNativeViewIds,
            viewTitles: {
                network: "Network",
                settings: "Settings",
                explorer: "Explorer",
                viewer: "Markdown",
                history: "History",
                workcenter: "Work Center",
                editor: "Editor"
            },
            onTaskingChange: (windows) => {
                this.syncWindowTasks?.(windows);
                const focused = windows.find((w) => w.focused);
                if (focused) this.setFocusedTaskId?.(focused.id);
            }
        });

        const shellContext = {
            ...this.windowLayer.shellContext,
            navigate: (viewId: string, opts?: ViewOptions) => {
                this.navEcho.value = `shell.navigate("${viewId}")`;
                void this.routeView(String(viewId), opts);
            },
            openView: (viewId: string, opts?: ViewOptions) => {
                this.navEcho.value = `shell.openView("${viewId}")`;
                void this.routeView(String(viewId), opts);
            },
            showMessage: (msg: unknown) => {
                this.showMessage(typeof msg === "string" ? msg : String(msg ?? ""));
            }
        };

        void seedCwspLauncherTiles();

        const isMonoNative = startNativeViewIds.length > 0;

        /*
         * WHY: mono `/settings?native=1` must not mount the full Home desktop first —
         * Home/focusHome/minimizeAll races left a native frame with no visible content.
         * Open the target view immediately; defer Home until the user exits native.
         */
        if (isMonoNative) {
            for (const vid of startNativeViewIds) {
                this.openInWindow(vid, { native: "1", params: { native: "1" } } as ViewOptions);
            }
            this._monoNativeBoot = true;
            this._pendingHomeMount = { homeMount, shellContext: { shellContext } as ViewOptions };
        } else {
            this.mountHomeDesktop(homeMount, shellContext);
        }
    }

    private mountHomeDesktop(homeMount: HTMLElement, shellContext: unknown): void {
        void mountViewModule(() => import("views/home") as any, homeMount, { shellContext } as ViewOptions)
            .then((unmount) => {
                this.homeUnmount = unmount;
            })
            .catch((err) => {
                console.warn("[EnvironmentShell] home-view failed", err);
                homeMount.innerHTML =
                    `<p style="color:#eee;padding:1rem;font-family:system-ui">Home view failed to load.</p>`;
            });
    }

    /** Lazily mount Home when leaving mono native (or user presses Home). */
    private ensureHomeMounted(): void {
        const pending = this._pendingHomeMount;
        if (!pending || this.homeUnmount) return;
        this._pendingHomeMount = null;
        this._monoNativeBoot = false;
        this.mountHomeDesktop(pending.homeMount, (pending.shellContext as ViewOptions).shellContext);
    }

    private focusHome(): void {
        this.ensureHomeMounted();
        // WHY: Home collapses open apps (minimize) — do not dispose; restore via long-press switcher.
        if (typeof this.windowLayer?.minimizeAllWindows === "function") {
            this.windowLayer.minimizeAllWindows();
        } else {
            for (const t of this.windowLayer?.listWindowTasks?.() ?? []) {
                this.windowLayer?.minimizeWindow?.(t.id);
            }
            this.windowLayer?.blurWindows?.();
        }
        this.setFocusedTaskId?.("home");
        this.focusedTaskId.value = "home";
        this.currentView.value = "home" as ViewId;
    }

    private openInWindow(viewId: string, opts?: ViewOptions): void {
        const id = String(viewId || "").trim().toLowerCase();
        if (!id || id === "airpad") return;
        const withNative = mergeNativeOpt(id, opts);
        if (!this.windowLayer?.focusWindow(id)) {
            void this.windowLayer?.shellContext.openView?.(id, withNative);
        }
        /* WHY: always re-assert native after open/focus — existing frames used to skip it. */
        if (wantsNative(withNative)) {
            const promote = (): void => {
                this.windowLayer?.enterNative?.(id);
                this.preserveNativeDeepLink(id);
            };
            promote();
            /* WHY: mountUiWindow applyChrome may race the first enterNative. */
            requestAnimationFrame(promote);
            setTimeout(promote, 0);
        }
        this.setFocusedTaskId?.(id === "markdown" ? "viewer" : id);
        this.currentView.value = id as ViewId;
    }

    /**
     * Keep mono-native deep link as a readable path: `/settings?shell=…&native=1&view=settings`.
     * WHY: root `/?view=` looked “wrong” in the address bar; path + view= stay in sync so
     * BootLoader / readStartNativeViewIds still resolve after reloads.
     * INVARIANT: do not leave a stale `#env-viewer` (tasking) on a Settings mono window.
     */
    private preserveNativeDeepLink(viewId: string): void {
        if (typeof location === "undefined" || typeof history === "undefined") return;
        try {
            const id = String(viewId || "").trim().toLowerCase();
            if (!id || id === "home") return;
            const sp = new URLSearchParams(location.search || "");
            sp.set("shell", this.id);
            sp.set("native", "1");
            sp.set("view", id);
            const path = `/${id}`;
            const next = `${path}?${sp.toString()}`;
            const cur = `${location.pathname}${location.search}${location.hash || ""}`;
            if (cur !== next) {
                history.replaceState({ viewId: id, params: Object.fromEntries(sp) }, "", next);
            }
        } catch {
            /* ignore */
        }
    }

    private async routeView(viewId: string, opts?: ViewOptions): Promise<void> {
        const id = String(viewId || "").trim().toLowerCase();
        if (!id || id === "airpad") return;
        if (id === "home") {
            this.focusHome();
            return;
        }
        this.openInWindow(id, opts);
    }

    async navigate(
        viewId: ViewId,
        params?: Record<string, string>,
        _navOptions?: unknown
    ): Promise<void> {
        const id = String(viewId || "home").toLowerCase();
        if (id === "airpad") {
            this.showMessage("AirPad view is disabled in environment shell");
            return;
        }
        if (id === "home") {
            /*
             * WHY: `/?shell=environment&native=1` (path stripped) still means mono boot —
             * do not collapse to desktop Home; open the start-native view instead.
             */
            const startNative = readStartNativeViewIds();
            if (startNative.length) {
                for (const vid of startNative) {
                    this.openInWindow(vid, { native: "1", params: { native: "1", ...(params || {}) } } as ViewOptions);
                }
                return;
            }
            this.focusHome();
            try {
                const searchParams = new URLSearchParams(params || {});
                searchParams.set("shell", this.id);
                searchParams.delete("native");
                const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
                const next = `${location.pathname}${search}`;
                if (`${location.pathname}${location.search}` !== next) {
                    history.replaceState({ viewId: "home", params }, "", next);
                }
            } catch {
                /* ignore */
            }
            return;
        }
        /*
         * WHY: BootLoader used to call navigate(viewId) without params — merge address-bar
         * `native=1` so mono deep links still enter Windows2 native immersive.
         */
        let urlParams: Record<string, string> = {};
        try {
            urlParams = Object.fromEntries(new URLSearchParams(location.search || ""));
        } catch {
            urlParams = {};
        }
        const merged = { ...urlParams, ...(params || {}) };
        const opts = { params: merged } as ViewOptions & { native?: string; params?: Record<string, string> };
        if (
            merged.native === "1" ||
            merged.native === "true" ||
            readStartNativeViewIds().includes(id)
        ) {
            opts.native = "1";
            opts.params = { ...merged, native: "1" };
        }
        this.openInWindow(id, opts);
    }

    unmount(): void {
        try {
            this.homeUnmount?.();
        } catch {
            /* ignore */
        }
        this.homeUnmount = null;
        try {
            this.windowLayer?.dispose();
        } catch {
            /* ignore */
        }
        this.windowLayer = null;
        try {
            this.chromeDispose?.();
        } catch {
            /* ignore */
        }
        this.chromeDispose = null;
        try {
            this.shellActivityDispose?.();
        } catch {
            /* ignore */
        }
        this.shellActivityDispose = null;

        if (this.mounted && this.container && this.rootElement) {
            try {
                if (this.container.contains(this.rootElement)) {
                    this.rootElement.remove();
                }
            } catch {
                /* ignore */
            }
        }
        this.rootElement = null;
        this.contentContainer = null;
        this.overlayContainer = null;
        this.workspaceEl = null;
        this.homeMountEl = null;
        this.container = null;
        this.mounted = false;
    }
}

export function createEnvironmentShell(_container: HTMLElement): EnvironmentShell {
    return new EnvironmentShell();
}

export default createEnvironmentShell;
