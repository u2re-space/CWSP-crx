/*
 * Filename: sw-window-polyfill.ts
 * FullPath: apps/CWSP-crx/src/crx/sw-window-polyfill.ts
 * Change date and time: 14.45.00_19.07.2026
 * Reason for changes: MV3 SW has no `window`; Vite __vitePreload uses window.dispatchEvent.
 */

/**
 * WHY: Rolldown/Vite inject `__vitePreload` that uses bare `window` / `document`
 * (`createElement("link")`, `head.appendChild`). MV3 SW has neither; without
 * stubs the worker dies with `document is not defined` (registration status 15)
 * as soon as snip hits a dynamic import.
 *
 * INVARIANT: must be the first import of `sw.ts` so it runs before Coordinator / fest.
 * Alias only when missing (never overwrite a real Window/Document).
 */
const g = globalThis as typeof globalThis & {
    window?: typeof globalThis;
    document?: {
        head: { appendChild: (n: unknown) => unknown; querySelector: () => null };
        createElement: () => Record<string, unknown>;
        querySelector: () => null;
        querySelectorAll: () => [];
        addEventListener: () => void;
        removeEventListener: () => void;
    };
};

if (typeof g.window === "undefined") {
    g.window = g;
}

if (typeof g.document === "undefined") {
    const node = () => {
        const el: Record<string, unknown> = {
            relList: { supports: () => false },
            style: {},
            dataset: {},
            setAttribute() {},
            appendChild(child: unknown) { return child; },
            removeChild(child: unknown) { return child; },
        };
        return el;
    };
    const head = { appendChild: (n: unknown) => n, querySelector: () => null };
    g.document = {
        head,
        createElement: node,
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener() {},
        removeEventListener() {},
    };
}

export {};
