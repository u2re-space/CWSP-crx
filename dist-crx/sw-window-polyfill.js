/* crx-sw-window-polyfill */
(() => {
  const g = globalThis;
  if (typeof g.window === "undefined") g.window = g;
})();
