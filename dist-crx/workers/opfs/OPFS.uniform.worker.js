var e = Object.defineProperty, t = (t, n) => {
	let s = {};
	for (var r in t) e(s, r, {
		get: t[r],
		enumerable: !0
	});
	return n || e(s, Symbol.toStringTag, { value: "Module" }), s;
};
let n = function(e) {
	return e.GET = "get", e.SET = "set", e.CALL = "call", e.APPLY = "apply", e.CONSTRUCT = "construct", e.DELETE = "delete", e.DELETE_PROPERTY = "deleteProperty", e.HAS = "has", e.OWN_KEYS = "ownKeys", e.GET_OWN_PROPERTY_DESCRIPTOR = "getOwnPropertyDescriptor", e.GET_PROPERTY_DESCRIPTOR = "getPropertyDescriptor", e.GET_PROTOTYPE_OF = "getPrototypeOf", e.SET_PROTOTYPE_OF = "setPrototypeOf", e.IS_EXTENSIBLE = "isExtensible", e.PREVENT_EXTENSIONS = "preventExtensions", e.TRANSFER = "transfer", e.IMPORT = "import", e.DISPOSE = "dispose", e;
}({});
const s = {
	ws: "websocket",
	socket: "websocket",
	socketio: "socket-io",
	service: "service-worker",
	sw: "service-worker",
	"service-worker-client": "service-worker",
	"service-worker-host": "service-worker",
	"ring-buffer": "atomics"
};
function r(e) {
	return "string" == typeof e ? function(e) {
		const t = String(e ?? "").trim().toLowerCase();
		return t ? s[t] ?? t : "internal";
	}(e) : "undefined" != typeof Worker && e instanceof Worker ? "worker" : "undefined" != typeof SharedWorker && e instanceof SharedWorker ? "shared-worker" : "undefined" != typeof MessagePort && e instanceof MessagePort ? "message-port" : "undefined" != typeof BroadcastChannel && e instanceof BroadcastChannel ? "broadcast" : "undefined" != typeof WebSocket && e instanceof WebSocket ? "websocket" : "undefined" != typeof RTCDataChannel && e instanceof RTCDataChannel ? "rtc-data" : "undefined" != typeof chrome && e && "object" == typeof e && "function" == typeof e.postMessage && e.onMessage?.addListener ? "chrome-port" : "internal";
}
const o = Symbol.for("@fix"), a = (e) => "string" == typeof e || "number" == typeof e || "boolean" == typeof e || "bigint" == typeof e || void 0 === e || null == e, i = (e, t) => e?.[o] ?? (null != e ? e : t) ?? t, c = () => crypto?.randomUUID ? crypto?.randomUUID?.() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (e) => {
	return (+e ^ (t = /* @__PURE__ */ new Uint8Array(1), crypto?.getRandomValues ? crypto?.getRandomValues?.(t) : (() => {
		const e = new Uint8Array(t.length);
		for (let n = 0; n < t.length; n++) e[n] = Math.floor(256 * Math.random());
		return e;
	})())?.[0] & 15 >> +e / 4).toString(16);
	var t;
}), l = (e) => Array.isArray(e) ? e?.flatMap?.((e) => Array.isArray(e) ? l(e) : e) : e, h = (e) => l(e)?.every?.(u), u = (e) => a(e) || "function" == typeof SharedArrayBuffer && e instanceof SharedArrayBuffer || d(e) || Array.isArray(e) && h(e), d = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), p = (e) => a(e) || "function" == typeof ArrayBuffer && e instanceof ArrayBuffer || "function" == typeof MessagePort && e instanceof MessagePort || "function" == typeof ReadableStream && e instanceof ReadableStream || "function" == typeof WritableStream && e instanceof WritableStream || "function" == typeof TransformStream && e instanceof TransformStream || "function" == typeof ImageBitmap && e instanceof ImageBitmap || "function" == typeof VideoFrame && e instanceof VideoFrame || "function" == typeof OffscreenCanvas && e instanceof OffscreenCanvas || "function" == typeof RTCDataChannel && e instanceof RTCDataChannel || "function" == typeof AudioData && e instanceof AudioData || "function" == typeof WebTransportReceiveStream && e instanceof WebTransportReceiveStream || "function" == typeof WebTransportSendStream && e instanceof WebTransportSendStream || "function" == typeof WebTransportReceiveStream && e instanceof WebTransportReceiveStream, f = (e, t, n) => {
	if (Array.isArray(e)) return e.every(u) ? e.map(t) : e.map((n, s) => f(n, t, [e, s]));
	if (e instanceof Map) {
		const n = Array.from(e.entries());
		return n.map(([e, t]) => t).every(u) ? new Map(n.map(([n, s]) => [n, t(s, n, e)])) : new Map(n.map(([n, s]) => [n, f(s, t, [e, n])]));
	}
	if (e instanceof Set) {
		const n = Array.from(e.entries()), s = n.map(([e, t]) => t);
		return n.every(u) ? new Set(s.map(t)) : new Set(s.map((n) => f(n, t, [e, n])));
	}
	if ("object" == typeof e && e?.constructor == Object && "[object Object]" == Object.prototype.toString.call(e)) {
		const n = Array.from(Object.entries(e));
		return n.map(([e, t]) => t).every(u) ? Object.fromEntries(n.map(([n, s]) => [n, t(s, n, e)])) : Object.fromEntries(n.map(([n, s]) => [n, f(s, t, [e, n])]));
	}
	return t(e, n?.[1] ?? "", n?.[0] ?? null);
}, m = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), g = (e, t) => e instanceof Promise || "function" == typeof e?.then ? m?.has?.(e) ? t(m?.get?.(e)) : Promise.try?.(async () => {
	const t = await e;
	return m?.set?.(e, t), t;
})?.then?.(t) : t(e);
var y = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	defineProperty(e, t, n) {
		return i(e) instanceof Promise ? Reflect.defineProperty(e, t, n) : g(i(e), (e) => Reflect.defineProperty(e, t, n));
	}
	deleteProperty(e, t) {
		return i(e) instanceof Promise ? Reflect.deleteProperty(e, t) : g(i(e), (e) => Reflect.deleteProperty(e, t));
	}
	getPrototypeOf(e) {
		return i(e) instanceof Promise ? Reflect.getPrototypeOf(e) : g(i(e), (e) => Reflect.getPrototypeOf(e));
	}
	setPrototypeOf(e, t) {
		return i(e) instanceof Promise ? Reflect.setPrototypeOf(e, t) : g(i(e), (e) => Reflect.setPrototypeOf(e, t));
	}
	isExtensible(e) {
		return i(e) instanceof Promise ? Reflect.isExtensible(e) : g(i(e), (e) => Reflect.isExtensible(e));
	}
	preventExtensions(e) {
		return i(e) instanceof Promise ? Reflect.ownKeys(e) : g(i(e), (e) => Reflect.preventExtensions(e));
	}
	ownKeys(e) {
		const t = i(e);
		return t instanceof Promise ? Object.keys(t) : g(t, (e) => "object" != typeof e && "function" != typeof e || null == e ? [] : Object.keys(e)) ?? [];
	}
	getOwnPropertyDescriptor(e, t) {
		return i(e) instanceof Promise ? Reflect.getOwnPropertyDescriptor(e, t) : g(i(e), (e) => Reflect.getOwnPropertyDescriptor(e, t));
	}
	construct(e, t, n) {
		return g(i(e), (e) => Reflect.construct(e, t, n));
	}
	has(e, t) {
		return i(e) instanceof Promise ? Reflect.has(e, t) : g(i(e), (e) => Reflect.has(e, t));
	}
	get(e, t, n) {
		if (e = i(e), "promise" == t) return e;
		if ("resolve" == t && this.#e) return (...e) => {
			const t = this.#e?.(...e);
			return this.#e = null, t;
		};
		if ("reject" == t && this.#t) return (...e) => {
			const t = this.#t?.(...e);
			return this.#t = null, t;
		};
		if ("then" == t || "catch" == t || "finally" == t) {
			if (e instanceof Promise) return e?.[t]?.bind?.(e);
			{
				const n = Promise.try(() => e);
				return n?.[t]?.bind?.(n);
			}
		}
		let s;
		return s = m?.has?.(e) && null != (s = m?.get?.(e))?.[t] ? m?.get?.(e)?.[t] : b(g(e, async (s) => {
			if (i(s) instanceof Promise) return Reflect.get(s, t, n);
			if (a(s)) return t == Symbol.toPrimitive || t == Symbol.toStringTag ? s : void 0;
			let r;
			try {
				r = Reflect.get(s, t, n);
			} catch (o) {
				r = e?.[t];
			}
			return "function" == typeof r ? r?.bind?.(s) : r;
		})), t == Symbol.toStringTag ? a(s) ? String(s ?? "") || "" : s?.[Symbol.toStringTag]?.() || String(s ?? "") || "" : t == Symbol.toPrimitive ? (e) => {
			if (a(s)) return ((e, t) => a(e) ? "number" == t ? Number(e) || 0 : "string" == t ? String(e) || "" : "boolean" == t ? !!e : e : null)(s, e);
		} : s;
	}
	set(e, t, n) {
		return g(i(e), (e) => Reflect.set(e, t, n));
	}
	apply(e, t, n) {
		if (this.#e) {
			const e = this.#e?.(...n);
			return this.#e = null, e;
		}
		return g(i(e, this.#e), (e) => {
			if ("function" == typeof e) return i(e), Reflect.apply(e, t, n);
		});
	}
};
function b(e, t, n) {
	return e instanceof Promise || "function" == typeof e?.then ? m?.has?.(e) ? m?.get?.(e) : (_?.has?.(e) || e?.then?.((t) => m?.set?.(e, t)), _?.getOrInsertComputed?.(e, () => new Proxy(((e) => {
		if ("function" == typeof e || null == e) return e;
		const t = function() {};
		return t[o] = e, t;
	})(e), new y(t, n)))) : e;
}
var w = class {
	_unsubscribe;
	_closed = !1;
	constructor(e) {
		this._unsubscribe = e;
	}
	get closed() {
		return this._closed;
	}
	unsubscribe() {
		this._closed || (this._closed = !0, this._unsubscribe());
	}
}, C = class {
	_producer;
	constructor(e) {
		this._producer = e;
	}
	subscribe(e, t) {
		const n = "function" == typeof e ? { next: e } : e ?? {}, s = new AbortController();
		t?.signal?.addEventListener("abort", () => s.abort());
		let r, o = !0;
		const a = () => {
			o = !1, s.abort(), r?.();
		}, i = {
			next: (e) => o && n.next?.(e),
			error: (e) => {
				o && (n.error?.(e), a());
			},
			complete: () => {
				o && (n.complete?.(), a());
			},
			signal: s.signal,
			get active() {
				return o && !s.signal.aborted;
			}
		};
		try {
			r = this._producer(i);
		} catch (c) {
			i.error(c);
		}
		return new w(a);
	}
	pipe(...e) {
		return e.reduce((e, t) => t(e), this);
	}
}, v = class {
	_subs = /* @__PURE__ */ new Set();
	_buffer = [];
	_maxBuffer;
	_replay;
	constructor(e = {}) {
		this._maxBuffer = e.bufferSize ?? 0, this._replay = e.replayOnSubscribe ?? !1;
	}
	next(e) {
		this._maxBuffer > 0 && (this._buffer.push(e), this._buffer.length > this._maxBuffer && this._buffer.shift());
		for (const n of this._subs) try {
			n.next?.(e);
		} catch (t) {
			n.error?.(t);
		}
	}
	error(e) {
		for (const t of this._subs) t.error?.(e);
	}
	complete() {
		for (const e of this._subs) e.complete?.();
		this._subs.clear();
	}
	subscribe(e) {
		const t = "function" == typeof e ? { next: e } : e;
		if (this._subs.add(t), this._replay) for (const s of this._buffer) try {
			t.next?.(s);
		} catch (n) {
			t.error?.(n);
		}
		return new w(() => {
			this._subs.delete(t);
		});
	}
	getValue() {
		return this._buffer.at(-1);
	}
	getBuffer() {
		return [...this._buffer];
	}
	get subscriberCount() {
		return this._subs.size;
	}
};
function k() {
	if (void 0 !== globalThis.Deno) return "deno";
	if (void 0 !== globalThis.process && globalThis.process?.versions?.node) return "node";
	const e = globalThis.ServiceWorkerGlobalScope, t = globalThis.SharedWorkerGlobalScope, n = globalThis.DedicatedWorkerGlobalScope;
	if (e && self instanceof e) return "service-worker";
	if (t && self instanceof t) return "shared-worker";
	if (n && self instanceof n) return "worker";
	if ("undefined" != typeof chrome && chrome.runtime?.id) {
		if ("function" == typeof chrome.runtime.getBackgroundPage || (chrome.runtime.getManifest?.()?.background)?.service_worker) return "chrome-background";
		if (void 0 !== chrome.devtools) return "chrome-devtools";
		if ("undefined" != typeof document && "chrome-extension:" === globalThis?.location?.protocol && (chrome.extension?.getViews?.({ type: "popup" }) ?? []).includes(globalThis)) return "chrome-popup";
		if ("undefined" != typeof document && "chrome-extension:" !== globalThis?.location?.protocol) return "chrome-content";
	}
	return "undefined" != typeof globalThis && "undefined" != typeof document ? "window" : "unknown";
}
function x(e) {
	if ("undefined" != typeof RTCDataChannel && e instanceof RTCDataChannel) return "rtc-data";
	const t = r(e);
	return t && "internal" !== t ? t : e === self || e === globalThis || "self" === e ? "self" : "internal";
}
function P(e) {
	if (!e) return "unknown";
	if (e.contextType) return e.contextType;
	const t = e.sender ?? "";
	return t.includes("worker") ? "worker" : t.includes("sw") || t.includes("service") ? "service-worker" : t.includes("chrome") || t.includes("crx") ? "chrome-content" : t.includes("background") ? "chrome-background" : "unknown";
}
const S = {
	get: (e, t) => Reflect.get(e, t),
	set: (e, t, n) => Reflect.set(e, t, n),
	has: (e, t) => Reflect.has(e, t),
	apply: (e, t, n) => Reflect.apply(e, t, n),
	construct: (e, t) => Reflect.construct(e, t),
	deleteProperty: (e, t) => Reflect.deleteProperty(e, t),
	ownKeys: (e) => Reflect.ownKeys(e),
	getOwnPropertyDescriptor: (e, t) => Reflect.getOwnPropertyDescriptor(e, t),
	getPrototypeOf: (e) => Reflect.getPrototypeOf(e),
	setPrototypeOf: (e, t) => Reflect.setPrototypeOf(e, t),
	isExtensible: (e) => Reflect.isExtensible(e),
	preventExtensions: (e) => Reflect.preventExtensions(e)
}, T = Symbol.for("uniform.proxy"), E = Symbol.for("uniform.proxy.internals");
var R = class {
	_invoker;
	_config;
	_childCache = /* @__PURE__ */ new Map();
	constructor(e, t) {
		this._invoker = e, this._config = {
			channel: t.channel,
			basePath: t.basePath ?? [],
			invoker: e,
			cache: t.cache ?? !0,
			timeout: t.timeout ?? 3e4
		};
	}
	get(e, t, n) {
		const s = String(t);
		if (t === T) return !0;
		if (t === E) return this._config;
		if (t === V) return !0;
		if (t === J) return this._getDescriptor();
		if ("then" === t || "catch" === t || "finally" === t) return;
		if ("symbol" == typeof t) return;
		if ("$path" === t) return this._config.basePath;
		if ("$channel" === t) return this._config.channel;
		if ("$descriptor" === t) return this._getDescriptor();
		if ("$invoke" === t) return this._invoker;
		const r = [...this._config.basePath, s];
		if (this._config.cache && this._childCache.has(s)) return this._childCache.get(s);
		const o = O(this._invoker, {
			...this._config,
			basePath: r
		});
		return this._config.cache && this._childCache.set(s, o), o;
	}
	set(e, t, s, r) {
		return "symbol" == typeof t || this._invoker(n.SET, [...this._config.basePath, String(t)], [s]), !0;
	}
	apply(e, t, s) {
		return this._invoker(n.APPLY, this._config.basePath, [s]);
	}
	construct(e, t, s) {
		return this._invoker(n.CONSTRUCT, this._config.basePath, [t]);
	}
	has(e, t) {
		return "symbol" != typeof t && this._invoker(n.HAS, this._config.basePath, [t]);
	}
	deleteProperty(e, t) {
		return "symbol" == typeof t || this._invoker(n.DELETE_PROPERTY, [...this._config.basePath, String(t)], []);
	}
	ownKeys(e) {
		return [];
	}
	getOwnPropertyDescriptor(e, t) {
		return {
			configurable: !0,
			enumerable: !0,
			writable: !0
		};
	}
	getPrototypeOf(e) {
		return Function.prototype;
	}
	setPrototypeOf(e, t) {
		return this._invoker(n.SET_PROTOTYPE_OF, this._config.basePath, [t]);
	}
	isExtensible(e) {
		return !0;
	}
	preventExtensions(e) {
		return this._invoker(n.PREVENT_EXTENSIONS, this._config.basePath, []);
	}
	_getDescriptor() {
		return {
			path: this._config.basePath,
			channel: this._config.channel,
			primitive: !1
		};
	}
};
function O(e, t) {
	const n = new R(e, t);
	return new Proxy(function() {}, n);
}
function M(e, t, n) {
	if (!e || "object" != typeof e) return e;
	if (e.primitive) return e;
	const s = Y.get(e);
	if (s) return s;
	const r = O(t, {
		channel: n ?? e.channel ?? "unknown",
		basePath: e.path ?? []
	});
	return Y.set(e, r), G.set(r, e), r;
}
const I = M;
var D = class {
	_createId;
	_emitEvent;
	_connections = /* @__PURE__ */ new Map();
	constructor(e, t) {
		this._createId = e, this._emitEvent = t;
	}
	register(e) {
		const t = function(e) {
			return [
				e.localChannel,
				e.remoteChannel,
				e.sender,
				e.transportType,
				e.direction
			].join("::");
		}(e), n = Date.now(), s = this._connections.get(t);
		if (s) return s.updatedAt = n, s.status = "active", s.metadata = {
			...s.metadata,
			...e.metadata
		}, s;
		const r = {
			id: this._createId(),
			localChannel: e.localChannel,
			remoteChannel: e.remoteChannel,
			sender: e.sender,
			transportType: e.transportType,
			direction: e.direction,
			status: "active",
			createdAt: n,
			updatedAt: n,
			metadata: e.metadata
		};
		return this._connections.set(t, r), this._emitEvent?.({
			type: "connected",
			connection: r,
			timestamp: n
		}), r;
	}
	markNotified(e, t) {
		const n = Date.now();
		e.lastNotifyAt = n, e.updatedAt = n, this._emitEvent?.({
			type: "notified",
			connection: e,
			timestamp: n,
			payload: t
		});
	}
	closeByChannel(e) {
		const t = Date.now();
		for (const n of this._connections.values()) n.localChannel !== e && n.remoteChannel !== e || "closed" !== n.status && (n.status = "closed", n.updatedAt = t, this._emitEvent?.({
			type: "disconnected",
			connection: n,
			timestamp: t
		}));
	}
	closeAll() {
		const e = Date.now();
		for (const t of this._connections.values()) "closed" !== t.status && (t.status = "closed", t.updatedAt = e, this._emitEvent?.({
			type: "disconnected",
			connection: t,
			timestamp: e
		}));
	}
	query(e = {}) {
		return function(e, t = {}) {
			const n = t.includeClosed ?? !1, s = t.status ?? (n ? void 0 : "active");
			return [...e].filter((e) => !(s && e.status !== s || t.channel && e.localChannel !== t.channel && e.remoteChannel !== t.channel || t.localChannel && e.localChannel !== t.localChannel || t.remoteChannel && e.remoteChannel !== t.remoteChannel || t.sender && e.sender !== t.sender || t.transportType && e.transportType !== t.transportType || t.direction && e.direction !== t.direction)).sort((e, t) => t.updatedAt - e.updatedAt);
		}(this._connections.values(), e);
	}
	values() {
		return [...this._connections.values()];
	}
	clear() {
		this._connections.clear();
	}
}, A = class {
	_name;
	_contextType;
	_config;
	_transports = /* @__PURE__ */ new Map();
	_defaultTransport = null;
	_connectionEvents = new v({ bufferSize: 200 });
	_connectionRegistry = new D(() => c(), (e) => this._connectionEvents.next(e));
	_pending = /* @__PURE__ */ new Map();
	_subscriptions = [];
	_inbound = new v({ bufferSize: 100 });
	_outbound = new v({ bufferSize: 100 });
	_invocations = new v({ bufferSize: 100 });
	_responses = new v({ bufferSize: 100 });
	_exposed = /* @__PURE__ */ new Map();
	_proxyCache = /* @__PURE__ */ new WeakMap();
	__getPrivate(e) {
		return this[e];
	}
	__setPrivate(e, t) {
		this[e] = t;
	}
	constructor(e) {
		const t = "string" == typeof e ? { name: e } : e;
		this._name = t.name, this._contextType = !1 !== t.autoDetect ? k() : "unknown", this._config = {
			name: t.name,
			autoDetect: t.autoDetect ?? !0,
			timeout: t.timeout ?? 3e4,
			reflect: t.reflect ?? S,
			bufferSize: t.bufferSize ?? 100,
			autoListen: t.autoListen ?? !0
		}, this._config.autoListen && this._isWorkerContext() && this.listen(self);
	}
	connect(e, t = {}) {
		const n = x(e), s = t.targetChannel ?? this._inferTargetChannel(e, n), r = this._createTransportBinding(e, n, s, t);
		this._transports.set(s, r), this._defaultTransport || (this._defaultTransport = r);
		const o = this._registerConnection({
			localChannel: this._name,
			remoteChannel: s,
			sender: this._name,
			transportType: n,
			direction: "outgoing",
			metadata: { phase: "connect" }
		});
		return this._emitConnectionSignal(r, "connect", {
			connectionId: o.id,
			from: this._name,
			to: s
		}), this;
	}
	listen(e, t = {}) {
		const n = x(e), s = t.targetChannel ?? this._inferTargetChannel(e, n), r = (e) => this._handleIncoming(e), o = this._registerConnection({
			localChannel: this._name,
			remoteChannel: s,
			sender: s,
			transportType: n,
			direction: "incoming",
			metadata: { phase: "listen" }
		});
		switch (n) {
			case "worker":
			case "message-port":
			case "broadcast":
				!1 !== t.autoStart && e.start && e.start(), e.addEventListener?.("message", (e) => r(e.data));
				break;
			case "websocket":
				e.addEventListener?.("message", (e) => {
					try {
						r(JSON.parse(e.data));
					} catch {}
				});
				break;
			case "chrome-runtime":
				chrome.runtime.onMessage?.addListener?.((e, t, n) => (r(e), !0));
				break;
			case "chrome-tabs":
				chrome.runtime.onMessage?.addListener?.((e, n) => (null == t.tabId || n?.tab?.id === t.tabId) && (r(e), !0));
				break;
			case "chrome-port":
				e?.onMessage?.addListener?.((e) => {
					r(e);
				});
				break;
			case "chrome-external":
				chrome.runtime.onMessageExternal?.addListener?.((e) => (r(e), !0));
				break;
			case "self":
				addEventListener?.("message", (e) => r(e.data));
				break;
			default: t.onMessage && t.onMessage(r);
		}
		return this._sendSignalToTarget(e, n, {
			connectionId: o.id,
			from: this._name,
			to: s,
			tabId: t.tabId,
			externalId: t.externalId
		}, "notify"), this;
	}
	attach(e, t = {}) {
		return this.connect(e, t);
	}
	expose(e, t) {
		const n = [e];
		return ne(n, t), this._exposed.set(e, {
			name: e,
			obj: t,
			path: n
		}), this;
	}
	exposeAll(e) {
		for (const [t, n] of Object.entries(e)) this.expose(t, n);
		return this;
	}
	async import(e, t) {
		return this.invoke(t ?? this._getDefaultTarget(), n.IMPORT, [], [e]);
	}
	invoke(e, t, n, s = []) {
		const r = c(), o = Promise.withResolvers();
		this._pending.set(r, o);
		const a = setTimeout(() => {
			this._pending.has(r) && (this._pending.delete(r), o.reject(/* @__PURE__ */ new Error(`Request timeout: ${t} on ${n.join(".")}`)));
		}, this._config.timeout), i = {
			id: r,
			channel: e,
			sender: this._name,
			type: "request",
			payload: {
				channel: e,
				sender: this._name,
				action: t,
				path: n,
				args: s
			},
			timestamp: Date.now()
		};
		return this._send(e, i), this._outbound.next(i), o.promise.finally(() => clearTimeout(a));
	}
	get(e, t, s) {
		return this.invoke(e, n.GET, t, [s]);
	}
	set(e, t, s, r) {
		return this.invoke(e, n.SET, t, [s, r]);
	}
	call(e, t, s = []) {
		return this.invoke(e, n.APPLY, t, [s]);
	}
	construct(e, t, s = []) {
		return this.invoke(e, n.CONSTRUCT, t, [s]);
	}
	proxy(e, t = []) {
		const n = e ?? this._getDefaultTarget();
		return this._createProxy(n, t);
	}
	remote(e, t) {
		return this.proxy(t, [e]);
	}
	wrapDescriptor(e, t) {
		return M(e, (n, s, r) => {
			const o = t ?? e?.channel ?? this._getDefaultTarget();
			return this.invoke(o, n, s, r);
		}, t ?? e?.channel ?? this._getDefaultTarget());
	}
	subscribe(e) {
		return this._inbound.subscribe(e);
	}
	next(e) {
		this._send(e.channel, e), this._outbound.next(e);
	}
	emit(e, t, n) {
		const s = {
			id: c(),
			channel: e,
			sender: this._name,
			type: "event",
			payload: {
				type: t,
				data: n
			},
			timestamp: Date.now()
		};
		this.next(s);
	}
	notify(e, t = {}, n = "notify") {
		const s = this._transports.get(e);
		return !!s && (this._emitConnectionSignal(s, n, {
			from: this._name,
			to: e,
			...t
		}), !0);
	}
	get onMessage() {
		return this._inbound;
	}
	get onOutbound() {
		return this._outbound;
	}
	get onInvocation() {
		return this._invocations;
	}
	get onResponse() {
		return this._responses;
	}
	get onConnection() {
		return this._connectionEvents;
	}
	subscribeConnections(e) {
		return this._connectionEvents.subscribe(e);
	}
	queryConnections(e = {}) {
		return this._connectionRegistry.query(e);
	}
	notifyConnections(e = {}, t = {}) {
		let n = 0;
		const s = this.queryConnections({
			...t,
			status: "active",
			includeClosed: !1
		});
		for (const r of s) {
			const t = this._transports.get(r.remoteChannel);
			t && (this._emitConnectionSignal(t, "notify", {
				connectionId: r.id,
				from: this._name,
				to: r.remoteChannel,
				...e
			}), n++);
		}
		return n;
	}
	get name() {
		return this._name;
	}
	get contextType() {
		return this._contextType;
	}
	get config() {
		return this._config;
	}
	get connectedChannels() {
		return [...this._transports.keys()];
	}
	get exposedModules() {
		return [...this._exposed.keys()];
	}
	close() {
		this._subscriptions.forEach((e) => e.unsubscribe()), this._subscriptions = [], this._pending.clear(), this._markAllConnectionsClosed();
		for (const e of this._transports.values()) {
			try {
				e.cleanup?.();
			} catch {}
			if ("message-port" === e.transportType || "broadcast" === e.transportType) try {
				e.target?.close?.();
			} catch {}
		}
		this._transports.clear(), this._defaultTransport = null, this._connectionRegistry.clear(), this._inbound.complete(), this._outbound.complete(), this._invocations.complete(), this._responses.complete(), this._connectionEvents.complete();
	}
	_handleIncoming(e) {
		if (e && "object" == typeof e) switch (this._inbound.next(e), e.type) {
			case "request":
				e.channel === this._name && this._handleRequest(e);
				break;
			case "response":
				this._handleResponse(e);
				break;
			case "event": break;
			case "signal": this._handleSignal(e);
		}
	}
	_handleResponse(e) {
		const t = e.reqId ?? e.id, n = this._pending.get(t);
		if (n) {
			if (this._pending.delete(t), e.payload?.error) n.reject(new Error(e.payload.error));
			else {
				const t = e.payload?.result, s = e.payload?.descriptor;
				null != t ? n.resolve(t) : s ? n.resolve(this.wrapDescriptor(s, e.sender)) : n.resolve(void 0);
			}
			this._responses.next({
				id: t,
				channel: e.channel,
				sender: e.sender,
				result: e.payload?.result,
				descriptor: e.payload?.descriptor,
				timestamp: Date.now()
			});
		}
	}
	async _handleRequest(e) {
		const t = e.payload;
		if (!t) return;
		const { action: n, path: s, args: r, sender: o } = t, a = e.reqId ?? e.id;
		this._invocations.next({
			id: a,
			channel: this._name,
			sender: o,
			action: n,
			path: s,
			args: r ?? [],
			timestamp: Date.now(),
			contextType: P(e)
		});
		const { result: i, toTransfer: c, newPath: l } = await this._executeAction(n, s, r ?? [], o);
		await this._sendResponse(a, n, o, l, i, c);
	}
	async _executeAction(e, t, n, s) {
		const { result: r, toTransfer: o, path: a } = ce(e, t, n, {
			channel: this._name,
			sender: s,
			reflect: this._config.reflect
		});
		return {
			result: await r,
			toTransfer: o,
			newPath: a
		};
	}
	async _sendResponse(e, t, n, s, r, o) {
		const { response: a, transfer: i } = await le(e, t, this._name, n, s, r, o), c = {
			id: e,
			...a,
			timestamp: Date.now(),
			transferable: i
		};
		this._send(n, c, i);
	}
	_handleSignal(e) {
		const t = e?.payload ?? {}, n = t.from ?? e.sender ?? "unknown", s = e.transportType ?? this._transports.get(e.channel)?.transportType ?? "internal", r = this._registerConnection({
			localChannel: this._name,
			remoteChannel: n,
			sender: e.sender ?? n,
			transportType: s,
			direction: "incoming"
		});
		this._markConnectionNotified(r, t);
	}
	_registerConnection(e) {
		return this._connectionRegistry.register(e);
	}
	_markConnectionNotified(e, t) {
		this._connectionRegistry.markNotified(e, t);
	}
	_emitConnectionSignal(e, t, n = {}) {
		const s = {
			id: c(),
			type: "signal",
			channel: e.targetChannel,
			sender: this._name,
			transportType: e.transportType,
			payload: {
				type: t,
				from: this._name,
				to: e.targetChannel,
				...n
			},
			timestamp: Date.now()
		};
		(e?.sender ?? e?.postMessage)?.call(e, s);
		const r = this._registerConnection({
			localChannel: this._name,
			remoteChannel: e.targetChannel,
			sender: this._name,
			transportType: e.transportType,
			direction: "outgoing"
		});
		this._markConnectionNotified(r, s.payload);
	}
	_sendSignalToTarget(e, t, n, s) {
		const r = {
			id: c(),
			type: "signal",
			channel: n.to ?? this._name,
			sender: this._name,
			transportType: t,
			payload: {
				type: s,
				...n
			},
			timestamp: Date.now()
		};
		try {
			if ("websocket" === t) return void e?.send?.(JSON.stringify(r));
			if ("chrome-runtime" === t) return void chrome.runtime?.sendMessage?.(r);
			if ("chrome-tabs" === t) {
				const e = n.tabId;
				null != e && chrome.tabs?.sendMessage?.(e, r);
				return;
			}
			if ("chrome-port" === t) return void e?.postMessage?.(r);
			if ("chrome-external" === t) return void (n.externalId && chrome.runtime?.sendMessage?.(n.externalId, r));
			e?.postMessage?.(r, { transfer: [] });
		} catch {}
	}
	_markAllConnectionsClosed() {
		this._connectionRegistry.closeAll();
	}
	_createTransportBinding(e, t, n, s) {
		let r, o;
		switch (t) {
			case "worker":
			case "message-port":
			case "broadcast":
				!1 !== s.autoStart && e.start && e.start(), r = (t, n) => e.postMessage(t, { transfer: n });
				{
					const t = (e) => this._handleIncoming(e.data);
					e.addEventListener?.("message", t), o = () => e.removeEventListener?.("message", t);
				}
				break;
			case "websocket":
				r = (t) => e.send(JSON.stringify(t));
				{
					const t = (e) => {
						try {
							this._handleIncoming(JSON.parse(e.data));
						} catch {}
					};
					e.addEventListener?.("message", t), o = () => e.removeEventListener?.("message", t);
				}
				break;
			case "chrome-runtime":
				r = (e) => chrome.runtime.sendMessage(e);
				{
					const e = (e) => this._handleIncoming(e);
					chrome.runtime.onMessage?.addListener?.(e), o = () => chrome.runtime.onMessage?.removeListener?.(e);
				}
				break;
			case "chrome-tabs":
				r = (e) => {
					null != s.tabId && chrome.tabs?.sendMessage?.(s.tabId, e);
				};
				{
					const e = (e, t) => (null == s.tabId || t?.tab?.id === s.tabId) && (this._handleIncoming(e), !0);
					chrome.runtime.onMessage?.addListener?.(e), o = () => chrome.runtime.onMessage?.removeListener?.(e);
				}
				break;
			case "chrome-port":
				if (e?.postMessage && e?.onMessage?.addListener) {
					r = (t) => e.postMessage(t);
					const t = (e) => this._handleIncoming(e);
					e.onMessage.addListener(t), o = () => {
						try {
							e.onMessage.removeListener(t);
						} catch {}
						try {
							e.disconnect?.();
						} catch {}
					};
				} else {
					const e = s.portName ?? n, t = null != s.tabId && chrome.tabs?.connect ? chrome.tabs.connect(s.tabId, { name: e }) : chrome.runtime.connect({ name: e });
					r = (e) => t.postMessage(e);
					const a = (e) => this._handleIncoming(e);
					t.onMessage.addListener(a), o = () => {
						try {
							t.onMessage.removeListener(a);
						} catch {}
						try {
							t.disconnect();
						} catch {}
					};
				}
				break;
			case "chrome-external":
				r = (e) => {
					s.externalId && chrome.runtime.sendMessage(s.externalId, e);
				};
				{
					const e = (e) => (this._handleIncoming(e), !0);
					chrome.runtime.onMessageExternal?.addListener?.(e), o = () => chrome.runtime.onMessageExternal?.removeListener?.(e);
				}
				break;
			case "self":
				r = (e, t) => globalThis.postMessage?.(e, { transfer: t ?? [] });
				{
					const e = (e) => this._handleIncoming(e.data);
					globalThis.addEventListener?.("message", e), o = () => globalThis.removeEventListener?.("message", e);
				}
				break;
			default: s.onMessage && (o = s.onMessage((e) => this._handleIncoming(e))), r = (t) => e?.postMessage?.(t);
		}
		return {
			target: e,
			targetChannel: n,
			transportType: t,
			sender: r,
			cleanup: o,
			postMessage: (e, t) => r?.(e, t),
			start: () => e?.start?.(),
			close: () => e?.close?.()
		};
	}
	_send(e, t, n) {
		const s = this._transports.get(e) ?? this._defaultTransport;
		(s?.sender ?? s?.postMessage)?.call(s, t, n);
	}
	_getDefaultTarget() {
		return this._defaultTransport ? this._defaultTransport.targetChannel : "worker";
	}
	_inferTargetChannel(e, t) {
		return "worker" === t ? "worker" : "broadcast" === t && e.name ? e.name : "self" === t ? "self" : `${t}-${c().slice(0, 8)}`;
	}
	_createProxy(e, t) {
		return O((t, n, s) => this.invoke(e, t, n, s), {
			channel: e,
			basePath: t,
			cache: !0,
			timeout: this._config.timeout
		});
	}
	_isWorkerContext() {
		return [
			"worker",
			"shared-worker",
			"service-worker"
		].includes(this._contextType);
	}
};
function j(e) {
	return new A(e);
}
let N = null;
const L = "undefined";
[
	typeof ArrayBuffer != L ? ArrayBuffer : null,
	typeof MessagePort != L ? MessagePort : null,
	typeof ReadableStream != L ? ReadableStream : null,
	typeof WritableStream != L ? WritableStream : null,
	typeof TransformStream != L ? TransformStream : null,
	typeof WebTransportReceiveStream != L ? WebTransportReceiveStream : null,
	typeof WebTransportSendStream != L ? WebTransportSendStream : null,
	typeof AudioData != L ? AudioData : null,
	typeof ImageBitmap != L ? ImageBitmap : null,
	typeof VideoFrame != L ? VideoFrame : null,
	typeof OffscreenCanvas != L ? OffscreenCanvas : null,
	typeof RTCDataChannel != L ? RTCDataChannel : null
].filter((e) => null != e);
function W() {
	try {
		const e = globalThis.location?.href;
		if ("string" == typeof e && e.length > 0) return e;
	} catch {}
	try {
		if ("undefined" != typeof document && "string" == typeof document.baseURI && document.baseURI.length > 0) return document.baseURI;
	} catch {}
	return "";
}
function q(e) {
	const t = W();
	if (!t.length) throw new TypeError("[uniform] No base URL for worker resolution (missing location / document.baseURI)");
	const n = e.startsWith("/") ? e.replace(/^\//, "./") : e;
	return new URL(n, t).href;
}
const B = {
	name: "unknown",
	instance: null
}, F = /* @__PURE__ */ new Map(), U = (e) => [...Object.values(n)].includes(e);
var $ = class {
	channelName;
	options;
	_channel;
	constructor(e, t = {}) {
		this.channelName = e, this.options = t, this._channel = function() {
			if (!N) {
				const e = k();
				N = [
					"worker",
					"shared-worker",
					"service-worker"
				].includes(e) ? j({
					name: "worker",
					autoListen: !0
				}) : j({
					name: "host",
					autoListen: !1
				});
			}
			return N;
		}();
	}
	request(e, t, n, s = {}) {
		return "string" == typeof e && (e = [e]), Array.isArray(t) && U(e) && (n = t, t = e, e = []), this._channel.invoke(this.channelName, t, e, n);
	}
	doImportModule(e, t) {
		return this._channel.import(e, this.channelName);
	}
}, z = class {
	channel;
	options;
	_unified;
	broadcasts = {};
	constructor(e, t = {}) {
		this.channel = e, this.options = t, this._unified = j({
			name: e,
			autoListen: !1
		}), B.name = e, B.instance = this;
	}
	createRemoteChannel(e, t = {}, n) {
		return n && (this._unified.attach(n, { targetChannel: e }), this.broadcasts[e] = n), Promise.resolve(new $(e, t));
	}
	getChannel() {
		return this.channel;
	}
	request(e, t, n, s = {}, r = "worker") {
		return "string" == typeof e && (e = [e]), Array.isArray(t) && U(e) && (r = s, s = n, n = t, t = e, e = []), this._unified.invoke(r, t, e, n);
	}
	resolveResponse(e, t) {
		return Promise.resolve(t);
	}
	async handleAndResponse(e, t, n) {
		const s = await async function(e, t, n, s) {
			const { channel: r, sender: o, path: a, action: i, args: c } = e;
			if (r !== n) return null;
			const { result: l, toTransfer: h, path: u } = ce(i, a, c, {
				channel: r,
				sender: o,
				...s
			});
			return le(t, i, n, o, u, l, h);
		}(e, t, this.channel);
		s && n?.(s.response, s.transfer);
	}
	close() {
		this._unified.close();
	}
};
const H = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), Y = /* @__PURE__ */ new WeakMap(), K = (e, t = B?.name, n) => "object" == typeof e && null != e || "function" == typeof e && null != e ? G.has(e) ? G.get(e) : H.has(e) ? H.get(e) : h(e) || n?.includes?.(e) || t == B?.name ? e : {
	$isDescriptor: !0,
	path: Z.get(e) ?? (() => {
		const t = [c()];
		return ne(t, e), t;
	})(),
	owner: B?.name,
	channel: t,
	primitive: a(e),
	writable: !0,
	enumerable: !0,
	configurable: !0,
	argumentCount: e instanceof Function ? e.length : -1
} : u(e) ? e : null, V = Symbol.for("@requestHandler"), J = Symbol.for("@descriptor"), X = (e) => u(e) || e?.[J] ? e : e?.$isDescriptor ? I(e, async () => {}) : h(e) ? e : null, Q = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new WeakMap(), ee = (e, t) => {
	if (null == t || Array.isArray(t) || (t = [t]), null == t || t?.length < 1) return e;
	const n = e?.[J] ?? (e?.$isDescriptor ? e : null);
	if (n && n?.owner == B?.name && (e = te(n?.path) ?? e), a(e)) return e;
	for (const s of t) if (e = e?.[s], null == e) return e;
	return e;
}, te = (e) => {
	if (null == e || Array.isArray(e) || (e = [e]), null == e || e?.length < 1) return null;
	const t = Q?.get?.(e?.[0]) ?? null;
	return null != t ? ee(t, e?.slice?.(1)) : null;
}, ne = (e, t) => {
	const n = t?.[J] ?? (t?.$isDescriptor ? t : null);
	if (n && n?.owner == B?.name && (t = te(n?.path) ?? t), null == e || Array.isArray(e) || (e = [e]), null == e || e?.length < 1) return null;
	const s = Q?.get?.(e?.[0]) ?? null;
	return e?.length > 1 ? ee(s, e?.slice?.(1, -1))[e?.[e?.length - 1]] = t : Q?.set?.(e?.[0], t), "object" != typeof t && "function" != typeof t || Z?.set?.(t, e), t;
}, se = (e) => {
	if (null == e || Array.isArray(e) || (e = [e]), null == e || e?.length < 1) return !1;
	return !(Q?.get?.(e?.[0]) ?? null) && e?.length <= 1 && (Q?.delete?.(e?.[0]), !0);
}, re = (e) => {
	const t = e?.[J] ?? (e?.$isDescriptor ? e : null);
	t && t?.owner == B?.name && (e = te(t?.path) ?? e);
	const n = Z?.get?.(e) ?? t?.path;
	return !(null == n || n?.length < 1) && (se(n), "object" != typeof e && "function" != typeof e || Z?.delete?.(e), !0);
}, oe = (e) => {
	const t = e?.[J] ?? (e?.$isDescriptor ? e : null);
	return null == (Z?.get?.(e) ?? t?.path);
}, ae = (e) => ("object" == typeof e || "function" == typeof e) && null != e, ie = {
	get: (e, t) => e?.[t],
	set: (e, t, n) => (e[t] = n, !0),
	has: (e, t) => t in e,
	apply: (e, t, n) => e.apply(t, n),
	construct: (e, t) => new e(...t),
	deleteProperty: (e, t) => delete e[t],
	ownKeys: (e) => Object.keys(e),
	getOwnPropertyDescriptor: (e, t) => Object.getOwnPropertyDescriptor(e, t),
	getPrototypeOf: (e) => Object.getPrototypeOf(e),
	setPrototypeOf: (e, t) => Object.setPrototypeOf(e, t),
	isExtensible: (e) => Object.isExtensible(e),
	preventExtensions: (e) => Object.preventExtensions(e)
};
function ce(e, t, s, r = {}) {
	const { channel: o = "", sender: a = "", reflect: i = ie } = r, c = r.target ?? te(t), l = [];
	let h = null, u = t;
	switch (String(e).toLowerCase()) {
		case "import":
		case n.IMPORT:
			h = import(s?.[0]);
			break;
		case "transfer":
		case n.TRANSFER:
			p(c) && o !== a && l.push(c), h = c;
			break;
		case "get":
		case n.GET: {
			const e = s?.[0], n = i.get?.(c, e) ?? c?.[e];
			h = "function" == typeof n && null != c ? n.bind(c) : n, u = [...t, String(e)];
			break;
		}
		case "set":
		case n.SET: {
			const [e, n] = s, o = f(n, X);
			h = r.target ? i.set?.(c, e, o) ?? (c[e] = o, !0) : i.set?.(c, e, o) ?? ne([...t, String(e)], o);
			break;
		}
		case "apply":
		case "call":
		case n.APPLY:
		case n.CALL:
			if ("function" == typeof c) {
				const e = r.context ?? (r.target ? void 0 : te(t.slice(0, -1))), n = f(s?.[0] ?? s ?? [], X);
				h = i.apply?.(c, e, n) ?? c.apply(e, n), p(h) && "transfer" === t?.at(-1) && o !== a && l.push(h);
			}
			break;
		case "construct":
		case n.CONSTRUCT:
			if ("function" == typeof c) {
				const e = f(s?.[0] ?? s ?? [], X);
				h = i.construct?.(c, e) ?? new c(...e);
			}
			break;
		case "delete":
		case "deleteproperty":
		case "dispose":
		case n.DELETE:
		case n.DELETE_PROPERTY:
		case n.DISPOSE:
			if (r.target) {
				const e = t[t.length - 1];
				h = i.deleteProperty?.(c, e) ?? delete c[e];
			} else h = t?.length > 0 ? se(t) : re(c), h && (u = Z.get(c) ?? []);
			break;
		case "has":
		case n.HAS:
			h = i.has?.(c, s?.[0]) ?? (!!ae(c) && s?.[0] in c);
			break;
		case "ownkeys":
		case n.OWN_KEYS:
			h = i.ownKeys?.(c) ?? (ae(c) ? Object.keys(c) : []);
			break;
		case "getownpropertydescriptor":
		case "getpropertydescriptor":
		case n.GET_OWN_PROPERTY_DESCRIPTOR:
		case n.GET_PROPERTY_DESCRIPTOR:
			h = i.getOwnPropertyDescriptor?.(c, s?.[0] ?? t?.at(-1) ?? "") ?? (ae(c) ? Object.getOwnPropertyDescriptor(c, s?.[0] ?? t?.at(-1) ?? "") : void 0);
			break;
		case "getprototypeof":
		case n.GET_PROTOTYPE_OF:
			h = i.getPrototypeOf?.(c) ?? (ae(c) ? Object.getPrototypeOf(c) : null);
			break;
		case "setprototypeof":
		case n.SET_PROTOTYPE_OF:
			h = i.setPrototypeOf?.(c, s?.[0]) ?? (!!ae(c) && Object.setPrototypeOf(c, s?.[0]));
			break;
		case "isextensible":
		case n.IS_EXTENSIBLE:
			h = i.isExtensible?.(c) ?? (!ae(c) || Object.isExtensible(c));
			break;
		case "preventextensions":
		case n.PREVENT_EXTENSIONS: h = i.preventExtensions?.(c) ?? (!!ae(c) && Object.preventExtensions(c));
	}
	return {
		result: h,
		toTransfer: l,
		path: u
	};
}
async function le(e, t, s, r, o, i, l) {
	const h = await i, d = p(h) && l.includes(h) || u(h);
	let m = o;
	d || "get" === t || t === n.GET || "object" != typeof h && "function" != typeof h || (oe(h) ? (m = [c()], ne(m, h)) : m = Z.get(h) ?? []);
	const _ = te(m), g = "get" === t || t === n.GET ? m?.at(-1) : void 0, y = te(o), b = f(h, (e) => K(e, s, l)) ?? h;
	return {
		response: {
			channel: r,
			sender: s,
			reqId: e,
			action: t,
			type: "response",
			payload: {
				result: d ? b : null,
				type: typeof h,
				channel: r,
				sender: s,
				descriptor: {
					$isDescriptor: !0,
					path: m,
					owner: s,
					channel: s,
					primitive: a(h),
					writable: !0,
					enumerable: !0,
					configurable: !0,
					argumentCount: y instanceof Function ? y.length : -1,
					...ae(_) && null != g ? Object.getOwnPropertyDescriptor(_, g) : {}
				}
			}
		},
		transfer: l
	};
}
var he = class {
	_name;
	_transportType;
	_id = c();
	_state = "disconnected";
	_inbound = new v({ bufferSize: 1e3 });
	_outbound = new v({ bufferSize: 1e3 });
	_stateChanges = new v();
	_connectedPeers = /* @__PURE__ */ new Map();
	_subs = [];
	_stats = {
		messagesSent: 0,
		messagesReceived: 0,
		bytesTransferred: 0,
		latencyMs: 0,
		uptime: 0,
		reconnectCount: 0
	};
	_startTime = 0;
	_pending = /* @__PURE__ */ new Map();
	_buffer = [];
	_opts;
	constructor(e, t = "internal", n = {}) {
		this._name = e, this._transportType = t, this._opts = {
			timeout: 3e4,
			autoReconnect: !0,
			reconnectInterval: 1e3,
			maxReconnectAttempts: 5,
			bufferMessages: !0,
			bufferSize: 1e3,
			metadata: {},
			...n
		}, this._setupSubscriptions();
	}
	subscribe(e, t) {
		return (t ? (n = (e) => e.sender === t, (e) => new C((t) => {
			const s = e.subscribe({
				next: (e) => n(e) && t.next(e),
				error: (e) => t.error(e),
				complete: () => t.complete()
			});
			return () => s.unsubscribe();
		}))(this._inbound) : this._inbound).subscribe("function" == typeof e ? { next: e } : e);
		var n;
	}
	next(e) {
		"connected" === this._state ? (this._outbound.next(e), this._stats.messagesSent++) : this._opts.bufferMessages && this._buffer.length < this._opts.bufferSize && this._buffer.push(e);
	}
	async request(e, t, n = {}) {
		const s = c(), r = Promise.withResolvers();
		this._pending.set(s, r);
		const o = setTimeout(() => {
			this._pending.has(s) && (this._pending.delete(s), r.reject(/* @__PURE__ */ new Error("Request timeout")));
		}, n.timeout ?? this._opts.timeout);
		return this.next({
			id: c(),
			channel: e,
			sender: this._name,
			type: "request",
			reqId: s,
			payload: {
				...t,
				action: n.action,
				path: n.path
			},
			timestamp: Date.now()
		}), r.promise.finally(() => clearTimeout(o));
	}
	respond(e, t) {
		this.next({
			id: c(),
			channel: e.sender,
			sender: this._name,
			type: "response",
			reqId: e.reqId,
			payload: t,
			timestamp: Date.now()
		});
	}
	emit(e, t, n) {
		this.next({
			id: c(),
			channel: e,
			sender: this._name,
			type: "event",
			payload: {
				type: t,
				data: n
			},
			timestamp: Date.now()
		});
	}
	subscribeOutbound(e) {
		return this._outbound.subscribe("function" == typeof e ? { next: e } : e);
	}
	pushInbound(e) {
		if (this._stats.messagesReceived++, "response" === e.type && e.reqId) {
			const t = this._pending.get(e.reqId);
			if (t) return this._pending.delete(e.reqId), void t.resolve(e.payload);
		}
		this._inbound.next(e);
	}
	async connect() {
		"connected" !== this._state && (this._setState("connecting"), this._startTime = Date.now(), this._setState("connected"), this._flushBuffer());
	}
	disconnect() {
		"disconnected" !== this._state && "closed" !== this._state && (this._setState("disconnected"), this._subs.forEach((e) => e.unsubscribe()), this._subs = []);
	}
	close() {
		this.disconnect(), this._setState("closed"), this._inbound.complete(), this._outbound.complete(), this._stateChanges.complete();
	}
	markConnected() {
		this._setState("connected"), this._flushBuffer();
	}
	markDisconnected() {
		this._setState("disconnected");
	}
	_setState(e) {
		this._state !== e && (this._state = e, this._stateChanges.next(e));
	}
	_flushBuffer() {
		for (const e of this._buffer) this._outbound.next(e);
		this._buffer = [];
	}
	_setupSubscriptions() {
		this._subs.push(this._inbound.subscribe({ next: (e) => {
			"signal" === e.type && "connect" === e.payload?.type && this._connectedPeers.set(e.sender, {
				name: e.sender,
				state: "connected",
				isHost: !1
			});
		} }));
	}
	get id() {
		return this._id;
	}
	get name() {
		return this._name;
	}
	get state() {
		return this._state;
	}
	get transportType() {
		return this._transportType;
	}
	get stats() {
		return {
			...this._stats,
			uptime: this._startTime ? Date.now() - this._startTime : 0
		};
	}
	get stateChanges() {
		return this._stateChanges;
	}
	get connectedPeers() {
		return [...this._connectedPeers.keys()];
	}
	get meta() {
		return {
			id: this._id,
			name: this._name,
			state: this._state,
			isHost: !1,
			connectedChannels: new Set(this._connectedPeers.keys())
		};
	}
}, ue = class e {
	_connections = /* @__PURE__ */ new Map();
	static _instance = null;
	static getInstance() {
		return e._instance || (e._instance = new e()), e._instance;
	}
	getOrCreate(e, t = "internal", n = {}) {
		return this._connections.has(e) || this._connections.set(e, new he(e, t, n)), this._connections.get(e);
	}
	get(e) {
		return this._connections.get(e);
	}
	has(e) {
		return this._connections.has(e);
	}
	delete(e) {
		return this._connections.get(e)?.close(), this._connections.delete(e);
	}
	clear() {
		this._connections.forEach((e) => e.close()), this._connections.clear();
	}
	get size() {
		return this._connections.size;
	}
	get names() {
		return [...this._connections.keys()];
	}
};
const de = () => ue.getInstance(), pe = "messages", fe = "mailbox", me = "pending", _e = "exchange", ge = "transactions";
var ye = class {
	_db = null;
	_isOpen = !1;
	_openPromise = null;
	_channelName;
	_messageUpdates = new v();
	_exchangeUpdates = new v();
	constructor(e) {
		this._channelName = e;
	}
	async open() {
		return this._db && this._isOpen ? this._db : (this._openPromise || (this._openPromise = new Promise((e, t) => {
			const n = indexedDB.open("uniform_channels", 1);
			n.onerror = () => {
				this._openPromise = null, t(/* @__PURE__ */ new Error("Failed to open IndexedDB"));
			}, n.onsuccess = () => {
				this._db = n.result, this._isOpen = !0, this._openPromise = null, e(this._db);
			}, n.onupgradeneeded = (e) => {
				const t = e.target.result;
				this._createStores(t);
			};
		})), this._openPromise);
	}
	close() {
		this._db && (this._db.close(), this._db = null, this._isOpen = !1);
	}
	_createStores(e) {
		if (!e.objectStoreNames.contains(pe)) {
			const t = e.createObjectStore(pe, { keyPath: "id" });
			t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("status", "status", { unique: !1 }), t.createIndex("recipient", "recipient", { unique: !1 }), t.createIndex("createdAt", "createdAt", { unique: !1 }), t.createIndex("channel_status", ["channel", "status"], { unique: !1 });
		}
		if (!e.objectStoreNames.contains(fe)) {
			const t = e.createObjectStore(fe, { keyPath: "id" });
			t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("priority", "priority", { unique: !1 }), t.createIndex("expiresAt", "expiresAt", { unique: !1 });
		}
		if (!e.objectStoreNames.contains(me)) {
			const t = e.createObjectStore(me, { keyPath: "id" });
			t.createIndex("channel", "channel", { unique: !1 }), t.createIndex("createdAt", "createdAt", { unique: !1 });
		}
		if (!e.objectStoreNames.contains(_e)) {
			const t = e.createObjectStore(_e, { keyPath: "id" });
			t.createIndex("key", "key", { unique: !0 }), t.createIndex("owner", "owner", { unique: !1 });
		}
		e.objectStoreNames.contains(ge) || e.createObjectStore(ge, { keyPath: "id" }).createIndex("createdAt", "createdAt", { unique: !1 });
	}
	async defer(e, t = {}) {
		const n = await this.open(), s = {
			id: c(),
			channel: e.channel,
			sender: e.sender ?? this._channelName,
			recipient: e.channel,
			type: e.type,
			payload: e.payload,
			status: "pending",
			priority: t.priority ?? 0,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			expiresAt: t.expiresIn ? Date.now() + t.expiresIn : null,
			retryCount: 0,
			maxRetries: t.maxRetries ?? 3,
			metadata: t.metadata
		};
		return new Promise((e, t) => {
			const r = n.transaction([pe, fe], "readwrite"), o = r.objectStore(pe), a = r.objectStore(fe);
			o.add(s), a.add(s), r.oncomplete = () => {
				this._messageUpdates.next(s), e(s.id);
			}, r.onerror = () => t(/* @__PURE__ */ new Error("Failed to defer message"));
		});
	}
	async getDeferredMessages(e, t = {}) {
		const n = await this.open();
		return new Promise((s, r) => {
			const o = n.transaction(pe, "readonly").objectStore(pe), a = t.status ? o.index("channel_status") : o.index("channel"), i = t.status ? IDBKeyRange.only([e, t.status]) : IDBKeyRange.only(e), c = a.getAll(i, t.limit);
			c.onsuccess = () => {
				let e = c.result;
				t.offset && (e = e.slice(t.offset)), s(e);
			}, c.onerror = () => r(/* @__PURE__ */ new Error("Failed to get deferred messages"));
		});
	}
	async processNextPending(e) {
		const t = await this.open();
		return new Promise((n, s) => {
			const r = t.transaction(pe, "readwrite").objectStore(pe).index("channel_status").openCursor(IDBKeyRange.only([e, "pending"]));
			r.onsuccess = () => {
				const e = r.result;
				if (e) {
					const t = e.value;
					t.status = "processing", t.updatedAt = Date.now(), e.update(t), this._messageUpdates.next(t), n(t);
				} else n(null);
			}, r.onerror = () => s(/* @__PURE__ */ new Error("Failed to process pending message"));
		});
	}
	async markDelivered(e) {
		await this._updateMessageStatus(e, "delivered");
	}
	async markFailed(e) {
		const t = await this.open();
		return new Promise((n, s) => {
			const r = t.transaction(pe, "readwrite").objectStore(pe), o = r.get(e);
			o.onsuccess = () => {
				const e = o.result;
				e ? (e.retryCount++, e.updatedAt = Date.now(), e.retryCount < e.maxRetries ? e.status = "pending" : e.status = "failed", r.put(e), this._messageUpdates.next(e), n("pending" === e.status)) : n(!1);
			}, o.onerror = () => s(/* @__PURE__ */ new Error("Failed to mark message as failed"));
		});
	}
	async _updateMessageStatus(e, t) {
		const n = await this.open();
		return new Promise((s, r) => {
			const o = n.transaction(pe, "readwrite").objectStore(pe), a = o.get(e);
			a.onsuccess = () => {
				const e = a.result;
				e && (e.status = t, e.updatedAt = Date.now(), o.put(e), this._messageUpdates.next(e)), s();
			}, a.onerror = () => r(/* @__PURE__ */ new Error("Failed to update message status"));
		});
	}
	async getMailbox(e, t = {}) {
		const n = await this.open();
		return new Promise((s, r) => {
			const o = n.transaction(fe, "readonly").objectStore(fe).index("channel").getAll(IDBKeyRange.only(e), t.limit);
			o.onsuccess = () => {
				let e = o.result;
				"priority" === t.sortBy ? e.sort((e, t) => t.priority - e.priority) : e.sort((e, t) => t.createdAt - e.createdAt), s(e);
			}, o.onerror = () => r(/* @__PURE__ */ new Error("Failed to get mailbox"));
		});
	}
	async getMailboxStats(e) {
		const t = await this.getDeferredMessages(e), n = {
			total: t.length,
			pending: 0,
			processing: 0,
			delivered: 0,
			failed: 0,
			expired: 0
		}, s = Date.now();
		for (const r of t) r.expiresAt && r.expiresAt < s ? n.expired++ : n[r.status]++;
		return n;
	}
	async clearMailbox(e) {
		const t = await this.open();
		return new Promise((n, s) => {
			const r = t.transaction(fe, "readwrite"), o = r.objectStore(fe).index("channel");
			let a = 0;
			const i = o.openCursor(IDBKeyRange.only(e));
			i.onsuccess = () => {
				const e = i.result;
				e && (e.delete(), a++, e.continue());
			}, r.oncomplete = () => n(a), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to clear mailbox"));
		});
	}
	async registerPending(e) {
		const t = await this.open(), n = {
			id: c(),
			channel: this._channelName,
			type: e.type,
			data: e.data,
			metadata: e.metadata,
			createdAt: Date.now(),
			status: "pending"
		};
		return new Promise((e, s) => {
			const r = t.transaction(me, "readwrite");
			r.objectStore(me).add(n), r.oncomplete = () => e(n.id), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to register pending operation"));
		});
	}
	async getPendingOperations() {
		const e = await this.open();
		return new Promise((t, n) => {
			const s = e.transaction(me, "readonly").objectStore(me).index("channel").getAll(IDBKeyRange.only(this._channelName));
			s.onsuccess = () => t(s.result), s.onerror = () => n(/* @__PURE__ */ new Error("Failed to get pending operations"));
		});
	}
	async completePending(e) {
		const t = await this.open();
		return new Promise((n, s) => {
			const r = t.transaction(me, "readwrite");
			r.objectStore(me).delete(e), r.oncomplete = () => n(), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to complete pending operation"));
		});
	}
	async awaitPending(e, t = {}) {
		const n = t.timeout ?? 3e4, s = t.pollInterval ?? 100, r = Date.now();
		for (; Date.now() - r < n;) {
			const t = await this._getPendingById(e);
			if (!t) return null;
			if ("completed" === t.status) return await this.completePending(e), t.result;
			await new Promise((e) => setTimeout(e, s));
		}
		throw new Error(`Pending operation ${e} timed out`);
	}
	async _getPendingById(e) {
		const t = await this.open();
		return new Promise((n, s) => {
			const r = t.transaction(me, "readonly").objectStore(me).get(e);
			r.onsuccess = () => n(r.result ?? null), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to get pending operation"));
		});
	}
	async exchangePut(e, t, n = {}) {
		const s = await this.open(), r = {
			id: c(),
			key: e,
			value: t,
			owner: this._channelName,
			sharedWith: n.sharedWith ?? ["*"],
			version: 1,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
		return new Promise((t, n) => {
			const o = s.transaction(_e, "readwrite"), a = o.objectStore(_e), i = a.index("key").get(e);
			i.onsuccess = () => {
				const e = i.result;
				e && (r.id = e.id, r.version = e.version + 1, r.createdAt = e.createdAt), a.put(r);
			}, o.oncomplete = () => {
				this._exchangeUpdates.next(r), t(r.id);
			}, o.onerror = () => n(/* @__PURE__ */ new Error("Failed to put exchange data"));
		});
	}
	async exchangeGet(e) {
		const t = await this.open();
		return new Promise((n, s) => {
			const r = t.transaction(_e, "readonly").objectStore(_e).index("key").get(e);
			r.onsuccess = () => {
				const e = r.result;
				e && this._canAccessExchange(e) ? n(e.value) : n(null);
			}, r.onerror = () => s(/* @__PURE__ */ new Error("Failed to get exchange data"));
		});
	}
	async exchangeDelete(e) {
		const t = await this.open();
		return new Promise((n, s) => {
			const r = t.transaction(_e, "readwrite"), o = r.objectStore(_e), a = o.index("key").get(e);
			a.onsuccess = () => {
				const e = a.result;
				e && e.owner === this._channelName ? o.delete(e.id) : n(!1);
			}, r.oncomplete = () => n(!0), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to delete exchange data"));
		});
	}
	async exchangeLock(e, t = {}) {
		const n = await this.open(), s = t.timeout ?? 3e4;
		return new Promise((t, r) => {
			const o = n.transaction(_e, "readwrite"), a = o.objectStore(_e), i = a.index("key").get(e);
			i.onsuccess = () => {
				const e = i.result;
				e ? e.lock && e.lock.holder !== this._channelName && e.lock.expiresAt > Date.now() ? t(!1) : (e.lock = {
					holder: this._channelName,
					acquiredAt: Date.now(),
					expiresAt: Date.now() + s
				}, e.updatedAt = Date.now(), a.put(e)) : t(!1);
			}, o.oncomplete = () => t(!0), o.onerror = () => r(/* @__PURE__ */ new Error("Failed to acquire lock"));
		});
	}
	async exchangeUnlock(e) {
		const t = await this.open();
		return new Promise((n, s) => {
			const r = t.transaction(_e, "readwrite"), o = r.objectStore(_e), a = o.index("key").get(e);
			a.onsuccess = () => {
				const e = a.result;
				e && e.lock?.holder === this._channelName && (delete e.lock, e.updatedAt = Date.now(), o.put(e));
			}, r.oncomplete = () => n(), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to release lock"));
		});
	}
	_canAccessExchange(e) {
		return e.owner === this._channelName || !!e.sharedWith.includes("*") || e.sharedWith.includes(this._channelName);
	}
	async beginTransaction() {
		return new be(this);
	}
	async executeTransaction(e) {
		const t = await this.open(), n = new Set(e.map((e) => e.store));
		return new Promise((s, r) => {
			const o = t.transaction(Array.from(n), "readwrite");
			for (const t of e) {
				const e = o.objectStore(t.store);
				switch (t.type) {
					case "put":
						void 0 !== t.value && e.put(t.value);
						break;
					case "delete":
						void 0 !== t.key && e.delete(t.key);
						break;
					case "update": if (void 0 !== t.key) {
						const n = e.get(t.key);
						n.onsuccess = () => {
							n.result && t.value && e.put({
								...n.result,
								...t.value
							});
						};
					}
				}
			}
			o.oncomplete = () => s(), o.onerror = () => r(/* @__PURE__ */ new Error("Transaction failed"));
		});
	}
	onMessageUpdate(e) {
		return this._messageUpdates.subscribe({ next: e });
	}
	onExchangeUpdate(e) {
		return this._exchangeUpdates.subscribe({ next: e });
	}
	async cleanupExpired() {
		const e = await this.open(), t = Date.now();
		return new Promise((n, s) => {
			const r = e.transaction([pe, fe], "readwrite"), o = r.objectStore(pe), a = r.objectStore(fe);
			let i = 0;
			const c = o.openCursor();
			c.onsuccess = () => {
				const e = c.result;
				if (e) {
					const n = e.value;
					n.expiresAt && n.expiresAt < t && (e.delete(), i++), e.continue();
				}
			};
			const l = a.openCursor();
			l.onsuccess = () => {
				const e = l.result;
				if (e) {
					const n = e.value;
					n.expiresAt && n.expiresAt < t && (e.delete(), i++), e.continue();
				}
			}, r.oncomplete = () => n(i), r.onerror = () => s(/* @__PURE__ */ new Error("Failed to cleanup expired"));
		});
	}
}, be = class {
	_storage;
	_operations = [];
	_isCommitted = !1;
	_isRolledBack = !1;
	constructor(e) {
		this._storage = e;
	}
	put(e, t) {
		return this._checkState(), this._operations.push({
			id: c(),
			type: "put",
			store: e,
			value: t,
			timestamp: Date.now()
		}), this;
	}
	delete(e, t) {
		return this._checkState(), this._operations.push({
			id: c(),
			type: "delete",
			store: e,
			key: t,
			timestamp: Date.now()
		}), this;
	}
	update(e, t, n) {
		return this._checkState(), this._operations.push({
			id: c(),
			type: "update",
			store: e,
			key: t,
			value: n,
			timestamp: Date.now()
		}), this;
	}
	async commit() {
		this._checkState(), 0 !== this._operations.length ? (await this._storage.executeTransaction(this._operations), this._isCommitted = !0) : this._isCommitted = !0;
	}
	rollback() {
		this._operations = [], this._isRolledBack = !0;
	}
	get operationCount() {
		return this._operations.length;
	}
	_checkState() {
		if (this._isCommitted) throw new Error("Transaction already committed");
		if (this._isRolledBack) throw new Error("Transaction already rolled back");
	}
};
const we = /* @__PURE__ */ new Map();
const Ce = W(), ve = Ce.length > 0 ? new URL("../transport/Worker.ts", Ce) : "";
var ke = class {
	_channel;
	_context;
	_options;
	_connection;
	_storage;
	constructor(e, t, n = {}) {
		var s, r, o, a;
		this._channel = e, this._context = t, this._options = n, this._connection = (s = e, de().getOrCreate(s, r, o)), this._storage = (a = e, we.has(a) || we.set(a, new ye(a)), we.get(a));
	}
	async request(e, t, n, s = {}) {
		let r = "string" == typeof e ? [e] : e, o = t, a = n;
		return Array.isArray(t) && Se(e) && (s = n, a = t, o = e, r = []), this._context.getHost()?.request(r, o, a, s, this._channel);
	}
	async doImportModule(e, t = {}) {
		return this.request([], n.IMPORT, [e], t);
	}
	async deferMessage(e, t = {}) {
		return this._storage.defer({
			channel: this._channel,
			sender: this._context.hostName,
			type: "request",
			payload: e
		}, t);
	}
	async getPendingMessages() {
		return this._storage.getDeferredMessages(this._channel, { status: "pending" });
	}
	get connection() {
		return this._connection;
	}
	get channelName() {
		return this._channel;
	}
	get context() {
		return this._context;
	}
}, xe = class {
	_channel;
	_context;
	_options;
	_connection;
	_unified;
	get _forResolves() {
		return this._unified.__getPrivate("_pending");
	}
	get _subscriptions() {
		return this._unified.__getPrivate("_subscriptions");
	}
	get _broadcasts() {
		return this._unified.__getPrivate("_transports");
	}
	constructor(e, t, n = {}) {
		this._channel = e, this._context = t, this._options = n, this._connection = de().getOrCreate(e, "internal", n), this._unified = new A({
			name: e,
			autoListen: !1,
			timeout: n?.timeout
		});
	}
	createRemoteChannel(e, t = {}, n) {
		const s = function(e) {
			if (!e) return null;
			if (Te(e)) return e;
			const t = e, n = Ee(t);
			return {
				target: t,
				targetChannel: "unknown",
				transportType: "internal" === n ? "self" : n,
				sender: (e, n) => {
					"undefined" != typeof WebSocket && t instanceof WebSocket ? t.send(JSON.stringify(e)) : t.postMessage?.(e, n?.length ? { transfer: n } : void 0);
				},
				postMessage: (e, n) => {
					t.postMessage?.(e, n);
				},
				addEventListener: t.addEventListener?.bind(t),
				removeEventListener: t.removeEventListener?.bind(t),
				start: t.start?.bind(t),
				close: t.close?.bind(t)
			};
		}(n ?? this._context.$createOrUseExistingRemote(e, t, n ?? null)?.messageChannel?.port1), r = Ee(s?.target ?? s);
		return this._unified.listen(s?.target, { targetChannel: e }), s && (this._broadcasts?.set?.(e, s), "self" === r && "undefined" == typeof postMessage || this._unified.connect(s, { targetChannel: e }), this._context.$registerConnection({
			localChannel: this._channel,
			remoteChannel: e,
			sender: this._channel,
			direction: "outgoing",
			transportType: r
		}), this.notifyChannel(e, {
			contextId: this._context.id,
			contextName: this._context.hostName
		}, "connect")), new ke(e, this._context, t);
	}
	getChannel() {
		return this._channel;
	}
	get connection() {
		return this._connection;
	}
	request(e, t, n, s = {}, r = "worker") {
		let o = "string" == typeof e ? [e] : e, a = n;
		return Array.isArray(t) && Se(e) && (r = s, s = n, a = t, t = e, o = []), this._unified.invoke(r, t, o ?? [], Array.isArray(a) ? a : [a]);
	}
	resolveResponse(e, t) {
		this._forResolves.get(e)?.resolve?.(t);
		const n = this._forResolves.get(e)?.promise;
		return this._forResolves.delete(e), n;
	}
	async handleAndResponse(e, t, n) {}
	notifyChannel(e, t = {}, n = "notify") {
		return this._unified.notify(e, {
			...t,
			from: this._channel,
			to: e
		}, n);
	}
	getConnectedChannels() {
		return this._unified.connectedChannels;
	}
	close() {
		this._subscriptions.forEach((e) => e.unsubscribe()), this._forResolves.clear(), this._broadcasts?.values?.()?.forEach((e) => e.close?.()), this._broadcasts?.clear?.(), this._unified.close();
	}
	get unified() {
		return this._unified;
	}
}, Pe = class {
	_options;
	_id = c();
	_hostName;
	_host = null;
	_endpoints = /* @__PURE__ */ new Map();
	_unifiedByChannel = /* @__PURE__ */ new Map();
	_unifiedConnectionSubs = /* @__PURE__ */ new Map();
	_remoteChannels = /* @__PURE__ */ new Map();
	_deferredChannels = /* @__PURE__ */ new Map();
	_connectionEvents = new v({ bufferSize: 200 });
	_connectionRegistry = new D(() => c(), (e) => this._emitConnectionEvent(e));
	_closed = !1;
	_globalSelf = null;
	constructor(e = {}) {
		this._options = e, this._hostName = e.name ?? `ctx-${this._id.slice(0, 8)}`, !1 !== e.useGlobalSelf && (this._globalSelf = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : null);
	}
	initHost(e) {
		if (this._host && !e) return this._host;
		const t = e ?? this._hostName;
		if (this._hostName = t, this._endpoints.has(t)) return this._host = this._endpoints.get(t).handler, this._host;
		this._host = new xe(t, this, this._options.defaultOptions);
		const n = {
			name: t,
			handler: this._host,
			connection: this._host.connection,
			subscriptions: [],
			ready: Promise.resolve(null),
			unified: this._host.unified
		};
		return this._endpoints.set(t, n), this._registerUnifiedChannel(t, this._host.unified), this._host;
	}
	getHost() {
		return this._host ?? this.initHost();
	}
	get hostName() {
		return this._hostName;
	}
	get id() {
		return this._id;
	}
	get onConnection() {
		return this._connectionEvents;
	}
	subscribeConnections(e) {
		return this._connectionEvents.subscribe(e);
	}
	notifyConnections(e = {}, t = {}) {
		let n = 0;
		for (const s of this._endpoints.values()) {
			const r = s.handler.getConnectedChannels();
			for (const o of r) {
				if (t.localChannel && t.localChannel !== s.name) continue;
				if (t.remoteChannel && t.remoteChannel !== o) continue;
				const r = this.queryConnections({
					localChannel: s.name,
					remoteChannel: o,
					status: "active"
				})[0];
				t.sender && r?.sender !== t.sender || t.transportType && r?.transportType !== t.transportType || t.channel && t.channel !== s.name && t.channel !== o || s.handler.notifyChannel(o, e, "notify") && n++;
			}
		}
		return n;
	}
	queryConnections(e = {}) {
		return this._connectionRegistry.query(e).map((e) => ({
			...e,
			contextId: this._id
		}));
	}
	createChannel(e, t = {}) {
		if (this._endpoints.has(e)) return this._endpoints.get(e);
		const n = new xe(e, this, {
			...this._options.defaultOptions,
			...t
		}), s = {
			name: e,
			handler: n,
			connection: n.connection,
			subscriptions: [],
			ready: Promise.resolve(null),
			unified: n.unified
		};
		return this._endpoints.set(e, s), this._registerUnifiedChannel(e, n.unified), s;
	}
	createChannels(e, t = {}) {
		const n = /* @__PURE__ */ new Map();
		for (const s of e) n.set(s, this.createChannel(s, t));
		return n;
	}
	getChannel(e) {
		return this._endpoints.get(e);
	}
	getOrCreateChannel(e, t = {}) {
		return this._endpoints.get(e) ?? this.createChannel(e, t);
	}
	hasChannel(e) {
		return this._endpoints.has(e);
	}
	getChannelNames() {
		return [...this._endpoints.keys()];
	}
	get size() {
		return this._endpoints.size;
	}
	defer(e, t) {
		this._deferredChannels.set(e, t);
	}
	async initDeferred(e) {
		const t = this._deferredChannels.get(e);
		if (!t) return null;
		const n = await t();
		return this._endpoints.set(e, n), this._deferredChannels.delete(e), n;
	}
	isDeferred(e) {
		return this._deferredChannels.has(e);
	}
	async getChannelAsync(e) {
		return this._endpoints.has(e) ? this._endpoints.get(e) : this._deferredChannels.has(e) ? this.initDeferred(e) : null;
	}
	async addWorker(e, t, n = {}) {
		const s = Re(t);
		if (!s) throw new Error(`Failed to create worker for channel: ${e}`);
		const r = new xe(e, this, {
			...this._options.defaultOptions,
			...n
		}), o = r.createRemoteChannel(e, n, s), a = {
			name: e,
			handler: r,
			connection: r.connection,
			subscriptions: [],
			transportType: "worker",
			ready: Promise.resolve(o),
			unified: r.unified
		};
		return this._endpoints.set(e, a), this._registerUnifiedChannel(e, r.unified), this._remoteChannels.set(e, {
			channel: e,
			context: this,
			remote: Promise.resolve(o),
			transport: s,
			transportType: "worker"
		}), a;
	}
	async addPort(e, t, n = {}) {
		const s = new xe(e, this, {
			...this._options.defaultOptions,
			...n
		});
		t.start?.();
		const r = s.createRemoteChannel(e, n, t), o = {
			name: e,
			handler: s,
			connection: s.connection,
			subscriptions: [],
			transportType: "message-port",
			ready: Promise.resolve(r),
			unified: s.unified
		};
		return this._endpoints.set(e, o), this._registerUnifiedChannel(e, s.unified), this._remoteChannels.set(e, {
			channel: e,
			context: this,
			remote: Promise.resolve(r),
			transport: t,
			transportType: "message-port"
		}), o;
	}
	async addBroadcast(e, t, n = {}) {
		const s = new BroadcastChannel(t ?? e), r = new xe(e, this, {
			...this._options.defaultOptions,
			...n
		}), o = r.createRemoteChannel(e, n, s), a = {
			name: e,
			handler: r,
			connection: r.connection,
			subscriptions: [],
			transportType: "broadcast",
			ready: Promise.resolve(o),
			unified: r.unified
		};
		return this._endpoints.set(e, a), this._registerUnifiedChannel(e, r.unified), this._remoteChannels.set(e, {
			channel: e,
			context: this,
			remote: Promise.resolve(o),
			transport: s,
			transportType: "broadcast"
		}), a;
	}
	addSelfChannel(e, t = {}) {
		const n = new xe(e, this, {
			...this._options.defaultOptions,
			...t
		}), s = this._globalSelf ?? ("undefined" != typeof self ? self : null), r = {
			name: e,
			handler: n,
			connection: n.connection,
			subscriptions: [],
			transportType: "self",
			ready: Promise.resolve(s ? n.createRemoteChannel(e, t, s) : null),
			unified: n.unified
		};
		return this._endpoints.set(e, r), this._registerUnifiedChannel(e, n.unified), r;
	}
	async addTransport(e, t) {
		const n = t.options ?? {};
		switch (t.type) {
			case "worker":
				if (!t.worker) throw new Error("Worker required for worker transport");
				return this.addWorker(e, t.worker, n);
			case "message-port":
				if (!t.port) throw new Error("Port required for message-port transport");
				return this.addPort(e, t.port, n);
			case "broadcast":
				const s = "string" == typeof t.broadcast ? t.broadcast : void 0;
				return this.addBroadcast(e, s, n);
			case "self": return this.addSelfChannel(e, n);
			default: return this.createChannel(e, n);
		}
	}
	createChannelPair(e, t, n = {}) {
		const s = new MessageChannel(), r = new xe(e, this, {
			...this._options.defaultOptions,
			...n
		}), o = new xe(t, this, {
			...this._options.defaultOptions,
			...n
		});
		s.port1.start(), s.port2.start();
		const a = Promise.resolve(r.createRemoteChannel(t, n, s.port1)), i = Promise.resolve(o.createRemoteChannel(e, n, s.port2)), c = {
			name: e,
			handler: r,
			connection: r.connection,
			subscriptions: [],
			transportType: "message-port",
			ready: a,
			unified: r.unified
		}, l = {
			name: t,
			handler: o,
			connection: o.connection,
			subscriptions: [],
			transportType: "message-port",
			ready: i,
			unified: o.unified
		};
		return this._endpoints.set(e, c), this._endpoints.set(t, l), this._registerUnifiedChannel(e, r.unified), this._registerUnifiedChannel(t, o.unified), {
			channel1: c,
			channel2: l,
			messageChannel: s
		};
	}
	get globalSelf() {
		return this._globalSelf;
	}
	async connectRemote(e, t = {}, n) {
		return this.initHost(), this._host.createRemoteChannel(e, t, n);
	}
	async importModuleInChannel(e, t, n = {}, s) {
		return (await this.connectRemote(e, n.channelOptions, s))?.doImportModule?.(t, n.importOptions);
	}
	$createOrUseExistingRemote(e, t = {}, n) {
		if (null == e || n) return null;
		if (this._remoteChannels.has(e)) return this._remoteChannels.get(e);
		const s = new MessageChannel(), r = b(new Promise((n) => {
			const r = Re(ve);
			r?.addEventListener?.("message", (e) => {
				"channelCreated" === e.data.type && (s.port1?.start?.(), n(new ke(e.data.channel, this, t)));
			}), r?.postMessage?.({
				type: "createChannel",
				channel: e,
				sender: this._hostName,
				options: t,
				messagePort: s.port2
			}, { transfer: [s.port2] });
		})), o = {
			channel: e,
			context: this,
			messageChannel: s,
			remote: r
		};
		return this._remoteChannels.set(e, o), o;
	}
	$registerConnection(e) {
		return {
			...this._connectionRegistry.register(e),
			contextId: this._id
		};
	}
	$markNotified(e) {
		const t = this._connectionRegistry.register({
			localChannel: e.localChannel,
			remoteChannel: e.remoteChannel,
			sender: e.sender,
			direction: e.direction,
			transportType: e.transportType
		});
		this._connectionRegistry.markNotified(t, e.payload);
	}
	$observeSignal(e) {
		const t = (e.payload, "incoming");
		this.$markNotified({
			localChannel: e.localChannel,
			remoteChannel: e.remoteChannel,
			sender: e.sender,
			direction: t,
			transportType: e.transportType,
			payload: e.payload
		});
	}
	$forwardUnifiedConnectionEvent(e, t) {
		const n = t.connection.transportType ?? "internal", s = this._connectionRegistry.register({
			localChannel: t.connection.localChannel || e,
			remoteChannel: t.connection.remoteChannel,
			sender: t.connection.sender,
			direction: t.connection.direction,
			transportType: n,
			metadata: t.connection.metadata
		});
		"notified" === t.type ? this._connectionRegistry.markNotified(s, t.payload) : "disconnected" === t.type && this._connectionRegistry.closeByChannel(t.connection.localChannel);
	}
	closeChannel(e) {
		const t = this._endpoints.get(e);
		return !!t && (t.subscriptions.forEach((e) => e.unsubscribe()), t.handler.close(), t.transport?.detach(), this._unifiedConnectionSubs.get(e)?.unsubscribe(), this._unifiedConnectionSubs.delete(e), this._unifiedByChannel.delete(e), this._endpoints.delete(e), e === this._hostName && (this._host = null), this._connectionRegistry.closeByChannel(e), !0);
	}
	close() {
		if (!this._closed) {
			this._closed = !0;
			for (const [e] of this._endpoints) this.closeChannel(e);
			this._remoteChannels.clear(), this._host = null, this._unifiedConnectionSubs.forEach((e) => e.unsubscribe()), this._unifiedConnectionSubs.clear(), this._unifiedByChannel.clear(), this._connectionRegistry.clear(), this._connectionEvents.complete();
		}
	}
	get closed() {
		return this._closed;
	}
	_registerUnifiedChannel(e, t) {
		this._unifiedByChannel.set(e, t), this._unifiedConnectionSubs.get(e)?.unsubscribe();
		const n = t.subscribeConnections((t) => {
			this.$forwardUnifiedConnectionEvent(e, t);
		});
		this._unifiedConnectionSubs.set(e, n);
	}
	_emitConnectionEvent(e) {
		this._connectionEvents.next({
			...e,
			connection: {
				...e.connection,
				contextId: this._id
			}
		});
	}
};
function Se(e) {
	return [...Object.values(n)].includes(e);
}
function Te(e) {
	return !!e && "object" == typeof e && "target" in e && "function" == typeof e.postMessage;
}
function Ee(e) {
	const t = Te(e) ? e.target : e;
	return t ? "chrome-runtime" === t ? "chrome-runtime" : "chrome-tabs" === t ? "chrome-tabs" : "chrome-port" === t ? "chrome-port" : "chrome-external" === t ? "chrome-external" : "undefined" != typeof MessagePort && t instanceof MessagePort ? "message-port" : "undefined" != typeof BroadcastChannel && t instanceof BroadcastChannel ? "broadcast" : "undefined" != typeof Worker && t instanceof Worker ? "worker" : "undefined" != typeof WebSocket && t instanceof WebSocket ? "websocket" : "undefined" != typeof chrome && "object" == typeof t && t && "function" == typeof t.postMessage && t.onMessage?.addListener ? "chrome-port" : "undefined" != typeof self && t === self ? "self" : "internal" : "internal";
}
function Re(e) {
	if (e instanceof Worker) return e;
	if (e instanceof URL) return new Worker(e.href, { type: "module" });
	if ("function" == typeof e) try {
		return new e({ type: "module" });
	} catch {
		return e({ type: "module" });
	}
	return "string" == typeof e ? e.startsWith("/") ? new Worker(q(e.replace(/^\//, "./")), { type: "module" }) : URL.canParse(e) || e.startsWith("./") ? new Worker(q(e), { type: "module" }) : new Worker(URL.createObjectURL(new Blob([e], { type: "application/javascript" })), { type: "module" }) : e instanceof Blob || e instanceof File ? new Worker(URL.createObjectURL(e), { type: "module" }) : e ?? ("undefined" != typeof self ? self : null);
}
const Oe = /* @__PURE__ */ new Map();
var Me = class {
	_context;
	_config;
	_subscriptions = [];
	_incomingConnections = new v({ bufferSize: 100 });
	_channelCreated = new v({ bufferSize: 100 });
	_channelClosed = new v();
	constructor(e = {}) {
		this._config = {
			name: e.name ?? "worker",
			workerName: e.workerName ?? `worker-${c().slice(0, 8)}`,
			autoAcceptChannels: e.autoAcceptChannels ?? !0,
			allowedChannels: e.allowedChannels ?? [],
			maxChannels: e.maxChannels ?? 100,
			autoConnect: e.autoConnect ?? !0,
			useGlobalSelf: !0,
			defaultOptions: e.defaultOptions ?? {},
			isolatedStorage: e.isolatedStorage ?? !1,
			...e
		}, this._context = function(e = {}) {
			const t = new Pe(e);
			return e.name && Oe.set(e.name, t), t;
		}({
			name: this._config.name,
			useGlobalSelf: !0,
			defaultOptions: e.defaultOptions
		}), this._setupMessageListener();
	}
	get onConnection() {
		return this._incomingConnections;
	}
	get onChannelCreated() {
		return this._channelCreated;
	}
	get onChannelClosed() {
		return this._channelClosed;
	}
	subscribeConnections(e) {
		return this._incomingConnections.subscribe(e);
	}
	subscribeChannelCreated(e) {
		return this._channelCreated.subscribe(e);
	}
	acceptConnection(e) {
		if (!this._canAcceptChannel(e.channel)) return null;
		const t = this._context.createChannel(e.channel, e.options);
		return e.port && (e.port.start?.(), t.handler.createRemoteChannel(e.sender, e.options, e.port)), this._channelCreated.next({
			channel: e.channel,
			endpoint: t,
			sender: e.sender,
			timestamp: Date.now()
		}), this._postChannelCreated(e.channel, e.sender, e.id), t;
	}
	createChannel(e, t) {
		return this._context.createChannel(e, t);
	}
	getChannel(e) {
		return this._context.getChannel(e);
	}
	hasChannel(e) {
		return this._context.hasChannel(e);
	}
	getChannelNames() {
		return this._context.getChannelNames();
	}
	queryConnections(e = {}) {
		return this._context.queryConnections(e);
	}
	notifyConnections(e = {}, t = {}) {
		return this._context.notifyConnections(e, t);
	}
	closeChannel(e) {
		const t = this._context.closeChannel(e);
		return t && this._channelClosed.next({
			channel: e,
			timestamp: Date.now()
		}), t;
	}
	get context() {
		return this._context;
	}
	get config() {
		return this._config;
	}
	_setupMessageListener() {
		addEventListener("message", (e) => {
			this._handleIncomingMessage(e);
		});
	}
	_handleIncomingMessage(e) {
		const t = e.data;
		if (t && "object" == typeof t) switch (t.type) {
			case "createChannel":
				this._handleCreateChannel(t);
				break;
			case "connectChannel":
				this._handleConnectChannel(t);
				break;
			case "addPort":
				this._handleAddPort(t);
				break;
			case "listChannels":
				this._handleListChannels(t);
				break;
			case "closeChannel":
				this._handleCloseChannel(t);
				break;
			case "ping":
				postMessage({
					type: "pong",
					id: t.id,
					timestamp: Date.now()
				});
				break;
			default: t.channel && this._context.hasChannel(t.channel) && (this._context.getChannel(t.channel)?.handler)?.handleAndResponse?.(t.payload, t.reqId);
		}
	}
	_handleCreateChannel(e) {
		const t = {
			id: e.reqId ?? c(),
			channel: e.channel,
			sender: e.sender ?? "unknown",
			type: "channel",
			port: e.messagePort,
			timestamp: Date.now(),
			options: e.options
		};
		this._incomingConnections.next(t), this._config.autoAcceptChannels && this.acceptConnection(t);
	}
	_handleConnectChannel(e) {
		const t = {
			id: e.reqId ?? c(),
			channel: e.channel,
			sender: e.sender ?? "unknown",
			type: e.portType ?? "channel",
			port: e.port,
			timestamp: Date.now(),
			options: e.options
		};
		if (this._incomingConnections.next(t), this._config.autoAcceptChannels && this._canAcceptChannel(e.channel)) {
			const t = this._context.getOrCreateChannel(e.channel, e.options);
			e.port && (e.port.start?.(), t.handler.createRemoteChannel(e.sender, e.options, e.port)), postMessage({
				type: "channelConnected",
				channel: e.channel,
				reqId: e.reqId
			});
		}
	}
	_handleAddPort(e) {
		if (!e.port || !e.channel) return;
		const t = {
			id: e.reqId ?? c(),
			channel: e.channel,
			sender: e.sender ?? "unknown",
			type: "port",
			port: e.port,
			timestamp: Date.now(),
			options: e.options
		};
		this._incomingConnections.next(t), this._config.autoAcceptChannels && this.acceptConnection(t);
	}
	_handleListChannels(e) {
		postMessage({
			type: "channelList",
			channels: this.getChannelNames(),
			reqId: e.reqId
		});
	}
	_handleCloseChannel(e) {
		e.channel && (this.closeChannel(e.channel), postMessage({
			type: "channelClosed",
			channel: e.channel,
			reqId: e.reqId
		}));
	}
	_canAcceptChannel(e) {
		return !(this._context.size >= this._config.maxChannels) && (!(this._config.allowedChannels.length > 0) || this._config.allowedChannels.includes(e));
	}
	_postChannelCreated(e, t, n) {
		postMessage({
			type: "channelCreated",
			channel: e,
			sender: t,
			reqId: n,
			timestamp: Date.now()
		});
	}
	close() {
		this._subscriptions.forEach((e) => e.unsubscribe()), this._subscriptions = [], this._incomingConnections.complete(), this._channelCreated.complete(), this._channelClosed.complete(), this._context.close();
	}
};
let Ie = null;
De = { name: "worker" }, Ie || (Ie = new Me(De));
var De;
const Ae = (e, t = "worker") => {
	const n = ((e = "$host$") => {
		if (B?.instance && "$host$" === e) return B.instance;
		if (F.has(e)) return F.get(e) ?? null;
		const t = new z(e);
		return "$host$" === e && (B.name = e, B.instance = t), F.set(e, t), t;
	})(t ?? "worker");
	return Object.keys(e).forEach((t) => {
		e[t];
	}), n;
};
var je = t({
	getDirHandle: () => Be,
	getFileSystemRoot: () => We,
	handlers: () => Fe,
	normalizePath: () => qe
});
const Ne = /* @__PURE__ */ new Map(), Le = /* @__PURE__ */ new Map(), We = async (e = "") => e && Ne.has(e) ? Ne.get(e) : await navigator.storage.getDirectory(), qe = (e) => e?.trim?.()?.replace(/\/+/g, "/") || "/", Be = async (e, t, n) => {
	const s = qe(t).split("/").filter((e) => e);
	let r = e;
	for (const o of s) r = await r.getDirectoryHandle(o, { create: n });
	return r;
}, Fe = {
	mount: async ({ id: e, handle: t }) => (Ne.set(e, t), !0),
	unmount: async ({ id: e }) => (Ne.delete(e), !0),
	readDirectory: async ({ rootId: e, path: t, create: n }) => {
		try {
			const s = await We(e), r = await Be(s, t, n), o = [];
			for await (const [e, t] of r.entries()) o.push([e, t]);
			return o;
		} catch (s) {
			return console.warn("Worker readDirectory error:", s), [];
		}
	},
	readFile: async ({ rootId: e, path: t, type: n }) => {
		try {
			const s = await We(e), r = qe(t).split("/").filter((e) => e), o = r.pop(), a = r.join("/"), i = await (await (await Be(s, a, !1)).getFileHandle(o, { create: !1 })).getFile();
			return "text" === n ? await i.text() : "arrayBuffer" === n ? await i.arrayBuffer() : i;
		} catch (s) {
			return console.warn("Worker readFile error:", s), null;
		}
	},
	writeFile: async ({ rootId: e, path: t, data: n }) => {
		try {
			const s = await We(e), r = qe(t).split("/").filter((e) => e), o = r.pop(), a = r.join("/"), i = await (await (await Be(s, a, !0)).getFileHandle(o, { create: !0 })).createWritable();
			return await i.write(n), await i.close(), !0;
		} catch (s) {
			return console.warn("Worker writeFile error:", s), !1;
		}
	},
	remove: async ({ rootId: e, path: t, recursive: n }) => {
		try {
			const s = await We(e), r = qe(t).split("/").filter((e) => e), o = r.pop(), a = r.join("/");
			return await (await Be(s, a, !1)).removeEntry(o, { recursive: n }), !0;
		} catch (s) {
			return !1;
		}
	},
	observe: async ({ rootId: e, path: t, id: n }) => {
		try {
			if (Le.has(n)) return !0;
			const s = await We(e), r = await Be(s, t, !1);
			if ("undefined" != typeof FileSystemObserver) {
				const e = new FileSystemObserver((e) => {
					const t = e.map((e) => {
						const t = e.changedHandle?.name || e.relativePathComponents?.at(-1);
						return {
							type: e.type,
							name: t,
							kind: e.changedHandle?.kind || (t?.includes(".") ? "file" : "directory"),
							handle: e.changedHandle,
							path: e.relativePathComponents.join("/")
						};
					});
					self.postMessage({
						type: "observation",
						id: n,
						changes: t
					});
				});
				return e.observe(r), Le.set(n, e), !0;
			}
			return !1;
		} catch (s) {
			return !1;
		}
	},
	unobserve: async ({ id: e }) => {
		const t = Le.get(e);
		return t && (t.disconnect(), Le.delete(e)), !0;
	},
	copy: async ({ from: e, to: t }) => {
		try {
			const n = async (e, t) => {
				if ("directory" === e.kind) for await (const [s, r] of e.entries()) if ("directory" === r.kind) {
					const e = await t.getDirectoryHandle(s, { create: !0 });
					await n(r, e);
				} else {
					const e = await r.getFile(), n = await (await t.getFileHandle(s, { create: !0 })).createWritable();
					await n.write(e), await n.close();
				}
				else {
					const n = await e.getFile(), s = await t.createWritable();
					await s.write(n), await s.close();
				}
			};
			return await n(e, t), !0;
		} catch (n) {
			return console.warn("Worker copy error:", n), !1;
		}
	}
};
let Ue = null;
try {
	"undefined" != typeof BroadcastChannel && (Ue = new BroadcastChannel("opfs-sw-bridge-v1"), Ue.onmessage = async (e) => {
		const t = e?.data || {};
		if (!t || "object" != typeof t) return;
		if ("opfs-sw-request" !== t?.type) return;
		const n = String(t?.requestId || ""), s = String(t?.action || ""), r = t?.payload;
		if (!n || !s) return;
		const o = Fe[s];
		if (o) try {
			const e = await o(r);
			Ue?.postMessage?.({
				type: "opfs-sw-response",
				requestId: n,
				ok: !0,
				result: e
			});
		} catch (a) {
			Ue?.postMessage?.({
				type: "opfs-sw-response",
				requestId: n,
				ok: !1,
				error: a?.message || String(a)
			});
		}
		else Ue?.postMessage?.({
			type: "opfs-sw-response",
			requestId: n,
			ok: !1,
			error: `Unknown operation type: ${s}`
		});
	});
} catch {
	Ue = null;
}
self.addEventListener("message", async (e) => {
	if (!e.data || "object" != typeof e.data) return;
	const { id: t, type: n, payload: s } = e.data;
	if (Fe[n]) try {
		const e = await Fe[n](s);
		self.postMessage({
			id: t,
			result: e
		});
	} catch (r) {
		self.postMessage({
			id: t,
			error: r?.message || String(r)
		});
	}
	else t && self.postMessage({
		id: t,
		error: `Unknown operation type: ${n}`
	});
}), Fe && Ae(Fe);
const $e = async (e) => {
	const t = Fe[e.type];
	if (!t) throw new Error(`Unknown message type: ${e.type}`);
	return await t(e.payload);
};
globalThis.processMessage = async (e) => {
	try {
		if ("batch" === e.type) {
			const t = [];
			for (const n of e.payload) {
				const e = await $e(n);
				t.push(e);
			}
			return t;
		}
		return await $e(e);
	} catch (t) {
		throw console.error("[OPFS Worker] Message processing error:", t), t;
	}
};
(async () => {
	try {
		const e = (await Promise.resolve().then(() => je)).handlers;
		e && Ae(e), console.log("[OPFS Worker] Initialized with handlers:", Object.keys(e || {}));
	} catch (e) {
		console.error("[OPFS Worker] Failed to initialize:", e);
	}
})();
