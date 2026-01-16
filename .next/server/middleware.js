// runtime can't be in strict mode because a global variable is assign and maybe created.
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[826],{

/***/ 67:
/***/ ((module) => {

"use strict";
module.exports = require("node:async_hooks");

/***/ }),

/***/ 195:
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ 738:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ nHandler)
});

// NAMESPACE OBJECT: ./middleware.ts
var middleware_namespaceObject_0 = {};
__webpack_require__.r(middleware_namespaceObject_0);
__webpack_require__.d(middleware_namespaceObject_0, {
  config: () => (config),
  "default": () => (middlewareWrapperTemplate),
  middleware: () => (middleware)
});

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/globals.js
async function registerInstrumentation() {
    if ("_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && _ENTRIES.middleware_instrumentation.register) {
        try {
            await _ENTRIES.middleware_instrumentation.register();
        } catch (err) {
            err.message = `An error occurred while loading instrumentation hook: ${err.message}`;
            throw err;
        }
    }
}
let registerInstrumentationPromise = null;
function ensureInstrumentationRegistered() {
    if (!registerInstrumentationPromise) {
        registerInstrumentationPromise = registerInstrumentation();
    }
    return registerInstrumentationPromise;
}
function getUnsupportedModuleErrorMessage(module) {
    // warning: if you change these messages, you must adjust how react-dev-overlay's middleware detects modules not found
    return `The edge runtime does not support Node.js '${module}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
}
function __import_unsupported(moduleName) {
    const proxy = new Proxy(function() {}, {
        get (_obj, prop) {
            if (prop === "then") {
                return {};
            }
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        },
        construct () {
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        },
        apply (_target, _this, args) {
            if (typeof args[0] === "function") {
                return args[0](proxy);
            }
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        }
    });
    return new Proxy({}, {
        get: ()=>proxy
    });
}
function enhanceGlobals() {
    // The condition is true when the "process" module is provided
    if (process !== __webpack_require__.g.process) {
        // prefer local process but global.process has correct "env"
        process.env = __webpack_require__.g.process.env;
        __webpack_require__.g.process = process;
    }
    // to allow building code that import but does not use node.js modules,
    // webpack will expect this function to exist in global scope
    Object.defineProperty(globalThis, "__import_unsupported", {
        value: __import_unsupported,
        enumerable: false,
        configurable: false
    });
    // Eagerly fire instrumentation hook to make the startup faster.
    void ensureInstrumentationRegistered();
}
enhanceGlobals(); //# sourceMappingURL=globals.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/error.js
class PageSignatureError extends Error {
    constructor({ page }){
        super(`The middleware "${page}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
    }
}
class RemovedPageError extends Error {
    constructor(){
        super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
    }
}
class RemovedUAError extends Error {
    constructor(){
        super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
    }
} //# sourceMappingURL=error.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/utils.js
/**
 * Converts a Node.js IncomingHttpHeaders object to a Headers object. Any
 * headers with multiple values will be joined with a comma and space. Any
 * headers that have an undefined value will be ignored and others will be
 * coerced to strings.
 *
 * @param nodeHeaders the headers object to convert
 * @returns the converted headers object
 */ function fromNodeOutgoingHttpHeaders(nodeHeaders) {
    const headers = new Headers();
    for (let [key, value] of Object.entries(nodeHeaders)){
        const values = Array.isArray(value) ? value : [
            value
        ];
        for (let v of values){
            if (typeof v === "undefined") continue;
            if (typeof v === "number") {
                v = v.toString();
            }
            headers.append(key, v);
        }
    }
    return headers;
}
/*
  Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
  that are within a single set-cookie field-value, such as in the Expires portion.
  This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
  Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
  React Native's fetch does this for *every* header, including set-cookie.
  
  Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
  Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
*/ function splitCookiesString(cookiesString) {
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
                // ',' is a cookie separator if we have later first '=', not ';' or ','
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                // currently special character
                if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                    // we found cookies separator
                    cookiesSeparatorFound = true;
                    // pos is inside the next cookie, so back up and return it.
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    // in param ',' or param separator ';',
                    // we continue from that comma
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
/**
 * Converts a Headers object to a Node.js OutgoingHttpHeaders object. This is
 * required to support the set-cookie header, which may have multiple values.
 *
 * @param headers the headers object to convert
 * @returns the converted headers object
 */ function toNodeOutgoingHttpHeaders(headers) {
    const nodeHeaders = {};
    const cookies = [];
    if (headers) {
        for (const [key, value] of headers.entries()){
            if (key.toLowerCase() === "set-cookie") {
                // We may have gotten a comma joined string of cookies, or multiple
                // set-cookie headers. We need to merge them into one header array
                // to represent all the cookies.
                cookies.push(...splitCookiesString(value));
                nodeHeaders[key] = cookies.length === 1 ? cookies[0] : cookies;
            } else {
                nodeHeaders[key] = value;
            }
        }
    }
    return nodeHeaders;
}
/**
 * Validate the correctness of a user-provided URL.
 */ function validateURL(url) {
    try {
        return String(new URL(String(url)));
    } catch (error) {
        throw new Error(`URL is malformed "${String(url)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, {
            cause: error
        });
    }
} //# sourceMappingURL=utils.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/fetch-event.js

const responseSymbol = Symbol("response");
const passThroughSymbol = Symbol("passThrough");
const waitUntilSymbol = Symbol("waitUntil");
class FetchEvent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(_request){
        this[waitUntilSymbol] = [];
        this[passThroughSymbol] = false;
    }
    respondWith(response) {
        if (!this[responseSymbol]) {
            this[responseSymbol] = Promise.resolve(response);
        }
    }
    passThroughOnException() {
        this[passThroughSymbol] = true;
    }
    waitUntil(promise) {
        this[waitUntilSymbol].push(promise);
    }
}
class NextFetchEvent extends FetchEvent {
    constructor(params){
        super(params.request);
        this.sourcePage = params.page;
    }
    /**
   * @deprecated The `request` is now the first parameter and the API is now async.
   *
   * Read more: https://nextjs.org/docs/messages/middleware-new-signature
   */ get request() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
    /**
   * @deprecated Using `respondWith` is no longer needed.
   *
   * Read more: https://nextjs.org/docs/messages/middleware-new-signature
   */ respondWith() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
} //# sourceMappingURL=fetch-event.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/i18n/detect-domain-locale.js
function detectDomainLocale(domainItems, hostname, detectedLocale) {
    if (!domainItems) return;
    if (detectedLocale) {
        detectedLocale = detectedLocale.toLowerCase();
    }
    for (const item of domainItems){
        var _item_domain, _item_locales;
        // remove port if present
        const domainHostname = (_item_domain = item.domain) == null ? void 0 : _item_domain.split(":", 1)[0].toLowerCase();
        if (hostname === domainHostname || detectedLocale === item.defaultLocale.toLowerCase() || ((_item_locales = item.locales) == null ? void 0 : _item_locales.some((locale)=>locale.toLowerCase() === detectedLocale))) {
            return item;
        }
    }
} //# sourceMappingURL=detect-domain-locale.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/remove-trailing-slash.js
/**
 * Removes the trailing slash for a given route or page path. Preserves the
 * root page. Examples:
 *   - `/foo/bar/` -> `/foo/bar`
 *   - `/foo/bar` -> `/foo/bar`
 *   - `/` -> `/`
 */ function removeTrailingSlash(route) {
    return route.replace(/\/$/, "") || "/";
} //# sourceMappingURL=remove-trailing-slash.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/parse-path.js
/**
 * Given a path this function will find the pathname, query and hash and return
 * them. This is useful to parse full paths on the client side.
 * @param path A path to parse e.g. /foo/bar?id=1#hash
 */ function parsePath(path) {
    const hashIndex = path.indexOf("#");
    const queryIndex = path.indexOf("?");
    const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
    if (hasQuery || hashIndex > -1) {
        return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined) : "",
            hash: hashIndex > -1 ? path.slice(hashIndex) : ""
        };
    }
    return {
        pathname: path,
        query: "",
        hash: ""
    };
} //# sourceMappingURL=parse-path.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/add-path-prefix.js

/**
 * Adds the provided prefix to the given path. It first ensures that the path
 * is indeed starting with a slash.
 */ function addPathPrefix(path, prefix) {
    if (!path.startsWith("/") || !prefix) {
        return path;
    }
    const { pathname, query, hash } = parsePath(path);
    return "" + prefix + pathname + query + hash;
} //# sourceMappingURL=add-path-prefix.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/add-path-suffix.js

/**
 * Similarly to `addPathPrefix`, this function adds a suffix at the end on the
 * provided path. It also works only for paths ensuring the argument starts
 * with a slash.
 */ function addPathSuffix(path, suffix) {
    if (!path.startsWith("/") || !suffix) {
        return path;
    }
    const { pathname, query, hash } = parsePath(path);
    return "" + pathname + suffix + query + hash;
} //# sourceMappingURL=add-path-suffix.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/path-has-prefix.js

/**
 * Checks if a given path starts with a given prefix. It ensures it matches
 * exactly without containing extra chars. e.g. prefix /docs should replace
 * for /docs, /docs/, /docs/a but not /docsss
 * @param path The path to check.
 * @param prefix The prefix to check against.
 */ function pathHasPrefix(path, prefix) {
    if (typeof path !== "string") {
        return false;
    }
    const { pathname } = parsePath(path);
    return pathname === prefix || pathname.startsWith(prefix + "/");
} //# sourceMappingURL=path-has-prefix.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/add-locale.js


/**
 * For a given path and a locale, if the locale is given, it will prefix the
 * locale. The path shouldn't be an API path. If a default locale is given the
 * prefix will be omitted if the locale is already the default locale.
 */ function addLocale(path, locale, defaultLocale, ignorePrefix) {
    // If no locale was given or the locale is the default locale, we don't need
    // to prefix the path.
    if (!locale || locale === defaultLocale) return path;
    const lower = path.toLowerCase();
    // If the path is an API path or the path already has the locale prefix, we
    // don't need to prefix the path.
    if (!ignorePrefix) {
        if (pathHasPrefix(lower, "/api")) return path;
        if (pathHasPrefix(lower, "/" + locale.toLowerCase())) return path;
    }
    // Add the locale prefix to the path.
    return addPathPrefix(path, "/" + locale);
} //# sourceMappingURL=add-locale.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/format-next-pathname-info.js




function formatNextPathnameInfo(info) {
    let pathname = addLocale(info.pathname, info.locale, info.buildId ? undefined : info.defaultLocale, info.ignorePrefix);
    if (info.buildId || !info.trailingSlash) {
        pathname = removeTrailingSlash(pathname);
    }
    if (info.buildId) {
        pathname = addPathSuffix(addPathPrefix(pathname, "/_next/data/" + info.buildId), info.pathname === "/" ? "index.json" : ".json");
    }
    pathname = addPathPrefix(pathname, info.basePath);
    return !info.buildId && info.trailingSlash ? !pathname.endsWith("/") ? addPathSuffix(pathname, "/") : pathname : removeTrailingSlash(pathname);
} //# sourceMappingURL=format-next-pathname-info.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/get-hostname.js
/**
 * Takes an object with a hostname property (like a parsed URL) and some
 * headers that may contain Host and returns the preferred hostname.
 * @param parsed An object containing a hostname property.
 * @param headers A dictionary with headers containing a `host`.
 */ function getHostname(parsed, headers) {
    // Get the hostname from the headers if it exists, otherwise use the parsed
    // hostname.
    let hostname;
    if ((headers == null ? void 0 : headers.host) && !Array.isArray(headers.host)) {
        hostname = headers.host.toString().split(":", 1)[0];
    } else if (parsed.hostname) {
        hostname = parsed.hostname;
    } else return;
    return hostname.toLowerCase();
} //# sourceMappingURL=get-hostname.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/i18n/normalize-locale-path.js
/**
 * For a pathname that may include a locale from a list of locales, it
 * removes the locale from the pathname returning it alongside with the
 * detected locale.
 *
 * @param pathname A pathname that may include a locale.
 * @param locales A list of locales.
 * @returns The detected locale and pathname without locale
 */ function normalizeLocalePath(pathname, locales) {
    let detectedLocale;
    // first item will be empty string from splitting at first char
    const pathnameParts = pathname.split("/");
    (locales || []).some((locale)=>{
        if (pathnameParts[1] && pathnameParts[1].toLowerCase() === locale.toLowerCase()) {
            detectedLocale = locale;
            pathnameParts.splice(1, 1);
            pathname = pathnameParts.join("/") || "/";
            return true;
        }
        return false;
    });
    return {
        pathname,
        detectedLocale
    };
} //# sourceMappingURL=normalize-locale-path.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/remove-path-prefix.js

/**
 * Given a path and a prefix it will remove the prefix when it exists in the
 * given path. It ensures it matches exactly without containing extra chars
 * and if the prefix is not there it will be noop.
 *
 * @param path The path to remove the prefix from.
 * @param prefix The prefix to be removed.
 */ function removePathPrefix(path, prefix) {
    // If the path doesn't start with the prefix we can return it as is. This
    // protects us from situations where the prefix is a substring of the path
    // prefix such as:
    //
    // For prefix: /blog
    //
    //   /blog -> true
    //   /blog/ -> true
    //   /blog/1 -> true
    //   /blogging -> false
    //   /blogging/ -> false
    //   /blogging/1 -> false
    if (!pathHasPrefix(path, prefix)) {
        return path;
    }
    // Remove the prefix from the path via slicing.
    const withoutPrefix = path.slice(prefix.length);
    // If the path without the prefix starts with a `/` we can return it as is.
    if (withoutPrefix.startsWith("/")) {
        return withoutPrefix;
    }
    // If the path without the prefix doesn't start with a `/` we need to add it
    // back to the path to make sure it's a valid path.
    return "/" + withoutPrefix;
} //# sourceMappingURL=remove-path-prefix.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/get-next-pathname-info.js



function getNextPathnameInfo(pathname, options) {
    var _options_nextConfig;
    const { basePath, i18n, trailingSlash } = (_options_nextConfig = options.nextConfig) != null ? _options_nextConfig : {};
    const info = {
        pathname,
        trailingSlash: pathname !== "/" ? pathname.endsWith("/") : trailingSlash
    };
    if (basePath && pathHasPrefix(info.pathname, basePath)) {
        info.pathname = removePathPrefix(info.pathname, basePath);
        info.basePath = basePath;
    }
    let pathnameNoDataPrefix = info.pathname;
    if (info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
        const paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
        const buildId = paths[0];
        info.buildId = buildId;
        pathnameNoDataPrefix = paths[1] !== "index" ? "/" + paths.slice(1).join("/") : "/";
        // update pathname with normalized if enabled although
        // we use normalized to populate locale info still
        if (options.parseData === true) {
            info.pathname = pathnameNoDataPrefix;
        }
    }
    // If provided, use the locale route normalizer to detect the locale instead
    // of the function below.
    if (i18n) {
        let result = options.i18nProvider ? options.i18nProvider.analyze(info.pathname) : normalizeLocalePath(info.pathname, i18n.locales);
        info.locale = result.detectedLocale;
        var _result_pathname;
        info.pathname = (_result_pathname = result.pathname) != null ? _result_pathname : info.pathname;
        if (!result.detectedLocale && info.buildId) {
            result = options.i18nProvider ? options.i18nProvider.analyze(pathnameNoDataPrefix) : normalizeLocalePath(pathnameNoDataPrefix, i18n.locales);
            if (result.detectedLocale) {
                info.locale = result.detectedLocale;
            }
        }
    }
    return info;
} //# sourceMappingURL=get-next-pathname-info.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/next-url.js




const REGEX_LOCALHOST_HOSTNAME = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
function parseURL(url, base) {
    return new URL(String(url).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"), base && String(base).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"));
}
const Internal = Symbol("NextURLInternal");
class NextURL {
    constructor(input, baseOrOpts, opts){
        let base;
        let options;
        if (typeof baseOrOpts === "object" && "pathname" in baseOrOpts || typeof baseOrOpts === "string") {
            base = baseOrOpts;
            options = opts || {};
        } else {
            options = opts || baseOrOpts || {};
        }
        this[Internal] = {
            url: parseURL(input, base ?? options.base),
            options: options,
            basePath: ""
        };
        this.analyze();
    }
    analyze() {
        var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig, _this_Internal_domainLocale, _this_Internal_options_nextConfig_i18n1, _this_Internal_options_nextConfig1;
        const info = getNextPathnameInfo(this[Internal].url.pathname, {
            nextConfig: this[Internal].options.nextConfig,
            parseData: !undefined,
            i18nProvider: this[Internal].options.i18nProvider
        });
        const hostname = getHostname(this[Internal].url, this[Internal].options.headers);
        this[Internal].domainLocale = this[Internal].options.i18nProvider ? this[Internal].options.i18nProvider.detectDomainLocale(hostname) : detectDomainLocale((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.domains, hostname);
        const defaultLocale = ((_this_Internal_domainLocale = this[Internal].domainLocale) == null ? void 0 : _this_Internal_domainLocale.defaultLocale) || ((_this_Internal_options_nextConfig1 = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n1 = _this_Internal_options_nextConfig1.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n1.defaultLocale);
        this[Internal].url.pathname = info.pathname;
        this[Internal].defaultLocale = defaultLocale;
        this[Internal].basePath = info.basePath ?? "";
        this[Internal].buildId = info.buildId;
        this[Internal].locale = info.locale ?? defaultLocale;
        this[Internal].trailingSlash = info.trailingSlash;
    }
    formatPathname() {
        return formatNextPathnameInfo({
            basePath: this[Internal].basePath,
            buildId: this[Internal].buildId,
            defaultLocale: !this[Internal].options.forceLocale ? this[Internal].defaultLocale : undefined,
            locale: this[Internal].locale,
            pathname: this[Internal].url.pathname,
            trailingSlash: this[Internal].trailingSlash
        });
    }
    formatSearch() {
        return this[Internal].url.search;
    }
    get buildId() {
        return this[Internal].buildId;
    }
    set buildId(buildId) {
        this[Internal].buildId = buildId;
    }
    get locale() {
        return this[Internal].locale ?? "";
    }
    set locale(locale) {
        var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig;
        if (!this[Internal].locale || !((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.locales.includes(locale))) {
            throw new TypeError(`The NextURL configuration includes no locale "${locale}"`);
        }
        this[Internal].locale = locale;
    }
    get defaultLocale() {
        return this[Internal].defaultLocale;
    }
    get domainLocale() {
        return this[Internal].domainLocale;
    }
    get searchParams() {
        return this[Internal].url.searchParams;
    }
    get host() {
        return this[Internal].url.host;
    }
    set host(value) {
        this[Internal].url.host = value;
    }
    get hostname() {
        return this[Internal].url.hostname;
    }
    set hostname(value) {
        this[Internal].url.hostname = value;
    }
    get port() {
        return this[Internal].url.port;
    }
    set port(value) {
        this[Internal].url.port = value;
    }
    get protocol() {
        return this[Internal].url.protocol;
    }
    set protocol(value) {
        this[Internal].url.protocol = value;
    }
    get href() {
        const pathname = this.formatPathname();
        const search = this.formatSearch();
        return `${this.protocol}//${this.host}${pathname}${search}${this.hash}`;
    }
    set href(url) {
        this[Internal].url = parseURL(url);
        this.analyze();
    }
    get origin() {
        return this[Internal].url.origin;
    }
    get pathname() {
        return this[Internal].url.pathname;
    }
    set pathname(value) {
        this[Internal].url.pathname = value;
    }
    get hash() {
        return this[Internal].url.hash;
    }
    set hash(value) {
        this[Internal].url.hash = value;
    }
    get search() {
        return this[Internal].url.search;
    }
    set search(value) {
        this[Internal].url.search = value;
    }
    get password() {
        return this[Internal].url.password;
    }
    set password(value) {
        this[Internal].url.password = value;
    }
    get username() {
        return this[Internal].url.username;
    }
    set username(value) {
        this[Internal].url.username = value;
    }
    get basePath() {
        return this[Internal].basePath;
    }
    set basePath(value) {
        this[Internal].basePath = value.startsWith("/") ? value : `/${value}`;
    }
    toString() {
        return this.href;
    }
    toJSON() {
        return this.href;
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            href: this.href,
            origin: this.origin,
            protocol: this.protocol,
            username: this.username,
            password: this.password,
            host: this.host,
            hostname: this.hostname,
            port: this.port,
            pathname: this.pathname,
            search: this.search,
            searchParams: this.searchParams,
            hash: this.hash
        };
    }
    clone() {
        return new NextURL(String(this), this[Internal].options);
    }
} //# sourceMappingURL=next-url.js.map

// EXTERNAL MODULE: ./node_modules/next/dist/compiled/@edge-runtime/cookies/index.js
var _edge_runtime_cookies = __webpack_require__(298);
;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/cookies.js
 //# sourceMappingURL=cookies.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/request.js




const INTERNALS = Symbol("internal request");
class NextRequest extends Request {
    constructor(input, init = {}){
        const url = typeof input !== "string" && "url" in input ? input.url : String(input);
        validateURL(url);
        if (input instanceof Request) super(input, init);
        else super(url, init);
        const nextUrl = new NextURL(url, {
            headers: toNodeOutgoingHttpHeaders(this.headers),
            nextConfig: init.nextConfig
        });
        this[INTERNALS] = {
            cookies: new _edge_runtime_cookies.RequestCookies(this.headers),
            geo: init.geo || {},
            ip: init.ip,
            nextUrl,
            url:  false ? 0 : nextUrl.toString()
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            geo: this.geo,
            ip: this.ip,
            nextUrl: this.nextUrl,
            url: this.url,
            // rest of props come from Request
            bodyUsed: this.bodyUsed,
            cache: this.cache,
            credentials: this.credentials,
            destination: this.destination,
            headers: Object.fromEntries(this.headers),
            integrity: this.integrity,
            keepalive: this.keepalive,
            method: this.method,
            mode: this.mode,
            redirect: this.redirect,
            referrer: this.referrer,
            referrerPolicy: this.referrerPolicy,
            signal: this.signal
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    get geo() {
        return this[INTERNALS].geo;
    }
    get ip() {
        return this[INTERNALS].ip;
    }
    get nextUrl() {
        return this[INTERNALS].nextUrl;
    }
    /**
   * @deprecated
   * `page` has been deprecated in favour of `URLPattern`.
   * Read more: https://nextjs.org/docs/messages/middleware-request-page
   */ get page() {
        throw new RemovedPageError();
    }
    /**
   * @deprecated
   * `ua` has been removed in favour of \`userAgent\` function.
   * Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
   */ get ua() {
        throw new RemovedUAError();
    }
    get url() {
        return this[INTERNALS].url;
    }
} //# sourceMappingURL=request.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/response.js



const response_INTERNALS = Symbol("internal response");
const REDIRECTS = new Set([
    301,
    302,
    303,
    307,
    308
]);
function handleMiddlewareField(init, headers) {
    var _init_request;
    if (init == null ? void 0 : (_init_request = init.request) == null ? void 0 : _init_request.headers) {
        if (!(init.request.headers instanceof Headers)) {
            throw new Error("request.headers must be an instance of Headers");
        }
        const keys = [];
        for (const [key, value] of init.request.headers){
            headers.set("x-middleware-request-" + key, value);
            keys.push(key);
        }
        headers.set("x-middleware-override-headers", keys.join(","));
    }
}
class NextResponse extends Response {
    constructor(body, init = {}){
        super(body, init);
        this[response_INTERNALS] = {
            cookies: new _edge_runtime_cookies.ResponseCookies(this.headers),
            url: init.url ? new NextURL(init.url, {
                headers: toNodeOutgoingHttpHeaders(this.headers),
                nextConfig: init.nextConfig
            }) : undefined
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            url: this.url,
            // rest of props come from Response
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: Object.fromEntries(this.headers),
            ok: this.ok,
            redirected: this.redirected,
            status: this.status,
            statusText: this.statusText,
            type: this.type
        };
    }
    get cookies() {
        return this[response_INTERNALS].cookies;
    }
    static json(body, init) {
        const response = Response.json(body, init);
        return new NextResponse(response.body, response);
    }
    static redirect(url, init) {
        const status = typeof init === "number" ? init : (init == null ? void 0 : init.status) ?? 307;
        if (!REDIRECTS.has(status)) {
            throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        const initObj = typeof init === "object" ? init : {};
        const headers = new Headers(initObj == null ? void 0 : initObj.headers);
        headers.set("Location", validateURL(url));
        return new NextResponse(null, {
            ...initObj,
            headers,
            status
        });
    }
    static rewrite(destination, init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-rewrite", validateURL(destination));
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
    static next(init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-next", "1");
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
} //# sourceMappingURL=response.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/relativize-url.js
/**
 * Given a URL as a string and a base URL it will make the URL relative
 * if the parsed protocol and host is the same as the one in the base
 * URL. Otherwise it returns the same URL string.
 */ function relativizeURL(url, base) {
    const baseURL = typeof base === "string" ? new URL(base) : base;
    const relative = new URL(url, base);
    const origin = baseURL.protocol + "//" + baseURL.host;
    return relative.protocol + "//" + relative.host === origin ? relative.toString().replace(origin, "") : relative.toString();
} //# sourceMappingURL=relativize-url.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/client/components/app-router-headers.js
const RSC_HEADER = "RSC";
const ACTION = "Next-Action";
const NEXT_ROUTER_STATE_TREE = "Next-Router-State-Tree";
const NEXT_ROUTER_PREFETCH_HEADER = "Next-Router-Prefetch";
const NEXT_URL = "Next-Url";
const RSC_CONTENT_TYPE_HEADER = "text/x-component";
const RSC_VARY_HEADER = RSC_HEADER + ", " + NEXT_ROUTER_STATE_TREE + ", " + NEXT_ROUTER_PREFETCH_HEADER + ", " + NEXT_URL;
const FLIGHT_PARAMETERS = [
    [
        RSC_HEADER
    ],
    [
        NEXT_ROUTER_STATE_TREE
    ],
    [
        NEXT_ROUTER_PREFETCH_HEADER
    ]
];
const NEXT_RSC_UNION_QUERY = "_rsc";
const NEXT_DID_POSTPONE_HEADER = "x-nextjs-postponed"; //# sourceMappingURL=app-router-headers.js.map

// EXTERNAL MODULE: ./node_modules/next/dist/esm/shared/lib/modern-browserslist-target.js
var modern_browserslist_target = __webpack_require__(535);
;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/constants.js


const COMPILER_NAMES = {
    client: "client",
    server: "server",
    edgeServer: "edge-server"
};
/**
 * Headers that are set by the Next.js server and should be stripped from the
 * request headers going to the user's application.
 */ const constants_INTERNAL_HEADERS = (/* unused pure expression or super */ null && ([
    "x-invoke-error",
    "x-invoke-output",
    "x-invoke-path",
    "x-invoke-query",
    "x-invoke-status",
    "x-middleware-invoke"
]));
const COMPILER_INDEXES = {
    [COMPILER_NAMES.client]: 0,
    [COMPILER_NAMES.server]: 1,
    [COMPILER_NAMES.edgeServer]: 2
};
const PHASE_EXPORT = "phase-export";
const PHASE_PRODUCTION_BUILD = "phase-production-build";
const PHASE_PRODUCTION_SERVER = "phase-production-server";
const PHASE_DEVELOPMENT_SERVER = "phase-development-server";
const PHASE_TEST = "phase-test";
const PHASE_INFO = "phase-info";
const PAGES_MANIFEST = "pages-manifest.json";
const APP_PATHS_MANIFEST = "app-paths-manifest.json";
const APP_PATH_ROUTES_MANIFEST = "app-path-routes-manifest.json";
const BUILD_MANIFEST = "build-manifest.json";
const APP_BUILD_MANIFEST = "app-build-manifest.json";
const FUNCTIONS_CONFIG_MANIFEST = "functions-config-manifest.json";
const SUBRESOURCE_INTEGRITY_MANIFEST = "subresource-integrity-manifest";
const NEXT_FONT_MANIFEST = "next-font-manifest";
const EXPORT_MARKER = "export-marker.json";
const EXPORT_DETAIL = "export-detail.json";
const PRERENDER_MANIFEST = "prerender-manifest.json";
const ROUTES_MANIFEST = "routes-manifest.json";
const IMAGES_MANIFEST = "images-manifest.json";
const SERVER_FILES_MANIFEST = "required-server-files.json";
const DEV_CLIENT_PAGES_MANIFEST = "_devPagesManifest.json";
const MIDDLEWARE_MANIFEST = "middleware-manifest.json";
const DEV_MIDDLEWARE_MANIFEST = "_devMiddlewareManifest.json";
const REACT_LOADABLE_MANIFEST = "react-loadable-manifest.json";
const FONT_MANIFEST = "font-manifest.json";
const SERVER_DIRECTORY = "server";
const CONFIG_FILES = (/* unused pure expression or super */ null && ([
    "next.config.js",
    "next.config.mjs"
]));
const BUILD_ID_FILE = "BUILD_ID";
const BLOCKED_PAGES = (/* unused pure expression or super */ null && ([
    "/_document",
    "/_app",
    "/_error"
]));
const CLIENT_PUBLIC_FILES_PATH = "public";
const CLIENT_STATIC_FILES_PATH = "static";
const STRING_LITERAL_DROP_BUNDLE = "__NEXT_DROP_CLIENT_FILE__";
const NEXT_BUILTIN_DOCUMENT = "__NEXT_BUILTIN_DOCUMENT__";
const BARREL_OPTIMIZATION_PREFIX = "__barrel_optimize__";
// server/[entry]/page_client-reference-manifest.js
const CLIENT_REFERENCE_MANIFEST = "client-reference-manifest";
// server/server-reference-manifest
const SERVER_REFERENCE_MANIFEST = "server-reference-manifest";
// server/middleware-build-manifest.js
const MIDDLEWARE_BUILD_MANIFEST = "middleware-build-manifest";
// server/middleware-react-loadable-manifest.js
const MIDDLEWARE_REACT_LOADABLE_MANIFEST = "middleware-react-loadable-manifest";
// static/runtime/main.js
const CLIENT_STATIC_FILES_RUNTIME_MAIN = "main";
const CLIENT_STATIC_FILES_RUNTIME_MAIN_APP = "" + CLIENT_STATIC_FILES_RUNTIME_MAIN + "-app";
// next internal client components chunk for layouts
const APP_CLIENT_INTERNALS = "app-pages-internals";
// static/runtime/react-refresh.js
const CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = "react-refresh";
// static/runtime/amp.js
const CLIENT_STATIC_FILES_RUNTIME_AMP = "amp";
// static/runtime/webpack.js
const CLIENT_STATIC_FILES_RUNTIME_WEBPACK = "webpack";
// static/runtime/polyfills.js
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS = "polyfills";
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL = Symbol(CLIENT_STATIC_FILES_RUNTIME_POLYFILLS);
const EDGE_RUNTIME_WEBPACK = "edge-runtime-webpack";
const STATIC_PROPS_ID = "__N_SSG";
const SERVER_PROPS_ID = "__N_SSP";
const PAGE_SEGMENT_KEY = "__PAGE__";
const GOOGLE_FONT_PROVIDER = "https://fonts.googleapis.com/";
const OPTIMIZED_FONT_PROVIDERS = [
    {
        url: GOOGLE_FONT_PROVIDER,
        preconnect: "https://fonts.gstatic.com"
    },
    {
        url: "https://use.typekit.net",
        preconnect: "https://use.typekit.net"
    }
];
const DEFAULT_SERIF_FONT = {
    name: "Times New Roman",
    xAvgCharWidth: 821,
    azAvgWidth: 854.3953488372093,
    unitsPerEm: 2048
};
const DEFAULT_SANS_SERIF_FONT = {
    name: "Arial",
    xAvgCharWidth: 904,
    azAvgWidth: 934.5116279069767,
    unitsPerEm: 2048
};
const STATIC_STATUS_PAGES = (/* unused pure expression or super */ null && ([
    "/500"
]));
const TRACE_OUTPUT_VERSION = 1;
// in `MB`
const TURBO_TRACE_DEFAULT_MEMORY_LIMIT = 6000;
const RSC_MODULE_TYPES = {
    client: "client",
    server: "server"
};
// comparing
// https://nextjs.org/docs/api-reference/edge-runtime
// with
// https://nodejs.org/docs/latest/api/globals.html
const EDGE_UNSUPPORTED_NODE_APIS = (/* unused pure expression or super */ null && ([
    "clearImmediate",
    "setImmediate",
    "BroadcastChannel",
    "ByteLengthQueuingStrategy",
    "CompressionStream",
    "CountQueuingStrategy",
    "DecompressionStream",
    "DomException",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "ReadableByteStreamController",
    "ReadableStreamBYOBRequest",
    "ReadableStreamDefaultController",
    "TransformStreamDefaultController",
    "WritableStreamDefaultController"
]));
const SYSTEM_ENTRYPOINTS = new Set([
    CLIENT_STATIC_FILES_RUNTIME_MAIN,
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH,
    CLIENT_STATIC_FILES_RUNTIME_AMP,
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP
]); //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/internal-utils.js


const INTERNAL_QUERY_NAMES = [
    "__nextFallback",
    "__nextLocale",
    "__nextInferredLocaleFromDefault",
    "__nextDefaultLocale",
    "__nextIsNotFound",
    NEXT_RSC_UNION_QUERY
];
const EDGE_EXTENDED_INTERNAL_QUERY_NAMES = [
    "__nextDataReq"
];
function stripInternalQueries(query) {
    for (const name of INTERNAL_QUERY_NAMES){
        delete query[name];
    }
}
function stripInternalSearchParams(url, isEdge) {
    const isStringUrl = typeof url === "string";
    const instance = isStringUrl ? new URL(url) : url;
    for (const name of INTERNAL_QUERY_NAMES){
        instance.searchParams.delete(name);
    }
    if (isEdge) {
        for (const name of EDGE_EXTENDED_INTERNAL_QUERY_NAMES){
            instance.searchParams.delete(name);
        }
    }
    return isStringUrl ? instance.toString() : instance;
}
/**
 * Strip internal headers from the request headers.
 *
 * @param headers the headers to strip of internal headers
 */ function stripInternalHeaders(headers) {
    for (const key of INTERNAL_HEADERS){
        delete headers[key];
    }
} //# sourceMappingURL=internal-utils.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/shared/lib/router/utils/app-paths.js


/**
 * Normalizes an app route so it represents the actual request path. Essentially
 * performing the following transformations:
 *
 * - `/(dashboard)/user/[id]/page` to `/user/[id]`
 * - `/(dashboard)/account/page` to `/account`
 * - `/user/[id]/page` to `/user/[id]`
 * - `/account/page` to `/account`
 * - `/page` to `/`
 * - `/(dashboard)/user/[id]/route` to `/user/[id]`
 * - `/(dashboard)/account/route` to `/account`
 * - `/user/[id]/route` to `/user/[id]`
 * - `/account/route` to `/account`
 * - `/route` to `/`
 * - `/` to `/`
 *
 * @param route the app route to normalize
 * @returns the normalized pathname
 */ function normalizeAppPath(route) {
    return ensureLeadingSlash(route.split("/").reduce((pathname, segment, index, segments)=>{
        // Empty segments are ignored.
        if (!segment) {
            return pathname;
        }
        // Groups are ignored.
        if (isGroupSegment(segment)) {
            return pathname;
        }
        // Parallel segments are ignored.
        if (segment[0] === "@") {
            return pathname;
        }
        // The last segment (if it's a leaf) should be ignored.
        if ((segment === "page" || segment === "route") && index === segments.length - 1) {
            return pathname;
        }
        return pathname + "/" + segment;
    }, ""));
}
/**
 * Strips the `.rsc` extension if it's in the pathname.
 * Since this function is used on full urls it checks `?` for searchParams handling.
 */ function normalizeRscURL(url) {
    return url.replace(/\.rsc($|\?)/, "$1");
} //# sourceMappingURL=app-paths.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/lib/constants.js
const NEXT_QUERY_PARAM_PREFIX = "nxtP";
const PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate";
const PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER = "x-prerender-revalidate-if-generated";
const RSC_PREFETCH_SUFFIX = ".prefetch.rsc";
const RSC_SUFFIX = ".rsc";
const NEXT_DATA_SUFFIX = ".json";
const NEXT_META_SUFFIX = ".meta";
const NEXT_BODY_SUFFIX = ".body";
const NEXT_CACHE_TAGS_HEADER = "x-next-cache-tags";
const NEXT_CACHE_SOFT_TAGS_HEADER = "x-next-cache-soft-tags";
const NEXT_CACHE_REVALIDATED_TAGS_HEADER = "x-next-revalidated-tags";
const NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER = "x-next-revalidate-tag-token";
const NEXT_CACHE_TAG_MAX_LENGTH = 256;
const NEXT_CACHE_SOFT_TAG_MAX_LENGTH = 1024;
const NEXT_CACHE_IMPLICIT_TAG_ID = "_N_T_";
// in seconds
const CACHE_ONE_YEAR = 31536000;
// Patterns to detect middleware files
const MIDDLEWARE_FILENAME = "middleware";
const MIDDLEWARE_LOCATION_REGEXP = (/* unused pure expression or super */ null && (`(?:src/)?${MIDDLEWARE_FILENAME}`));
// Pattern to detect instrumentation hooks file
const INSTRUMENTATION_HOOK_FILENAME = "instrumentation";
// Because on Windows absolute paths in the generated code can break because of numbers, eg 1 in the path,
// we have to use a private alias
const PAGES_DIR_ALIAS = "private-next-pages";
const DOT_NEXT_ALIAS = "private-dot-next";
const ROOT_DIR_ALIAS = "private-next-root-dir";
const APP_DIR_ALIAS = "private-next-app-dir";
const RSC_MOD_REF_PROXY_ALIAS = "private-next-rsc-mod-ref-proxy";
const RSC_ACTION_VALIDATE_ALIAS = "private-next-rsc-action-validate";
const RSC_ACTION_PROXY_ALIAS = "private-next-rsc-action-proxy";
const RSC_ACTION_ENCRYPTION_ALIAS = "private-next-rsc-action-encryption";
const RSC_ACTION_CLIENT_WRAPPER_ALIAS = "private-next-rsc-action-client-wrapper";
const PUBLIC_DIR_MIDDLEWARE_CONFLICT = (/* unused pure expression or super */ null && (`You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict`));
const SSG_GET_INITIAL_PROPS_CONFLICT = (/* unused pure expression or super */ null && (`You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`));
const SERVER_PROPS_GET_INIT_PROPS_CONFLICT = (/* unused pure expression or super */ null && (`You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`));
const SERVER_PROPS_SSG_CONFLICT = (/* unused pure expression or super */ null && (`You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps`));
const STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = (/* unused pure expression or super */ null && (`can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props`));
const SERVER_PROPS_EXPORT_ERROR = (/* unused pure expression or super */ null && (`pages with \`getServerSideProps\` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export`));
const GSP_NO_RETURNED_VALUE = "Your `getStaticProps` function did not return an object. Did you forget to add a `return`?";
const GSSP_NO_RETURNED_VALUE = "Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?";
const UNSTABLE_REVALIDATE_RENAME_ERROR = (/* unused pure expression or super */ null && ("The `unstable_revalidate` property is available for general use.\n" + "Please use `revalidate` instead."));
const GSSP_COMPONENT_MEMBER_ERROR = (/* unused pure expression or super */ null && (`can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member`));
const NON_STANDARD_NODE_ENV = (/* unused pure expression or super */ null && (`You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env`));
const SSG_FALLBACK_EXPORT_ERROR = (/* unused pure expression or super */ null && (`Pages with \`fallback\` enabled in \`getStaticPaths\` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export`));
const ESLINT_DEFAULT_DIRS = (/* unused pure expression or super */ null && ([
    "app",
    "pages",
    "components",
    "lib",
    "src"
]));
const ESLINT_PROMPT_VALUES = [
    {
        title: "Strict",
        recommended: true,
        config: {
            extends: "next/core-web-vitals"
        }
    },
    {
        title: "Base",
        config: {
            extends: "next"
        }
    },
    {
        title: "Cancel",
        config: null
    }
];
const SERVER_RUNTIME = {
    edge: "edge",
    experimentalEdge: "experimental-edge",
    nodejs: "nodejs"
};
/**
 * The names of the webpack layers. These layers are the primitives for the
 * webpack chunks.
 */ const WEBPACK_LAYERS_NAMES = {
    /**
   * The layer for the shared code between the client and server bundles.
   */ shared: "shared",
    /**
   * React Server Components layer (rsc).
   */ reactServerComponents: "rsc",
    /**
   * Server Side Rendering layer for app (ssr).
   */ serverSideRendering: "ssr",
    /**
   * The browser client bundle layer for actions.
   */ actionBrowser: "action-browser",
    /**
   * The layer for the API routes.
   */ api: "api",
    /**
   * The layer for the middleware code.
   */ middleware: "middleware",
    /**
   * The layer for assets on the edge.
   */ edgeAsset: "edge-asset",
    /**
   * The browser client bundle layer for App directory.
   */ appPagesBrowser: "app-pages-browser",
    /**
   * The server bundle layer for metadata routes.
   */ appMetadataRoute: "app-metadata-route",
    /**
   * The layer for the server bundle for App Route handlers.
   */ appRouteHandler: "app-route-handler"
};
const WEBPACK_LAYERS = {
    ...WEBPACK_LAYERS_NAMES,
    GROUP: {
        server: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.appMetadataRoute,
            WEBPACK_LAYERS_NAMES.appRouteHandler
        ],
        nonClientServerTarget: [
            // plus middleware and pages api
            WEBPACK_LAYERS_NAMES.middleware,
            WEBPACK_LAYERS_NAMES.api
        ],
        app: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.appMetadataRoute,
            WEBPACK_LAYERS_NAMES.appRouteHandler,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser
        ]
    }
};
const WEBPACK_RESOURCE_QUERIES = {
    edgeSSREntry: "__next_edge_ssr_entry__",
    metadata: "__next_metadata__",
    metadataRoute: "__next_metadata_route__",
    metadataImageMeta: "__next_metadata_image_meta__"
};
 //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/adapters/reflect.js
class ReflectAdapter {
    static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "function") {
            return value.bind(target);
        }
        return value;
    }
    static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    }
    static has(target, prop) {
        return Reflect.has(target, prop);
    }
    static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
} //# sourceMappingURL=reflect.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/adapters/headers.js

/**
 * @internal
 */ class ReadonlyHeadersError extends Error {
    constructor(){
        super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
    }
    static callable() {
        throw new ReadonlyHeadersError();
    }
}
class HeadersAdapter extends Headers {
    constructor(headers){
        // We've already overridden the methods that would be called, so we're just
        // calling the super constructor to ensure that the instanceof check works.
        super();
        this.headers = new Proxy(headers, {
            get (target, prop, receiver) {
                // Because this is just an object, we expect that all "get" operations
                // are for properties. If it's a "get" for a symbol, we'll just return
                // the symbol.
                if (typeof prop === "symbol") {
                    return ReflectAdapter.get(target, prop, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return undefined.
                if (typeof original === "undefined") return;
                // If the original casing exists, return the value.
                return ReflectAdapter.get(target, original, receiver);
            },
            set (target, prop, value, receiver) {
                if (typeof prop === "symbol") {
                    return ReflectAdapter.set(target, prop, value, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, use the prop as the key.
                return ReflectAdapter.set(target, original ?? prop, value, receiver);
            },
            has (target, prop) {
                if (typeof prop === "symbol") return ReflectAdapter.has(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return false.
                if (typeof original === "undefined") return false;
                // If the original casing exists, return true.
                return ReflectAdapter.has(target, original);
            },
            deleteProperty (target, prop) {
                if (typeof prop === "symbol") return ReflectAdapter.deleteProperty(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return true.
                if (typeof original === "undefined") return true;
                // If the original casing exists, delete the property.
                return ReflectAdapter.deleteProperty(target, original);
            }
        });
    }
    /**
   * Seals a Headers instance to prevent modification by throwing an error when
   * any mutating method is called.
   */ static seal(headers) {
        return new Proxy(headers, {
            get (target, prop, receiver) {
                switch(prop){
                    case "append":
                    case "delete":
                    case "set":
                        return ReadonlyHeadersError.callable;
                    default:
                        return ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
    /**
   * Merges a header value into a string. This stores multiple values as an
   * array, so we need to merge them into a string.
   *
   * @param value a header value
   * @returns a merged header value (a string)
   */ merge(value) {
        if (Array.isArray(value)) return value.join(", ");
        return value;
    }
    /**
   * Creates a Headers instance from a plain object or a Headers instance.
   *
   * @param headers a plain object or a Headers instance
   * @returns a headers instance
   */ static from(headers) {
        if (headers instanceof Headers) return headers;
        return new HeadersAdapter(headers);
    }
    append(name, value) {
        const existing = this.headers[name];
        if (typeof existing === "string") {
            this.headers[name] = [
                existing,
                value
            ];
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            this.headers[name] = value;
        }
    }
    delete(name) {
        delete this.headers[name];
    }
    get(name) {
        const value = this.headers[name];
        if (typeof value !== "undefined") return this.merge(value);
        return null;
    }
    has(name) {
        return typeof this.headers[name] !== "undefined";
    }
    set(name, value) {
        this.headers[name] = value;
    }
    forEach(callbackfn, thisArg) {
        for (const [name, value] of this.entries()){
            callbackfn.call(thisArg, value, name, this);
        }
    }
    *entries() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(name);
            yield [
                name,
                value
            ];
        }
    }
    *keys() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            yield name;
        }
    }
    *values() {
        for (const key of Object.keys(this.headers)){
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(key);
            yield value;
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
} //# sourceMappingURL=headers.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/spec-extension/adapters/request-cookies.js


/**
 * @internal
 */ class ReadonlyRequestCookiesError extends Error {
    constructor(){
        super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options");
    }
    static callable() {
        throw new ReadonlyRequestCookiesError();
    }
}
class RequestCookiesAdapter {
    static seal(cookies) {
        return new Proxy(cookies, {
            get (target, prop, receiver) {
                switch(prop){
                    case "clear":
                    case "delete":
                    case "set":
                        return ReadonlyRequestCookiesError.callable;
                    default:
                        return ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
}
const SYMBOL_MODIFY_COOKIE_VALUES = Symbol.for("next.mutated.cookies");
function getModifiedCookieValues(cookies) {
    const modified = cookies[SYMBOL_MODIFY_COOKIE_VALUES];
    if (!modified || !Array.isArray(modified) || modified.length === 0) {
        return [];
    }
    return modified;
}
function appendMutableCookies(headers, mutableCookies) {
    const modifiedCookieValues = getModifiedCookieValues(mutableCookies);
    if (modifiedCookieValues.length === 0) {
        return false;
    }
    // Return a new response that extends the response with
    // the modified cookies as fallbacks. `res` cookies
    // will still take precedence.
    const resCookies = new ResponseCookies(headers);
    const returnedCookies = resCookies.getAll();
    // Set the modified cookies as fallbacks.
    for (const cookie of modifiedCookieValues){
        resCookies.set(cookie);
    }
    // Set the original cookies as the final values.
    for (const cookie of returnedCookies){
        resCookies.set(cookie);
    }
    return true;
}
class MutableRequestCookiesAdapter {
    static wrap(cookies, onUpdateCookies) {
        const responseCookes = new _edge_runtime_cookies.ResponseCookies(new Headers());
        for (const cookie of cookies.getAll()){
            responseCookes.set(cookie);
        }
        let modifiedValues = [];
        const modifiedCookies = new Set();
        const updateResponseCookies = ()=>{
            var _fetch___nextGetStaticStore;
            // TODO-APP: change method of getting staticGenerationAsyncStore
            const staticGenerationAsyncStore = fetch.__nextGetStaticStore == null ? void 0 : (_fetch___nextGetStaticStore = fetch.__nextGetStaticStore.call(fetch)) == null ? void 0 : _fetch___nextGetStaticStore.getStore();
            if (staticGenerationAsyncStore) {
                staticGenerationAsyncStore.pathWasRevalidated = true;
            }
            const allCookies = responseCookes.getAll();
            modifiedValues = allCookies.filter((c)=>modifiedCookies.has(c.name));
            if (onUpdateCookies) {
                const serializedCookies = [];
                for (const cookie of modifiedValues){
                    const tempCookies = new _edge_runtime_cookies.ResponseCookies(new Headers());
                    tempCookies.set(cookie);
                    serializedCookies.push(tempCookies.toString());
                }
                onUpdateCookies(serializedCookies);
            }
        };
        return new Proxy(responseCookes, {
            get (target, prop, receiver) {
                switch(prop){
                    // A special symbol to get the modified cookie values
                    case SYMBOL_MODIFY_COOKIE_VALUES:
                        return modifiedValues;
                    // TODO: Throw error if trying to set a cookie after the response
                    // headers have been set.
                    case "delete":
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === "string" ? args[0] : args[0].name);
                            try {
                                target.delete(...args);
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    case "set":
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === "string" ? args[0] : args[0].name);
                            try {
                                return target.set(...args);
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    default:
                        return ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
} //# sourceMappingURL=request-cookies.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/api-utils/index.js


/**
 *
 * @param res response object
 * @param statusCode `HTTP` status code of response
 */ function sendStatusCode(res, statusCode) {
    res.statusCode = statusCode;
    return res;
}
/**
 *
 * @param res response object
 * @param [statusOrUrl] `HTTP` status code of redirect
 * @param url URL of redirect
 */ function redirect(res, statusOrUrl, url) {
    if (typeof statusOrUrl === "string") {
        url = statusOrUrl;
        statusOrUrl = 307;
    }
    if (typeof statusOrUrl !== "number" || typeof url !== "string") {
        throw new Error(`Invalid redirect arguments. Please use a single argument URL, e.g. res.redirect('/destination') or use a status code and URL, e.g. res.redirect(307, '/destination').`);
    }
    res.writeHead(statusOrUrl, {
        Location: url
    });
    res.write(url);
    res.end();
    return res;
}
function checkIsOnDemandRevalidate(req, previewProps) {
    const headers = HeadersAdapter.from(req.headers);
    const previewModeId = headers.get(PRERENDER_REVALIDATE_HEADER);
    const isOnDemandRevalidate = previewModeId === previewProps.previewModeId;
    const revalidateOnlyGenerated = headers.has(PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER);
    return {
        isOnDemandRevalidate,
        revalidateOnlyGenerated
    };
}
const COOKIE_NAME_PRERENDER_BYPASS = `__prerender_bypass`;
const COOKIE_NAME_PRERENDER_DATA = `__next_preview_data`;
const RESPONSE_LIMIT_DEFAULT = (/* unused pure expression or super */ null && (4 * 1024 * 1024));
const SYMBOL_PREVIEW_DATA = Symbol(COOKIE_NAME_PRERENDER_DATA);
const SYMBOL_CLEARED_COOKIES = Symbol(COOKIE_NAME_PRERENDER_BYPASS);
function clearPreviewData(res, options = {}) {
    if (SYMBOL_CLEARED_COOKIES in res) {
        return res;
    }
    const { serialize } = __webpack_require__(287);
    const previous = res.getHeader("Set-Cookie");
    res.setHeader(`Set-Cookie`, [
        ...typeof previous === "string" ? [
            previous
        ] : Array.isArray(previous) ? previous : [],
        serialize(COOKIE_NAME_PRERENDER_BYPASS, "", {
            // To delete a cookie, set `expires` to a date in the past:
            // https://tools.ietf.org/html/rfc6265#section-4.1.1
            // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
            expires: new Date(0),
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        }),
        serialize(COOKIE_NAME_PRERENDER_DATA, "", {
            // To delete a cookie, set `expires` to a date in the past:
            // https://tools.ietf.org/html/rfc6265#section-4.1.1
            // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
            expires: new Date(0),
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        })
    ]);
    Object.defineProperty(res, SYMBOL_CLEARED_COOKIES, {
        value: true,
        enumerable: false
    });
    return res;
}
/**
 * Custom error class
 */ class ApiError extends (/* unused pure expression or super */ null && (Error)) {
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
    }
}
/**
 * Sends error in `response`
 * @param res response object
 * @param statusCode of response
 * @param message of response
 */ function sendError(res, statusCode, message) {
    res.statusCode = statusCode;
    res.statusMessage = message;
    res.end(message);
}
/**
 * Execute getter function only if its needed
 * @param LazyProps `req` and `params` for lazyProp
 * @param prop name of property
 * @param getter function to get data
 */ function setLazyProp({ req }, prop, getter) {
    const opts = {
        configurable: true,
        enumerable: true
    };
    const optsReset = {
        ...opts,
        writable: true
    };
    Object.defineProperty(req, prop, {
        ...opts,
        get: ()=>{
            const value = getter();
            // we set the property on the object to avoid recalculating it
            Object.defineProperty(req, prop, {
                ...optsReset,
                value
            });
            return value;
        },
        set: (value)=>{
            Object.defineProperty(req, prop, {
                ...optsReset,
                value
            });
        }
    });
} //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/async-storage/draft-mode-provider.js

class DraftModeProvider {
    constructor(previewProps, req, cookies, mutableCookies){
        var _cookies_get;
        // The logic for draftMode() is very similar to tryGetPreviewData()
        // but Draft Mode does not have any data associated with it.
        const isOnDemandRevalidate = previewProps && checkIsOnDemandRevalidate(req, previewProps).isOnDemandRevalidate;
        const cookieValue = (_cookies_get = cookies.get(COOKIE_NAME_PRERENDER_BYPASS)) == null ? void 0 : _cookies_get.value;
        this.isEnabled = Boolean(!isOnDemandRevalidate && cookieValue && previewProps && cookieValue === previewProps.previewModeId);
        this._previewModeId = previewProps == null ? void 0 : previewProps.previewModeId;
        this._mutableCookies = mutableCookies;
    }
    enable() {
        if (!this._previewModeId) {
            throw new Error("Invariant: previewProps missing previewModeId this should never happen");
        }
        this._mutableCookies.set({
            name: COOKIE_NAME_PRERENDER_BYPASS,
            value: this._previewModeId,
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/"
        });
    }
    disable() {
        // To delete a cookie, set `expires` to a date in the past:
        // https://tools.ietf.org/html/rfc6265#section-4.1.1
        // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
        this._mutableCookies.set({
            name: COOKIE_NAME_PRERENDER_BYPASS,
            value: "",
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            expires: new Date(0)
        });
    }
} //# sourceMappingURL=draft-mode-provider.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/async-storage/request-async-storage-wrapper.js





function getHeaders(headers) {
    const cleaned = HeadersAdapter.from(headers);
    for (const param of FLIGHT_PARAMETERS){
        cleaned.delete(param.toString().toLowerCase());
    }
    return HeadersAdapter.seal(cleaned);
}
function getCookies(headers) {
    const cookies = new _edge_runtime_cookies.RequestCookies(HeadersAdapter.from(headers));
    return RequestCookiesAdapter.seal(cookies);
}
function getMutableCookies(headers, onUpdateCookies) {
    const cookies = new _edge_runtime_cookies.RequestCookies(HeadersAdapter.from(headers));
    return MutableRequestCookiesAdapter.wrap(cookies, onUpdateCookies);
}
const RequestAsyncStorageWrapper = {
    /**
   * Wrap the callback with the given store so it can access the underlying
   * store using hooks.
   *
   * @param storage underlying storage object returned by the module
   * @param context context to seed the store
   * @param callback function to call within the scope of the context
   * @returns the result returned by the callback
   */ wrap (storage, { req, res, renderOpts }, callback) {
        let previewProps = undefined;
        if (renderOpts && "previewProps" in renderOpts) {
            // TODO: investigate why previewProps isn't on RenderOpts
            previewProps = renderOpts.previewProps;
        }
        function defaultOnUpdateCookies(cookies) {
            if (res) {
                res.setHeader("Set-Cookie", cookies);
            }
        }
        const cache = {};
        const store = {
            get headers () {
                if (!cache.headers) {
                    // Seal the headers object that'll freeze out any methods that could
                    // mutate the underlying data.
                    cache.headers = getHeaders(req.headers);
                }
                return cache.headers;
            },
            get cookies () {
                if (!cache.cookies) {
                    // Seal the cookies object that'll freeze out any methods that could
                    // mutate the underlying data.
                    cache.cookies = getCookies(req.headers);
                }
                return cache.cookies;
            },
            get mutableCookies () {
                if (!cache.mutableCookies) {
                    cache.mutableCookies = getMutableCookies(req.headers, (renderOpts == null ? void 0 : renderOpts.onUpdateCookies) || (res ? defaultOnUpdateCookies : undefined));
                }
                return cache.mutableCookies;
            },
            get draftMode () {
                if (!cache.draftMode) {
                    cache.draftMode = new DraftModeProvider(previewProps, req, this.cookies, this.mutableCookies);
                }
                return cache.draftMode;
            }
        };
        return storage.run(store, callback, store);
    }
}; //# sourceMappingURL=request-async-storage-wrapper.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/client/components/async-local-storage.js
const sharedAsyncLocalStorageNotAvailableError = new Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available");
class FakeAsyncLocalStorage {
    disable() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    getStore() {
        // This fake implementation of AsyncLocalStorage always returns `undefined`.
        return undefined;
    }
    run() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    exit() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    enterWith() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
}
const maybeGlobalAsyncLocalStorage = globalThis.AsyncLocalStorage;
function createAsyncLocalStorage() {
    if (maybeGlobalAsyncLocalStorage) {
        return new maybeGlobalAsyncLocalStorage();
    }
    return new FakeAsyncLocalStorage();
} //# sourceMappingURL=async-local-storage.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/client/components/request-async-storage.external.js

const requestAsyncStorage = createAsyncLocalStorage(); //# sourceMappingURL=request-async-storage.external.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/lib/trace/constants.js
/**
 * Contains predefined constants for the trace span name in next/server.
 *
 * Currently, next/server/tracer is internal implementation only for tracking
 * next.js's implementation only with known span names defined here.
 **/ // eslint typescript has a bug with TS enums
/* eslint-disable no-shadow */ var BaseServerSpan;
(function(BaseServerSpan) {
    BaseServerSpan["handleRequest"] = "BaseServer.handleRequest";
    BaseServerSpan["run"] = "BaseServer.run";
    BaseServerSpan["pipe"] = "BaseServer.pipe";
    BaseServerSpan["getStaticHTML"] = "BaseServer.getStaticHTML";
    BaseServerSpan["render"] = "BaseServer.render";
    BaseServerSpan["renderToResponseWithComponents"] = "BaseServer.renderToResponseWithComponents";
    BaseServerSpan["renderToResponse"] = "BaseServer.renderToResponse";
    BaseServerSpan["renderToHTML"] = "BaseServer.renderToHTML";
    BaseServerSpan["renderError"] = "BaseServer.renderError";
    BaseServerSpan["renderErrorToResponse"] = "BaseServer.renderErrorToResponse";
    BaseServerSpan["renderErrorToHTML"] = "BaseServer.renderErrorToHTML";
    BaseServerSpan["render404"] = "BaseServer.render404";
})(BaseServerSpan || (BaseServerSpan = {}));
var LoadComponentsSpan;
(function(LoadComponentsSpan) {
    LoadComponentsSpan["loadDefaultErrorComponents"] = "LoadComponents.loadDefaultErrorComponents";
    LoadComponentsSpan["loadComponents"] = "LoadComponents.loadComponents";
})(LoadComponentsSpan || (LoadComponentsSpan = {}));
var NextServerSpan;
(function(NextServerSpan) {
    NextServerSpan["getRequestHandler"] = "NextServer.getRequestHandler";
    NextServerSpan["getServer"] = "NextServer.getServer";
    NextServerSpan["getServerRequestHandler"] = "NextServer.getServerRequestHandler";
    NextServerSpan["createServer"] = "createServer.createServer";
})(NextServerSpan || (NextServerSpan = {}));
var NextNodeServerSpan;
(function(NextNodeServerSpan) {
    NextNodeServerSpan["compression"] = "NextNodeServer.compression";
    NextNodeServerSpan["getBuildId"] = "NextNodeServer.getBuildId";
    NextNodeServerSpan["generateStaticRoutes"] = "NextNodeServer.generateStaticRoutes";
    NextNodeServerSpan["generateFsStaticRoutes"] = "NextNodeServer.generateFsStaticRoutes";
    NextNodeServerSpan["generatePublicRoutes"] = "NextNodeServer.generatePublicRoutes";
    NextNodeServerSpan["generateImageRoutes"] = "NextNodeServer.generateImageRoutes.route";
    NextNodeServerSpan["sendRenderResult"] = "NextNodeServer.sendRenderResult";
    NextNodeServerSpan["proxyRequest"] = "NextNodeServer.proxyRequest";
    NextNodeServerSpan["runApi"] = "NextNodeServer.runApi";
    NextNodeServerSpan["render"] = "NextNodeServer.render";
    NextNodeServerSpan["renderHTML"] = "NextNodeServer.renderHTML";
    NextNodeServerSpan["imageOptimizer"] = "NextNodeServer.imageOptimizer";
    NextNodeServerSpan["getPagePath"] = "NextNodeServer.getPagePath";
    NextNodeServerSpan["getRoutesManifest"] = "NextNodeServer.getRoutesManifest";
    NextNodeServerSpan["findPageComponents"] = "NextNodeServer.findPageComponents";
    NextNodeServerSpan["getFontManifest"] = "NextNodeServer.getFontManifest";
    NextNodeServerSpan["getServerComponentManifest"] = "NextNodeServer.getServerComponentManifest";
    NextNodeServerSpan["getRequestHandler"] = "NextNodeServer.getRequestHandler";
    NextNodeServerSpan["renderToHTML"] = "NextNodeServer.renderToHTML";
    NextNodeServerSpan["renderError"] = "NextNodeServer.renderError";
    NextNodeServerSpan["renderErrorToHTML"] = "NextNodeServer.renderErrorToHTML";
    NextNodeServerSpan["render404"] = "NextNodeServer.render404";
    NextNodeServerSpan["route"] = "route";
    NextNodeServerSpan["onProxyReq"] = "onProxyReq";
    NextNodeServerSpan["apiResolver"] = "apiResolver";
    NextNodeServerSpan["internalFetch"] = "internalFetch";
})(NextNodeServerSpan || (NextNodeServerSpan = {}));
var StartServerSpan;
(function(StartServerSpan) {
    StartServerSpan["startServer"] = "startServer.startServer";
})(StartServerSpan || (StartServerSpan = {}));
var RenderSpan;
(function(RenderSpan) {
    RenderSpan["getServerSideProps"] = "Render.getServerSideProps";
    RenderSpan["getStaticProps"] = "Render.getStaticProps";
    RenderSpan["renderToString"] = "Render.renderToString";
    RenderSpan["renderDocument"] = "Render.renderDocument";
    RenderSpan["createBodyResult"] = "Render.createBodyResult";
})(RenderSpan || (RenderSpan = {}));
var AppRenderSpan;
(function(AppRenderSpan) {
    AppRenderSpan["renderToString"] = "AppRender.renderToString";
    AppRenderSpan["renderToReadableStream"] = "AppRender.renderToReadableStream";
    AppRenderSpan["getBodyResult"] = "AppRender.getBodyResult";
    AppRenderSpan["fetch"] = "AppRender.fetch";
})(AppRenderSpan || (AppRenderSpan = {}));
var RouterSpan;
(function(RouterSpan) {
    RouterSpan["executeRoute"] = "Router.executeRoute";
})(RouterSpan || (RouterSpan = {}));
var NodeSpan;
(function(NodeSpan) {
    NodeSpan["runHandler"] = "Node.runHandler";
})(NodeSpan || (NodeSpan = {}));
var AppRouteRouteHandlersSpan;
(function(AppRouteRouteHandlersSpan) {
    AppRouteRouteHandlersSpan["runHandler"] = "AppRouteRouteHandlers.runHandler";
})(AppRouteRouteHandlersSpan || (AppRouteRouteHandlersSpan = {}));
var ResolveMetadataSpan;
(function(ResolveMetadataSpan) {
    ResolveMetadataSpan["generateMetadata"] = "ResolveMetadata.generateMetadata";
    ResolveMetadataSpan["generateViewport"] = "ResolveMetadata.generateViewport";
})(ResolveMetadataSpan || (ResolveMetadataSpan = {}));
// This list is used to filter out spans that are not relevant to the user
const NextVanillaSpanAllowlist = [
    "BaseServer.handleRequest",
    "Render.getServerSideProps",
    "Render.getStaticProps",
    "AppRender.fetch",
    "AppRender.getBodyResult",
    "Render.renderDocument",
    "Node.runHandler",
    "AppRouteRouteHandlers.runHandler",
    "ResolveMetadata.generateMetadata",
    "ResolveMetadata.generateViewport"
];
 //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/lib/trace/tracer.js

let api;
// we want to allow users to use their own version of @opentelemetry/api if they
// want to, so we try to require it first, and if it fails we fall back to the
// version that is bundled with Next.js
// this is because @opentelemetry/api has to be synced with the version of
// @opentelemetry/tracing that is used, and we don't want to force users to use
// the version that is bundled with Next.js.
// the API is ~stable, so this should be fine
if (true) {
    api = __webpack_require__(940);
} else {}
const { context, propagation, trace, SpanStatusCode, SpanKind, ROOT_CONTEXT } = api;
const isPromise = (p)=>{
    return p !== null && typeof p === "object" && typeof p.then === "function";
};
const closeSpanWithError = (span, error)=>{
    if ((error == null ? void 0 : error.bubble) === true) {
        span.setAttribute("next.bubble", true);
    } else {
        if (error) {
            span.recordException(error);
        }
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error == null ? void 0 : error.message
        });
    }
    span.end();
};
/** we use this map to propagate attributes from nested spans to the top span */ const rootSpanAttributesStore = new Map();
const rootSpanIdKey = api.createContextKey("next.rootSpanId");
let lastSpanId = 0;
const getSpanId = ()=>lastSpanId++;
class NextTracerImpl {
    /**
   * Returns an instance to the trace with configured name.
   * Since wrap / trace can be defined in any place prior to actual trace subscriber initialization,
   * This should be lazily evaluated.
   */ getTracerInstance() {
        return trace.getTracer("next.js", "0.0.1");
    }
    getContext() {
        return context;
    }
    getActiveScopeSpan() {
        return trace.getSpan(context == null ? void 0 : context.active());
    }
    withPropagatedContext(carrier, fn, getter) {
        const activeContext = context.active();
        if (trace.getSpanContext(activeContext)) {
            // Active span is already set, too late to propagate.
            return fn();
        }
        const remoteContext = propagation.extract(activeContext, carrier, getter);
        return context.with(remoteContext, fn);
    }
    trace(...args) {
        var _trace_getSpanContext;
        const [type, fnOrOptions, fnOrEmpty] = args;
        // coerce options form overload
        const { fn, options } = typeof fnOrOptions === "function" ? {
            fn: fnOrOptions,
            options: {}
        } : {
            fn: fnOrEmpty,
            options: {
                ...fnOrOptions
            }
        };
        if (!NextVanillaSpanAllowlist.includes(type) && process.env.NEXT_OTEL_VERBOSE !== "1" || options.hideSpan) {
            return fn();
        }
        const spanName = options.spanName ?? type;
        // Trying to get active scoped span to assign parent. If option specifies parent span manually, will try to use it.
        let spanContext = this.getSpanContext((options == null ? void 0 : options.parentSpan) ?? this.getActiveScopeSpan());
        let isRootSpan = false;
        if (!spanContext) {
            spanContext = ROOT_CONTEXT;
            isRootSpan = true;
        } else if ((_trace_getSpanContext = trace.getSpanContext(spanContext)) == null ? void 0 : _trace_getSpanContext.isRemote) {
            isRootSpan = true;
        }
        const spanId = getSpanId();
        options.attributes = {
            "next.span_name": spanName,
            "next.span_type": type,
            ...options.attributes
        };
        return context.with(spanContext.setValue(rootSpanIdKey, spanId), ()=>this.getTracerInstance().startActiveSpan(spanName, options, (span)=>{
                const onCleanup = ()=>{
                    rootSpanAttributesStore.delete(spanId);
                };
                if (isRootSpan) {
                    rootSpanAttributesStore.set(spanId, new Map(Object.entries(options.attributes ?? {})));
                }
                try {
                    if (fn.length > 1) {
                        return fn(span, (err)=>closeSpanWithError(span, err));
                    }
                    const result = fn(span);
                    if (isPromise(result)) {
                        result.then(()=>span.end(), (err)=>closeSpanWithError(span, err)).finally(onCleanup);
                    } else {
                        span.end();
                        onCleanup();
                    }
                    return result;
                } catch (err) {
                    closeSpanWithError(span, err);
                    onCleanup();
                    throw err;
                }
            }));
    }
    wrap(...args) {
        const tracer = this;
        const [name, options, fn] = args.length === 3 ? args : [
            args[0],
            {},
            args[1]
        ];
        if (!NextVanillaSpanAllowlist.includes(name) && process.env.NEXT_OTEL_VERBOSE !== "1") {
            return fn;
        }
        return function() {
            let optionsObj = options;
            if (typeof optionsObj === "function" && typeof fn === "function") {
                optionsObj = optionsObj.apply(this, arguments);
            }
            const lastArgId = arguments.length - 1;
            const cb = arguments[lastArgId];
            if (typeof cb === "function") {
                const scopeBoundCb = tracer.getContext().bind(context.active(), cb);
                return tracer.trace(name, optionsObj, (_span, done)=>{
                    arguments[lastArgId] = function(err) {
                        done == null ? void 0 : done(err);
                        return scopeBoundCb.apply(this, arguments);
                    };
                    return fn.apply(this, arguments);
                });
            } else {
                return tracer.trace(name, optionsObj, ()=>fn.apply(this, arguments));
            }
        };
    }
    startSpan(...args) {
        const [type, options] = args;
        const spanContext = this.getSpanContext((options == null ? void 0 : options.parentSpan) ?? this.getActiveScopeSpan());
        return this.getTracerInstance().startSpan(type, options, spanContext);
    }
    getSpanContext(parentSpan) {
        const spanContext = parentSpan ? trace.setSpan(context.active(), parentSpan) : undefined;
        return spanContext;
    }
    getRootSpanAttributes() {
        const spanId = context.active().getValue(rootSpanIdKey);
        return rootSpanAttributesStore.get(spanId);
    }
}
const getTracer = (()=>{
    const tracer = new NextTracerImpl();
    return ()=>tracer;
})();
 //# sourceMappingURL=tracer.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/adapter.js
















class NextRequestHint extends NextRequest {
    constructor(params){
        super(params.input, params.init);
        this.sourcePage = params.page;
    }
    get request() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
    respondWith() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
    waitUntil() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
}
const headersGetter = {
    keys: (headers)=>Array.from(headers.keys()),
    get: (headers, key)=>headers.get(key) ?? undefined
};
let propagator = (request, fn)=>{
    const tracer = getTracer();
    return tracer.withPropagatedContext(request.headers, fn, headersGetter);
};
let testApisIntercepted = false;
function ensureTestApisIntercepted() {
    if (!testApisIntercepted) {
        testApisIntercepted = true;
        if (process.env.NEXT_PRIVATE_TEST_PROXY === "true") {
            const { interceptTestApis, wrapRequestHandler } = __webpack_require__(503);
            interceptTestApis();
            propagator = wrapRequestHandler(propagator);
        }
    }
}
async function adapter(params) {
    ensureTestApisIntercepted();
    await ensureInstrumentationRegistered();
    // TODO-APP: use explicit marker for this
    const isEdgeRendering = typeof self.__BUILD_MANIFEST !== "undefined";
    const prerenderManifest = typeof self.__PRERENDER_MANIFEST === "string" ? JSON.parse(self.__PRERENDER_MANIFEST) : undefined;
    params.request.url = normalizeRscURL(params.request.url);
    const requestUrl = new NextURL(params.request.url, {
        headers: params.request.headers,
        nextConfig: params.request.nextConfig
    });
    // Iterator uses an index to keep track of the current iteration. Because of deleting and appending below we can't just use the iterator.
    // Instead we use the keys before iteration.
    const keys = [
        ...requestUrl.searchParams.keys()
    ];
    for (const key of keys){
        const value = requestUrl.searchParams.getAll(key);
        if (key !== NEXT_QUERY_PARAM_PREFIX && key.startsWith(NEXT_QUERY_PARAM_PREFIX)) {
            const normalizedKey = key.substring(NEXT_QUERY_PARAM_PREFIX.length);
            requestUrl.searchParams.delete(normalizedKey);
            for (const val of value){
                requestUrl.searchParams.append(normalizedKey, val);
            }
            requestUrl.searchParams.delete(key);
        }
    }
    // Ensure users only see page requests, never data requests.
    const buildId = requestUrl.buildId;
    requestUrl.buildId = "";
    const isDataReq = params.request.headers["x-nextjs-data"];
    if (isDataReq && requestUrl.pathname === "/index") {
        requestUrl.pathname = "/";
    }
    const requestHeaders = fromNodeOutgoingHttpHeaders(params.request.headers);
    const flightHeaders = new Map();
    // Parameters should only be stripped for middleware
    if (!isEdgeRendering) {
        for (const param of FLIGHT_PARAMETERS){
            const key = param.toString().toLowerCase();
            const value = requestHeaders.get(key);
            if (value) {
                flightHeaders.set(key, requestHeaders.get(key));
                requestHeaders.delete(key);
            }
        }
    }
    const normalizeUrl =  false ? 0 : requestUrl;
    const request = new NextRequestHint({
        page: params.page,
        // Strip internal query parameters off the request.
        input: stripInternalSearchParams(normalizeUrl, true).toString(),
        init: {
            body: params.request.body,
            geo: params.request.geo,
            headers: requestHeaders,
            ip: params.request.ip,
            method: params.request.method,
            nextConfig: params.request.nextConfig,
            signal: params.request.signal
        }
    });
    /**
   * This allows to identify the request as a data request. The user doesn't
   * need to know about this property neither use it. We add it for testing
   * purposes.
   */ if (isDataReq) {
        Object.defineProperty(request, "__isData", {
            enumerable: false,
            value: true
        });
    }
    if (!globalThis.__incrementalCache && params.IncrementalCache) {
        globalThis.__incrementalCache = new params.IncrementalCache({
            appDir: true,
            fetchCache: true,
            minimalMode: "production" !== "development",
            fetchCacheKeyPrefix: undefined,
            dev: "production" === "development",
            requestHeaders: params.request.headers,
            requestProtocol: "https",
            getPrerenderManifest: ()=>{
                return {
                    version: -1,
                    routes: {},
                    dynamicRoutes: {},
                    notFoundRoutes: [],
                    preview: {
                        previewModeId: "development-id"
                    }
                };
            }
        });
    }
    const event = new NextFetchEvent({
        request,
        page: params.page
    });
    let response;
    let cookiesFromResponse;
    response = await propagator(request, ()=>{
        // we only care to make async storage available for middleware
        const isMiddleware = params.page === "/middleware" || params.page === "/src/middleware";
        if (isMiddleware) {
            return RequestAsyncStorageWrapper.wrap(requestAsyncStorage, {
                req: request,
                renderOpts: {
                    onUpdateCookies: (cookies)=>{
                        cookiesFromResponse = cookies;
                    },
                    // @ts-expect-error: TODO: investigate why previewProps isn't on RenderOpts
                    previewProps: (prerenderManifest == null ? void 0 : prerenderManifest.preview) || {
                        previewModeId: "development-id",
                        previewModeEncryptionKey: "",
                        previewModeSigningKey: ""
                    }
                }
            }, ()=>params.handler(request, event));
        }
        return params.handler(request, event);
    });
    // check if response is a Response object
    if (response && !(response instanceof Response)) {
        throw new TypeError("Expected an instance of Response to be returned");
    }
    if (response && cookiesFromResponse) {
        response.headers.set("set-cookie", cookiesFromResponse);
    }
    /**
   * For rewrites we must always include the locale in the final pathname
   * so we re-create the NextURL forcing it to include it when the it is
   * an internal rewrite. Also we make sure the outgoing rewrite URL is
   * a data URL if the request was a data request.
   */ const rewrite = response == null ? void 0 : response.headers.get("x-middleware-rewrite");
    if (response && rewrite) {
        const rewriteUrl = new NextURL(rewrite, {
            forceLocale: true,
            headers: params.request.headers,
            nextConfig: params.request.nextConfig
        });
        if (true) {
            if (rewriteUrl.host === request.nextUrl.host) {
                rewriteUrl.buildId = buildId || rewriteUrl.buildId;
                response.headers.set("x-middleware-rewrite", String(rewriteUrl));
            }
        }
        /**
     * When the request is a data request we must show if there was a rewrite
     * with an internal header so the client knows which component to load
     * from the data request.
     */ const relativizedRewrite = relativizeURL(String(rewriteUrl), String(requestUrl));
        if (isDataReq && // if the rewrite is external and external rewrite
        // resolving config is enabled don't add this header
        // so the upstream app can set it instead
        !(undefined && 0)) {
            response.headers.set("x-nextjs-rewrite", relativizedRewrite);
        }
    }
    /**
   * For redirects we will not include the locale in case when it is the
   * default and we must also make sure the outgoing URL is a data one if
   * the incoming request was a data request.
   */ const redirect = response == null ? void 0 : response.headers.get("Location");
    if (response && redirect && !isEdgeRendering) {
        const redirectURL = new NextURL(redirect, {
            forceLocale: false,
            headers: params.request.headers,
            nextConfig: params.request.nextConfig
        });
        /**
     * Responses created from redirects have immutable headers so we have
     * to clone the response to be able to modify it.
     */ response = new Response(response.body, response);
        if (true) {
            if (redirectURL.host === request.nextUrl.host) {
                redirectURL.buildId = buildId || redirectURL.buildId;
                response.headers.set("Location", String(redirectURL));
            }
        }
        /**
     * When the request is a data request we can't use the location header as
     * it may end up with CORS error. Instead we map to an internal header so
     * the client knows the destination.
     */ if (isDataReq) {
            response.headers.delete("Location");
            response.headers.set("x-nextjs-redirect", relativizeURL(String(redirectURL), String(requestUrl)));
        }
    }
    const finalResponse = response ? response : NextResponse.next();
    // Flight headers are not overridable / removable so they are applied at the end.
    const middlewareOverrideHeaders = finalResponse.headers.get("x-middleware-override-headers");
    const overwrittenHeaders = [];
    if (middlewareOverrideHeaders) {
        for (const [key, value] of flightHeaders){
            finalResponse.headers.set(`x-middleware-request-${key}`, value);
            overwrittenHeaders.push(key);
        }
        if (overwrittenHeaders.length > 0) {
            finalResponse.headers.set("x-middleware-override-headers", middlewareOverrideHeaders + "," + overwrittenHeaders.join(","));
        }
    }
    return {
        response: finalResponse,
        waitUntil: Promise.all(event[waitUntilSymbol]),
        fetchMetrics: request.fetchMetrics
    };
} //# sourceMappingURL=adapter.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/debug-build.js
/**
 * This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
 *
 * ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
 */ const debug_build_DEBUG_BUILD = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
 //# sourceMappingURL=debug-build.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/worldwide.js
/** Internal global with common properties and Sentry extensions  */ // The code below for 'isGlobalObj' and 'GLOBAL_OBJ' was copied from core-js before modification
// https://github.com/zloirock/core-js/blob/1b944df55282cdc99c90db5f49eb0b6eda2cc0a3/packages/core-js/internals/global.js
// core-js has the following licence:
//
// Copyright (c) 2014-2022 Denis Pushkarev
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/** Returns 'obj' if it's the global object, otherwise returns undefined */ function isGlobalObj(obj) {
    return obj && obj.Math == Math ? obj : undefined;
}
/** Get's the global object for the current JavaScript runtime */ const worldwide_GLOBAL_OBJ = typeof globalThis == "object" && isGlobalObj(globalThis) || // eslint-disable-next-line no-restricted-globals
 false && 0 || typeof self == "object" && isGlobalObj(self) || typeof __webpack_require__.g == "object" && isGlobalObj(__webpack_require__.g) || function() {
    return this;
}() || {};
/**
 * @deprecated Use GLOBAL_OBJ instead or WINDOW from @sentry/browser. This will be removed in v8
 */ function getGlobalObject() {
    return worldwide_GLOBAL_OBJ;
}
/**
 * Returns a global singleton contained in the global `__SENTRY__` object.
 *
 * If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
 * function and added to the `__SENTRY__` object.
 *
 * @param name name of the global singleton on __SENTRY__
 * @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
 * @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `GLOBAL_OBJ`'s return value
 * @returns the singleton
 */ function getGlobalSingleton(name, creator, obj) {
    const gbl = obj || worldwide_GLOBAL_OBJ;
    const __SENTRY__ = gbl.__SENTRY__ = gbl.__SENTRY__ || {};
    const singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
    return singleton;
}
 //# sourceMappingURL=worldwide.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/logger.js


/** Prefix for logging strings */ const PREFIX = "Sentry Logger ";
const CONSOLE_LEVELS = [
    "debug",
    "info",
    "warn",
    "error",
    "log",
    "assert",
    "trace"
];
/** This may be mutated by the console instrumentation. */ const originalConsoleMethods = {};
/** JSDoc */ /**
 * Temporarily disable sentry console instrumentations.
 *
 * @param callback The function to run against the original `console` messages
 * @returns The results of the callback
 */ function consoleSandbox(callback) {
    if (!("console" in worldwide_GLOBAL_OBJ)) {
        return callback();
    }
    const console = worldwide_GLOBAL_OBJ.console;
    const wrappedFuncs = {};
    const wrappedLevels = Object.keys(originalConsoleMethods);
    // Restore all wrapped console methods
    wrappedLevels.forEach((level)=>{
        const originalConsoleMethod = originalConsoleMethods[level];
        wrappedFuncs[level] = console[level];
        console[level] = originalConsoleMethod;
    });
    try {
        return callback();
    } finally{
        // Revert restoration to wrapped state
        wrappedLevels.forEach((level)=>{
            console[level] = wrappedFuncs[level];
        });
    }
}
function makeLogger() {
    let enabled = false;
    const logger = {
        enable: ()=>{
            enabled = true;
        },
        disable: ()=>{
            enabled = false;
        },
        isEnabled: ()=>enabled
    };
    if (debug_build_DEBUG_BUILD) {
        CONSOLE_LEVELS.forEach((name)=>{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            logger[name] = (...args)=>{
                if (enabled) {
                    consoleSandbox(()=>{
                        worldwide_GLOBAL_OBJ.console[name](`${PREFIX}[${name}]:`, ...args);
                    });
                }
            };
        });
    } else {
        CONSOLE_LEVELS.forEach((name)=>{
            logger[name] = ()=>undefined;
        });
    }
    return logger;
}
const logger_logger = makeLogger();
 //# sourceMappingURL=logger.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/debug-build.js
/**
 * This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
 *
 * ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
 */ const esm_debug_build_DEBUG_BUILD = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
 //# sourceMappingURL=debug-build.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/is.js
// eslint-disable-next-line @typescript-eslint/unbound-method
const objectToString = Object.prototype.toString;
/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isError(wat) {
    switch(objectToString.call(wat)){
        case "[object Error]":
        case "[object Exception]":
        case "[object DOMException]":
            return true;
        default:
            return isInstanceOf(wat, Error);
    }
}
/**
 * Checks whether given value is an instance of the given built-in class.
 *
 * @param wat The value to be checked
 * @param className
 * @returns A boolean representing the result.
 */ function isBuiltin(wat, className) {
    return objectToString.call(wat) === `[object ${className}]`;
}
/**
 * Checks whether given value's type is ErrorEvent
 * {@link isErrorEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isErrorEvent(wat) {
    return isBuiltin(wat, "ErrorEvent");
}
/**
 * Checks whether given value's type is DOMError
 * {@link isDOMError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isDOMError(wat) {
    return isBuiltin(wat, "DOMError");
}
/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isDOMException(wat) {
    return isBuiltin(wat, "DOMException");
}
/**
 * Checks whether given value's type is a string
 * {@link isString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isString(wat) {
    return isBuiltin(wat, "String");
}
/**
 * Checks whether given string is parameterized
 * {@link isParameterizedString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isParameterizedString(wat) {
    return typeof wat === "object" && wat !== null && "__sentry_template_string__" in wat && "__sentry_template_values__" in wat;
}
/**
 * Checks whether given value is a primitive (undefined, null, number, boolean, string, bigint, symbol)
 * {@link isPrimitive}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function is_isPrimitive(wat) {
    return wat === null || isParameterizedString(wat) || typeof wat !== "object" && typeof wat !== "function";
}
/**
 * Checks whether given value's type is an object literal, or a class instance.
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isPlainObject(wat) {
    return isBuiltin(wat, "Object");
}
/**
 * Checks whether given value's type is an Event instance
 * {@link isEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isEvent(wat) {
    return typeof Event !== "undefined" && isInstanceOf(wat, Event);
}
/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isElement(wat) {
    return typeof Element !== "undefined" && isInstanceOf(wat, Element);
}
/**
 * Checks whether given value's type is an regexp
 * {@link isRegExp}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isRegExp(wat) {
    return isBuiltin(wat, "RegExp");
}
/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */ function is_isThenable(wat) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Boolean(wat && wat.then && typeof wat.then === "function");
}
/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isSyntheticEvent(wat) {
    return isPlainObject(wat) && "nativeEvent" in wat && "preventDefault" in wat && "stopPropagation" in wat;
}
/**
 * Checks whether given value is NaN
 * {@link isNaN}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function is_isNaN(wat) {
    return typeof wat === "number" && wat !== wat;
}
/**
 * Checks whether given value's type is an instance of provided constructor.
 * {@link isInstanceOf}.
 *
 * @param wat A value to be checked.
 * @param base A constructor to be used in a check.
 * @returns A boolean representing the result.
 */ function isInstanceOf(wat, base) {
    try {
        return wat instanceof base;
    } catch (_e) {
        return false;
    }
}
/**
 * Checks whether given value's type is a Vue ViewModel.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function is_isVueViewModel(wat) {
    // Not using Object.prototype.toString because in Vue 3 it would read the instance's Symbol(Symbol.toStringTag) property.
    return !!(typeof wat === "object" && wat !== null && (wat.__isVue || wat._isVue));
}
 //# sourceMappingURL=is.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/browser.js


// eslint-disable-next-line deprecation/deprecation
const WINDOW = getGlobalObject();
const DEFAULT_MAX_STRING_LENGTH = 80;
/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @returns generated DOM path
 */ function htmlTreeAsString(elem, options = {}) {
    if (!elem) {
        return "<unknown>";
    }
    // try/catch both:
    // - accessing event.target (see getsentry/raven-js#838, #768)
    // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
    // - can throw an exception in some circumstances.
    try {
        let currentElem = elem;
        const MAX_TRAVERSE_HEIGHT = 5;
        const out = [];
        let height = 0;
        let len = 0;
        const separator = " > ";
        const sepLength = separator.length;
        let nextStr;
        const keyAttrs = Array.isArray(options) ? options : options.keyAttrs;
        const maxStringLength = !Array.isArray(options) && options.maxStringLength || DEFAULT_MAX_STRING_LENGTH;
        while(currentElem && height++ < MAX_TRAVERSE_HEIGHT){
            nextStr = _htmlElementAsString(currentElem, keyAttrs);
            // bail out if
            // - nextStr is the 'html' element
            // - the length of the string that would be created exceeds maxStringLength
            //   (ignore this limit if we are on the first iteration)
            if (nextStr === "html" || height > 1 && len + out.length * sepLength + nextStr.length >= maxStringLength) {
                break;
            }
            out.push(nextStr);
            len += nextStr.length;
            currentElem = currentElem.parentNode;
        }
        return out.reverse().join(separator);
    } catch (_oO) {
        return "<unknown>";
    }
}
/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @returns generated DOM path
 */ function _htmlElementAsString(el, keyAttrs) {
    const elem = el;
    const out = [];
    let className;
    let classes;
    let key;
    let attr;
    let i;
    if (!elem || !elem.tagName) {
        return "";
    }
    // @ts-expect-error WINDOW has HTMLElement
    if (WINDOW.HTMLElement) {
        // If using the component name annotation plugin, this value may be available on the DOM node
        if (elem instanceof HTMLElement && elem.dataset && elem.dataset["sentryComponent"]) {
            return elem.dataset["sentryComponent"];
        }
    }
    out.push(elem.tagName.toLowerCase());
    // Pairs of attribute keys defined in `serializeAttribute` and their values on element.
    const keyAttrPairs = keyAttrs && keyAttrs.length ? keyAttrs.filter((keyAttr)=>elem.getAttribute(keyAttr)).map((keyAttr)=>[
            keyAttr,
            elem.getAttribute(keyAttr)
        ]) : null;
    if (keyAttrPairs && keyAttrPairs.length) {
        keyAttrPairs.forEach((keyAttrPair)=>{
            out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
        });
    } else {
        if (elem.id) {
            out.push(`#${elem.id}`);
        }
        // eslint-disable-next-line prefer-const
        className = elem.className;
        if (className && isString(className)) {
            classes = className.split(/\s+/);
            for(i = 0; i < classes.length; i++){
                out.push(`.${classes[i]}`);
            }
        }
    }
    const allowedAttrs = [
        "aria-label",
        "type",
        "name",
        "title",
        "alt"
    ];
    for(i = 0; i < allowedAttrs.length; i++){
        key = allowedAttrs[i];
        attr = elem.getAttribute(key);
        if (attr) {
            out.push(`[${key}="${attr}"]`);
        }
    }
    return out.join("");
}
/**
 * A safe form of location.href
 */ function getLocationHref() {
    try {
        return WINDOW.document.location.href;
    } catch (oO) {
        return "";
    }
}
/**
 * Gets a DOM element by using document.querySelector.
 *
 * This wrapper will first check for the existance of the function before
 * actually calling it so that we don't have to take care of this check,
 * every time we want to access the DOM.
 *
 * Reason: DOM/querySelector is not available in all environments.
 *
 * We have to cast to any because utils can be consumed by a variety of environments,
 * and we don't want to break TS users. If you know what element will be selected by
 * `document.querySelector`, specify it as part of the generic call. For example,
 * `const element = getDomElement<Element>('selector');`
 *
 * @param selector the selector string passed on to document.querySelector
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDomElement(selector) {
    if (WINDOW.document && WINDOW.document.querySelector) {
        return WINDOW.document.querySelector(selector);
    }
    return null;
}
/**
 * Given a DOM element, traverses up the tree until it finds the first ancestor node
 * that has the `data-sentry-component` attribute. This attribute is added at build-time
 * by projects that have the component name annotation plugin installed.
 *
 * @returns a string representation of the component for the provided DOM element, or `null` if not found
 */ function getComponentName(elem) {
    // @ts-expect-error WINDOW has HTMLElement
    if (!WINDOW.HTMLElement) {
        return null;
    }
    let currentElem = elem;
    const MAX_TRAVERSE_HEIGHT = 5;
    for(let i = 0; i < MAX_TRAVERSE_HEIGHT; i++){
        if (!currentElem) {
            return null;
        }
        if (currentElem instanceof HTMLElement && currentElem.dataset["sentryComponent"]) {
            return currentElem.dataset["sentryComponent"];
        }
        currentElem = currentElem.parentNode;
    }
    return null;
}
 //# sourceMappingURL=browser.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/string.js

/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string (0 = unlimited)
 * @returns string Encoded
 */ function truncate(str, max = 0) {
    if (typeof str !== "string" || max === 0) {
        return str;
    }
    return str.length <= max ? str : `${str.slice(0, max)}...`;
}
/**
 * This is basically just `trim_line` from
 * https://github.com/getsentry/sentry/blob/master/src/sentry/lang/javascript/processor.py#L67
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */ function string_snipLine(line, colno) {
    let newLine = line;
    const lineLength = newLine.length;
    if (lineLength <= 150) {
        return newLine;
    }
    if (colno > lineLength) {
        // eslint-disable-next-line no-param-reassign
        colno = lineLength;
    }
    let start = Math.max(colno - 60, 0);
    if (start < 5) {
        start = 0;
    }
    let end = Math.min(start + 140, lineLength);
    if (end > lineLength - 5) {
        end = lineLength;
    }
    if (end === lineLength) {
        start = Math.max(end - 140, 0);
    }
    newLine = newLine.slice(start, end);
    if (start > 0) {
        newLine = `'{snip} ${newLine}`;
    }
    if (end < lineLength) {
        newLine += " {snip}";
    }
    return newLine;
}
/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeJoin(input, delimiter) {
    if (!Array.isArray(input)) {
        return "";
    }
    const output = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i = 0; i < input.length; i++){
        const value = input[i];
        try {
            // This is a hack to fix a Vue3-specific bug that causes an infinite loop of
            // console warnings. This happens when a Vue template is rendered with
            // an undeclared variable, which we try to stringify, ultimately causing
            // Vue to issue another warning which repeats indefinitely.
            // see: https://github.com/getsentry/sentry-javascript/pull/8981
            if (isVueViewModel(value)) {
                output.push("[VueViewModel]");
            } else {
                output.push(String(value));
            }
        } catch (e) {
            output.push("[value cannot be serialized]");
        }
    }
    return output.join(delimiter);
}
/**
 * Checks if the given value matches a regex or string
 *
 * @param value The string to test
 * @param pattern Either a regex or a string against which `value` will be matched
 * @param requireExactStringMatch If true, `value` must match `pattern` exactly. If false, `value` will match
 * `pattern` if it contains `pattern`. Only applies to string-type patterns.
 */ function isMatchingPattern(value, pattern, requireExactStringMatch = false) {
    if (!isString(value)) {
        return false;
    }
    if (isRegExp(pattern)) {
        return pattern.test(value);
    }
    if (isString(pattern)) {
        return requireExactStringMatch ? value === pattern : value.includes(pattern);
    }
    return false;
}
/**
 * Test the given string against an array of strings and regexes. By default, string matching is done on a
 * substring-inclusion basis rather than a strict equality basis
 *
 * @param testString The string to test
 * @param patterns The patterns against which to test the string
 * @param requireExactStringMatch If true, `testString` must match one of the given string patterns exactly in order to
 * count. If false, `testString` will match a string pattern if it contains that pattern.
 * @returns
 */ function stringMatchesSomePattern(testString, patterns = [], requireExactStringMatch = false) {
    return patterns.some((pattern)=>isMatchingPattern(testString, pattern, requireExactStringMatch));
}
 //# sourceMappingURL=string.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/object.js





/**
 * Replace a method in an object with a wrapped version of itself.
 *
 * @param source An object that contains a method to be wrapped.
 * @param name The name of the method to be wrapped.
 * @param replacementFactory A higher-order function that takes the original version of the given method and returns a
 * wrapped version. Note: The function returned by `replacementFactory` needs to be a non-arrow function, in order to
 * preserve the correct value of `this`, and the original method must be called using `origMethod.call(this, <other
 * args>)` or `origMethod.apply(this, [<other args>])` (rather than being called directly), again to preserve `this`.
 * @returns void
 */ function object_fill(source, name, replacementFactory) {
    if (!(name in source)) {
        return;
    }
    const original = source[name];
    const wrapped = replacementFactory(original);
    // Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
    // otherwise it'll throw "TypeError: Object.defineProperties called on non-object"
    if (typeof wrapped === "function") {
        markFunctionWrapped(wrapped, original);
    }
    source[name] = wrapped;
}
/**
 * Defines a non-enumerable property on the given object.
 *
 * @param obj The object on which to set the property
 * @param name The name of the property to be set
 * @param value The value to which to set the property
 */ function addNonEnumerableProperty(obj, name, value) {
    try {
        Object.defineProperty(obj, name, {
            // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
            value: value,
            writable: true,
            configurable: true
        });
    } catch (o_O) {
        debug_build_DEBUG_BUILD && logger_logger.log(`Failed to add non-enumerable property "${name}" to object`, obj);
    }
}
/**
 * Remembers the original function on the wrapped function and
 * patches up the prototype.
 *
 * @param wrapped the wrapper function
 * @param original the original function that gets wrapped
 */ function markFunctionWrapped(wrapped, original) {
    try {
        const proto = original.prototype || {};
        wrapped.prototype = original.prototype = proto;
        addNonEnumerableProperty(wrapped, "__sentry_original__", original);
    } catch (o_O) {} // eslint-disable-line no-empty
}
/**
 * This extracts the original function if available.  See
 * `markFunctionWrapped` for more information.
 *
 * @param func the function to unwrap
 * @returns the unwrapped version of the function if available.
 */ function getOriginalFunction(func) {
    return func.__sentry_original__;
}
/**
 * Encodes given object into url-friendly format
 *
 * @param object An object that contains serializable values
 * @returns string Encoded
 */ function urlEncode(object) {
    return Object.keys(object).map((key)=>`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join("&");
}
/**
 * Transforms any `Error` or `Event` into a plain object with all of their enumerable properties, and some of their
 * non-enumerable properties attached.
 *
 * @param value Initial source that we have to transform in order for it to be usable by the serializer
 * @returns An Event or Error turned into an object - or the value argurment itself, when value is neither an Event nor
 *  an Error.
 */ function convertToPlainObject(value) {
    if (isError(value)) {
        return {
            message: value.message,
            name: value.name,
            stack: value.stack,
            ...getOwnProperties(value)
        };
    } else if (isEvent(value)) {
        const newObj = {
            type: value.type,
            target: serializeEventTarget(value.target),
            currentTarget: serializeEventTarget(value.currentTarget),
            ...getOwnProperties(value)
        };
        if (typeof CustomEvent !== "undefined" && isInstanceOf(value, CustomEvent)) {
            newObj.detail = value.detail;
        }
        return newObj;
    } else {
        return value;
    }
}
/** Creates a string representation of the target of an `Event` object */ function serializeEventTarget(target) {
    try {
        return isElement(target) ? htmlTreeAsString(target) : Object.prototype.toString.call(target);
    } catch (_oO) {
        return "<unknown>";
    }
}
/** Filters out all but an object's own properties */ function getOwnProperties(obj) {
    if (typeof obj === "object" && obj !== null) {
        const extractedProps = {};
        for(const property in obj){
            if (Object.prototype.hasOwnProperty.call(obj, property)) {
                extractedProps[property] = obj[property];
            }
        }
        return extractedProps;
    } else {
        return {};
    }
}
/**
 * Given any captured exception, extract its keys and create a sorted
 * and truncated list that will be used inside the event message.
 * eg. `Non-error exception captured with keys: foo, bar, baz`
 */ function extractExceptionKeysForMessage(exception, maxLength = 40) {
    const keys = Object.keys(convertToPlainObject(exception));
    keys.sort();
    if (!keys.length) {
        return "[object has no keys]";
    }
    if (keys[0].length >= maxLength) {
        return truncate(keys[0], maxLength);
    }
    for(let includedKeys = keys.length; includedKeys > 0; includedKeys--){
        const serialized = keys.slice(0, includedKeys).join(", ");
        if (serialized.length > maxLength) {
            continue;
        }
        if (includedKeys === keys.length) {
            return serialized;
        }
        return truncate(serialized, maxLength);
    }
    return "";
}
/**
 * Given any object, return a new object having removed all fields whose value was `undefined`.
 * Works recursively on objects and arrays.
 *
 * Attention: This function keeps circular references in the returned object.
 */ function dropUndefinedKeys(inputValue) {
    // This map keeps track of what already visited nodes map to.
    // Our Set - based memoBuilder doesn't work here because we want to the output object to have the same circular
    // references as the input object.
    const memoizationMap = new Map();
    // This function just proxies `_dropUndefinedKeys` to keep the `memoBuilder` out of this function's API
    return _dropUndefinedKeys(inputValue, memoizationMap);
}
function _dropUndefinedKeys(inputValue, memoizationMap) {
    if (isPojo(inputValue)) {
        // If this node has already been visited due to a circular reference, return the object it was mapped to in the new object
        const memoVal = memoizationMap.get(inputValue);
        if (memoVal !== undefined) {
            return memoVal;
        }
        const returnValue = {};
        // Store the mapping of this value in case we visit it again, in case of circular data
        memoizationMap.set(inputValue, returnValue);
        for (const key of Object.keys(inputValue)){
            if (typeof inputValue[key] !== "undefined") {
                returnValue[key] = _dropUndefinedKeys(inputValue[key], memoizationMap);
            }
        }
        return returnValue;
    }
    if (Array.isArray(inputValue)) {
        // If this node has already been visited due to a circular reference, return the array it was mapped to in the new object
        const memoVal = memoizationMap.get(inputValue);
        if (memoVal !== undefined) {
            return memoVal;
        }
        const returnValue = [];
        // Store the mapping of this value in case we visit it again, in case of circular data
        memoizationMap.set(inputValue, returnValue);
        inputValue.forEach((item)=>{
            returnValue.push(_dropUndefinedKeys(item, memoizationMap));
        });
        return returnValue;
    }
    return inputValue;
}
function isPojo(input) {
    if (!isPlainObject(input)) {
        return false;
    }
    try {
        const name = Object.getPrototypeOf(input).constructor.name;
        return !name || name === "Object";
    } catch (e) {
        return true;
    }
}
/**
 * Ensure that something is an object.
 *
 * Turns `undefined` and `null` into `String`s and all other primitives into instances of their respective wrapper
 * classes (String, Boolean, Number, etc.). Acts as the identity function on non-primitives.
 *
 * @param wat The subject of the objectification
 * @returns A version of `wat` which can safely be used with `Object` class methods
 */ function objectify(wat) {
    let objectified;
    switch(true){
        case wat === undefined || wat === null:
            objectified = new String(wat);
            break;
        // Though symbols and bigints do have wrapper classes (`Symbol` and `BigInt`, respectively), for whatever reason
        // those classes don't have constructors which can be used with the `new` keyword. We therefore need to cast each as
        // an object in order to wrap it.
        case typeof wat === "symbol" || typeof wat === "bigint":
            objectified = Object(wat);
            break;
        // this will catch the remaining primitives: `String`, `Number`, and `Boolean`
        case isPrimitive(wat):
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            objectified = new wat.constructor(wat);
            break;
        // by process of elimination, at this point we know that `wat` must already be an object
        default:
            objectified = wat;
            break;
    }
    return objectified;
}
 //# sourceMappingURL=object.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/misc.js



/**
 * UUID4 generator
 *
 * @returns string Generated UUID4.
 */ function misc_uuid4() {
    const gbl = worldwide_GLOBAL_OBJ;
    const crypto = gbl.crypto || gbl.msCrypto;
    let getRandomByte = ()=>Math.random() * 16;
    try {
        if (crypto && crypto.randomUUID) {
            return crypto.randomUUID().replace(/-/g, "");
        }
        if (crypto && crypto.getRandomValues) {
            getRandomByte = ()=>{
                // crypto.getRandomValues might return undefined instead of the typed array
                // in old Chromium versions (e.g. 23.0.1235.0 (151422))
                // However, `typedArray` is still filled in-place.
                // @see https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues#typedarray
                const typedArray = new Uint8Array(1);
                crypto.getRandomValues(typedArray);
                return typedArray[0];
            };
        }
    } catch (_) {
    // some runtimes can crash invoking crypto
    // https://github.com/getsentry/sentry-javascript/issues/8935
    }
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    // Concatenating the following numbers as strings results in '10000000100040008000100000000000'
    return ([
        1e7
    ] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, (c)=>// eslint-disable-next-line no-bitwise
        (c ^ (getRandomByte() & 15) >> c / 4).toString(16));
}
function getFirstException(event) {
    return event.exception && event.exception.values ? event.exception.values[0] : undefined;
}
/**
 * Extracts either message or type+value from an event that can be used for user-facing logs
 * @returns event's description
 */ function getEventDescription(event) {
    const { message, event_id: eventId } = event;
    if (message) {
        return message;
    }
    const firstException = getFirstException(event);
    if (firstException) {
        if (firstException.type && firstException.value) {
            return `${firstException.type}: ${firstException.value}`;
        }
        return firstException.type || firstException.value || eventId || "<unknown>";
    }
    return eventId || "<unknown>";
}
/**
 * Adds exception values, type and value to an synthetic Exception.
 * @param event The event to modify.
 * @param value Value of the exception.
 * @param type Type of the exception.
 * @hidden
 */ function addExceptionTypeValue(event, value, type) {
    const exception = event.exception = event.exception || {};
    const values = exception.values = exception.values || [];
    const firstException = values[0] = values[0] || {};
    if (!firstException.value) {
        firstException.value = value || "";
    }
    if (!firstException.type) {
        firstException.type = type || "Error";
    }
}
/**
 * Adds exception mechanism data to a given event. Uses defaults if the second parameter is not passed.
 *
 * @param event The event to modify.
 * @param newMechanism Mechanism data to add to the event.
 * @hidden
 */ function addExceptionMechanism(event, newMechanism) {
    const firstException = getFirstException(event);
    if (!firstException) {
        return;
    }
    const defaultMechanism = {
        type: "generic",
        handled: true
    };
    const currentMechanism = firstException.mechanism;
    firstException.mechanism = {
        ...defaultMechanism,
        ...currentMechanism,
        ...newMechanism
    };
    if (newMechanism && "data" in newMechanism) {
        const mergedData = {
            ...currentMechanism && currentMechanism.data,
            ...newMechanism.data
        };
        firstException.mechanism.data = mergedData;
    }
}
// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const SEMVER_REGEXP = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
/**
 * Represents Semantic Versioning object
 */ /**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */ function parseSemver(input) {
    const match = input.match(SEMVER_REGEXP) || [];
    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10);
    const patch = parseInt(match[3], 10);
    return {
        buildmetadata: match[5],
        major: isNaN(major) ? undefined : major,
        minor: isNaN(minor) ? undefined : minor,
        patch: isNaN(patch) ? undefined : patch,
        prerelease: match[4]
    };
}
/**
 * This function adds context (pre/post/line) lines to the provided frame
 *
 * @param lines string[] containing all lines
 * @param frame StackFrame that will be mutated
 * @param linesOfContext number of context lines we want to add pre/post
 */ function addContextToFrame(lines, frame, linesOfContext = 5) {
    // When there is no line number in the frame, attaching context is nonsensical and will even break grouping
    if (frame.lineno === undefined) {
        return;
    }
    const maxLines = lines.length;
    const sourceLine = Math.max(Math.min(maxLines - 1, frame.lineno - 1), 0);
    frame.pre_context = lines.slice(Math.max(0, sourceLine - linesOfContext), sourceLine).map((line)=>snipLine(line, 0));
    frame.context_line = snipLine(lines[Math.min(maxLines - 1, sourceLine)], frame.colno || 0);
    frame.post_context = lines.slice(Math.min(sourceLine + 1, maxLines), sourceLine + 1 + linesOfContext).map((line)=>snipLine(line, 0));
}
/**
 * Checks whether or not we've already captured the given exception (note: not an identical exception - the very object
 * in question), and marks it captured if not.
 *
 * This is useful because it's possible for an error to get captured by more than one mechanism. After we intercept and
 * record an error, we rethrow it (assuming we've intercepted it before it's reached the top-level global handlers), so
 * that we don't interfere with whatever effects the error might have had were the SDK not there. At that point, because
 * the error has been rethrown, it's possible for it to bubble up to some other code we've instrumented. If it's not
 * caught after that, it will bubble all the way up to the global handlers (which of course we also instrument). This
 * function helps us ensure that even if we encounter the same error more than once, we only record it the first time we
 * see it.
 *
 * Note: It will ignore primitives (always return `false` and not mark them as seen), as properties can't be set on
 * them. {@link: Object.objectify} can be used on exceptions to convert any that are primitives into their equivalent
 * object wrapper forms so that this check will always work. However, because we need to flag the exact object which
 * will get rethrown, and because that rethrowing happens outside of the event processing pipeline, the objectification
 * must be done before the exception captured.
 *
 * @param A thrown exception to check or flag as having been seen
 * @returns `true` if the exception has already been captured, `false` if not (with the side effect of marking it seen)
 */ function checkOrSetAlreadyCaught(exception) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (exception && exception.__sentry_captured__) {
        return true;
    }
    try {
        // set it this way rather than by assignment so that it's not ennumerable and therefore isn't recorded by the
        // `ExtraErrorData` integration
        addNonEnumerableProperty(exception, "__sentry_captured__", true);
    } catch (err) {
    // `exception` is a primitive, so we can't mark it seen
    }
    return false;
}
/**
 * Checks whether the given input is already an array, and if it isn't, wraps it in one.
 *
 * @param maybeArray Input to turn into an array, if necessary
 * @returns The input, if already an array, or an array with the input as the only element, if not
 */ function arrayify(maybeArray) {
    return Array.isArray(maybeArray) ? maybeArray : [
        maybeArray
    ];
}
 //# sourceMappingURL=misc.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/time.js

const ONE_SECOND_IN_MS = 1000;
/**
 * A partial definition of the [Performance Web API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance}
 * for accessing a high-resolution monotonic clock.
 */ /**
 * Returns a timestamp in seconds since the UNIX epoch using the Date API.
 *
 * TODO(v8): Return type should be rounded.
 */ function dateTimestampInSeconds() {
    return Date.now() / ONE_SECOND_IN_MS;
}
/**
 * Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
 * support the API.
 *
 * Wrapping the native API works around differences in behavior from different browsers.
 */ function createUnixTimestampInSecondsFunc() {
    const { performance } = worldwide_GLOBAL_OBJ;
    if (!performance || !performance.now) {
        return dateTimestampInSeconds;
    }
    // Some browser and environments don't have a timeOrigin, so we fallback to
    // using Date.now() to compute the starting time.
    const approxStartingTimeOrigin = Date.now() - performance.now();
    const timeOrigin = performance.timeOrigin == undefined ? approxStartingTimeOrigin : performance.timeOrigin;
    // performance.now() is a monotonic clock, which means it starts at 0 when the process begins. To get the current
    // wall clock time (actual UNIX timestamp), we need to add the starting time origin and the current time elapsed.
    //
    // TODO: This does not account for the case where the monotonic clock that powers performance.now() drifts from the
    // wall clock time, which causes the returned timestamp to be inaccurate. We should investigate how to detect and
    // correct for this.
    // See: https://github.com/getsentry/sentry-javascript/issues/2590
    // See: https://github.com/mdn/content/issues/4713
    // See: https://dev.to/noamr/when-a-millisecond-is-not-a-millisecond-3h6
    return ()=>{
        return (timeOrigin + performance.now()) / ONE_SECOND_IN_MS;
    };
}
/**
 * Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
 * availability of the Performance API.
 *
 * BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
 * asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
 * skew can grow to arbitrary amounts like days, weeks or months.
 * See https://github.com/getsentry/sentry-javascript/issues/2590.
 */ const time_timestampInSeconds = createUnixTimestampInSecondsFunc();
/**
 * Re-exported with an old name for backwards-compatibility.
 * TODO (v8): Remove this
 *
 * @deprecated Use `timestampInSeconds` instead.
 */ const timestampWithMs = (/* unused pure expression or super */ null && (time_timestampInSeconds));
/**
 * Internal helper to store what is the source of browserPerformanceTimeOrigin below. For debugging only.
 */ let _browserPerformanceTimeOriginMode;
/**
 * The number of milliseconds since the UNIX epoch. This value is only usable in a browser, and only when the
 * performance API is available.
 */ const browserPerformanceTimeOrigin = (()=>{
    // Unfortunately browsers may report an inaccurate time origin data, through either performance.timeOrigin or
    // performance.timing.navigationStart, which results in poor results in performance data. We only treat time origin
    // data as reliable if they are within a reasonable threshold of the current time.
    const { performance } = worldwide_GLOBAL_OBJ;
    if (!performance || !performance.now) {
        _browserPerformanceTimeOriginMode = "none";
        return undefined;
    }
    const threshold = 3600 * 1000;
    const performanceNow = performance.now();
    const dateNow = Date.now();
    // if timeOrigin isn't available set delta to threshold so it isn't used
    const timeOriginDelta = performance.timeOrigin ? Math.abs(performance.timeOrigin + performanceNow - dateNow) : threshold;
    const timeOriginIsReliable = timeOriginDelta < threshold;
    // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
    // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
    // Also as of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always
    // a valid fallback. In the absence of an initial time provided by the browser, fallback to the current time from the
    // Date API.
    // eslint-disable-next-line deprecation/deprecation
    const navigationStart = performance.timing && performance.timing.navigationStart;
    const hasNavigationStart = typeof navigationStart === "number";
    // if navigationStart isn't available set delta to threshold so it isn't used
    const navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
    const navigationStartIsReliable = navigationStartDelta < threshold;
    if (timeOriginIsReliable || navigationStartIsReliable) {
        // Use the more reliable time origin
        if (timeOriginDelta <= navigationStartDelta) {
            _browserPerformanceTimeOriginMode = "timeOrigin";
            return performance.timeOrigin;
        } else {
            _browserPerformanceTimeOriginMode = "navigationStart";
            return navigationStart;
        }
    }
    // Either both timeOrigin and navigationStart are skewed or neither is available, fallback to Date.
    _browserPerformanceTimeOriginMode = "dateNow";
    return dateNow;
})();
 //# sourceMappingURL=time.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/constants.js
const constants_DEFAULT_ENVIRONMENT = "production";
 //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/syncpromise.js

/* eslint-disable @typescript-eslint/explicit-function-return-type */ /** SyncPromise internal states */ var States;
(function(States) {
    /** Pending */ const PENDING = 0;
    States[States["PENDING"] = PENDING] = "PENDING";
    /** Resolved / OK */ const RESOLVED = 1;
    States[States["RESOLVED"] = RESOLVED] = "RESOLVED";
    /** Rejected / Error */ const REJECTED = 2;
    States[States["REJECTED"] = REJECTED] = "REJECTED";
})(States || (States = {}));
// Overloads so we can call resolvedSyncPromise without arguments and generic argument
/**
 * Creates a resolved sync promise.
 *
 * @param value the value to resolve the promise with
 * @returns the resolved sync promise
 */ function resolvedSyncPromise(value) {
    return new SyncPromise((resolve)=>{
        resolve(value);
    });
}
/**
 * Creates a rejected sync promise.
 *
 * @param value the value to reject the promise with
 * @returns the rejected sync promise
 */ function rejectedSyncPromise(reason) {
    return new SyncPromise((_, reject)=>{
        reject(reason);
    });
}
/**
 * Thenable class that behaves like a Promise and follows it's interface
 * but is not async internally
 */ class SyncPromise {
    constructor(executor){
        SyncPromise.prototype.__init.call(this);
        SyncPromise.prototype.__init2.call(this);
        SyncPromise.prototype.__init3.call(this);
        SyncPromise.prototype.__init4.call(this);
        this._state = States.PENDING;
        this._handlers = [];
        try {
            executor(this._resolve, this._reject);
        } catch (e) {
            this._reject(e);
        }
    }
    /** JSDoc */ then(onfulfilled, onrejected) {
        return new SyncPromise((resolve, reject)=>{
            this._handlers.push([
                false,
                (result)=>{
                    if (!onfulfilled) {
                        // TODO: ¯\_(ツ)_/¯
                        // TODO: FIXME
                        resolve(result);
                    } else {
                        try {
                            resolve(onfulfilled(result));
                        } catch (e) {
                            reject(e);
                        }
                    }
                },
                (reason)=>{
                    if (!onrejected) {
                        reject(reason);
                    } else {
                        try {
                            resolve(onrejected(reason));
                        } catch (e) {
                            reject(e);
                        }
                    }
                }
            ]);
            this._executeHandlers();
        });
    }
    /** JSDoc */ catch(onrejected) {
        return this.then((val)=>val, onrejected);
    }
    /** JSDoc */ finally(onfinally) {
        return new SyncPromise((resolve, reject)=>{
            let val;
            let isRejected;
            return this.then((value)=>{
                isRejected = false;
                val = value;
                if (onfinally) {
                    onfinally();
                }
            }, (reason)=>{
                isRejected = true;
                val = reason;
                if (onfinally) {
                    onfinally();
                }
            }).then(()=>{
                if (isRejected) {
                    reject(val);
                    return;
                }
                resolve(val);
            });
        });
    }
    /** JSDoc */ __init() {
        this._resolve = (value)=>{
            this._setResult(States.RESOLVED, value);
        };
    }
    /** JSDoc */ __init2() {
        this._reject = (reason)=>{
            this._setResult(States.REJECTED, reason);
        };
    }
    /** JSDoc */ __init3() {
        this._setResult = (state, value)=>{
            if (this._state !== States.PENDING) {
                return;
            }
            if (is_isThenable(value)) {
                void value.then(this._resolve, this._reject);
                return;
            }
            this._state = state;
            this._value = value;
            this._executeHandlers();
        };
    }
    /** JSDoc */ __init4() {
        this._executeHandlers = ()=>{
            if (this._state === States.PENDING) {
                return;
            }
            const cachedHandlers = this._handlers.slice();
            this._handlers = [];
            cachedHandlers.forEach((handler)=>{
                if (handler[0]) {
                    return;
                }
                if (this._state === States.RESOLVED) {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    handler[1](this._value);
                }
                if (this._state === States.REJECTED) {
                    handler[2](this._value);
                }
                handler[0] = true;
            });
        };
    }
}
 //# sourceMappingURL=syncpromise.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/eventProcessors.js


/**
 * Returns the global event processors.
 * @deprecated Global event processors will be removed in v8.
 */ function getGlobalEventProcessors() {
    return getGlobalSingleton("globalEventProcessors", ()=>[]);
}
/**
 * Add a EventProcessor to be kept globally.
 * @deprecated Use `addEventProcessor` instead. Global event processors will be removed in v8.
 */ function addGlobalEventProcessor(callback) {
    // eslint-disable-next-line deprecation/deprecation
    getGlobalEventProcessors().push(callback);
}
/**
 * Process an array of event processors, returning the processed event (or `null` if the event was dropped).
 */ function notifyEventProcessors(processors, event, hint, index = 0) {
    return new SyncPromise((resolve, reject)=>{
        const processor = processors[index];
        if (event === null || typeof processor !== "function") {
            resolve(event);
        } else {
            const result = processor({
                ...event
            }, hint);
            esm_debug_build_DEBUG_BUILD && processor.id && result === null && logger_logger.log(`Event processor "${processor.id}" dropped event`);
            if (is_isThenable(result)) {
                void result.then((final)=>notifyEventProcessors(processors, final, hint, index + 1).then(resolve)).then(null, reject);
            } else {
                void notifyEventProcessors(processors, result, hint, index + 1).then(resolve).then(null, reject);
            }
        }
    });
}
 //# sourceMappingURL=eventProcessors.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/session.js

/**
 * Creates a new `Session` object by setting certain default parameters. If optional @param context
 * is passed, the passed properties are applied to the session object.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns a new `Session` object
 */ function session_makeSession(context) {
    // Both timestamp and started are in seconds since the UNIX epoch.
    const startingTime = time_timestampInSeconds();
    const session = {
        sid: misc_uuid4(),
        init: true,
        timestamp: startingTime,
        started: startingTime,
        duration: 0,
        status: "ok",
        errors: 0,
        ignoreDuration: false,
        toJSON: ()=>sessionToJSON(session)
    };
    if (context) {
        session_updateSession(session, context);
    }
    return session;
}
/**
 * Updates a session object with the properties passed in the context.
 *
 * Note that this function mutates the passed object and returns void.
 * (Had to do this instead of returning a new and updated session because closing and sending a session
 * makes an update to the session after it was passed to the sending logic.
 * @see BaseClient.captureSession )
 *
 * @param session the `Session` to update
 * @param context the `SessionContext` holding the properties that should be updated in @param session
 */ // eslint-disable-next-line complexity
function session_updateSession(session, context = {}) {
    if (context.user) {
        if (!session.ipAddress && context.user.ip_address) {
            session.ipAddress = context.user.ip_address;
        }
        if (!session.did && !context.did) {
            session.did = context.user.id || context.user.email || context.user.username;
        }
    }
    session.timestamp = context.timestamp || time_timestampInSeconds();
    if (context.abnormal_mechanism) {
        session.abnormal_mechanism = context.abnormal_mechanism;
    }
    if (context.ignoreDuration) {
        session.ignoreDuration = context.ignoreDuration;
    }
    if (context.sid) {
        // Good enough uuid validation. — Kamil
        session.sid = context.sid.length === 32 ? context.sid : misc_uuid4();
    }
    if (context.init !== undefined) {
        session.init = context.init;
    }
    if (!session.did && context.did) {
        session.did = `${context.did}`;
    }
    if (typeof context.started === "number") {
        session.started = context.started;
    }
    if (session.ignoreDuration) {
        session.duration = undefined;
    } else if (typeof context.duration === "number") {
        session.duration = context.duration;
    } else {
        const duration = session.timestamp - session.started;
        session.duration = duration >= 0 ? duration : 0;
    }
    if (context.release) {
        session.release = context.release;
    }
    if (context.environment) {
        session.environment = context.environment;
    }
    if (!session.ipAddress && context.ipAddress) {
        session.ipAddress = context.ipAddress;
    }
    if (!session.userAgent && context.userAgent) {
        session.userAgent = context.userAgent;
    }
    if (typeof context.errors === "number") {
        session.errors = context.errors;
    }
    if (context.status) {
        session.status = context.status;
    }
}
/**
 * Closes a session by setting its status and updating the session object with it.
 * Internally calls `updateSession` to update the passed session object.
 *
 * Note that this function mutates the passed session (@see updateSession for explanation).
 *
 * @param session the `Session` object to be closed
 * @param status the `SessionStatus` with which the session was closed. If you don't pass a status,
 *               this function will keep the previously set status, unless it was `'ok'` in which case
 *               it is changed to `'exited'`.
 */ function session_closeSession(session, status) {
    let context = {};
    if (status) {
        context = {
            status
        };
    } else if (session.status === "ok") {
        context = {
            status: "exited"
        };
    }
    session_updateSession(session, context);
}
/**
 * Serializes a passed session object to a JSON object with a slightly different structure.
 * This is necessary because the Sentry backend requires a slightly different schema of a session
 * than the one the JS SDKs use internally.
 *
 * @param session the session to be converted
 *
 * @returns a JSON object of the passed session
 */ function sessionToJSON(session) {
    return dropUndefinedKeys({
        sid: `${session.sid}`,
        init: session.init,
        // Make sure that sec is converted to ms for date constructor
        started: new Date(session.started * 1000).toISOString(),
        timestamp: new Date(session.timestamp * 1000).toISOString(),
        status: session.status,
        errors: session.errors,
        did: typeof session.did === "number" || typeof session.did === "string" ? `${session.did}` : undefined,
        duration: session.duration,
        abnormal_mechanism: session.abnormal_mechanism,
        attrs: {
            release: session.release,
            environment: session.environment,
            ip_address: session.ipAddress,
            user_agent: session.userAgent
        }
    });
}
 //# sourceMappingURL=session.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/memo.js
/* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/no-explicit-any */ /**
 * Helper to decycle json objects
 */ function memoBuilder() {
    const hasWeakSet = typeof WeakSet === "function";
    const inner = hasWeakSet ? new WeakSet() : [];
    function memoize(obj) {
        if (hasWeakSet) {
            if (inner.has(obj)) {
                return true;
            }
            inner.add(obj);
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let i = 0; i < inner.length; i++){
            const value = inner[i];
            if (value === obj) {
                return true;
            }
        }
        inner.push(obj);
        return false;
    }
    function unmemoize(obj) {
        if (hasWeakSet) {
            inner.delete(obj);
        } else {
            for(let i = 0; i < inner.length; i++){
                if (inner[i] === obj) {
                    inner.splice(i, 1);
                    break;
                }
            }
        }
    }
    return [
        memoize,
        unmemoize
    ];
}
 //# sourceMappingURL=memo.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/node-stack-trace.js
/**
 * Does this filename look like it's part of the app code?
 */ function filenameIsInApp(filename, isNative = false) {
    const isInternal = isNative || filename && // It's not internal if it's an absolute linux path
    !filename.startsWith("/") && // It's not internal if it's an absolute windows path
    !filename.match(/^[A-Z]:/) && // It's not internal if the path is starting with a dot
    !filename.startsWith(".") && // It's not internal if the frame has a protocol. In node, this is usually the case if the file got pre-processed with a bundler like webpack
    !filename.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//); // Schema from: https://stackoverflow.com/a/3641782
    // in_app is all that's not an internal Node function or a module within node_modules
    // note that isNative appears to return true even for node core libraries
    // see https://github.com/getsentry/raven-node/issues/176
    return !isInternal && filename !== undefined && !filename.includes("node_modules/");
}
/** Node Stack line parser */ // eslint-disable-next-line complexity
function node(getModule) {
    const FILENAME_MATCH = /^\s*[-]{4,}$/;
    const FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
    // eslint-disable-next-line complexity
    return (line)=>{
        const lineMatch = line.match(FULL_MATCH);
        if (lineMatch) {
            let object;
            let method;
            let functionName;
            let typeName;
            let methodName;
            if (lineMatch[1]) {
                functionName = lineMatch[1];
                let methodStart = functionName.lastIndexOf(".");
                if (functionName[methodStart - 1] === ".") {
                    methodStart--;
                }
                if (methodStart > 0) {
                    object = functionName.slice(0, methodStart);
                    method = functionName.slice(methodStart + 1);
                    const objectEnd = object.indexOf(".Module");
                    if (objectEnd > 0) {
                        functionName = functionName.slice(objectEnd + 1);
                        object = object.slice(0, objectEnd);
                    }
                }
                typeName = undefined;
            }
            if (method) {
                typeName = object;
                methodName = method;
            }
            if (method === "<anonymous>") {
                methodName = undefined;
                functionName = undefined;
            }
            if (functionName === undefined) {
                methodName = methodName || "<anonymous>";
                functionName = typeName ? `${typeName}.${methodName}` : methodName;
            }
            let filename = lineMatch[2] && lineMatch[2].startsWith("file://") ? lineMatch[2].slice(7) : lineMatch[2];
            const isNative = lineMatch[5] === "native";
            // If it's a Windows path, trim the leading slash so that `/C:/foo` becomes `C:/foo`
            if (filename && filename.match(/\/[A-Z]:/)) {
                filename = filename.slice(1);
            }
            if (!filename && lineMatch[5] && !isNative) {
                filename = lineMatch[5];
            }
            return {
                filename,
                module: getModule ? getModule(filename) : undefined,
                function: functionName,
                lineno: parseInt(lineMatch[3], 10) || undefined,
                colno: parseInt(lineMatch[4], 10) || undefined,
                in_app: filenameIsInApp(filename, isNative)
            };
        }
        if (line.match(FILENAME_MATCH)) {
            return {
                filename: line
            };
        }
        return undefined;
    };
}
 //# sourceMappingURL=node-stack-trace.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/stacktrace.js


const STACKTRACE_FRAME_LIMIT = 50;
// Used to sanitize webpack (error: *) wrapped stack errors
const WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
const STRIP_FRAME_REGEXP = /captureMessage|captureException/;
/**
 * Creates a stack parser with the supplied line parsers
 *
 * StackFrames are returned in the correct order for Sentry Exception
 * frames and with Sentry SDK internal frames removed from the top and bottom
 *
 */ function createStackParser(...parsers) {
    const sortedParsers = parsers.sort((a, b)=>a[0] - b[0]).map((p)=>p[1]);
    return (stack, skipFirst = 0)=>{
        const frames = [];
        const lines = stack.split("\n");
        for(let i = skipFirst; i < lines.length; i++){
            const line = lines[i];
            // Ignore lines over 1kb as they are unlikely to be stack frames.
            // Many of the regular expressions use backtracking which results in run time that increases exponentially with
            // input size. Huge strings can result in hangs/Denial of Service:
            // https://github.com/getsentry/sentry-javascript/issues/2286
            if (line.length > 1024) {
                continue;
            }
            // https://github.com/getsentry/sentry-javascript/issues/5459
            // Remove webpack (error: *) wrappers
            const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, "$1") : line;
            // https://github.com/getsentry/sentry-javascript/issues/7813
            // Skip Error: lines
            if (cleanedLine.match(/\S*Error: /)) {
                continue;
            }
            for (const parser of sortedParsers){
                const frame = parser(cleanedLine);
                if (frame) {
                    frames.push(frame);
                    break;
                }
            }
            if (frames.length >= STACKTRACE_FRAME_LIMIT) {
                break;
            }
        }
        return stripSentryFramesAndReverse(frames);
    };
}
/**
 * Gets a stack parser implementation from Options.stackParser
 * @see Options
 *
 * If options contains an array of line parsers, it is converted into a parser
 */ function stackParserFromStackParserOptions(stackParser) {
    if (Array.isArray(stackParser)) {
        return createStackParser(...stackParser);
    }
    return stackParser;
}
/**
 * Removes Sentry frames from the top and bottom of the stack if present and enforces a limit of max number of frames.
 * Assumes stack input is ordered from top to bottom and returns the reverse representation so call site of the
 * function that caused the crash is the last frame in the array.
 * @hidden
 */ function stripSentryFramesAndReverse(stack) {
    if (!stack.length) {
        return [];
    }
    const localStack = Array.from(stack);
    // If stack starts with one of our API calls, remove it (starts, meaning it's the top of the stack - aka last call)
    if (/sentryWrapped/.test(localStack[localStack.length - 1].function || "")) {
        localStack.pop();
    }
    // Reversing in the middle of the procedure allows us to just pop the values off the stack
    localStack.reverse();
    // If stack ends with one of our internal API calls, remove it (ends, meaning it's the bottom of the stack - aka top-most call)
    if (STRIP_FRAME_REGEXP.test(localStack[localStack.length - 1].function || "")) {
        localStack.pop();
        // When using synthetic events, we will have a 2 levels deep stack, as `new Error('Sentry syntheticException')`
        // is produced within the hub itself, making it:
        //
        //   Sentry.captureException()
        //   getCurrentHub().captureException()
        //
        // instead of just the top `Sentry` call itself.
        // This forces us to possibly strip an additional frame in the exact same was as above.
        if (STRIP_FRAME_REGEXP.test(localStack[localStack.length - 1].function || "")) {
            localStack.pop();
        }
    }
    return localStack.slice(0, STACKTRACE_FRAME_LIMIT).map((frame)=>({
            ...frame,
            filename: frame.filename || localStack[localStack.length - 1].filename,
            function: frame.function || "?"
        }));
}
const defaultFunctionName = "<anonymous>";
/**
 * Safely extract function name from itself
 */ function getFunctionName(fn) {
    try {
        if (!fn || typeof fn !== "function") {
            return defaultFunctionName;
        }
        return fn.name || defaultFunctionName;
    } catch (e) {
        // Just accessing custom props in some Selenium environments
        // can cause a "Permission denied" exception (see raven-js#495).
        return defaultFunctionName;
    }
}
/**
 * Node.js stack line parser
 *
 * This is in @sentry/utils so it can be used from the Electron SDK in the browser for when `nodeIntegration == true`.
 * This allows it to be used without referencing or importing any node specific code which causes bundlers to complain
 */ function nodeStackLineParser(getModule) {
    return [
        90,
        node(getModule)
    ];
}
 //# sourceMappingURL=stacktrace.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/normalize.js




/**
 * Recursively normalizes the given object.
 *
 * - Creates a copy to prevent original input mutation
 * - Skips non-enumerable properties
 * - When stringifying, calls `toJSON` if implemented
 * - Removes circular references
 * - Translates non-serializable values (`undefined`/`NaN`/functions) to serializable format
 * - Translates known global objects/classes to a string representations
 * - Takes care of `Error` object serialization
 * - Optionally limits depth of final output
 * - Optionally limits number of properties/elements included in any single object/array
 *
 * @param input The object to be normalized.
 * @param depth The max depth to which to normalize the object. (Anything deeper stringified whole.)
 * @param maxProperties The max number of elements or properties to be included in any single array or
 * object in the normallized output.
 * @returns A normalized version of the object, or `"**non-serializable**"` if any errors are thrown during normalization.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(input, depth = 100, maxProperties = +Infinity) {
    try {
        // since we're at the outermost level, we don't provide a key
        return visit("", input, depth, maxProperties);
    } catch (err) {
        return {
            ERROR: `**non-serializable** (${err})`
        };
    }
}
/** JSDoc */ function normalizeToSize(// eslint-disable-next-line @typescript-eslint/no-explicit-any
object, // Default Node.js REPL depth
depth = 3, // 100kB, as 200kB is max payload size, so half sounds reasonable
maxSize = 100 * 1024) {
    const normalized = normalize(object, depth);
    if (jsonSize(normalized) > maxSize) {
        return normalizeToSize(object, depth - 1, maxSize);
    }
    return normalized;
}
/**
 * Visits a node to perform normalization on it
 *
 * @param key The key corresponding to the given node
 * @param value The node to be visited
 * @param depth Optional number indicating the maximum recursion depth
 * @param maxProperties Optional maximum number of properties/elements included in any single object/array
 * @param memo Optional Memo class handling decycling
 */ function visit(key, value, depth = +Infinity, maxProperties = +Infinity, memo = memoBuilder()) {
    const [memoize, unmemoize] = memo;
    // Get the simple cases out of the way first
    if (value == null || // this matches null and undefined -> eqeq not eqeqeq
    [
        "number",
        "boolean",
        "string"
    ].includes(typeof value) && !is_isNaN(value)) {
        return value;
    }
    const stringified = stringifyValue(key, value);
    // Anything we could potentially dig into more (objects or arrays) will have come back as `"[object XXXX]"`.
    // Everything else will have already been serialized, so if we don't see that pattern, we're done.
    if (!stringified.startsWith("[object ")) {
        return stringified;
    }
    // From here on, we can assert that `value` is either an object or an array.
    // Do not normalize objects that we know have already been normalized. As a general rule, the
    // "__sentry_skip_normalization__" property should only be used sparingly and only should only be set on objects that
    // have already been normalized.
    if (value["__sentry_skip_normalization__"]) {
        return value;
    }
    // We can set `__sentry_override_normalization_depth__` on an object to ensure that from there
    // We keep a certain amount of depth.
    // This should be used sparingly, e.g. we use it for the redux integration to ensure we get a certain amount of state.
    const remainingDepth = typeof value["__sentry_override_normalization_depth__"] === "number" ? value["__sentry_override_normalization_depth__"] : depth;
    // We're also done if we've reached the max depth
    if (remainingDepth === 0) {
        // At this point we know `serialized` is a string of the form `"[object XXXX]"`. Clean it up so it's just `"[XXXX]"`.
        return stringified.replace("object ", "");
    }
    // If we've already visited this branch, bail out, as it's circular reference. If not, note that we're seeing it now.
    if (memoize(value)) {
        return "[Circular ~]";
    }
    // If the value has a `toJSON` method, we call it to extract more information
    const valueWithToJSON = value;
    if (valueWithToJSON && typeof valueWithToJSON.toJSON === "function") {
        try {
            const jsonValue = valueWithToJSON.toJSON();
            // We need to normalize the return value of `.toJSON()` in case it has circular references
            return visit("", jsonValue, remainingDepth - 1, maxProperties, memo);
        } catch (err) {
        // pass (The built-in `toJSON` failed, but we can still try to do it ourselves)
        }
    }
    // At this point we know we either have an object or an array, we haven't seen it before, and we're going to recurse
    // because we haven't yet reached the max depth. Create an accumulator to hold the results of visiting each
    // property/entry, and keep track of the number of items we add to it.
    const normalized = Array.isArray(value) ? [] : {};
    let numAdded = 0;
    // Before we begin, convert`Error` and`Event` instances into plain objects, since some of each of their relevant
    // properties are non-enumerable and otherwise would get missed.
    const visitable = convertToPlainObject(value);
    for(const visitKey in visitable){
        // Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
        if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
            continue;
        }
        if (numAdded >= maxProperties) {
            normalized[visitKey] = "[MaxProperties ~]";
            break;
        }
        // Recursively visit all the child nodes
        const visitValue = visitable[visitKey];
        normalized[visitKey] = visit(visitKey, visitValue, remainingDepth - 1, maxProperties, memo);
        numAdded++;
    }
    // Once we've visited all the branches, remove the parent from memo storage
    unmemoize(value);
    // Return accumulated values
    return normalized;
}
/* eslint-disable complexity */ /**
 * Stringify the given value. Handles various known special values and types.
 *
 * Not meant to be used on simple primitives which already have a string representation, as it will, for example, turn
 * the number 1231 into "[Object Number]", nor on `null`, as it will throw.
 *
 * @param value The value to stringify
 * @returns A stringified representation of the given value
 */ function stringifyValue(key, // this type is a tiny bit of a cheat, since this function does handle NaN (which is technically a number), but for
// our internal use, it'll do
value) {
    try {
        if (key === "domain" && value && typeof value === "object" && value._events) {
            return "[Domain]";
        }
        if (key === "domainEmitter") {
            return "[DomainEmitter]";
        }
        // It's safe to use `global`, `window`, and `document` here in this manner, as we are asserting using `typeof` first
        // which won't throw if they are not present.
        if (typeof __webpack_require__.g !== "undefined" && value === __webpack_require__.g) {
            return "[Global]";
        }
        // eslint-disable-next-line no-restricted-globals
        if (false) {}
        // eslint-disable-next-line no-restricted-globals
        if (typeof document !== "undefined" && value === document) {
            return "[Document]";
        }
        if (is_isVueViewModel(value)) {
            return "[VueViewModel]";
        }
        // React's SyntheticEvent thingy
        if (isSyntheticEvent(value)) {
            return "[SyntheticEvent]";
        }
        if (typeof value === "number" && value !== value) {
            return "[NaN]";
        }
        if (typeof value === "function") {
            return `[Function: ${getFunctionName(value)}]`;
        }
        if (typeof value === "symbol") {
            return `[${String(value)}]`;
        }
        // stringified BigInts are indistinguishable from regular numbers, so we need to label them to avoid confusion
        if (typeof value === "bigint") {
            return `[BigInt: ${String(value)}]`;
        }
        // Now that we've knocked out all the special cases and the primitives, all we have left are objects. Simply casting
        // them to strings means that instances of classes which haven't defined their `toStringTag` will just come out as
        // `"[object Object]"`. If we instead look at the constructor's name (which is the same as the name of the class),
        // we can make sure that only plain objects come out that way.
        const objName = getConstructorName(value);
        // Handle HTML Elements
        if (/^HTML(\w*)Element$/.test(objName)) {
            return `[HTMLElement: ${objName}]`;
        }
        return `[object ${objName}]`;
    } catch (err) {
        return `**non-serializable** (${err})`;
    }
}
/* eslint-enable complexity */ function getConstructorName(value) {
    const prototype = Object.getPrototypeOf(value);
    return prototype ? prototype.constructor.name : "null prototype";
}
/** Calculates bytes size of input string */ function utf8Length(value) {
    // eslint-disable-next-line no-bitwise
    return ~-encodeURI(value).split(/%..|./).length;
}
/** Calculates bytes size of input object */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonSize(value) {
    return utf8Length(JSON.stringify(value));
}
/**
 * Normalizes URLs in exceptions and stacktraces to a base path so Sentry can fingerprint
 * across platforms and working directory.
 *
 * @param url The URL to be normalized.
 * @param basePath The application base path.
 * @returns The normalized URL.
 */ function normalizeUrlToBase(url, basePath) {
    const escapedBase = basePath// Backslash to forward
    .replace(/\\/g, "/")// Escape RegExp special characters
    .replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    let newUrl = url;
    try {
        newUrl = decodeURI(url);
    } catch (_Oo) {
    // Sometime this breaks
    }
    return newUrl.replace(/\\/g, "/").replace(/webpack:\/?/g, "") // Remove intermediate base path
    // eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor
    .replace(new RegExp(`(file://)?/*${escapedBase}/*`, "ig"), "app:///");
}
 //# sourceMappingURL=normalize.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/baggage.js



const BAGGAGE_HEADER_NAME = "baggage";
const SENTRY_BAGGAGE_KEY_PREFIX = "sentry-";
const SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/;
/**
 * Max length of a serialized baggage string
 *
 * https://www.w3.org/TR/baggage/#limits
 */ const MAX_BAGGAGE_STRING_LENGTH = 8192;
/**
 * Takes a baggage header and turns it into Dynamic Sampling Context, by extracting all the "sentry-" prefixed values
 * from it.
 *
 * @param baggageHeader A very bread definition of a baggage header as it might appear in various frameworks.
 * @returns The Dynamic Sampling Context that was found on `baggageHeader`, if there was any, `undefined` otherwise.
 */ function baggage_baggageHeaderToDynamicSamplingContext(// Very liberal definition of what any incoming header might look like
baggageHeader) {
    if (!isString(baggageHeader) && !Array.isArray(baggageHeader)) {
        return undefined;
    }
    // Intermediary object to store baggage key value pairs of incoming baggage headers on.
    // It is later used to read Sentry-DSC-values from.
    let baggageObject = {};
    if (Array.isArray(baggageHeader)) {
        // Combine all baggage headers into one object containing the baggage values so we can later read the Sentry-DSC-values from it
        baggageObject = baggageHeader.reduce((acc, curr)=>{
            const currBaggageObject = baggageHeaderToObject(curr);
            for (const key of Object.keys(currBaggageObject)){
                acc[key] = currBaggageObject[key];
            }
            return acc;
        }, {});
    } else {
        // Return undefined if baggage header is an empty string (technically an empty baggage header is not spec conform but
        // this is how we choose to handle it)
        if (!baggageHeader) {
            return undefined;
        }
        baggageObject = baggageHeaderToObject(baggageHeader);
    }
    // Read all "sentry-" prefixed values out of the baggage object and put it onto a dynamic sampling context object.
    const dynamicSamplingContext = Object.entries(baggageObject).reduce((acc, [key, value])=>{
        if (key.match(SENTRY_BAGGAGE_KEY_PREFIX_REGEX)) {
            const nonPrefixedKey = key.slice(SENTRY_BAGGAGE_KEY_PREFIX.length);
            acc[nonPrefixedKey] = value;
        }
        return acc;
    }, {});
    // Only return a dynamic sampling context object if there are keys in it.
    // A keyless object means there were no sentry values on the header, which means that there is no DSC.
    if (Object.keys(dynamicSamplingContext).length > 0) {
        return dynamicSamplingContext;
    } else {
        return undefined;
    }
}
/**
 * Turns a Dynamic Sampling Object into a baggage header by prefixing all the keys on the object with "sentry-".
 *
 * @param dynamicSamplingContext The Dynamic Sampling Context to turn into a header. For convenience and compatibility
 * with the `getDynamicSamplingContext` method on the Transaction class ,this argument can also be `undefined`. If it is
 * `undefined` the function will return `undefined`.
 * @returns a baggage header, created from `dynamicSamplingContext`, or `undefined` either if `dynamicSamplingContext`
 * was `undefined`, or if `dynamicSamplingContext` didn't contain any values.
 */ function dynamicSamplingContextToSentryBaggageHeader(// this also takes undefined for convenience and bundle size in other places
dynamicSamplingContext) {
    if (!dynamicSamplingContext) {
        return undefined;
    }
    // Prefix all DSC keys with "sentry-" and put them into a new object
    const sentryPrefixedDSC = Object.entries(dynamicSamplingContext).reduce((acc, [dscKey, dscValue])=>{
        if (dscValue) {
            acc[`${SENTRY_BAGGAGE_KEY_PREFIX}${dscKey}`] = dscValue;
        }
        return acc;
    }, {});
    return objectToBaggageHeader(sentryPrefixedDSC);
}
/**
 * Will parse a baggage header, which is a simple key-value map, into a flat object.
 *
 * @param baggageHeader The baggage header to parse.
 * @returns a flat object containing all the key-value pairs from `baggageHeader`.
 */ function baggageHeaderToObject(baggageHeader) {
    return baggageHeader.split(",").map((baggageEntry)=>baggageEntry.split("=").map((keyOrValue)=>decodeURIComponent(keyOrValue.trim()))).reduce((acc, [key, value])=>{
        acc[key] = value;
        return acc;
    }, {});
}
/**
 * Turns a flat object (key-value pairs) into a baggage header, which is also just key-value pairs.
 *
 * @param object The object to turn into a baggage header.
 * @returns a baggage header string, or `undefined` if the object didn't have any values, since an empty baggage header
 * is not spec compliant.
 */ function objectToBaggageHeader(object) {
    if (Object.keys(object).length === 0) {
        // An empty baggage header is not spec compliant: We return undefined.
        return undefined;
    }
    return Object.entries(object).reduce((baggageHeader, [objectKey, objectValue], currentIndex)=>{
        const baggageEntry = `${encodeURIComponent(objectKey)}=${encodeURIComponent(objectValue)}`;
        const newBaggageHeader = currentIndex === 0 ? baggageEntry : `${baggageHeader},${baggageEntry}`;
        if (newBaggageHeader.length > MAX_BAGGAGE_STRING_LENGTH) {
            debug_build_DEBUG_BUILD && logger_logger.warn(`Not adding key: ${objectKey} with val: ${objectValue} to baggage header due to exceeding baggage size limits.`);
            return baggageHeader;
        } else {
            return newBaggageHeader;
        }
    }, "");
}
 //# sourceMappingURL=baggage.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/tracing.js


// eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor -- RegExp is used for readability here
const TRACEPARENT_REGEXP = new RegExp("^[ \\t]*" + // whitespace
"([0-9a-f]{32})?" + // trace_id
"-?([0-9a-f]{16})?" + // span_id
"-?([01])?" + // sampled
"[ \\t]*$");
/**
 * Extract transaction context data from a `sentry-trace` header.
 *
 * @param traceparent Traceparent string
 *
 * @returns Object containing data from the header, or undefined if traceparent string is malformed
 */ function extractTraceparentData(traceparent) {
    if (!traceparent) {
        return undefined;
    }
    const matches = traceparent.match(TRACEPARENT_REGEXP);
    if (!matches) {
        return undefined;
    }
    let parentSampled;
    if (matches[3] === "1") {
        parentSampled = true;
    } else if (matches[3] === "0") {
        parentSampled = false;
    }
    return {
        traceId: matches[1],
        parentSampled,
        parentSpanId: matches[2]
    };
}
/**
 * Create tracing context from incoming headers.
 *
 * @deprecated Use `propagationContextFromHeaders` instead.
 */ // TODO(v8): Remove this function
function tracingContextFromHeaders(sentryTrace, baggage) {
    const traceparentData = extractTraceparentData(sentryTrace);
    const dynamicSamplingContext = baggage_baggageHeaderToDynamicSamplingContext(baggage);
    const { traceId, parentSpanId, parentSampled } = traceparentData || {};
    if (!traceparentData) {
        return {
            traceparentData,
            dynamicSamplingContext: undefined,
            propagationContext: {
                traceId: traceId || misc_uuid4(),
                spanId: misc_uuid4().substring(16)
            }
        };
    } else {
        return {
            traceparentData,
            dynamicSamplingContext: dynamicSamplingContext || {},
            propagationContext: {
                traceId: traceId || misc_uuid4(),
                parentSpanId: parentSpanId || misc_uuid4().substring(16),
                spanId: misc_uuid4().substring(16),
                sampled: parentSampled,
                dsc: dynamicSamplingContext || {}
            }
        };
    }
}
/**
 * Create a propagation context from incoming headers.
 */ function propagationContextFromHeaders(sentryTrace, baggage) {
    const traceparentData = extractTraceparentData(sentryTrace);
    const dynamicSamplingContext = baggageHeaderToDynamicSamplingContext(baggage);
    const { traceId, parentSpanId, parentSampled } = traceparentData || {};
    if (!traceparentData) {
        return {
            traceId: traceId || uuid4(),
            spanId: uuid4().substring(16)
        };
    } else {
        return {
            traceId: traceId || uuid4(),
            parentSpanId: parentSpanId || uuid4().substring(16),
            spanId: uuid4().substring(16),
            sampled: parentSampled,
            dsc: dynamicSamplingContext || {}
        };
    }
}
/**
 * Create sentry-trace header from span context values.
 */ function generateSentryTraceHeader(traceId = misc_uuid4(), spanId = misc_uuid4().substring(16), sampled) {
    let sampledString = "";
    if (sampled !== undefined) {
        sampledString = sampled ? "-1" : "-0";
    }
    return `${traceId}-${spanId}${sampledString}`;
}
 //# sourceMappingURL=tracing.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/utils/spanUtils.js

// These are aligned with OpenTelemetry trace flags
const TRACE_FLAG_NONE = 0x0;
const TRACE_FLAG_SAMPLED = 0x1;
/**
 * Convert a span to a trace context, which can be sent as the `trace` context in an event.
 */ function spanToTraceContext(span) {
    const { spanId: span_id, traceId: trace_id } = span.spanContext();
    const { data, op, parent_span_id, status, tags, origin } = spanUtils_spanToJSON(span);
    return dropUndefinedKeys({
        data,
        op,
        parent_span_id,
        span_id,
        status,
        tags,
        trace_id,
        origin
    });
}
/**
 * Convert a Span to a Sentry trace header.
 */ function spanToTraceHeader(span) {
    const { traceId, spanId } = span.spanContext();
    const sampled = spanIsSampled(span);
    return generateSentryTraceHeader(traceId, spanId, sampled);
}
/**
 * Convert a span time input intp a timestamp in seconds.
 */ function spanTimeInputToSeconds(input) {
    if (typeof input === "number") {
        return ensureTimestampInSeconds(input);
    }
    if (Array.isArray(input)) {
        // See {@link HrTime} for the array-based time format
        return input[0] + input[1] / 1e9;
    }
    if (input instanceof Date) {
        return ensureTimestampInSeconds(input.getTime());
    }
    return time_timestampInSeconds();
}
/**
 * Converts a timestamp to second, if it was in milliseconds, or keeps it as second.
 */ function ensureTimestampInSeconds(timestamp) {
    const isMs = timestamp > 9999999999;
    return isMs ? timestamp / 1000 : timestamp;
}
/**
 * Convert a span to a JSON representation.
 * Note that all fields returned here are optional and need to be guarded against.
 *
 * Note: Because of this, we currently have a circular type dependency (which we opted out of in package.json).
 * This is not avoidable as we need `spanToJSON` in `spanUtils.ts`, which in turn is needed by `span.ts` for backwards compatibility.
 * And `spanToJSON` needs the Span class from `span.ts` to check here.
 * TODO v8: When we remove the deprecated stuff from `span.ts`, we can remove the circular dependency again.
 */ function spanUtils_spanToJSON(span) {
    if (spanIsSpanClass(span)) {
        return span.getSpanJSON();
    }
    // Fallback: We also check for `.toJSON()` here...
    // eslint-disable-next-line deprecation/deprecation
    if (typeof span.toJSON === "function") {
        // eslint-disable-next-line deprecation/deprecation
        return span.toJSON();
    }
    return {};
}
/**
 * Sadly, due to circular dependency checks we cannot actually import the Span class here and check for instanceof.
 * :( So instead we approximate this by checking if it has the `getSpanJSON` method.
 */ function spanIsSpanClass(span) {
    return typeof span.getSpanJSON === "function";
}
/**
 * Returns true if a span is sampled.
 * In most cases, you should just use `span.isRecording()` instead.
 * However, this has a slightly different semantic, as it also returns false if the span is finished.
 * So in the case where this distinction is important, use this method.
 */ function spanIsSampled(span) {
    // We align our trace flags with the ones OpenTelemetry use
    // So we also check for sampled the same way they do.
    const { traceFlags } = span.spanContext();
    // eslint-disable-next-line no-bitwise
    return Boolean(traceFlags & TRACE_FLAG_SAMPLED);
}
 //# sourceMappingURL=spanUtils.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/utils/prepareEvent.js






/**
 * This type makes sure that we get either a CaptureContext, OR an EventHint.
 * It does not allow mixing them, which could lead to unexpected outcomes, e.g. this is disallowed:
 * { user: { id: '123' }, mechanism: { handled: false } }
 */ /**
 * Adds common information to events.
 *
 * The information includes release and environment from `options`,
 * breadcrumbs and context (extra, tags and user) from the scope.
 *
 * Information that is already present in the event is never overwritten. For
 * nested objects, such as the context, keys are merged.
 *
 * Note: This also triggers callbacks for `addGlobalEventProcessor`, but not `beforeSend`.
 *
 * @param event The original event.
 * @param hint May contain additional information about the original exception.
 * @param scope A scope containing event metadata.
 * @returns A new event with more information.
 * @hidden
 */ function prepareEvent(options, event, hint, scope, client, isolationScope) {
    const { normalizeDepth = 3, normalizeMaxBreadth = 1000 } = options;
    const prepared = {
        ...event,
        event_id: event.event_id || hint.event_id || misc_uuid4(),
        timestamp: event.timestamp || dateTimestampInSeconds()
    };
    const integrations = hint.integrations || options.integrations.map((i)=>i.name);
    applyClientOptions(prepared, options);
    applyIntegrationsMetadata(prepared, integrations);
    // Only put debug IDs onto frames for error events.
    if (event.type === undefined) {
        applyDebugIds(prepared, options.stackParser);
    }
    // If we have scope given to us, use it as the base for further modifications.
    // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.
    const finalScope = getFinalScope(scope, hint.captureContext);
    if (hint.mechanism) {
        addExceptionMechanism(prepared, hint.mechanism);
    }
    const clientEventProcessors = client && client.getEventProcessors ? client.getEventProcessors() : [];
    // This should be the last thing called, since we want that
    // {@link Hub.addEventProcessor} gets the finished prepared event.
    // Merge scope data together
    const data = getGlobalScope().getScopeData();
    if (isolationScope) {
        const isolationData = isolationScope.getScopeData();
        mergeScopeData(data, isolationData);
    }
    if (finalScope) {
        const finalScopeData = finalScope.getScopeData();
        mergeScopeData(data, finalScopeData);
    }
    const attachments = [
        ...hint.attachments || [],
        ...data.attachments
    ];
    if (attachments.length) {
        hint.attachments = attachments;
    }
    applyScopeDataToEvent(prepared, data);
    // TODO (v8): Update this order to be: Global > Client > Scope
    const eventProcessors = [
        ...clientEventProcessors,
        // eslint-disable-next-line deprecation/deprecation
        ...getGlobalEventProcessors(),
        // Run scope event processors _after_ all other processors
        ...data.eventProcessors
    ];
    const result = notifyEventProcessors(eventProcessors, prepared, hint);
    return result.then((evt)=>{
        if (evt) {
            // We apply the debug_meta field only after all event processors have ran, so that if any event processors modified
            // file names (e.g.the RewriteFrames integration) the filename -> debug ID relationship isn't destroyed.
            // This should not cause any PII issues, since we're only moving data that is already on the event and not adding
            // any new data
            applyDebugMeta(evt);
        }
        if (typeof normalizeDepth === "number" && normalizeDepth > 0) {
            return normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
        }
        return evt;
    });
}
/**
 *  Enhances event using the client configuration.
 *  It takes care of all "static" values like environment, release and `dist`,
 *  as well as truncating overly long values.
 * @param event event instance to be enhanced
 */ function applyClientOptions(event, options) {
    const { environment, release, dist, maxValueLength = 250 } = options;
    if (!("environment" in event)) {
        event.environment = "environment" in options ? environment : constants_DEFAULT_ENVIRONMENT;
    }
    if (event.release === undefined && release !== undefined) {
        event.release = release;
    }
    if (event.dist === undefined && dist !== undefined) {
        event.dist = dist;
    }
    if (event.message) {
        event.message = truncate(event.message, maxValueLength);
    }
    const exception = event.exception && event.exception.values && event.exception.values[0];
    if (exception && exception.value) {
        exception.value = truncate(exception.value, maxValueLength);
    }
    const request = event.request;
    if (request && request.url) {
        request.url = truncate(request.url, maxValueLength);
    }
}
const debugIdStackParserCache = new WeakMap();
/**
 * Puts debug IDs into the stack frames of an error event.
 */ function applyDebugIds(event, stackParser) {
    const debugIdMap = worldwide_GLOBAL_OBJ._sentryDebugIds;
    if (!debugIdMap) {
        return;
    }
    let debugIdStackFramesCache;
    const cachedDebugIdStackFrameCache = debugIdStackParserCache.get(stackParser);
    if (cachedDebugIdStackFrameCache) {
        debugIdStackFramesCache = cachedDebugIdStackFrameCache;
    } else {
        debugIdStackFramesCache = new Map();
        debugIdStackParserCache.set(stackParser, debugIdStackFramesCache);
    }
    // Build a map of filename -> debug_id
    const filenameDebugIdMap = Object.keys(debugIdMap).reduce((acc, debugIdStackTrace)=>{
        let parsedStack;
        const cachedParsedStack = debugIdStackFramesCache.get(debugIdStackTrace);
        if (cachedParsedStack) {
            parsedStack = cachedParsedStack;
        } else {
            parsedStack = stackParser(debugIdStackTrace);
            debugIdStackFramesCache.set(debugIdStackTrace, parsedStack);
        }
        for(let i = parsedStack.length - 1; i >= 0; i--){
            const stackFrame = parsedStack[i];
            if (stackFrame.filename) {
                acc[stackFrame.filename] = debugIdMap[debugIdStackTrace];
                break;
            }
        }
        return acc;
    }, {});
    try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        event.exception.values.forEach((exception)=>{
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            exception.stacktrace.frames.forEach((frame)=>{
                if (frame.filename) {
                    frame.debug_id = filenameDebugIdMap[frame.filename];
                }
            });
        });
    } catch (e) {
    // To save bundle size we're just try catching here instead of checking for the existence of all the different objects.
    }
}
/**
 * Moves debug IDs from the stack frames of an error event into the debug_meta field.
 */ function applyDebugMeta(event) {
    // Extract debug IDs and filenames from the stack frames on the event.
    const filenameDebugIdMap = {};
    try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        event.exception.values.forEach((exception)=>{
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            exception.stacktrace.frames.forEach((frame)=>{
                if (frame.debug_id) {
                    if (frame.abs_path) {
                        filenameDebugIdMap[frame.abs_path] = frame.debug_id;
                    } else if (frame.filename) {
                        filenameDebugIdMap[frame.filename] = frame.debug_id;
                    }
                    delete frame.debug_id;
                }
            });
        });
    } catch (e) {
    // To save bundle size we're just try catching here instead of checking for the existence of all the different objects.
    }
    if (Object.keys(filenameDebugIdMap).length === 0) {
        return;
    }
    // Fill debug_meta information
    event.debug_meta = event.debug_meta || {};
    event.debug_meta.images = event.debug_meta.images || [];
    const images = event.debug_meta.images;
    Object.keys(filenameDebugIdMap).forEach((filename)=>{
        images.push({
            type: "sourcemap",
            code_file: filename,
            debug_id: filenameDebugIdMap[filename]
        });
    });
}
/**
 * This function adds all used integrations to the SDK info in the event.
 * @param event The event that will be filled with all integrations.
 */ function applyIntegrationsMetadata(event, integrationNames) {
    if (integrationNames.length > 0) {
        event.sdk = event.sdk || {};
        event.sdk.integrations = [
            ...event.sdk.integrations || [],
            ...integrationNames
        ];
    }
}
/**
 * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
 * Normalized keys:
 * - `breadcrumbs.data`
 * - `user`
 * - `contexts`
 * - `extra`
 * @param event Event
 * @returns Normalized event
 */ function normalizeEvent(event, depth, maxBreadth) {
    if (!event) {
        return null;
    }
    const normalized = {
        ...event,
        ...event.breadcrumbs && {
            breadcrumbs: event.breadcrumbs.map((b)=>({
                    ...b,
                    ...b.data && {
                        data: normalize(b.data, depth, maxBreadth)
                    }
                }))
        },
        ...event.user && {
            user: normalize(event.user, depth, maxBreadth)
        },
        ...event.contexts && {
            contexts: normalize(event.contexts, depth, maxBreadth)
        },
        ...event.extra && {
            extra: normalize(event.extra, depth, maxBreadth)
        }
    };
    // event.contexts.trace stores information about a Transaction. Similarly,
    // event.spans[] stores information about child Spans. Given that a
    // Transaction is conceptually a Span, normalization should apply to both
    // Transactions and Spans consistently.
    // For now the decision is to skip normalization of Transactions and Spans,
    // so this block overwrites the normalized event to add back the original
    // Transaction information prior to normalization.
    if (event.contexts && event.contexts.trace && normalized.contexts) {
        normalized.contexts.trace = event.contexts.trace;
        // event.contexts.trace.data may contain circular/dangerous data so we need to normalize it
        if (event.contexts.trace.data) {
            normalized.contexts.trace.data = normalize(event.contexts.trace.data, depth, maxBreadth);
        }
    }
    // event.spans[].data may contain circular/dangerous data so we need to normalize it
    if (event.spans) {
        normalized.spans = event.spans.map((span)=>{
            const data = spanUtils_spanToJSON(span).data;
            if (data) {
                // This is a bit weird, as we generally have `Span` instances here, but to be safe we do not assume so
                // eslint-disable-next-line deprecation/deprecation
                span.data = normalize(data, depth, maxBreadth);
            }
            return span;
        });
    }
    return normalized;
}
function getFinalScope(scope, captureContext) {
    if (!captureContext) {
        return scope;
    }
    const finalScope = scope ? scope.clone() : new Scope();
    finalScope.update(captureContext);
    return finalScope;
}
/**
 * Parse either an `EventHint` directly, or convert a `CaptureContext` to an `EventHint`.
 * This is used to allow to update method signatures that used to accept a `CaptureContext` but should now accept an `EventHint`.
 */ function parseEventHintOrCaptureContext(hint) {
    if (!hint) {
        return undefined;
    }
    // If you pass a Scope or `() => Scope` as CaptureContext, we just return this as captureContext
    if (hintIsScopeOrFunction(hint)) {
        return {
            captureContext: hint
        };
    }
    if (hintIsScopeContext(hint)) {
        return {
            captureContext: hint
        };
    }
    return hint;
}
function hintIsScopeOrFunction(hint) {
    return hint instanceof Scope || typeof hint === "function";
}
const captureContextKeys = [
    "user",
    "level",
    "extra",
    "contexts",
    "tags",
    "fingerprint",
    "requestSession",
    "propagationContext"
];
function hintIsScopeContext(hint) {
    return Object.keys(hint).some((key)=>captureContextKeys.includes(key));
}
 //# sourceMappingURL=prepareEvent.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/exports.js






/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception The exception to capture.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured Sentry event.
 */ function captureException(// eslint-disable-next-line @typescript-eslint/no-explicit-any
exception, hint) {
    // eslint-disable-next-line deprecation/deprecation
    return hub_getCurrentHub().captureException(exception, parseEventHintOrCaptureContext(hint));
}
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param exception The exception to capture.
 * @param captureContext Define the level of the message or pass in additional data to attach to the message.
 * @returns the id of the captured message.
 */ function captureMessage(message, // eslint-disable-next-line deprecation/deprecation
captureContext) {
    // This is necessary to provide explicit scopes upgrade, without changing the original
    // arity of the `captureMessage(message, level)` method.
    const level = typeof captureContext === "string" ? captureContext : undefined;
    const context = typeof captureContext !== "string" ? {
        captureContext
    } : undefined;
    // eslint-disable-next-line deprecation/deprecation
    return getCurrentHub().captureMessage(message, level, context);
}
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param exception The event to send to Sentry.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured event.
 */ function captureEvent(event, hint) {
    // eslint-disable-next-line deprecation/deprecation
    return getCurrentHub().captureEvent(event, hint);
}
/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 *
 * @deprecated Use getCurrentScope() directly.
 */ function configureScope(callback) {
    // eslint-disable-next-line deprecation/deprecation
    getCurrentHub().configureScope(callback);
}
/**
 * Records a new breadcrumb which will be attached to future events.
 *
 * Breadcrumbs will be added to subsequent events to provide more context on
 * user's actions prior to an error or crash.
 *
 * @param breadcrumb The breadcrumb to record.
 */ function addBreadcrumb(breadcrumb, hint) {
    // eslint-disable-next-line deprecation/deprecation
    hub_getCurrentHub().addBreadcrumb(breadcrumb, hint);
}
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function setContext(name, context) {
    // eslint-disable-next-line deprecation/deprecation
    getCurrentHub().setContext(name, context);
}
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */ function setExtras(extras) {
    // eslint-disable-next-line deprecation/deprecation
    getCurrentHub().setExtras(extras);
}
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */ function setExtra(key, extra) {
    // eslint-disable-next-line deprecation/deprecation
    getCurrentHub().setExtra(key, extra);
}
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */ function setTags(tags) {
    // eslint-disable-next-line deprecation/deprecation
    getCurrentHub().setTags(tags);
}
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */ function setTag(key, value) {
    // eslint-disable-next-line deprecation/deprecation
    getCurrentHub().setTag(key, value);
}
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */ function setUser(user) {
    // eslint-disable-next-line deprecation/deprecation
    getCurrentHub().setUser(user);
}
/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 *
 * This is essentially a convenience function for:
 *
 *     pushScope();
 *     callback();
 *     popScope();
 */ /**
 * Either creates a new active scope, or sets the given scope as active scope in the given callback.
 */ function exports_withScope(...rest) {
    // eslint-disable-next-line deprecation/deprecation
    const hub = hub_getCurrentHub();
    // If a scope is defined, we want to make this the active scope instead of the default one
    if (rest.length === 2) {
        const [scope, callback] = rest;
        if (!scope) {
            // eslint-disable-next-line deprecation/deprecation
            return hub.withScope(callback);
        }
        // eslint-disable-next-line deprecation/deprecation
        return hub.withScope(()=>{
            // eslint-disable-next-line deprecation/deprecation
            hub.getStackTop().scope = scope;
            return callback(scope);
        });
    }
    // eslint-disable-next-line deprecation/deprecation
    return hub.withScope(rest[0]);
}
/**
 * Attempts to fork the current isolation scope and the current scope based on the current async context strategy. If no
 * async context strategy is set, the isolation scope and the current scope will not be forked (this is currently the
 * case, for example, in the browser).
 *
 * Usage of this function in environments without async context strategy is discouraged and may lead to unexpected behaviour.
 *
 * This function is intended for Sentry SDK and SDK integration development. It is not recommended to be used in "normal"
 * applications directly because it comes with pitfalls. Use at your own risk!
 *
 * @param callback The callback in which the passed isolation scope is active. (Note: In environments without async
 * context strategy, the currently active isolation scope may change within execution of the callback.)
 * @returns The same value that `callback` returns.
 */ function withIsolationScope(callback) {
    return runWithAsyncContext(()=>{
        return callback(getIsolationScope());
    });
}
/**
 * Forks the current scope and sets the provided span as active span in the context of the provided callback.
 *
 * @param span Spans started in the context of the provided callback will be children of this span.
 * @param callback Execution context in which the provided span will be active. Is passed the newly forked scope.
 * @returns the value returned from the provided callback function.
 */ function withActiveSpan(span, callback) {
    return exports_withScope((scope)=>{
        // eslint-disable-next-line deprecation/deprecation
        scope.setSpan(span);
        return callback(scope);
    });
}
/**
 * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
 *
 * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
 * new child span within the transaction or any span, call the respective `.startChild()` method.
 *
 * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
 *
 * The transaction must be finished with a call to its `.end()` method, at which point the transaction with all its
 * finished child spans will be sent to Sentry.
 *
 * NOTE: This function should only be used for *manual* instrumentation. Auto-instrumentation should call
 * `startTransaction` directly on the hub.
 *
 * @param context Properties of the new `Transaction`.
 * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
 * default values). See {@link Options.tracesSampler}.
 *
 * @returns The transaction which was just started
 *
 * @deprecated Use `startSpan()`, `startSpanManual()` or `startInactiveSpan()` instead.
 */ function startTransaction(context, customSamplingContext) {
    // eslint-disable-next-line deprecation/deprecation
    return getCurrentHub().startTransaction({
        ...context
    }, customSamplingContext);
}
/**
 * Create a cron monitor check in and send it to Sentry.
 *
 * @param checkIn An object that describes a check in.
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function captureCheckIn(checkIn, upsertMonitorConfig) {
    const scope = exports_getCurrentScope();
    const client = exports_getClient();
    if (!client) {
        DEBUG_BUILD && logger.warn("Cannot capture check-in. No client defined.");
    } else if (!client.captureCheckIn) {
        DEBUG_BUILD && logger.warn("Cannot capture check-in. Client does not support sending check-ins.");
    } else {
        return client.captureCheckIn(checkIn, upsertMonitorConfig, scope);
    }
    return uuid4();
}
/**
 * Wraps a callback with a cron monitor check in. The check in will be sent to Sentry when the callback finishes.
 *
 * @param monitorSlug The distinct slug of the monitor.
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function withMonitor(monitorSlug, callback, upsertMonitorConfig) {
    const checkInId = captureCheckIn({
        monitorSlug,
        status: "in_progress"
    }, upsertMonitorConfig);
    const now = timestampInSeconds();
    function finishCheckIn(status) {
        captureCheckIn({
            monitorSlug,
            status,
            checkInId,
            duration: timestampInSeconds() - now
        });
    }
    let maybePromiseResult;
    try {
        maybePromiseResult = callback();
    } catch (e) {
        finishCheckIn("error");
        throw e;
    }
    if (isThenable(maybePromiseResult)) {
        Promise.resolve(maybePromiseResult).then(()=>{
            finishCheckIn("ok");
        }, ()=>{
            finishCheckIn("error");
        });
    } else {
        finishCheckIn("ok");
    }
    return maybePromiseResult;
}
/**
 * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
 * the client to wait until all events are sent before resolving the promise.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */ async function flush(timeout) {
    const client = exports_getClient();
    if (client) {
        return client.flush(timeout);
    }
    esm_debug_build_DEBUG_BUILD && logger_logger.warn("Cannot flush events. No client defined.");
    return Promise.resolve(false);
}
/**
 * Call `close()` on the current client, if there is one. See {@link Client.close}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue before shutting down. Omitting this
 * parameter will cause the client to wait until all events are sent before disabling itself.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */ async function exports_close(timeout) {
    const client = exports_getClient();
    if (client) {
        return client.close(timeout);
    }
    DEBUG_BUILD && logger.warn("Cannot flush events and disable SDK. No client defined.");
    return Promise.resolve(false);
}
/**
 * This is the getter for lastEventId.
 *
 * @returns The last event id of a captured event.
 * @deprecated This function will be removed in the next major version of the Sentry SDK.
 */ function lastEventId() {
    // eslint-disable-next-line deprecation/deprecation
    return getCurrentHub().lastEventId();
}
/**
 * Get the currently active client.
 */ function exports_getClient() {
    // eslint-disable-next-line deprecation/deprecation
    return hub_getCurrentHub().getClient();
}
/**
 * Returns true if Sentry has been properly initialized.
 */ function isInitialized() {
    return !!exports_getClient();
}
/**
 * Get the currently active scope.
 */ function exports_getCurrentScope() {
    // eslint-disable-next-line deprecation/deprecation
    return hub_getCurrentHub().getScope();
}
/**
 * Start a session on the current isolation scope.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns the new active session
 */ function startSession(context) {
    const client = exports_getClient();
    const isolationScope = getIsolationScope();
    const currentScope = exports_getCurrentScope();
    const { release, environment = DEFAULT_ENVIRONMENT } = client && client.getOptions() || {};
    // Will fetch userAgent if called from browser sdk
    const { userAgent } = GLOBAL_OBJ.navigator || {};
    const session = makeSession({
        release,
        environment,
        user: currentScope.getUser() || isolationScope.getUser(),
        ...userAgent && {
            userAgent
        },
        ...context
    });
    // End existing session if there's one
    const currentSession = isolationScope.getSession();
    if (currentSession && currentSession.status === "ok") {
        updateSession(currentSession, {
            status: "exited"
        });
    }
    endSession();
    // Afterwards we set the new session on the scope
    isolationScope.setSession(session);
    // TODO (v8): Remove this and only use the isolation scope(?).
    // For v7 though, we can't "soft-break" people using getCurrentHub().getScope().setSession()
    currentScope.setSession(session);
    return session;
}
/**
 * End the session on the current isolation scope.
 */ function endSession() {
    const isolationScope = getIsolationScope();
    const currentScope = exports_getCurrentScope();
    const session = currentScope.getSession() || isolationScope.getSession();
    if (session) {
        closeSession(session);
    }
    _sendSessionUpdate();
    // the session is over; take it off of the scope
    isolationScope.setSession();
    // TODO (v8): Remove this and only use the isolation scope(?).
    // For v7 though, we can't "soft-break" people using getCurrentHub().getScope().setSession()
    currentScope.setSession();
}
/**
 * Sends the current Session on the scope
 */ function _sendSessionUpdate() {
    const isolationScope = getIsolationScope();
    const currentScope = exports_getCurrentScope();
    const client = exports_getClient();
    // TODO (v8): Remove currentScope and only use the isolation scope(?).
    // For v7 though, we can't "soft-break" people using getCurrentHub().getScope().setSession()
    const session = currentScope.getSession() || isolationScope.getSession();
    if (session && client && client.captureSession) {
        client.captureSession(session);
    }
}
/**
 * Sends the current session on the scope to Sentry
 *
 * @param end If set the session will be marked as exited and removed from the scope.
 *            Defaults to `false`.
 */ function captureSession(end = false) {
    // both send the update and pull the session from the scope
    if (end) {
        endSession();
        return;
    }
    // only send the update
    _sendSessionUpdate();
}
 //# sourceMappingURL=exports.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/utils/getRootSpan.js
/**
 * Returns the root span of a given span.
 *
 * As long as we use `Transaction`s internally, the returned root span
 * will be a `Transaction` but be aware that this might change in the future.
 *
 * If the given span has no root span or transaction, `undefined` is returned.
 */ function getRootSpan(span) {
    // TODO (v8): Remove this check and just return span
    // eslint-disable-next-line deprecation/deprecation
    return span.transaction;
}
 //# sourceMappingURL=getRootSpan.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/tracing/dynamicSamplingContext.js





/**
 * Creates a dynamic sampling context from a client.
 *
 * Dispatches the `createDsc` lifecycle hook as a side effect.
 */ function getDynamicSamplingContextFromClient(trace_id, client, scope) {
    const options = client.getOptions();
    const { publicKey: public_key } = client.getDsn() || {};
    // TODO(v8): Remove segment from User
    // eslint-disable-next-line deprecation/deprecation
    const { segment: user_segment } = scope && scope.getUser() || {};
    const dsc = dropUndefinedKeys({
        environment: options.environment || constants_DEFAULT_ENVIRONMENT,
        release: options.release,
        user_segment,
        public_key,
        trace_id
    });
    client.emit && client.emit("createDsc", dsc);
    return dsc;
}
/**
 * A Span with a frozen dynamic sampling context.
 */ /**
 * Creates a dynamic sampling context from a span (and client and scope)
 *
 * @param span the span from which a few values like the root span name and sample rate are extracted.
 *
 * @returns a dynamic sampling context
 */ function getDynamicSamplingContextFromSpan(span) {
    const client = exports_getClient();
    if (!client) {
        return {};
    }
    // passing emit=false here to only emit later once the DSC is actually populated
    const dsc = getDynamicSamplingContextFromClient(spanUtils_spanToJSON(span).trace_id || "", client, exports_getCurrentScope());
    // TODO (v8): Remove v7FrozenDsc as a Transaction will no longer have _frozenDynamicSamplingContext
    const txn = getRootSpan(span);
    if (!txn) {
        return dsc;
    }
    // TODO (v8): Remove v7FrozenDsc as a Transaction will no longer have _frozenDynamicSamplingContext
    // For now we need to avoid breaking users who directly created a txn with a DSC, where this field is still set.
    // @see Transaction class constructor
    const v7FrozenDsc = txn && txn._frozenDynamicSamplingContext;
    if (v7FrozenDsc) {
        return v7FrozenDsc;
    }
    // TODO (v8): Replace txn.metadata with txn.attributes[]
    // We can't do this yet because attributes aren't always set yet.
    // eslint-disable-next-line deprecation/deprecation
    const { sampleRate: maybeSampleRate, source } = txn.metadata;
    if (maybeSampleRate != null) {
        dsc.sample_rate = `${maybeSampleRate}`;
    }
    // We don't want to have a transaction name in the DSC if the source is "url" because URLs might contain PII
    const jsonSpan = spanUtils_spanToJSON(txn);
    // after JSON conversion, txn.name becomes jsonSpan.description
    if (source && source !== "url") {
        dsc.transaction = jsonSpan.description;
    }
    dsc.sampled = String(spanIsSampled(txn));
    client.emit && client.emit("createDsc", dsc);
    return dsc;
}
 //# sourceMappingURL=dynamicSamplingContext.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/utils/applyScopeDataToEvent.js




/**
 * Applies data from the scope to the event and runs all event processors on it.
 */ function applyScopeDataToEvent(event, data) {
    const { fingerprint, span, breadcrumbs, sdkProcessingMetadata } = data;
    // Apply general data
    applyDataToEvent(event, data);
    // We want to set the trace context for normal events only if there isn't already
    // a trace context on the event. There is a product feature in place where we link
    // errors with transaction and it relies on that.
    if (span) {
        applySpanToEvent(event, span);
    }
    applyFingerprintToEvent(event, fingerprint);
    applyBreadcrumbsToEvent(event, breadcrumbs);
    applySdkMetadataToEvent(event, sdkProcessingMetadata);
}
/** Merge data of two scopes together. */ function mergeScopeData(data, mergeData) {
    const { extra, tags, user, contexts, level, sdkProcessingMetadata, breadcrumbs, fingerprint, eventProcessors, attachments, propagationContext, // eslint-disable-next-line deprecation/deprecation
    transactionName, span } = mergeData;
    mergeAndOverwriteScopeData(data, "extra", extra);
    mergeAndOverwriteScopeData(data, "tags", tags);
    mergeAndOverwriteScopeData(data, "user", user);
    mergeAndOverwriteScopeData(data, "contexts", contexts);
    mergeAndOverwriteScopeData(data, "sdkProcessingMetadata", sdkProcessingMetadata);
    if (level) {
        data.level = level;
    }
    if (transactionName) {
        // eslint-disable-next-line deprecation/deprecation
        data.transactionName = transactionName;
    }
    if (span) {
        data.span = span;
    }
    if (breadcrumbs.length) {
        data.breadcrumbs = [
            ...data.breadcrumbs,
            ...breadcrumbs
        ];
    }
    if (fingerprint.length) {
        data.fingerprint = [
            ...data.fingerprint,
            ...fingerprint
        ];
    }
    if (eventProcessors.length) {
        data.eventProcessors = [
            ...data.eventProcessors,
            ...eventProcessors
        ];
    }
    if (attachments.length) {
        data.attachments = [
            ...data.attachments,
            ...attachments
        ];
    }
    data.propagationContext = {
        ...data.propagationContext,
        ...propagationContext
    };
}
/**
 * Merges certain scope data. Undefined values will overwrite any existing values.
 * Exported only for tests.
 */ function mergeAndOverwriteScopeData(data, prop, mergeVal) {
    if (mergeVal && Object.keys(mergeVal).length) {
        // Clone object
        data[prop] = {
            ...data[prop]
        };
        for(const key in mergeVal){
            if (Object.prototype.hasOwnProperty.call(mergeVal, key)) {
                data[prop][key] = mergeVal[key];
            }
        }
    }
}
function applyDataToEvent(event, data) {
    const { extra, tags, user, contexts, level, // eslint-disable-next-line deprecation/deprecation
    transactionName } = data;
    const cleanedExtra = dropUndefinedKeys(extra);
    if (cleanedExtra && Object.keys(cleanedExtra).length) {
        event.extra = {
            ...cleanedExtra,
            ...event.extra
        };
    }
    const cleanedTags = dropUndefinedKeys(tags);
    if (cleanedTags && Object.keys(cleanedTags).length) {
        event.tags = {
            ...cleanedTags,
            ...event.tags
        };
    }
    const cleanedUser = dropUndefinedKeys(user);
    if (cleanedUser && Object.keys(cleanedUser).length) {
        event.user = {
            ...cleanedUser,
            ...event.user
        };
    }
    const cleanedContexts = dropUndefinedKeys(contexts);
    if (cleanedContexts && Object.keys(cleanedContexts).length) {
        event.contexts = {
            ...cleanedContexts,
            ...event.contexts
        };
    }
    if (level) {
        event.level = level;
    }
    if (transactionName) {
        event.transaction = transactionName;
    }
}
function applyBreadcrumbsToEvent(event, breadcrumbs) {
    const mergedBreadcrumbs = [
        ...event.breadcrumbs || [],
        ...breadcrumbs
    ];
    event.breadcrumbs = mergedBreadcrumbs.length ? mergedBreadcrumbs : undefined;
}
function applySdkMetadataToEvent(event, sdkProcessingMetadata) {
    event.sdkProcessingMetadata = {
        ...event.sdkProcessingMetadata,
        ...sdkProcessingMetadata
    };
}
function applySpanToEvent(event, span) {
    event.contexts = {
        trace: spanToTraceContext(span),
        ...event.contexts
    };
    const rootSpan = getRootSpan(span);
    if (rootSpan) {
        event.sdkProcessingMetadata = {
            dynamicSamplingContext: getDynamicSamplingContextFromSpan(span),
            ...event.sdkProcessingMetadata
        };
        const transactionName = spanUtils_spanToJSON(rootSpan).description;
        if (transactionName) {
            event.tags = {
                transaction: transactionName,
                ...event.tags
            };
        }
    }
}
/**
 * Applies fingerprint from the scope to the event if there's one,
 * uses message if there's one instead or get rid of empty fingerprint
 */ function applyFingerprintToEvent(event, fingerprint) {
    // Make sure it's an array first and we actually have something in place
    event.fingerprint = event.fingerprint ? arrayify(event.fingerprint) : [];
    // If we have something on the scope, then merge it with event
    if (fingerprint) {
        event.fingerprint = event.fingerprint.concat(fingerprint);
    }
    // If we have no data at all, remove empty array default
    if (event.fingerprint && !event.fingerprint.length) {
        delete event.fingerprint;
    }
}
 //# sourceMappingURL=applyScopeDataToEvent.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/scope.js




/**
 * Default value for maximum number of breadcrumbs added to an event.
 */ const DEFAULT_MAX_BREADCRUMBS = 100;
/**
 * The global scope is kept in this module.
 * When accessing this via `getGlobalScope()` we'll make sure to set one if none is currently present.
 */ let globalScope;
/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */ class Scope {
    /** Flag if notifying is happening. */ /** Callback for client to receive scope changes. */ /** Callback list that will be called after {@link applyToEvent}. */ /** Array of breadcrumbs. */ /** User */ /** Tags */ /** Extra */ /** Contexts */ /** Attachments */ /** Propagation Context for distributed tracing */ /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */ /** Fingerprint */ /** Severity */ // eslint-disable-next-line deprecation/deprecation
    /**
   * Transaction Name
   */ /** Span */ /** Session */ /** Request Mode Session Status */ /** The client on this scope */ // NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.
    constructor(){
        this._notifyingListeners = false;
        this._scopeListeners = [];
        this._eventProcessors = [];
        this._breadcrumbs = [];
        this._attachments = [];
        this._user = {};
        this._tags = {};
        this._extra = {};
        this._contexts = {};
        this._sdkProcessingMetadata = {};
        this._propagationContext = generatePropagationContext();
    }
    /**
   * Inherit values from the parent scope.
   * @deprecated Use `scope.clone()` and `new Scope()` instead.
   */ static clone(scope) {
        return scope ? scope.clone() : new Scope();
    }
    /**
   * Clone this scope instance.
   */ clone() {
        const newScope = new Scope();
        newScope._breadcrumbs = [
            ...this._breadcrumbs
        ];
        newScope._tags = {
            ...this._tags
        };
        newScope._extra = {
            ...this._extra
        };
        newScope._contexts = {
            ...this._contexts
        };
        newScope._user = this._user;
        newScope._level = this._level;
        newScope._span = this._span;
        newScope._session = this._session;
        newScope._transactionName = this._transactionName;
        newScope._fingerprint = this._fingerprint;
        newScope._eventProcessors = [
            ...this._eventProcessors
        ];
        newScope._requestSession = this._requestSession;
        newScope._attachments = [
            ...this._attachments
        ];
        newScope._sdkProcessingMetadata = {
            ...this._sdkProcessingMetadata
        };
        newScope._propagationContext = {
            ...this._propagationContext
        };
        newScope._client = this._client;
        return newScope;
    }
    /** Update the client on the scope. */ setClient(client) {
        this._client = client;
    }
    /**
   * Get the client assigned to this scope.
   *
   * It is generally recommended to use the global function `Sentry.getClient()` instead, unless you know what you are doing.
   */ getClient() {
        return this._client;
    }
    /**
   * Add internal on change listener. Used for sub SDKs that need to store the scope.
   * @hidden
   */ addScopeListener(callback) {
        this._scopeListeners.push(callback);
    }
    /**
   * @inheritDoc
   */ addEventProcessor(callback) {
        this._eventProcessors.push(callback);
        return this;
    }
    /**
   * @inheritDoc
   */ setUser(user) {
        // If null is passed we want to unset everything, but still define keys,
        // so that later down in the pipeline any existing values are cleared.
        this._user = user || {
            email: undefined,
            id: undefined,
            ip_address: undefined,
            segment: undefined,
            username: undefined
        };
        if (this._session) {
            session_updateSession(this._session, {
                user
            });
        }
        this._notifyScopeListeners();
        return this;
    }
    /**
   * @inheritDoc
   */ getUser() {
        return this._user;
    }
    /**
   * @inheritDoc
   */ getRequestSession() {
        return this._requestSession;
    }
    /**
   * @inheritDoc
   */ setRequestSession(requestSession) {
        this._requestSession = requestSession;
        return this;
    }
    /**
   * @inheritDoc
   */ setTags(tags) {
        this._tags = {
            ...this._tags,
            ...tags
        };
        this._notifyScopeListeners();
        return this;
    }
    /**
   * @inheritDoc
   */ setTag(key, value) {
        this._tags = {
            ...this._tags,
            [key]: value
        };
        this._notifyScopeListeners();
        return this;
    }
    /**
   * @inheritDoc
   */ setExtras(extras) {
        this._extra = {
            ...this._extra,
            ...extras
        };
        this._notifyScopeListeners();
        return this;
    }
    /**
   * @inheritDoc
   */ setExtra(key, extra) {
        this._extra = {
            ...this._extra,
            [key]: extra
        };
        this._notifyScopeListeners();
        return this;
    }
    /**
   * @inheritDoc
   */ setFingerprint(fingerprint) {
        this._fingerprint = fingerprint;
        this._notifyScopeListeners();
        return this;
    }
    /**
   * @inheritDoc
   */ setLevel(// eslint-disable-next-line deprecation/deprecation
    level) {
        this._level = level;
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Sets the transaction name on the scope for future events.
   * @deprecated Use extra or tags instead.
   */ setTransactionName(name) {
        this._transactionName = name;
        this._notifyScopeListeners();
        return this;
    }
    /**
   * @inheritDoc
   */ setContext(key, context) {
        if (context === null) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._contexts[key];
        } else {
            this._contexts[key] = context;
        }
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Sets the Span on the scope.
   * @param span Span
   * @deprecated Instead of setting a span on a scope, use `startSpan()`/`startSpanManual()` instead.
   */ setSpan(span) {
        this._span = span;
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Returns the `Span` if there is one.
   * @deprecated Use `getActiveSpan()` instead.
   */ getSpan() {
        return this._span;
    }
    /**
   * Returns the `Transaction` attached to the scope (if there is one).
   * @deprecated You should not rely on the transaction, but just use `startSpan()` APIs instead.
   */ getTransaction() {
        // Often, this span (if it exists at all) will be a transaction, but it's not guaranteed to be. Regardless, it will
        // have a pointer to the currently-active transaction.
        const span = this._span;
        // Cannot replace with getRootSpan because getRootSpan returns a span, not a transaction
        // Also, this method will be removed anyway.
        // eslint-disable-next-line deprecation/deprecation
        return span && span.transaction;
    }
    /**
   * @inheritDoc
   */ setSession(session) {
        if (!session) {
            delete this._session;
        } else {
            this._session = session;
        }
        this._notifyScopeListeners();
        return this;
    }
    /**
   * @inheritDoc
   */ getSession() {
        return this._session;
    }
    /**
   * @inheritDoc
   */ update(captureContext) {
        if (!captureContext) {
            return this;
        }
        if (typeof captureContext === "function") {
            const updatedScope = captureContext(this);
            return updatedScope instanceof Scope ? updatedScope : this;
        }
        if (captureContext instanceof Scope) {
            this._tags = {
                ...this._tags,
                ...captureContext._tags
            };
            this._extra = {
                ...this._extra,
                ...captureContext._extra
            };
            this._contexts = {
                ...this._contexts,
                ...captureContext._contexts
            };
            if (captureContext._user && Object.keys(captureContext._user).length) {
                this._user = captureContext._user;
            }
            if (captureContext._level) {
                this._level = captureContext._level;
            }
            if (captureContext._fingerprint) {
                this._fingerprint = captureContext._fingerprint;
            }
            if (captureContext._requestSession) {
                this._requestSession = captureContext._requestSession;
            }
            if (captureContext._propagationContext) {
                this._propagationContext = captureContext._propagationContext;
            }
        } else if (isPlainObject(captureContext)) {
            // eslint-disable-next-line no-param-reassign
            captureContext = captureContext;
            this._tags = {
                ...this._tags,
                ...captureContext.tags
            };
            this._extra = {
                ...this._extra,
                ...captureContext.extra
            };
            this._contexts = {
                ...this._contexts,
                ...captureContext.contexts
            };
            if (captureContext.user) {
                this._user = captureContext.user;
            }
            if (captureContext.level) {
                this._level = captureContext.level;
            }
            if (captureContext.fingerprint) {
                this._fingerprint = captureContext.fingerprint;
            }
            if (captureContext.requestSession) {
                this._requestSession = captureContext.requestSession;
            }
            if (captureContext.propagationContext) {
                this._propagationContext = captureContext.propagationContext;
            }
        }
        return this;
    }
    /**
   * @inheritDoc
   */ clear() {
        this._breadcrumbs = [];
        this._tags = {};
        this._extra = {};
        this._user = {};
        this._contexts = {};
        this._level = undefined;
        this._transactionName = undefined;
        this._fingerprint = undefined;
        this._requestSession = undefined;
        this._span = undefined;
        this._session = undefined;
        this._notifyScopeListeners();
        this._attachments = [];
        this._propagationContext = generatePropagationContext();
        return this;
    }
    /**
   * @inheritDoc
   */ addBreadcrumb(breadcrumb, maxBreadcrumbs) {
        const maxCrumbs = typeof maxBreadcrumbs === "number" ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS;
        // No data has been changed, so don't notify scope listeners
        if (maxCrumbs <= 0) {
            return this;
        }
        const mergedBreadcrumb = {
            timestamp: dateTimestampInSeconds(),
            ...breadcrumb
        };
        const breadcrumbs = this._breadcrumbs;
        breadcrumbs.push(mergedBreadcrumb);
        this._breadcrumbs = breadcrumbs.length > maxCrumbs ? breadcrumbs.slice(-maxCrumbs) : breadcrumbs;
        this._notifyScopeListeners();
        return this;
    }
    /**
   * @inheritDoc
   */ getLastBreadcrumb() {
        return this._breadcrumbs[this._breadcrumbs.length - 1];
    }
    /**
   * @inheritDoc
   */ clearBreadcrumbs() {
        this._breadcrumbs = [];
        this._notifyScopeListeners();
        return this;
    }
    /**
   * @inheritDoc
   */ addAttachment(attachment) {
        this._attachments.push(attachment);
        return this;
    }
    /**
   * @inheritDoc
   * @deprecated Use `getScopeData()` instead.
   */ getAttachments() {
        const data = this.getScopeData();
        return data.attachments;
    }
    /**
   * @inheritDoc
   */ clearAttachments() {
        this._attachments = [];
        return this;
    }
    /** @inheritDoc */ getScopeData() {
        const { _breadcrumbs, _attachments, _contexts, _tags, _extra, _user, _level, _fingerprint, _eventProcessors, _propagationContext, _sdkProcessingMetadata, _transactionName, _span } = this;
        return {
            breadcrumbs: _breadcrumbs,
            attachments: _attachments,
            contexts: _contexts,
            tags: _tags,
            extra: _extra,
            user: _user,
            level: _level,
            fingerprint: _fingerprint || [],
            eventProcessors: _eventProcessors,
            propagationContext: _propagationContext,
            sdkProcessingMetadata: _sdkProcessingMetadata,
            transactionName: _transactionName,
            span: _span
        };
    }
    /**
   * Applies data from the scope to the event and runs all event processors on it.
   *
   * @param event Event
   * @param hint Object containing additional information about the original exception, for use by the event processors.
   * @hidden
   * @deprecated Use `applyScopeDataToEvent()` directly
   */ applyToEvent(event, hint = {}, additionalEventProcessors = []) {
        applyScopeDataToEvent(event, this.getScopeData());
        // TODO (v8): Update this order to be: Global > Client > Scope
        const eventProcessors = [
            ...additionalEventProcessors,
            // eslint-disable-next-line deprecation/deprecation
            ...getGlobalEventProcessors(),
            ...this._eventProcessors
        ];
        return notifyEventProcessors(eventProcessors, event, hint);
    }
    /**
   * Add data which will be accessible during event processing but won't get sent to Sentry
   */ setSDKProcessingMetadata(newData) {
        this._sdkProcessingMetadata = {
            ...this._sdkProcessingMetadata,
            ...newData
        };
        return this;
    }
    /**
   * @inheritDoc
   */ setPropagationContext(context) {
        this._propagationContext = context;
        return this;
    }
    /**
   * @inheritDoc
   */ getPropagationContext() {
        return this._propagationContext;
    }
    /**
   * Capture an exception for this scope.
   *
   * @param exception The exception to capture.
   * @param hint Optinal additional data to attach to the Sentry event.
   * @returns the id of the captured Sentry event.
   */ captureException(exception, hint) {
        const eventId = hint && hint.event_id ? hint.event_id : misc_uuid4();
        if (!this._client) {
            logger_logger.warn("No client configured on scope - will not capture exception!");
            return eventId;
        }
        const syntheticException = new Error("Sentry syntheticException");
        this._client.captureException(exception, {
            originalException: exception,
            syntheticException,
            ...hint,
            event_id: eventId
        }, this);
        return eventId;
    }
    /**
   * Capture a message for this scope.
   *
   * @param message The message to capture.
   * @param level An optional severity level to report the message with.
   * @param hint Optional additional data to attach to the Sentry event.
   * @returns the id of the captured message.
   */ captureMessage(message, level, hint) {
        const eventId = hint && hint.event_id ? hint.event_id : misc_uuid4();
        if (!this._client) {
            logger_logger.warn("No client configured on scope - will not capture message!");
            return eventId;
        }
        const syntheticException = new Error(message);
        this._client.captureMessage(message, level, {
            originalException: message,
            syntheticException,
            ...hint,
            event_id: eventId
        }, this);
        return eventId;
    }
    /**
   * Captures a manually created event for this scope and sends it to Sentry.
   *
   * @param exception The event to capture.
   * @param hint Optional additional data to attach to the Sentry event.
   * @returns the id of the captured event.
   */ captureEvent(event, hint) {
        const eventId = hint && hint.event_id ? hint.event_id : misc_uuid4();
        if (!this._client) {
            logger_logger.warn("No client configured on scope - will not capture event!");
            return eventId;
        }
        this._client.captureEvent(event, {
            ...hint,
            event_id: eventId
        }, this);
        return eventId;
    }
    /**
   * This will be called on every set call.
   */ _notifyScopeListeners() {
        // We need this check for this._notifyingListeners to be able to work on scope during updates
        // If this check is not here we'll produce endless recursion when something is done with the scope
        // during the callback.
        if (!this._notifyingListeners) {
            this._notifyingListeners = true;
            this._scopeListeners.forEach((callback)=>{
                callback(this);
            });
            this._notifyingListeners = false;
        }
    }
}
/**
 * Get the global scope.
 * This scope is applied to _all_ events.
 */ function getGlobalScope() {
    if (!globalScope) {
        globalScope = new Scope();
    }
    return globalScope;
}
/**
 * This is mainly needed for tests.
 * DO NOT USE this, as this is an internal API and subject to change.
 * @hidden
 */ function setGlobalScope(scope) {
    globalScope = scope;
}
function generatePropagationContext() {
    return {
        traceId: misc_uuid4(),
        spanId: misc_uuid4().substring(16)
    };
}
 //# sourceMappingURL=scope.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/version.js
const SDK_VERSION = "7.100.0";
 //# sourceMappingURL=version.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/hub.js






/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */ const API_VERSION = parseFloat(SDK_VERSION);
/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */ const DEFAULT_BREADCRUMBS = 100;
/**
 * @inheritDoc
 */ class Hub {
    /** Is a {@link Layer}[] containing the client and scope */ /** Contains the last event id of a captured event.  */ /**
   * Creates a new instance of the hub, will push one {@link Layer} into the
   * internal stack on creation.
   *
   * @param client bound to the hub.
   * @param scope bound to the hub.
   * @param version number, higher number means higher priority.
   */ constructor(client, scope, isolationScope, _version = API_VERSION){
        this._version = _version;
        let assignedScope;
        if (!scope) {
            assignedScope = new Scope();
            assignedScope.setClient(client);
        } else {
            assignedScope = scope;
        }
        let assignedIsolationScope;
        if (!isolationScope) {
            assignedIsolationScope = new Scope();
            assignedIsolationScope.setClient(client);
        } else {
            assignedIsolationScope = isolationScope;
        }
        this._stack = [
            {
                scope: assignedScope
            }
        ];
        if (client) {
            // eslint-disable-next-line deprecation/deprecation
            this.bindClient(client);
        }
        this._isolationScope = assignedIsolationScope;
    }
    /**
   * Checks if this hub's version is older than the given version.
   *
   * @param version A version number to compare to.
   * @return True if the given version is newer; otherwise false.
   *
   * @deprecated This will be removed in v8.
   */ isOlderThan(version) {
        return this._version < version;
    }
    /**
   * This binds the given client to the current scope.
   * @param client An SDK client (client) instance.
   *
   * @deprecated Use `initAndBind()` directly, or `setCurrentClient()` and/or `client.init()` instead.
   */ bindClient(client) {
        // eslint-disable-next-line deprecation/deprecation
        const top = this.getStackTop();
        top.client = client;
        top.scope.setClient(client);
        // eslint-disable-next-line deprecation/deprecation
        if (client && client.setupIntegrations) {
            // eslint-disable-next-line deprecation/deprecation
            client.setupIntegrations();
        }
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `withScope` instead.
   */ pushScope() {
        // We want to clone the content of prev scope
        // eslint-disable-next-line deprecation/deprecation
        const scope = this.getScope().clone();
        // eslint-disable-next-line deprecation/deprecation
        this.getStack().push({
            // eslint-disable-next-line deprecation/deprecation
            client: this.getClient(),
            scope
        });
        return scope;
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `withScope` instead.
   */ popScope() {
        // eslint-disable-next-line deprecation/deprecation
        if (this.getStack().length <= 1) return false;
        // eslint-disable-next-line deprecation/deprecation
        return !!this.getStack().pop();
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `Sentry.withScope()` instead.
   */ withScope(callback) {
        // eslint-disable-next-line deprecation/deprecation
        const scope = this.pushScope();
        let maybePromiseResult;
        try {
            maybePromiseResult = callback(scope);
        } catch (e) {
            // eslint-disable-next-line deprecation/deprecation
            this.popScope();
            throw e;
        }
        if (is_isThenable(maybePromiseResult)) {
            // @ts-expect-error - isThenable returns the wrong type
            return maybePromiseResult.then((res)=>{
                // eslint-disable-next-line deprecation/deprecation
                this.popScope();
                return res;
            }, (e)=>{
                // eslint-disable-next-line deprecation/deprecation
                this.popScope();
                throw e;
            });
        }
        // eslint-disable-next-line deprecation/deprecation
        this.popScope();
        return maybePromiseResult;
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `Sentry.getClient()` instead.
   */ getClient() {
        // eslint-disable-next-line deprecation/deprecation
        return this.getStackTop().client;
    }
    /**
   * Returns the scope of the top stack.
   *
   * @deprecated Use `Sentry.getCurrentScope()` instead.
   */ getScope() {
        // eslint-disable-next-line deprecation/deprecation
        return this.getStackTop().scope;
    }
    /**
   * @deprecated Use `Sentry.getIsolationScope()` instead.
   */ getIsolationScope() {
        return this._isolationScope;
    }
    /**
   * Returns the scope stack for domains or the process.
   * @deprecated This will be removed in v8.
   */ getStack() {
        return this._stack;
    }
    /**
   * Returns the topmost scope layer in the order domain > local > process.
   * @deprecated This will be removed in v8.
   */ getStackTop() {
        return this._stack[this._stack.length - 1];
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `Sentry.captureException()` instead.
   */ captureException(exception, hint) {
        const eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : misc_uuid4();
        const syntheticException = new Error("Sentry syntheticException");
        // eslint-disable-next-line deprecation/deprecation
        this.getScope().captureException(exception, {
            originalException: exception,
            syntheticException,
            ...hint,
            event_id: eventId
        });
        return eventId;
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use  `Sentry.captureMessage()` instead.
   */ captureMessage(message, // eslint-disable-next-line deprecation/deprecation
    level, hint) {
        const eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : misc_uuid4();
        const syntheticException = new Error(message);
        // eslint-disable-next-line deprecation/deprecation
        this.getScope().captureMessage(message, level, {
            originalException: message,
            syntheticException,
            ...hint,
            event_id: eventId
        });
        return eventId;
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `Sentry.captureEvent()` instead.
   */ captureEvent(event, hint) {
        const eventId = hint && hint.event_id ? hint.event_id : misc_uuid4();
        if (!event.type) {
            this._lastEventId = eventId;
        }
        // eslint-disable-next-line deprecation/deprecation
        this.getScope().captureEvent(event, {
            ...hint,
            event_id: eventId
        });
        return eventId;
    }
    /**
   * @inheritDoc
   *
   * @deprecated This will be removed in v8.
   */ lastEventId() {
        return this._lastEventId;
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `Sentry.addBreadcrumb()` instead.
   */ addBreadcrumb(breadcrumb, hint) {
        // eslint-disable-next-line deprecation/deprecation
        const { scope, client } = this.getStackTop();
        if (!client) return;
        const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } = client.getOptions && client.getOptions() || {};
        if (maxBreadcrumbs <= 0) return;
        const timestamp = dateTimestampInSeconds();
        const mergedBreadcrumb = {
            timestamp,
            ...breadcrumb
        };
        const finalBreadcrumb = beforeBreadcrumb ? consoleSandbox(()=>beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
        if (finalBreadcrumb === null) return;
        if (client.emit) {
            client.emit("beforeAddBreadcrumb", finalBreadcrumb, hint);
        }
        // TODO(v8): I know this comment doesn't make much sense because the hub will be deprecated but I still wanted to
        // write it down. In theory, we would have to add the breadcrumbs to the isolation scope here, however, that would
        // duplicate all of the breadcrumbs. There was the possibility of adding breadcrumbs to both, the isolation scope
        // and the normal scope, and deduplicating it down the line in the event processing pipeline. However, that would
        // have been very fragile, because the breadcrumb objects would have needed to keep their identity all throughout
        // the event processing pipeline.
        // In the new implementation, the top level `Sentry.addBreadcrumb()` should ONLY write to the isolation scope.
        scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
    }
    /**
   * @inheritDoc
   * @deprecated Use `Sentry.setUser()` instead.
   */ setUser(user) {
        // TODO(v8): The top level `Sentry.setUser()` function should write ONLY to the isolation scope.
        // eslint-disable-next-line deprecation/deprecation
        this.getScope().setUser(user);
        // eslint-disable-next-line deprecation/deprecation
        this.getIsolationScope().setUser(user);
    }
    /**
   * @inheritDoc
   * @deprecated Use `Sentry.setTags()` instead.
   */ setTags(tags) {
        // TODO(v8): The top level `Sentry.setTags()` function should write ONLY to the isolation scope.
        // eslint-disable-next-line deprecation/deprecation
        this.getScope().setTags(tags);
        // eslint-disable-next-line deprecation/deprecation
        this.getIsolationScope().setTags(tags);
    }
    /**
   * @inheritDoc
   * @deprecated Use `Sentry.setExtras()` instead.
   */ setExtras(extras) {
        // TODO(v8): The top level `Sentry.setExtras()` function should write ONLY to the isolation scope.
        // eslint-disable-next-line deprecation/deprecation
        this.getScope().setExtras(extras);
        // eslint-disable-next-line deprecation/deprecation
        this.getIsolationScope().setExtras(extras);
    }
    /**
   * @inheritDoc
   * @deprecated Use `Sentry.setTag()` instead.
   */ setTag(key, value) {
        // TODO(v8): The top level `Sentry.setTag()` function should write ONLY to the isolation scope.
        // eslint-disable-next-line deprecation/deprecation
        this.getScope().setTag(key, value);
        // eslint-disable-next-line deprecation/deprecation
        this.getIsolationScope().setTag(key, value);
    }
    /**
   * @inheritDoc
   * @deprecated Use `Sentry.setExtra()` instead.
   */ setExtra(key, extra) {
        // TODO(v8): The top level `Sentry.setExtra()` function should write ONLY to the isolation scope.
        // eslint-disable-next-line deprecation/deprecation
        this.getScope().setExtra(key, extra);
        // eslint-disable-next-line deprecation/deprecation
        this.getIsolationScope().setExtra(key, extra);
    }
    /**
   * @inheritDoc
   * @deprecated Use `Sentry.setContext()` instead.
   */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setContext(name, context) {
        // TODO(v8): The top level `Sentry.setContext()` function should write ONLY to the isolation scope.
        // eslint-disable-next-line deprecation/deprecation
        this.getScope().setContext(name, context);
        // eslint-disable-next-line deprecation/deprecation
        this.getIsolationScope().setContext(name, context);
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `getScope()` directly.
   */ configureScope(callback) {
        // eslint-disable-next-line deprecation/deprecation
        const { scope, client } = this.getStackTop();
        if (client) {
            callback(scope);
        }
    }
    /**
   * @inheritDoc
   */ run(callback) {
        // eslint-disable-next-line deprecation/deprecation
        const oldHub = makeMain(this);
        try {
            callback(this);
        } finally{
            // eslint-disable-next-line deprecation/deprecation
            makeMain(oldHub);
        }
    }
    /**
   * @inheritDoc
   * @deprecated Use `Sentry.getClient().getIntegrationByName()` instead.
   */ getIntegration(integration) {
        // eslint-disable-next-line deprecation/deprecation
        const client = this.getClient();
        if (!client) return null;
        try {
            // eslint-disable-next-line deprecation/deprecation
            return client.getIntegration(integration);
        } catch (_oO) {
            esm_debug_build_DEBUG_BUILD && logger_logger.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);
            return null;
        }
    }
    /**
   * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
   *
   * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
   * new child span within the transaction or any span, call the respective `.startChild()` method.
   *
   * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
   *
   * The transaction must be finished with a call to its `.end()` method, at which point the transaction with all its
   * finished child spans will be sent to Sentry.
   *
   * @param context Properties of the new `Transaction`.
   * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
   * default values). See {@link Options.tracesSampler}.
   *
   * @returns The transaction which was just started
   *
   * @deprecated Use `startSpan()`, `startSpanManual()` or `startInactiveSpan()` instead.
   */ startTransaction(context, customSamplingContext) {
        const result = this._callExtensionMethod("startTransaction", context, customSamplingContext);
        if (esm_debug_build_DEBUG_BUILD && !result) {
            // eslint-disable-next-line deprecation/deprecation
            const client = this.getClient();
            if (!client) {
                logger_logger.warn("Tracing extension 'startTransaction' is missing. You should 'init' the SDK before calling 'startTransaction'");
            } else {
                logger_logger.warn(`Tracing extension 'startTransaction' has not been added. Call 'addTracingExtensions' before calling 'init':
Sentry.addTracingExtensions();
Sentry.init({...});
`);
            }
        }
        return result;
    }
    /**
   * @inheritDoc
   * @deprecated Use `spanToTraceHeader()` instead.
   */ traceHeaders() {
        return this._callExtensionMethod("traceHeaders");
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use top level `captureSession` instead.
   */ captureSession(endSession = false) {
        // both send the update and pull the session from the scope
        if (endSession) {
            // eslint-disable-next-line deprecation/deprecation
            return this.endSession();
        }
        // only send the update
        this._sendSessionUpdate();
    }
    /**
   * @inheritDoc
   * @deprecated Use top level `endSession` instead.
   */ endSession() {
        // eslint-disable-next-line deprecation/deprecation
        const layer = this.getStackTop();
        const scope = layer.scope;
        const session = scope.getSession();
        if (session) {
            session_closeSession(session);
        }
        this._sendSessionUpdate();
        // the session is over; take it off of the scope
        scope.setSession();
    }
    /**
   * @inheritDoc
   * @deprecated Use top level `startSession` instead.
   */ startSession(context) {
        // eslint-disable-next-line deprecation/deprecation
        const { scope, client } = this.getStackTop();
        const { release, environment = constants_DEFAULT_ENVIRONMENT } = client && client.getOptions() || {};
        // Will fetch userAgent if called from browser sdk
        const { userAgent } = worldwide_GLOBAL_OBJ.navigator || {};
        const session = session_makeSession({
            release,
            environment,
            user: scope.getUser(),
            ...userAgent && {
                userAgent
            },
            ...context
        });
        // End existing session if there's one
        const currentSession = scope.getSession && scope.getSession();
        if (currentSession && currentSession.status === "ok") {
            session_updateSession(currentSession, {
                status: "exited"
            });
        }
        // eslint-disable-next-line deprecation/deprecation
        this.endSession();
        // Afterwards we set the new session on the scope
        scope.setSession(session);
        return session;
    }
    /**
   * Returns if default PII should be sent to Sentry and propagated in ourgoing requests
   * when Tracing is used.
   *
   * @deprecated Use top-level `getClient().getOptions().sendDefaultPii` instead. This function
   * only unnecessarily increased API surface but only wrapped accessing the option.
   */ shouldSendDefaultPii() {
        // eslint-disable-next-line deprecation/deprecation
        const client = this.getClient();
        const options = client && client.getOptions();
        return Boolean(options && options.sendDefaultPii);
    }
    /**
   * Sends the current Session on the scope
   */ _sendSessionUpdate() {
        // eslint-disable-next-line deprecation/deprecation
        const { scope, client } = this.getStackTop();
        const session = scope.getSession();
        if (session && client && client.captureSession) {
            client.captureSession(session);
        }
    }
    /**
   * Calls global extension method and binding current instance to the function call
   */ // @ts-expect-error Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _callExtensionMethod(method, ...args) {
        const carrier = getMainCarrier();
        const sentry = carrier.__SENTRY__;
        if (sentry && sentry.extensions && typeof sentry.extensions[method] === "function") {
            return sentry.extensions[method].apply(this, args);
        }
        esm_debug_build_DEBUG_BUILD && logger_logger.warn(`Extension method ${method} couldn't be found, doing nothing.`);
    }
}
/**
 * Returns the global shim registry.
 *
 * FIXME: This function is problematic, because despite always returning a valid Carrier,
 * it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
 * at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
 **/ function getMainCarrier() {
    worldwide_GLOBAL_OBJ.__SENTRY__ = worldwide_GLOBAL_OBJ.__SENTRY__ || {
        extensions: {},
        hub: undefined
    };
    return worldwide_GLOBAL_OBJ;
}
/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 *
 * @deprecated Use `setCurrentClient()` instead.
 */ function makeMain(hub) {
    const registry = getMainCarrier();
    const oldHub = getHubFromCarrier(registry);
    setHubOnCarrier(registry, hub);
    return oldHub;
}
/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 *
 * @deprecated Use the respective replacement method directly instead.
 */ function hub_getCurrentHub() {
    // Get main carrier (global for every environment)
    const registry = getMainCarrier();
    if (registry.__SENTRY__ && registry.__SENTRY__.acs) {
        const hub = registry.__SENTRY__.acs.getCurrentHub();
        if (hub) {
            return hub;
        }
    }
    // Return hub that lives on a global object
    return getGlobalHub(registry);
}
/**
 * Get the currently active isolation scope.
 * The isolation scope is active for the current exection context,
 * meaning that it will remain stable for the same Hub.
 */ function hub_getIsolationScope() {
    // eslint-disable-next-line deprecation/deprecation
    return hub_getCurrentHub().getIsolationScope();
}
function getGlobalHub(registry = getMainCarrier()) {
    // If there's no hub, or its an old API, assign a new one
    if (!hasHubOnCarrier(registry) || // eslint-disable-next-line deprecation/deprecation
    getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
        setHubOnCarrier(registry, new Hub());
    }
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
}
/**
 * @private Private API with no semver guarantees!
 *
 * If the carrier does not contain a hub, a new hub is created with the global hub client and scope.
 */ function ensureHubOnCarrier(carrier, parent = getGlobalHub()) {
    // If there's no hub on current domain, or it's an old API, assign a new one
    if (!hasHubOnCarrier(carrier) || // eslint-disable-next-line deprecation/deprecation
    getHubFromCarrier(carrier).isOlderThan(API_VERSION)) {
        // eslint-disable-next-line deprecation/deprecation
        const client = parent.getClient();
        // eslint-disable-next-line deprecation/deprecation
        const scope = parent.getScope();
        // eslint-disable-next-line deprecation/deprecation
        const isolationScope = parent.getIsolationScope();
        setHubOnCarrier(carrier, new Hub(client, scope.clone(), isolationScope.clone()));
    }
}
/**
 * @private Private API with no semver guarantees!
 *
 * Sets the global async context strategy
 */ function setAsyncContextStrategy(strategy) {
    // Get main carrier (global for every environment)
    const registry = getMainCarrier();
    registry.__SENTRY__ = registry.__SENTRY__ || {};
    registry.__SENTRY__.acs = strategy;
}
/**
 * Runs the supplied callback in its own async context. Async Context strategies are defined per SDK.
 *
 * @param callback The callback to run in its own async context
 * @param options Options to pass to the async context strategy
 * @returns The result of the callback
 */ function hub_runWithAsyncContext(callback, options = {}) {
    const registry = getMainCarrier();
    if (registry.__SENTRY__ && registry.__SENTRY__.acs) {
        return registry.__SENTRY__.acs.runWithAsyncContext(callback, options);
    }
    // if there was no strategy, fallback to just calling the callback
    return callback();
}
/**
 * This will tell whether a carrier has a hub on it or not
 * @param carrier object
 */ function hasHubOnCarrier(carrier) {
    return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}
/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */ function getHubFromCarrier(carrier) {
    return getGlobalSingleton("hub", ()=>new Hub(), carrier);
}
/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 * @returns A boolean indicating success or failure
 */ function setHubOnCarrier(carrier, hub) {
    if (!carrier) return false;
    const __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};
    __SENTRY__.hub = hub;
    return true;
}
 //# sourceMappingURL=hub.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/instrument/_handlers.js



// We keep the handlers globally
const handlers = {};
const instrumented = {};
/** Add a handler function. */ function addHandler(type, handler) {
    handlers[type] = handlers[type] || [];
    handlers[type].push(handler);
}
/**
 * Reset all instrumentation handlers.
 * This can be used by tests to ensure we have a clean slate of instrumentation handlers.
 */ function resetInstrumentationHandlers() {
    Object.keys(handlers).forEach((key)=>{
        handlers[key] = undefined;
    });
}
/** Maybe run an instrumentation function, unless it was already called. */ function maybeInstrument(type, instrumentFn) {
    if (!instrumented[type]) {
        instrumentFn();
        instrumented[type] = true;
    }
}
/** Trigger handlers for a given instrumentation type. */ function triggerHandlers(type, data) {
    const typeHandlers = type && handlers[type];
    if (!typeHandlers) {
        return;
    }
    for (const handler of typeHandlers){
        try {
            handler(data);
        } catch (e) {
            debug_build_DEBUG_BUILD && logger_logger.error(`Error while triggering instrumentation handler.\nType: ${type}\nName: ${getFunctionName(handler)}\nError:`, e);
        }
    }
}
 //# sourceMappingURL=_handlers.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/instrument/globalError.js


let _oldOnErrorHandler = null;
/**
 * Add an instrumentation handler for when an error is captured by the global error handler.
 *
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */ function addGlobalErrorInstrumentationHandler(handler) {
    const type = "error";
    addHandler(type, handler);
    maybeInstrument(type, instrumentError);
}
function instrumentError() {
    _oldOnErrorHandler = worldwide_GLOBAL_OBJ.onerror;
    worldwide_GLOBAL_OBJ.onerror = function(msg, url, line, column, error) {
        const handlerData = {
            column,
            error,
            line,
            msg,
            url
        };
        triggerHandlers("error", handlerData);
        if (_oldOnErrorHandler && !_oldOnErrorHandler.__SENTRY_LOADER__) {
            // eslint-disable-next-line prefer-rest-params
            return _oldOnErrorHandler.apply(this, arguments);
        }
        return false;
    };
    worldwide_GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = true;
}
 //# sourceMappingURL=globalError.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/instrument/globalUnhandledRejection.js


let _oldOnUnhandledRejectionHandler = null;
/**
 * Add an instrumentation handler for when an unhandled promise rejection is captured.
 *
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */ function addGlobalUnhandledRejectionInstrumentationHandler(handler) {
    const type = "unhandledrejection";
    addHandler(type, handler);
    maybeInstrument(type, instrumentUnhandledRejection);
}
function instrumentUnhandledRejection() {
    _oldOnUnhandledRejectionHandler = worldwide_GLOBAL_OBJ.onunhandledrejection;
    worldwide_GLOBAL_OBJ.onunhandledrejection = function(e) {
        const handlerData = e;
        triggerHandlers("unhandledrejection", handlerData);
        if (_oldOnUnhandledRejectionHandler && !_oldOnUnhandledRejectionHandler.__SENTRY_LOADER__) {
            // eslint-disable-next-line prefer-rest-params
            return _oldOnUnhandledRejectionHandler.apply(this, arguments);
        }
        return true;
    };
    worldwide_GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
}
 //# sourceMappingURL=globalUnhandledRejection.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/tracing/utils.js



/**
 * Grabs active transaction off scope.
 *
 * @deprecated You should not rely on the transaction, but just use `startSpan()` APIs instead.
 */ function getActiveTransaction(maybeHub) {
    // eslint-disable-next-line deprecation/deprecation
    const hub = maybeHub || hub_getCurrentHub();
    // eslint-disable-next-line deprecation/deprecation
    const scope = hub.getScope();
    // eslint-disable-next-line deprecation/deprecation
    return scope.getTransaction();
}
/**
 * The `extractTraceparentData` function and `TRACEPARENT_REGEXP` constant used
 * to be declared in this file. It was later moved into `@sentry/utils` as part of a
 * move to remove `@sentry/tracing` dependencies from `@sentry/node` (`extractTraceparentData`
 * is the only tracing function used by `@sentry/node`).
 *
 * These exports are kept here for backwards compatability's sake.
 *
 * See https://github.com/getsentry/sentry-javascript/issues/4642 for more details.
 *
 * @deprecated Import this function from `@sentry/utils` instead
 */ const utils_extractTraceparentData = (/* unused pure expression or super */ null && (extractTraceparentData$1));
 //# sourceMappingURL=utils.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/tracing/errors.js



let errorsInstrumented = false;
/**
 * Configures global error listeners
 */ function registerErrorInstrumentation() {
    if (errorsInstrumented) {
        return;
    }
    errorsInstrumented = true;
    addGlobalErrorInstrumentationHandler(errorCallback);
    addGlobalUnhandledRejectionInstrumentationHandler(errorCallback);
}
/**
 * If an error or unhandled promise occurs, we mark the active transaction as failed
 */ function errorCallback() {
    // eslint-disable-next-line deprecation/deprecation
    const activeTransaction = getActiveTransaction();
    if (activeTransaction) {
        const status = "internal_error";
        esm_debug_build_DEBUG_BUILD && logger_logger.log(`[Tracing] Transaction: ${status} -> Global error occured`);
        activeTransaction.setStatus(status);
    }
}
// The function name will be lost when bundling but we need to be able to identify this listener later to maintain the
// node.js default exit behaviour
errorCallback.tag = "sentry_tracingErrorCallback";
 //# sourceMappingURL=errors.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/semanticAttributes.js
/**
 * Use this attribute to represent the source of a span.
 * Should be one of: custom, url, route, view, component, task, unknown
 *
 */ const SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = "sentry.source";
/**
 * Use this attribute to represent the sample rate used for a span.
 */ const SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = "sentry.sample_rate";
/**
 * Use this attribute to represent the operation of a span.
 */ const SEMANTIC_ATTRIBUTE_SENTRY_OP = "sentry.op";
/**
 * Use this attribute to represent the origin of a span.
 */ const SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = "sentry.origin";
 //# sourceMappingURL=semanticAttributes.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/utils/hasTracingEnabled.js

// Treeshakable guard to remove all code related to tracing
/**
 * Determines if tracing is currently enabled.
 *
 * Tracing is enabled when at least one of `tracesSampleRate` and `tracesSampler` is defined in the SDK config.
 */ function hasTracingEnabled(maybeOptions) {
    if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__) {
        return false;
    }
    const client = exports_getClient();
    const options = maybeOptions || client && client.getOptions();
    return !!options && (options.enableTracing || "tracesSampleRate" in options || "tracesSampler" in options);
}
 //# sourceMappingURL=hasTracingEnabled.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/tracing/sampling.js





/**
 * Makes a sampling decision for the given transaction and stores it on the transaction.
 *
 * Called every time a transaction is created. Only transactions which emerge with a `sampled` value of `true` will be
 * sent to Sentry.
 *
 * This method muttes the given `transaction` and will set the `sampled` value on it.
 * It returns the same transaction, for convenience.
 */ function sampling_sampleTransaction(transaction, options, samplingContext) {
    // nothing to do if tracing is not enabled
    if (!hasTracingEnabled(options)) {
        // eslint-disable-next-line deprecation/deprecation
        transaction.sampled = false;
        return transaction;
    }
    // if the user has forced a sampling decision by passing a `sampled` value in their transaction context, go with that
    // eslint-disable-next-line deprecation/deprecation
    if (transaction.sampled !== undefined) {
        // eslint-disable-next-line deprecation/deprecation
        transaction.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(transaction.sampled));
        return transaction;
    }
    // we would have bailed already if neither `tracesSampler` nor `tracesSampleRate` nor `enableTracing` were defined, so one of these should
    // work; prefer the hook if so
    let sampleRate;
    if (typeof options.tracesSampler === "function") {
        sampleRate = options.tracesSampler(samplingContext);
        transaction.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(sampleRate));
    } else if (samplingContext.parentSampled !== undefined) {
        sampleRate = samplingContext.parentSampled;
    } else if (typeof options.tracesSampleRate !== "undefined") {
        sampleRate = options.tracesSampleRate;
        transaction.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(sampleRate));
    } else {
        // When `enableTracing === true`, we use a sample rate of 100%
        sampleRate = 1;
        transaction.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, sampleRate);
    }
    // Since this is coming from the user (or from a function provided by the user), who knows what we might get. (The
    // only valid values are booleans or numbers between 0 and 1.)
    if (!isValidSampleRate(sampleRate)) {
        esm_debug_build_DEBUG_BUILD && logger_logger.warn("[Tracing] Discarding transaction because of invalid sample rate.");
        // eslint-disable-next-line deprecation/deprecation
        transaction.sampled = false;
        return transaction;
    }
    // if the function returned 0 (or false), or if `tracesSampleRate` is 0, it's a sign the transaction should be dropped
    if (!sampleRate) {
        esm_debug_build_DEBUG_BUILD && logger_logger.log(`[Tracing] Discarding transaction because ${typeof options.tracesSampler === "function" ? "tracesSampler returned 0 or false" : "a negative sampling decision was inherited or tracesSampleRate is set to 0"}`);
        // eslint-disable-next-line deprecation/deprecation
        transaction.sampled = false;
        return transaction;
    }
    // Now we roll the dice. Math.random is inclusive of 0, but not of 1, so strict < is safe here. In case sampleRate is
    // a boolean, the < comparison will cause it to be automatically cast to 1 if it's true and 0 if it's false.
    // eslint-disable-next-line deprecation/deprecation
    transaction.sampled = Math.random() < sampleRate;
    // if we're not going to keep it, we're done
    // eslint-disable-next-line deprecation/deprecation
    if (!transaction.sampled) {
        esm_debug_build_DEBUG_BUILD && logger_logger.log(`[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(sampleRate)})`);
        return transaction;
    }
    esm_debug_build_DEBUG_BUILD && // eslint-disable-next-line deprecation/deprecation
    logger_logger.log(`[Tracing] starting ${transaction.op} transaction - ${spanUtils_spanToJSON(transaction).description}`);
    return transaction;
}
/**
 * Checks the given sample rate to make sure it is valid type and value (a boolean, or a number between 0 and 1).
 */ function isValidSampleRate(rate) {
    // we need to check NaN explicitly because it's of type 'number' and therefore wouldn't get caught by this typecheck
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (is_isNaN(rate) || !(typeof rate === "number" || typeof rate === "boolean")) {
        esm_debug_build_DEBUG_BUILD && logger_logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(rate)} of type ${JSON.stringify(typeof rate)}.`);
        return false;
    }
    // in case sampleRate is a boolean, it will get automatically cast to 1 if it's true and 0 if it's false
    if (rate < 0 || rate > 1) {
        esm_debug_build_DEBUG_BUILD && logger_logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ${rate}.`);
        return false;
    }
    return true;
}
 //# sourceMappingURL=sampling.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/tracing/spanstatus.js
/** The status of an Span.
 *
 * @deprecated Use string literals - if you require type casting, cast to SpanStatusType type
 */ var SpanStatus;
(function(SpanStatus) {
    /** The operation completed successfully. */ const Ok = "ok";
    SpanStatus["Ok"] = Ok;
    /** Deadline expired before operation could complete. */ const DeadlineExceeded = "deadline_exceeded";
    SpanStatus["DeadlineExceeded"] = DeadlineExceeded;
    /** 401 Unauthorized (actually does mean unauthenticated according to RFC 7235) */ const Unauthenticated = "unauthenticated";
    SpanStatus["Unauthenticated"] = Unauthenticated;
    /** 403 Forbidden */ const PermissionDenied = "permission_denied";
    SpanStatus["PermissionDenied"] = PermissionDenied;
    /** 404 Not Found. Some requested entity (file or directory) was not found. */ const NotFound = "not_found";
    SpanStatus["NotFound"] = NotFound;
    /** 429 Too Many Requests */ const ResourceExhausted = "resource_exhausted";
    SpanStatus["ResourceExhausted"] = ResourceExhausted;
    /** Client specified an invalid argument. 4xx. */ const InvalidArgument = "invalid_argument";
    SpanStatus["InvalidArgument"] = InvalidArgument;
    /** 501 Not Implemented */ const Unimplemented = "unimplemented";
    SpanStatus["Unimplemented"] = Unimplemented;
    /** 503 Service Unavailable */ const Unavailable = "unavailable";
    SpanStatus["Unavailable"] = Unavailable;
    /** Other/generic 5xx. */ const InternalError = "internal_error";
    SpanStatus["InternalError"] = InternalError;
    /** Unknown. Any non-standard HTTP status code. */ const UnknownError = "unknown_error";
    SpanStatus["UnknownError"] = UnknownError;
    /** The operation was cancelled (typically by the user). */ const Cancelled = "cancelled";
    SpanStatus["Cancelled"] = Cancelled;
    /** Already exists (409) */ const AlreadyExists = "already_exists";
    SpanStatus["AlreadyExists"] = AlreadyExists;
    /** Operation was rejected because the system is not in a state required for the operation's */ const FailedPrecondition = "failed_precondition";
    SpanStatus["FailedPrecondition"] = FailedPrecondition;
    /** The operation was aborted, typically due to a concurrency issue. */ const Aborted = "aborted";
    SpanStatus["Aborted"] = Aborted;
    /** Operation was attempted past the valid range. */ const OutOfRange = "out_of_range";
    SpanStatus["OutOfRange"] = OutOfRange;
    /** Unrecoverable data loss or corruption */ const DataLoss = "data_loss";
    SpanStatus["DataLoss"] = DataLoss;
})(SpanStatus || (SpanStatus = {}));
/**
 * Converts a HTTP status code into a {@link SpanStatusType}.
 *
 * @param httpStatus The HTTP response status code.
 * @returns The span status or unknown_error.
 */ function getSpanStatusFromHttpCode(httpStatus) {
    if (httpStatus < 400 && httpStatus >= 100) {
        return "ok";
    }
    if (httpStatus >= 400 && httpStatus < 500) {
        switch(httpStatus){
            case 401:
                return "unauthenticated";
            case 403:
                return "permission_denied";
            case 404:
                return "not_found";
            case 409:
                return "already_exists";
            case 413:
                return "failed_precondition";
            case 429:
                return "resource_exhausted";
            default:
                return "invalid_argument";
        }
    }
    if (httpStatus >= 500 && httpStatus < 600) {
        switch(httpStatus){
            case 501:
                return "unimplemented";
            case 503:
                return "unavailable";
            case 504:
                return "deadline_exceeded";
            default:
                return "internal_error";
        }
    }
    return "unknown_error";
}
/**
 * Converts a HTTP status code into a {@link SpanStatusType}.
 *
 * @deprecated Use {@link spanStatusFromHttpCode} instead.
 * This export will be removed in v8 as the signature contains a typo.
 *
 * @param httpStatus The HTTP response status code.
 * @returns The span status or unknown_error.
 */ const spanStatusfromHttpCode = (/* unused pure expression or super */ null && (getSpanStatusFromHttpCode));
/**
 * Sets the Http status attributes on the current span based on the http code.
 * Additionally, the span's status is updated, depending on the http code.
 */ function spanstatus_setHttpStatus(span, httpStatus) {
    // TODO (v8): Remove these calls
    // Relay does not require us to send the status code as a tag
    // For now, just because users might expect it to land as a tag we keep sending it.
    // Same with data.
    // In v8, we replace both, simply with
    // span.setAttribute('http.response.status_code', httpStatus);
    // eslint-disable-next-line deprecation/deprecation
    span.setTag("http.status_code", String(httpStatus));
    // eslint-disable-next-line deprecation/deprecation
    span.setData("http.response.status_code", httpStatus);
    const spanStatus = getSpanStatusFromHttpCode(httpStatus);
    if (spanStatus !== "unknown_error") {
        span.setStatus(spanStatus);
    }
}
 //# sourceMappingURL=spanstatus.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/tracing/span.js






/**
 * Keeps track of finished spans for a given transaction
 * @internal
 * @hideconstructor
 * @hidden
 */ class SpanRecorder {
    constructor(maxlen = 1000){
        this._maxlen = maxlen;
        this.spans = [];
    }
    /**
   * This is just so that we don't run out of memory while recording a lot
   * of spans. At some point we just stop and flush out the start of the
   * trace tree (i.e.the first n spans with the smallest
   * start_timestamp).
   */ add(span) {
        if (this.spans.length > this._maxlen) {
            // eslint-disable-next-line deprecation/deprecation
            span.spanRecorder = undefined;
        } else {
            this.spans.push(span);
        }
    }
}
/**
 * Span contains all data about a span
 */ class Span {
    /**
   * Tags for the span.
   * @deprecated Use `getSpanAttributes(span)` instead.
   */ /**
   * Data for the span.
   * @deprecated Use `getSpanAttributes(span)` instead.
   */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
    /**
   * List of spans that were finalized
   *
   * @deprecated This property will no longer be public. Span recording will be handled internally.
   */ /**
   * @inheritDoc
   * @deprecated Use top level `Sentry.getRootSpan()` instead
   */ /**
   * The instrumenter that created this span.
   *
   * TODO (v8): This can probably be replaced by an `instanceOf` check of the span class.
   *            the instrumenter can only be sentry or otel so we can check the span instance
   *            to verify which one it is and remove this field entirely.
   *
   * @deprecated This field will be removed.
   */ /** Epoch timestamp in seconds when the span started. */ /** Epoch timestamp in seconds when the span ended. */ /** Internal keeper of the status */ /**
   * You should never call the constructor manually, always use `Sentry.startTransaction()`
   * or call `startChild()` on an existing span.
   * @internal
   * @hideconstructor
   * @hidden
   */ constructor(spanContext = {}){
        this._traceId = spanContext.traceId || misc_uuid4();
        this._spanId = spanContext.spanId || misc_uuid4().substring(16);
        this._startTime = spanContext.startTimestamp || time_timestampInSeconds();
        // eslint-disable-next-line deprecation/deprecation
        this.tags = spanContext.tags ? {
            ...spanContext.tags
        } : {};
        // eslint-disable-next-line deprecation/deprecation
        this.data = spanContext.data ? {
            ...spanContext.data
        } : {};
        // eslint-disable-next-line deprecation/deprecation
        this.instrumenter = spanContext.instrumenter || "sentry";
        this._attributes = {};
        this.setAttributes({
            [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanContext.origin || "manual",
            [SEMANTIC_ATTRIBUTE_SENTRY_OP]: spanContext.op,
            ...spanContext.attributes
        });
        // eslint-disable-next-line deprecation/deprecation
        this._name = spanContext.name || spanContext.description;
        if (spanContext.parentSpanId) {
            this._parentSpanId = spanContext.parentSpanId;
        }
        // We want to include booleans as well here
        if ("sampled" in spanContext) {
            this._sampled = spanContext.sampled;
        }
        if (spanContext.status) {
            this._status = spanContext.status;
        }
        if (spanContext.endTimestamp) {
            this._endTime = spanContext.endTimestamp;
        }
    }
    // This rule conflicts with another eslint rule :(
    /* eslint-disable @typescript-eslint/member-ordering */ /**
   * An alias for `description` of the Span.
   * @deprecated Use `spanToJSON(span).description` instead.
   */ get name() {
        return this._name || "";
    }
    /**
   * Update the name of the span.
   * @deprecated Use `spanToJSON(span).description` instead.
   */ set name(name) {
        this.updateName(name);
    }
    /**
   * Get the description of the Span.
   * @deprecated Use `spanToJSON(span).description` instead.
   */ get description() {
        return this._name;
    }
    /**
   * Get the description of the Span.
   * @deprecated Use `spanToJSON(span).description` instead.
   */ set description(description) {
        this._name = description;
    }
    /**
   * The ID of the trace.
   * @deprecated Use `spanContext().traceId` instead.
   */ get traceId() {
        return this._traceId;
    }
    /**
   * The ID of the trace.
   * @deprecated You cannot update the traceId of a span after span creation.
   */ set traceId(traceId) {
        this._traceId = traceId;
    }
    /**
   * The ID of the span.
   * @deprecated Use `spanContext().spanId` instead.
   */ get spanId() {
        return this._spanId;
    }
    /**
   * The ID of the span.
   * @deprecated You cannot update the spanId of a span after span creation.
   */ set spanId(spanId) {
        this._spanId = spanId;
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `startSpan` functions instead.
   */ set parentSpanId(string) {
        this._parentSpanId = string;
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `spanToJSON(span).parent_span_id` instead.
   */ get parentSpanId() {
        return this._parentSpanId;
    }
    /**
   * Was this span chosen to be sent as part of the sample?
   * @deprecated Use `isRecording()` instead.
   */ get sampled() {
        return this._sampled;
    }
    /**
   * Was this span chosen to be sent as part of the sample?
   * @deprecated You cannot update the sampling decision of a span after span creation.
   */ set sampled(sampled) {
        this._sampled = sampled;
    }
    /**
   * Attributes for the span.
   * @deprecated Use `getSpanAttributes(span)` instead.
   */ get attributes() {
        return this._attributes;
    }
    /**
   * Attributes for the span.
   * @deprecated Use `setAttributes()` instead.
   */ set attributes(attributes) {
        this._attributes = attributes;
    }
    /**
   * Timestamp in seconds (epoch time) indicating when the span started.
   * @deprecated Use `spanToJSON()` instead.
   */ get startTimestamp() {
        return this._startTime;
    }
    /**
   * Timestamp in seconds (epoch time) indicating when the span started.
   * @deprecated In v8, you will not be able to update the span start time after creation.
   */ set startTimestamp(startTime) {
        this._startTime = startTime;
    }
    /**
   * Timestamp in seconds when the span ended.
   * @deprecated Use `spanToJSON()` instead.
   */ get endTimestamp() {
        return this._endTime;
    }
    /**
   * Timestamp in seconds when the span ended.
   * @deprecated Set the end time via `span.end()` instead.
   */ set endTimestamp(endTime) {
        this._endTime = endTime;
    }
    /**
   * The status of the span.
   *
   * @deprecated Use `spanToJSON().status` instead to get the status.
   */ get status() {
        return this._status;
    }
    /**
   * The status of the span.
   *
   * @deprecated Use `.setStatus()` instead to set or update the status.
   */ set status(status) {
        this._status = status;
    }
    /**
   * Operation of the span
   *
   * @deprecated Use `spanToJSON().op` to read the op instead.
   */ get op() {
        return this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP];
    }
    /**
   * Operation of the span
   *
   * @deprecated Use `startSpan()` functions to set or `span.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_OP, 'op')
   *             to update the span instead.
   */ set op(op) {
        this.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_OP, op);
    }
    /**
   * The origin of the span, giving context about what created the span.
   *
   * @deprecated Use `spanToJSON().origin` to read the origin instead.
   */ get origin() {
        return this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN];
    }
    /**
   * The origin of the span, giving context about what created the span.
   *
   * @deprecated Use `startSpan()` functions to set the origin instead.
   */ set origin(origin) {
        this.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, origin);
    }
    /* eslint-enable @typescript-eslint/member-ordering */ /** @inheritdoc */ spanContext() {
        const { _spanId: spanId, _traceId: traceId, _sampled: sampled } = this;
        return {
            spanId,
            traceId,
            traceFlags: sampled ? TRACE_FLAG_SAMPLED : TRACE_FLAG_NONE
        };
    }
    /**
   * Creates a new `Span` while setting the current `Span.id` as `parentSpanId`.
   * Also the `sampled` decision will be inherited.
   *
   * @deprecated Use `startSpan()`, `startSpanManual()` or `startInactiveSpan()` instead.
   */ startChild(spanContext) {
        const childSpan = new Span({
            ...spanContext,
            parentSpanId: this._spanId,
            sampled: this._sampled,
            traceId: this._traceId
        });
        // eslint-disable-next-line deprecation/deprecation
        childSpan.spanRecorder = this.spanRecorder;
        // eslint-disable-next-line deprecation/deprecation
        if (childSpan.spanRecorder) {
            // eslint-disable-next-line deprecation/deprecation
            childSpan.spanRecorder.add(childSpan);
        }
        const rootSpan = getRootSpan(this);
        // TODO: still set span.transaction here until we have a more permanent solution
        // Probably similarly to the weakmap we hold in node-experimental
        // eslint-disable-next-line deprecation/deprecation
        childSpan.transaction = rootSpan;
        if (esm_debug_build_DEBUG_BUILD && rootSpan) {
            const opStr = spanContext && spanContext.op || "< unknown op >";
            const nameStr = spanUtils_spanToJSON(childSpan).description || "< unknown name >";
            const idStr = rootSpan.spanContext().spanId;
            const logMessage = `[Tracing] Starting '${opStr}' span on transaction '${nameStr}' (${idStr}).`;
            logger_logger.log(logMessage);
            this._logMessage = logMessage;
        }
        return childSpan;
    }
    /**
   * Sets the tag attribute on the current span.
   *
   * Can also be used to unset a tag, by passing `undefined`.
   *
   * @param key Tag key
   * @param value Tag value
   * @deprecated Use `setAttribute()` instead.
   */ setTag(key, value) {
        // eslint-disable-next-line deprecation/deprecation
        this.tags = {
            ...this.tags,
            [key]: value
        };
        return this;
    }
    /**
   * Sets the data attribute on the current span
   * @param key Data key
   * @param value Data value
   * @deprecated Use `setAttribute()` instead.
   */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData(key, value) {
        // eslint-disable-next-line deprecation/deprecation
        this.data = {
            ...this.data,
            [key]: value
        };
        return this;
    }
    /** @inheritdoc */ setAttribute(key, value) {
        if (value === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._attributes[key];
        } else {
            this._attributes[key] = value;
        }
    }
    /** @inheritdoc */ setAttributes(attributes) {
        Object.keys(attributes).forEach((key)=>this.setAttribute(key, attributes[key]));
    }
    /**
   * @inheritDoc
   */ setStatus(value) {
        this._status = value;
        return this;
    }
    /**
   * @inheritDoc
   * @deprecated Use top-level `setHttpStatus()` instead.
   */ setHttpStatus(httpStatus) {
        spanstatus_setHttpStatus(this, httpStatus);
        return this;
    }
    /**
   * @inheritdoc
   *
   * @deprecated Use `.updateName()` instead.
   */ setName(name) {
        this.updateName(name);
    }
    /**
   * @inheritDoc
   */ updateName(name) {
        this._name = name;
        return this;
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `spanToJSON(span).status === 'ok'` instead.
   */ isSuccess() {
        return this._status === "ok";
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `.end()` instead.
   */ finish(endTimestamp) {
        return this.end(endTimestamp);
    }
    /** @inheritdoc */ end(endTimestamp) {
        // If already ended, skip
        if (this._endTime) {
            return;
        }
        const rootSpan = getRootSpan(this);
        if (esm_debug_build_DEBUG_BUILD && // Don't call this for transactions
        rootSpan && rootSpan.spanContext().spanId !== this._spanId) {
            const logMessage = this._logMessage;
            if (logMessage) {
                logger_logger.log(logMessage.replace("Starting", "Finishing"));
            }
        }
        this._endTime = spanTimeInputToSeconds(endTimestamp);
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `spanToTraceHeader()` instead.
   */ toTraceparent() {
        return spanToTraceHeader(this);
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `spanToJSON()` or access the fields directly instead.
   */ toContext() {
        return dropUndefinedKeys({
            data: this._getData(),
            description: this._name,
            endTimestamp: this._endTime,
            // eslint-disable-next-line deprecation/deprecation
            op: this.op,
            parentSpanId: this._parentSpanId,
            sampled: this._sampled,
            spanId: this._spanId,
            startTimestamp: this._startTime,
            status: this._status,
            // eslint-disable-next-line deprecation/deprecation
            tags: this.tags,
            traceId: this._traceId
        });
    }
    /**
   * @inheritDoc
   *
   * @deprecated Update the fields directly instead.
   */ updateWithContext(spanContext) {
        // eslint-disable-next-line deprecation/deprecation
        this.data = spanContext.data || {};
        // eslint-disable-next-line deprecation/deprecation
        this._name = spanContext.name || spanContext.description;
        this._endTime = spanContext.endTimestamp;
        // eslint-disable-next-line deprecation/deprecation
        this.op = spanContext.op;
        this._parentSpanId = spanContext.parentSpanId;
        this._sampled = spanContext.sampled;
        this._spanId = spanContext.spanId || this._spanId;
        this._startTime = spanContext.startTimestamp || this._startTime;
        this._status = spanContext.status;
        // eslint-disable-next-line deprecation/deprecation
        this.tags = spanContext.tags || {};
        this._traceId = spanContext.traceId || this._traceId;
        return this;
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use `spanToTraceContext()` util function instead.
   */ getTraceContext() {
        return spanToTraceContext(this);
    }
    /**
   * Get JSON representation of this span.
   *
   * @hidden
   * @internal This method is purely for internal purposes and should not be used outside
   * of SDK code. If you need to get a JSON representation of a span,
   * use `spanToJSON(span)` instead.
   */ getSpanJSON() {
        return dropUndefinedKeys({
            data: this._getData(),
            description: this._name,
            op: this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP],
            parent_span_id: this._parentSpanId,
            span_id: this._spanId,
            start_timestamp: this._startTime,
            status: this._status,
            // eslint-disable-next-line deprecation/deprecation
            tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
            timestamp: this._endTime,
            trace_id: this._traceId,
            origin: this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]
        });
    }
    /** @inheritdoc */ isRecording() {
        return !this._endTime && !!this._sampled;
    }
    /**
   * Convert the object to JSON.
   * @deprecated Use `spanToJSON(span)` instead.
   */ toJSON() {
        return this.getSpanJSON();
    }
    /**
   * Get the merged data for this span.
   * For now, this combines `data` and `attributes` together,
   * until eventually we can ingest `attributes` directly.
   */ _getData() {
        // eslint-disable-next-line deprecation/deprecation
        const { data, _attributes: attributes } = this;
        const hasData = Object.keys(data).length > 0;
        const hasAttributes = Object.keys(attributes).length > 0;
        if (!hasData && !hasAttributes) {
            return undefined;
        }
        if (hasData && hasAttributes) {
            return {
                ...data,
                ...attributes
            };
        }
        return hasData ? data : attributes;
    }
}
 //# sourceMappingURL=span.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/utils/handleCallbackErrors.js

/**
 * Wrap a callback function with error handling.
 * If an error is thrown, it will be passed to the `onError` callback and re-thrown.
 *
 * If the return value of the function is a promise, it will be handled with `maybeHandlePromiseRejection`.
 *
 * If an `onFinally` callback is provided, this will be called when the callback has finished
 * - so if it returns a promise, once the promise resolved/rejected,
 * else once the callback has finished executing.
 * The `onFinally` callback will _always_ be called, no matter if an error was thrown or not.
 */ function handleCallbackErrors_handleCallbackErrors(fn, onError, // eslint-disable-next-line @typescript-eslint/no-empty-function
onFinally = ()=>{}) {
    let maybePromiseResult;
    try {
        maybePromiseResult = fn();
    } catch (e) {
        onError(e);
        onFinally();
        throw e;
    }
    return maybeHandlePromiseRejection(maybePromiseResult, onError, onFinally);
}
/**
 * Maybe handle a promise rejection.
 * This expects to be given a value that _may_ be a promise, or any other value.
 * If it is a promise, and it rejects, it will call the `onError` callback.
 * Other than this, it will generally return the given value as-is.
 */ function maybeHandlePromiseRejection(value, onError, onFinally) {
    if (is_isThenable(value)) {
        // @ts-expect-error - the isThenable check returns the "wrong" type here
        return value.then((res)=>{
            onFinally();
            return res;
        }, (e)=>{
            onError(e);
            onFinally();
            throw e;
        });
    }
    onFinally();
    return value;
}
 //# sourceMappingURL=handleCallbackErrors.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/tracing/trace.js







/**
 * Wraps a function with a transaction/span and finishes the span after the function is done.
 *
 * Note that if you have not enabled tracing extensions via `addTracingExtensions`
 * or you didn't set `tracesSampleRate`, this function will not generate spans
 * and the `span` returned from the callback will be undefined.
 *
 * This function is meant to be used internally and may break at any time. Use at your own risk.
 *
 * @internal
 * @private
 *
 * @deprecated Use `startSpan` instead.
 */ function trace_trace(context, callback, // eslint-disable-next-line @typescript-eslint/no-empty-function
onError = ()=>{}, // eslint-disable-next-line @typescript-eslint/no-empty-function
afterFinish = ()=>{}) {
    // eslint-disable-next-line deprecation/deprecation
    const hub = getCurrentHub();
    const scope = getCurrentScope();
    // eslint-disable-next-line deprecation/deprecation
    const parentSpan = scope.getSpan();
    const ctx = normalizeContext(context);
    const activeSpan = createChildSpanOrTransaction(hub, parentSpan, ctx);
    // eslint-disable-next-line deprecation/deprecation
    scope.setSpan(activeSpan);
    return handleCallbackErrors(()=>callback(activeSpan), (error)=>{
        activeSpan && activeSpan.setStatus("internal_error");
        onError(error, activeSpan);
    }, ()=>{
        activeSpan && activeSpan.end();
        // eslint-disable-next-line deprecation/deprecation
        scope.setSpan(parentSpan);
        afterFinish();
    });
}
/**
 * Wraps a function with a transaction/span and finishes the span after the function is done.
 * The created span is the active span and will be used as parent by other spans created inside the function
 * and can be accessed via `Sentry.getSpan()`, as long as the function is executed while the scope is active.
 *
 * If you want to create a span that is not set as active, use {@link startInactiveSpan}.
 *
 * Note that if you have not enabled tracing extensions via `addTracingExtensions`
 * or you didn't set `tracesSampleRate`, this function will not generate spans
 * and the `span` returned from the callback will be undefined.
 */ function startSpan(context, callback) {
    const ctx = normalizeContext(context);
    return hub_runWithAsyncContext(()=>{
        return exports_withScope(context.scope, (scope)=>{
            // eslint-disable-next-line deprecation/deprecation
            const hub = hub_getCurrentHub();
            // eslint-disable-next-line deprecation/deprecation
            const parentSpan = scope.getSpan();
            const shouldSkipSpan = context.onlyIfParent && !parentSpan;
            const activeSpan = shouldSkipSpan ? undefined : createChildSpanOrTransaction(hub, parentSpan, ctx);
            // eslint-disable-next-line deprecation/deprecation
            scope.setSpan(activeSpan);
            return handleCallbackErrors_handleCallbackErrors(()=>callback(activeSpan), ()=>{
                // Only update the span status if it hasn't been changed yet
                if (activeSpan) {
                    const { status } = spanUtils_spanToJSON(activeSpan);
                    if (!status || status === "ok") {
                        activeSpan.setStatus("internal_error");
                    }
                }
            }, ()=>activeSpan && activeSpan.end());
        });
    });
}
/**
 * @deprecated Use {@link startSpan} instead.
 */ const startActiveSpan = (/* unused pure expression or super */ null && (startSpan));
/**
 * Similar to `Sentry.startSpan`. Wraps a function with a transaction/span, but does not finish the span
 * after the function is done automatically. You'll have to call `span.end()` manually.
 *
 * The created span is the active span and will be used as parent by other spans created inside the function
 * and can be accessed via `Sentry.getActiveSpan()`, as long as the function is executed while the scope is active.
 *
 * Note that if you have not enabled tracing extensions via `addTracingExtensions`
 * or you didn't set `tracesSampleRate`, this function will not generate spans
 * and the `span` returned from the callback will be undefined.
 */ function startSpanManual(context, callback) {
    const ctx = normalizeContext(context);
    return runWithAsyncContext(()=>{
        return withScope(context.scope, (scope)=>{
            // eslint-disable-next-line deprecation/deprecation
            const hub = getCurrentHub();
            // eslint-disable-next-line deprecation/deprecation
            const parentSpan = scope.getSpan();
            const shouldSkipSpan = context.onlyIfParent && !parentSpan;
            const activeSpan = shouldSkipSpan ? undefined : createChildSpanOrTransaction(hub, parentSpan, ctx);
            // eslint-disable-next-line deprecation/deprecation
            scope.setSpan(activeSpan);
            function finishAndSetSpan() {
                activeSpan && activeSpan.end();
            }
            return handleCallbackErrors(()=>callback(activeSpan, finishAndSetSpan), ()=>{
                // Only update the span status if it hasn't been changed yet, and the span is not yet finished
                if (activeSpan && activeSpan.isRecording()) {
                    const { status } = spanToJSON(activeSpan);
                    if (!status || status === "ok") {
                        activeSpan.setStatus("internal_error");
                    }
                }
            });
        });
    });
}
/**
 * Creates a span. This span is not set as active, so will not get automatic instrumentation spans
 * as children or be able to be accessed via `Sentry.getSpan()`.
 *
 * If you want to create a span that is set as active, use {@link startSpan}.
 *
 * Note that if you have not enabled tracing extensions via `addTracingExtensions`
 * or you didn't set `tracesSampleRate` or `tracesSampler`, this function will not generate spans
 * and the `span` returned from the callback will be undefined.
 */ function startInactiveSpan(context) {
    if (!hasTracingEnabled()) {
        return undefined;
    }
    const ctx = normalizeContext(context);
    // eslint-disable-next-line deprecation/deprecation
    const hub = hub_getCurrentHub();
    const parentSpan = context.scope ? context.scope.getSpan() : getActiveSpan();
    const shouldSkipSpan = context.onlyIfParent && !parentSpan;
    if (shouldSkipSpan) {
        return undefined;
    }
    const isolationScope = hub_getIsolationScope();
    const scope = exports_getCurrentScope();
    let span;
    if (parentSpan) {
        // eslint-disable-next-line deprecation/deprecation
        span = parentSpan.startChild(ctx);
    } else {
        const { traceId, dsc, parentSpanId, sampled } = {
            ...isolationScope.getPropagationContext(),
            ...scope.getPropagationContext()
        };
        // eslint-disable-next-line deprecation/deprecation
        span = hub.startTransaction({
            traceId,
            parentSpanId,
            parentSampled: sampled,
            ...ctx,
            metadata: {
                dynamicSamplingContext: dsc,
                // eslint-disable-next-line deprecation/deprecation
                ...ctx.metadata
            }
        });
    }
    setCapturedScopesOnSpan(span, scope, isolationScope);
    return span;
}
/**
 * Returns the currently active span.
 */ function getActiveSpan() {
    // eslint-disable-next-line deprecation/deprecation
    return exports_getCurrentScope().getSpan();
}
const continueTrace = ({ sentryTrace, baggage }, callback)=>{
    // TODO(v8): Change this function so it doesn't do anything besides setting the propagation context on the current scope:
    /*
    return withScope((scope) => {
      const propagationContext = propagationContextFromHeaders(sentryTrace, baggage);
      scope.setPropagationContext(propagationContext);
      return callback();
    })
  */ const currentScope = exports_getCurrentScope();
    // eslint-disable-next-line deprecation/deprecation
    const { traceparentData, dynamicSamplingContext, propagationContext } = tracingContextFromHeaders(sentryTrace, baggage);
    currentScope.setPropagationContext(propagationContext);
    if (esm_debug_build_DEBUG_BUILD && traceparentData) {
        logger_logger.log(`[Tracing] Continuing trace ${traceparentData.traceId}.`);
    }
    const transactionContext = {
        ...traceparentData,
        metadata: dropUndefinedKeys({
            dynamicSamplingContext
        })
    };
    if (!callback) {
        return transactionContext;
    }
    return hub_runWithAsyncContext(()=>{
        return callback(transactionContext);
    });
};
function createChildSpanOrTransaction(hub, parentSpan, ctx) {
    if (!hasTracingEnabled()) {
        return undefined;
    }
    const isolationScope = hub_getIsolationScope();
    const scope = exports_getCurrentScope();
    let span;
    if (parentSpan) {
        // eslint-disable-next-line deprecation/deprecation
        span = parentSpan.startChild(ctx);
    } else {
        const { traceId, dsc, parentSpanId, sampled } = {
            ...isolationScope.getPropagationContext(),
            ...scope.getPropagationContext()
        };
        // eslint-disable-next-line deprecation/deprecation
        span = hub.startTransaction({
            traceId,
            parentSpanId,
            parentSampled: sampled,
            ...ctx,
            metadata: {
                dynamicSamplingContext: dsc,
                // eslint-disable-next-line deprecation/deprecation
                ...ctx.metadata
            }
        });
    }
    setCapturedScopesOnSpan(span, scope, isolationScope);
    return span;
}
/**
 * This converts StartSpanOptions to TransactionContext.
 * For the most part (for now) we accept the same options,
 * but some of them need to be transformed.
 *
 * Eventually the StartSpanOptions will be more aligned with OpenTelemetry.
 */ function normalizeContext(context) {
    if (context.startTime) {
        const ctx = {
            ...context
        };
        ctx.startTimestamp = spanTimeInputToSeconds(context.startTime);
        delete ctx.startTime;
        return ctx;
    }
    return context;
}
const SCOPE_ON_START_SPAN_FIELD = "_sentryScope";
const ISOLATION_SCOPE_ON_START_SPAN_FIELD = "_sentryIsolationScope";
function setCapturedScopesOnSpan(span, scope, isolationScope) {
    if (span) {
        addNonEnumerableProperty(span, ISOLATION_SCOPE_ON_START_SPAN_FIELD, isolationScope);
        addNonEnumerableProperty(span, SCOPE_ON_START_SPAN_FIELD, scope);
    }
}
/**
 * Grabs the scope and isolation scope off a span that were active when the span was started.
 */ function getCapturedScopesOnSpan(span) {
    return {
        scope: span[SCOPE_ON_START_SPAN_FIELD],
        isolationScope: span[ISOLATION_SCOPE_ON_START_SPAN_FIELD]
    };
}
 //# sourceMappingURL=trace.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/tracing/transaction.js








/** JSDoc */ class Transaction extends Span {
    /**
   * The reference to the current hub.
   */ // DO NOT yet remove this property, it is used in a hack for v7 backwards compatibility.
    /**
   * This constructor should never be called manually. Those instrumenting tracing should use
   * `Sentry.startTransaction()`, and internal methods should use `hub.startTransaction()`.
   * @internal
   * @hideconstructor
   * @hidden
   *
   * @deprecated Transactions will be removed in v8. Use spans instead.
   */ constructor(transactionContext, hub){
        super(transactionContext);
        this._measurements = {};
        this._contexts = {};
        // eslint-disable-next-line deprecation/deprecation
        this._hub = hub || hub_getCurrentHub();
        this._name = transactionContext.name || "";
        this._metadata = {
            // eslint-disable-next-line deprecation/deprecation
            ...transactionContext.metadata
        };
        this._trimEnd = transactionContext.trimEnd;
        // this is because transactions are also spans, and spans have a transaction pointer
        // TODO (v8): Replace this with another way to set the root span
        // eslint-disable-next-line deprecation/deprecation
        this.transaction = this;
        // If Dynamic Sampling Context is provided during the creation of the transaction, we freeze it as it usually means
        // there is incoming Dynamic Sampling Context. (Either through an incoming request, a baggage meta-tag, or other means)
        const incomingDynamicSamplingContext = this._metadata.dynamicSamplingContext;
        if (incomingDynamicSamplingContext) {
            // We shallow copy this in case anything writes to the original reference of the passed in `dynamicSamplingContext`
            this._frozenDynamicSamplingContext = {
                ...incomingDynamicSamplingContext
            };
        }
    }
    // This sadly conflicts with the getter/setter ordering :(
    /* eslint-disable @typescript-eslint/member-ordering */ /**
   * Getter for `name` property.
   * @deprecated Use `spanToJSON(span).description` instead.
   */ get name() {
        return this._name;
    }
    /**
   * Setter for `name` property, which also sets `source` as custom.
   * @deprecated Use `updateName()` and `setMetadata()` instead.
   */ set name(newName) {
        // eslint-disable-next-line deprecation/deprecation
        this.setName(newName);
    }
    /**
   * Get the metadata for this transaction.
   * @deprecated Use `spanGetMetadata(transaction)` instead.
   */ get metadata() {
        // We merge attributes in for backwards compatibility
        return {
            // Defaults
            // eslint-disable-next-line deprecation/deprecation
            source: "custom",
            spanMetadata: {},
            // Legacy metadata
            ...this._metadata,
            // From attributes
            ...this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] && {
                source: this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]
            },
            ...this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE] && {
                sampleRate: this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]
            }
        };
    }
    /**
   * Update the metadata for this transaction.
   * @deprecated Use `spanGetMetadata(transaction)` instead.
   */ set metadata(metadata) {
        this._metadata = metadata;
    }
    /* eslint-enable @typescript-eslint/member-ordering */ /**
   * Setter for `name` property, which also sets `source` on the metadata.
   *
   * @deprecated Use `.updateName()` and `.setAttribute()` instead.
   */ setName(name, source = "custom") {
        this._name = name;
        this.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, source);
    }
    /** @inheritdoc */ updateName(name) {
        this._name = name;
        return this;
    }
    /**
   * Attaches SpanRecorder to the span itself
   * @param maxlen maximum number of spans that can be recorded
   */ initSpanRecorder(maxlen = 1000) {
        // eslint-disable-next-line deprecation/deprecation
        if (!this.spanRecorder) {
            // eslint-disable-next-line deprecation/deprecation
            this.spanRecorder = new SpanRecorder(maxlen);
        }
        // eslint-disable-next-line deprecation/deprecation
        this.spanRecorder.add(this);
    }
    /**
   * Set the context of a transaction event.
   * @deprecated Use either `.setAttribute()`, or set the context on the scope before creating the transaction.
   */ setContext(key, context) {
        if (context === null) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._contexts[key];
        } else {
            this._contexts[key] = context;
        }
    }
    /**
   * @inheritDoc
   *
   * @deprecated Use top-level `setMeasurement()` instead.
   */ setMeasurement(name, value, unit = "") {
        this._measurements[name] = {
            value,
            unit
        };
    }
    /**
   * Store metadata on this transaction.
   * @deprecated Use attributes or store data on the scope instead.
   */ setMetadata(newMetadata) {
        this._metadata = {
            ...this._metadata,
            ...newMetadata
        };
    }
    /**
   * @inheritDoc
   */ end(endTimestamp) {
        const timestampInS = spanTimeInputToSeconds(endTimestamp);
        const transaction = this._finishTransaction(timestampInS);
        if (!transaction) {
            return undefined;
        }
        // eslint-disable-next-line deprecation/deprecation
        return this._hub.captureEvent(transaction);
    }
    /**
   * @inheritDoc
   */ toContext() {
        // eslint-disable-next-line deprecation/deprecation
        const spanContext = super.toContext();
        return dropUndefinedKeys({
            ...spanContext,
            name: this._name,
            trimEnd: this._trimEnd
        });
    }
    /**
   * @inheritDoc
   */ updateWithContext(transactionContext) {
        // eslint-disable-next-line deprecation/deprecation
        super.updateWithContext(transactionContext);
        this._name = transactionContext.name || "";
        this._trimEnd = transactionContext.trimEnd;
        return this;
    }
    /**
   * @inheritdoc
   *
   * @experimental
   *
   * @deprecated Use top-level `getDynamicSamplingContextFromSpan` instead.
   */ getDynamicSamplingContext() {
        return getDynamicSamplingContextFromSpan(this);
    }
    /**
   * Override the current hub with a new one.
   * Used if you want another hub to finish the transaction.
   *
   * @internal
   */ setHub(hub) {
        this._hub = hub;
    }
    /**
   * Finish the transaction & prepare the event to send to Sentry.
   */ _finishTransaction(endTimestamp) {
        // This transaction is already finished, so we should not flush it again.
        if (this._endTime !== undefined) {
            return undefined;
        }
        if (!this._name) {
            esm_debug_build_DEBUG_BUILD && logger_logger.warn("Transaction has no name, falling back to `<unlabeled transaction>`.");
            this._name = "<unlabeled transaction>";
        }
        // just sets the end timestamp
        super.end(endTimestamp);
        // eslint-disable-next-line deprecation/deprecation
        const client = this._hub.getClient();
        if (client && client.emit) {
            client.emit("finishTransaction", this);
        }
        if (this._sampled !== true) {
            // At this point if `sampled !== true` we want to discard the transaction.
            esm_debug_build_DEBUG_BUILD && logger_logger.log("[Tracing] Discarding transaction because its trace was not chosen to be sampled.");
            if (client) {
                client.recordDroppedEvent("sample_rate", "transaction");
            }
            return undefined;
        }
        // eslint-disable-next-line deprecation/deprecation
        const finishedSpans = this.spanRecorder ? this.spanRecorder.spans.filter((span)=>span !== this && spanUtils_spanToJSON(span).timestamp) : [];
        if (this._trimEnd && finishedSpans.length > 0) {
            const endTimes = finishedSpans.map((span)=>spanUtils_spanToJSON(span).timestamp).filter(Boolean);
            this._endTime = endTimes.reduce((prev, current)=>{
                return prev > current ? prev : current;
            });
        }
        const { scope: capturedSpanScope, isolationScope: capturedSpanIsolationScope } = getCapturedScopesOnSpan(this);
        // eslint-disable-next-line deprecation/deprecation
        const { metadata } = this;
        // eslint-disable-next-line deprecation/deprecation
        const { source } = metadata;
        const transaction = {
            contexts: {
                ...this._contexts,
                // We don't want to override trace context
                trace: spanToTraceContext(this)
            },
            // TODO: Pass spans serialized via `spanToJSON()` here instead in v8.
            spans: finishedSpans,
            start_timestamp: this._startTime,
            // eslint-disable-next-line deprecation/deprecation
            tags: this.tags,
            timestamp: this._endTime,
            transaction: this._name,
            type: "transaction",
            sdkProcessingMetadata: {
                ...metadata,
                capturedSpanScope,
                capturedSpanIsolationScope,
                dynamicSamplingContext: getDynamicSamplingContextFromSpan(this)
            },
            ...source && {
                transaction_info: {
                    source
                }
            }
        };
        const hasMeasurements = Object.keys(this._measurements).length > 0;
        if (hasMeasurements) {
            esm_debug_build_DEBUG_BUILD && logger_logger.log("[Measurements] Adding measurements to transaction", JSON.stringify(this._measurements, undefined, 2));
            transaction.measurements = this._measurements;
        }
        // eslint-disable-next-line deprecation/deprecation
        esm_debug_build_DEBUG_BUILD && logger_logger.log(`[Tracing] Finishing ${this.op} transaction: ${this._name}.`);
        return transaction;
    }
}
 //# sourceMappingURL=transaction.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/tracing/hubextensions.js








/** Returns all trace headers that are currently on the top scope. */ function traceHeaders() {
    // eslint-disable-next-line deprecation/deprecation
    const scope = this.getScope();
    // eslint-disable-next-line deprecation/deprecation
    const span = scope.getSpan();
    return span ? {
        "sentry-trace": spanToTraceHeader(span)
    } : {};
}
/**
 * Creates a new transaction and adds a sampling decision if it doesn't yet have one.
 *
 * The Hub.startTransaction method delegates to this method to do its work, passing the Hub instance in as `this`, as if
 * it had been called on the hub directly. Exists as a separate function so that it can be injected into the class as an
 * "extension method."
 *
 * @param this: The Hub starting the transaction
 * @param transactionContext: Data used to configure the transaction
 * @param CustomSamplingContext: Optional data to be provided to the `tracesSampler` function (if any)
 *
 * @returns The new transaction
 *
 * @see {@link Hub.startTransaction}
 */ function _startTransaction(transactionContext, customSamplingContext) {
    // eslint-disable-next-line deprecation/deprecation
    const client = this.getClient();
    const options = client && client.getOptions() || {};
    const configInstrumenter = options.instrumenter || "sentry";
    const transactionInstrumenter = transactionContext.instrumenter || "sentry";
    if (configInstrumenter !== transactionInstrumenter) {
        esm_debug_build_DEBUG_BUILD && logger_logger.error(`A transaction was started with instrumenter=\`${transactionInstrumenter}\`, but the SDK is configured with the \`${configInstrumenter}\` instrumenter.
The transaction will not be sampled. Please use the ${configInstrumenter} instrumentation to start transactions.`);
        // eslint-disable-next-line deprecation/deprecation
        transactionContext.sampled = false;
    }
    // eslint-disable-next-line deprecation/deprecation
    let transaction = new Transaction(transactionContext, this);
    transaction = sampling_sampleTransaction(transaction, options, {
        name: transactionContext.name,
        parentSampled: transactionContext.parentSampled,
        transactionContext,
        attributes: {
            // eslint-disable-next-line deprecation/deprecation
            ...transactionContext.data,
            ...transactionContext.attributes
        },
        ...customSamplingContext
    });
    if (transaction.isRecording()) {
        transaction.initSpanRecorder(options._experiments && options._experiments.maxSpans);
    }
    if (client && client.emit) {
        client.emit("startTransaction", transaction);
    }
    return transaction;
}
/**
 * Create new idle transaction.
 */ function startIdleTransaction(hub, transactionContext, idleTimeout, finalTimeout, onScope, customSamplingContext, heartbeatInterval, delayAutoFinishUntilSignal = false) {
    // eslint-disable-next-line deprecation/deprecation
    const client = hub.getClient();
    const options = client && client.getOptions() || {};
    // eslint-disable-next-line deprecation/deprecation
    let transaction = new IdleTransaction(transactionContext, hub, idleTimeout, finalTimeout, heartbeatInterval, onScope, delayAutoFinishUntilSignal);
    transaction = sampleTransaction(transaction, options, {
        name: transactionContext.name,
        parentSampled: transactionContext.parentSampled,
        transactionContext,
        attributes: {
            // eslint-disable-next-line deprecation/deprecation
            ...transactionContext.data,
            ...transactionContext.attributes
        },
        ...customSamplingContext
    });
    if (transaction.isRecording()) {
        transaction.initSpanRecorder(options._experiments && options._experiments.maxSpans);
    }
    if (client && client.emit) {
        client.emit("startTransaction", transaction);
    }
    return transaction;
}
/**
 * Adds tracing extensions to the global hub.
 */ function addTracingExtensions() {
    const carrier = getMainCarrier();
    if (!carrier.__SENTRY__) {
        return;
    }
    carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
    if (!carrier.__SENTRY__.extensions.startTransaction) {
        carrier.__SENTRY__.extensions.startTransaction = _startTransaction;
    }
    if (!carrier.__SENTRY__.extensions.traceHeaders) {
        carrier.__SENTRY__.extensions.traceHeaders = traceHeaders;
    }
    registerErrorInstrumentation();
}
 //# sourceMappingURL=hubextensions.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/utils/sdkMetadata.js

/**
 * A builder for the SDK metadata in the options for the SDK initialization.
 *
 * Note: This function is identical to `buildMetadata` in Remix and NextJS and SvelteKit.
 * We don't extract it for bundle size reasons.
 * @see https://github.com/getsentry/sentry-javascript/pull/7404
 * @see https://github.com/getsentry/sentry-javascript/pull/4196
 *
 * If you make changes to this function consider updating the others as well.
 *
 * @param options SDK options object that gets mutated
 * @param names list of package names
 */ function applySdkMetadata(options, name, names = [
    name
], source = "npm") {
    const metadata = options._metadata || {};
    if (!metadata.sdk) {
        metadata.sdk = {
            name: `sentry.javascript.${name}`,
            packages: names.map((name)=>({
                    name: `${source}:@sentry/${name}`,
                    version: SDK_VERSION
                })),
            version: SDK_VERSION
        };
    }
    options._metadata = metadata;
}
 //# sourceMappingURL=sdkMetadata.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/integration.js





const installedIntegrations = [];
/** Map of integrations assigned to a client */ /**
 * Remove duplicates from the given array, preferring the last instance of any duplicate. Not guaranteed to
 * preseve the order of integrations in the array.
 *
 * @private
 */ function filterDuplicates(integrations) {
    const integrationsByName = {};
    integrations.forEach((currentInstance)=>{
        const { name } = currentInstance;
        const existingInstance = integrationsByName[name];
        // We want integrations later in the array to overwrite earlier ones of the same type, except that we never want a
        // default instance to overwrite an existing user instance
        if (existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance) {
            return;
        }
        integrationsByName[name] = currentInstance;
    });
    return Object.keys(integrationsByName).map((k)=>integrationsByName[k]);
}
/** Gets integrations to install */ function getIntegrationsToSetup(options) {
    const defaultIntegrations = options.defaultIntegrations || [];
    const userIntegrations = options.integrations;
    // We flag default instances, so that later we can tell them apart from any user-created instances of the same class
    defaultIntegrations.forEach((integration)=>{
        integration.isDefaultInstance = true;
    });
    let integrations;
    if (Array.isArray(userIntegrations)) {
        integrations = [
            ...defaultIntegrations,
            ...userIntegrations
        ];
    } else if (typeof userIntegrations === "function") {
        integrations = arrayify(userIntegrations(defaultIntegrations));
    } else {
        integrations = defaultIntegrations;
    }
    const finalIntegrations = filterDuplicates(integrations);
    // The `Debug` integration prints copies of the `event` and `hint` which will be passed to `beforeSend` or
    // `beforeSendTransaction`. It therefore has to run after all other integrations, so that the changes of all event
    // processors will be reflected in the printed values. For lack of a more elegant way to guarantee that, we therefore
    // locate it and, assuming it exists, pop it out of its current spot and shove it onto the end of the array.
    const debugIndex = findIndex(finalIntegrations, (integration)=>integration.name === "Debug");
    if (debugIndex !== -1) {
        const [debugInstance] = finalIntegrations.splice(debugIndex, 1);
        finalIntegrations.push(debugInstance);
    }
    return finalIntegrations;
}
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */ function setupIntegrations(client, integrations) {
    const integrationIndex = {};
    integrations.forEach((integration)=>{
        // guard against empty provided integrations
        if (integration) {
            setupIntegration(client, integration, integrationIndex);
        }
    });
    return integrationIndex;
}
/**
 * Execute the `afterAllSetup` hooks of the given integrations.
 */ function afterSetupIntegrations(client, integrations) {
    for (const integration of integrations){
        // guard against empty provided integrations
        if (integration && integration.afterAllSetup) {
            integration.afterAllSetup(client);
        }
    }
}
/** Setup a single integration.  */ function setupIntegration(client, integration, integrationIndex) {
    if (integrationIndex[integration.name]) {
        esm_debug_build_DEBUG_BUILD && logger_logger.log(`Integration skipped because it was already installed: ${integration.name}`);
        return;
    }
    integrationIndex[integration.name] = integration;
    // `setupOnce` is only called the first time
    if (installedIntegrations.indexOf(integration.name) === -1) {
        // eslint-disable-next-line deprecation/deprecation
        integration.setupOnce(addGlobalEventProcessor, hub_getCurrentHub);
        installedIntegrations.push(integration.name);
    }
    // `setup` is run for each client
    if (integration.setup && typeof integration.setup === "function") {
        integration.setup(client);
    }
    if (client.on && typeof integration.preprocessEvent === "function") {
        const callback = integration.preprocessEvent.bind(integration);
        client.on("preprocessEvent", (event, hint)=>callback(event, hint, client));
    }
    if (client.addEventProcessor && typeof integration.processEvent === "function") {
        const callback = integration.processEvent.bind(integration);
        const processor = Object.assign((event, hint)=>callback(event, hint, client), {
            id: integration.name
        });
        client.addEventProcessor(processor);
    }
    esm_debug_build_DEBUG_BUILD && logger_logger.log(`Integration installed: ${integration.name}`);
}
/** Add an integration to the current hub's client. */ function addIntegration(integration) {
    const client = getClient();
    if (!client || !client.addIntegration) {
        DEBUG_BUILD && logger.warn(`Cannot add integration "${integration.name}" because no SDK Client is available.`);
        return;
    }
    client.addIntegration(integration);
}
// Polyfill for Array.findIndex(), which is not supported in ES5
function findIndex(arr, callback) {
    for(let i = 0; i < arr.length; i++){
        if (callback(arr[i]) === true) {
            return i;
        }
    }
    return -1;
}
/**
 * Convert a new integration function to the legacy class syntax.
 * In v8, we can remove this and instead export the integration functions directly.
 *
 * @deprecated This will be removed in v8!
 */ function convertIntegrationFnToClass(name, fn) {
    return Object.assign(function ConvertedIntegration(...args) {
        return fn(...args);
    }, {
        id: name
    });
}
/**
 * Define an integration function that can be used to create an integration instance.
 * Note that this by design hides the implementation details of the integration, as they are considered internal.
 */ function defineIntegration(fn) {
    return fn;
}
 //# sourceMappingURL=integration.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/integrations/inboundfilters.js



// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
const DEFAULT_IGNORE_ERRORS = [
    /^Script error\.?$/,
    /^Javascript error: Script error\.? on line 0$/
];
const DEFAULT_IGNORE_TRANSACTIONS = [
    /^.*\/healthcheck$/,
    /^.*\/healthy$/,
    /^.*\/live$/,
    /^.*\/ready$/,
    /^.*\/heartbeat$/,
    /^.*\/health$/,
    /^.*\/healthz$/
];
/** Options for the InboundFilters integration */ const INTEGRATION_NAME = "InboundFilters";
const _inboundFiltersIntegration = (options = {})=>{
    return {
        name: INTEGRATION_NAME,
        // TODO v8: Remove this
        setupOnce () {},
        processEvent (event, _hint, client) {
            const clientOptions = client.getOptions();
            const mergedOptions = _mergeOptions(options, clientOptions);
            return _shouldDropEvent(event, mergedOptions) ? null : event;
        }
    };
};
const inboundFiltersIntegration = defineIntegration(_inboundFiltersIntegration);
/**
 * Inbound filters configurable by the user.
 * @deprecated Use `inboundFiltersIntegration()` instead.
 */ // eslint-disable-next-line deprecation/deprecation
const InboundFilters = convertIntegrationFnToClass(INTEGRATION_NAME, inboundFiltersIntegration);
function _mergeOptions(internalOptions = {}, clientOptions = {}) {
    return {
        allowUrls: [
            ...internalOptions.allowUrls || [],
            ...clientOptions.allowUrls || []
        ],
        denyUrls: [
            ...internalOptions.denyUrls || [],
            ...clientOptions.denyUrls || []
        ],
        ignoreErrors: [
            ...internalOptions.ignoreErrors || [],
            ...clientOptions.ignoreErrors || [],
            ...internalOptions.disableErrorDefaults ? [] : DEFAULT_IGNORE_ERRORS
        ],
        ignoreTransactions: [
            ...internalOptions.ignoreTransactions || [],
            ...clientOptions.ignoreTransactions || [],
            ...internalOptions.disableTransactionDefaults ? [] : DEFAULT_IGNORE_TRANSACTIONS
        ],
        ignoreInternal: internalOptions.ignoreInternal !== undefined ? internalOptions.ignoreInternal : true
    };
}
function _shouldDropEvent(event, options) {
    if (options.ignoreInternal && _isSentryError(event)) {
        esm_debug_build_DEBUG_BUILD && logger_logger.warn(`Event dropped due to being internal Sentry Error.\nEvent: ${getEventDescription(event)}`);
        return true;
    }
    if (_isIgnoredError(event, options.ignoreErrors)) {
        esm_debug_build_DEBUG_BUILD && logger_logger.warn(`Event dropped due to being matched by \`ignoreErrors\` option.\nEvent: ${getEventDescription(event)}`);
        return true;
    }
    if (_isIgnoredTransaction(event, options.ignoreTransactions)) {
        esm_debug_build_DEBUG_BUILD && logger_logger.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.\nEvent: ${getEventDescription(event)}`);
        return true;
    }
    if (_isDeniedUrl(event, options.denyUrls)) {
        esm_debug_build_DEBUG_BUILD && logger_logger.warn(`Event dropped due to being matched by \`denyUrls\` option.\nEvent: ${getEventDescription(event)}.\nUrl: ${_getEventFilterUrl(event)}`);
        return true;
    }
    if (!_isAllowedUrl(event, options.allowUrls)) {
        esm_debug_build_DEBUG_BUILD && logger_logger.warn(`Event dropped due to not being matched by \`allowUrls\` option.\nEvent: ${getEventDescription(event)}.\nUrl: ${_getEventFilterUrl(event)}`);
        return true;
    }
    return false;
}
function _isIgnoredError(event, ignoreErrors) {
    // If event.type, this is not an error
    if (event.type || !ignoreErrors || !ignoreErrors.length) {
        return false;
    }
    return _getPossibleEventMessages(event).some((message)=>stringMatchesSomePattern(message, ignoreErrors));
}
function _isIgnoredTransaction(event, ignoreTransactions) {
    if (event.type !== "transaction" || !ignoreTransactions || !ignoreTransactions.length) {
        return false;
    }
    const name = event.transaction;
    return name ? stringMatchesSomePattern(name, ignoreTransactions) : false;
}
function _isDeniedUrl(event, denyUrls) {
    // TODO: Use Glob instead?
    if (!denyUrls || !denyUrls.length) {
        return false;
    }
    const url = _getEventFilterUrl(event);
    return !url ? false : stringMatchesSomePattern(url, denyUrls);
}
function _isAllowedUrl(event, allowUrls) {
    // TODO: Use Glob instead?
    if (!allowUrls || !allowUrls.length) {
        return true;
    }
    const url = _getEventFilterUrl(event);
    return !url ? true : stringMatchesSomePattern(url, allowUrls);
}
function _getPossibleEventMessages(event) {
    const possibleMessages = [];
    if (event.message) {
        possibleMessages.push(event.message);
    }
    let lastException;
    try {
        // @ts-expect-error Try catching to save bundle size
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        lastException = event.exception.values[event.exception.values.length - 1];
    } catch (e) {
    // try catching to save bundle size checking existence of variables
    }
    if (lastException) {
        if (lastException.value) {
            possibleMessages.push(lastException.value);
            if (lastException.type) {
                possibleMessages.push(`${lastException.type}: ${lastException.value}`);
            }
        }
    }
    if (esm_debug_build_DEBUG_BUILD && possibleMessages.length === 0) {
        logger_logger.error(`Could not extract message for event ${getEventDescription(event)}`);
    }
    return possibleMessages;
}
function _isSentryError(event) {
    try {
        // @ts-expect-error can't be a sentry error if undefined
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return event.exception.values[0].type === "SentryError";
    } catch (e) {
    // ignore
    }
    return false;
}
function _getLastValidUrl(frames = []) {
    for(let i = frames.length - 1; i >= 0; i--){
        const frame = frames[i];
        if (frame && frame.filename !== "<anonymous>" && frame.filename !== "[native code]") {
            return frame.filename || null;
        }
    }
    return null;
}
function _getEventFilterUrl(event) {
    try {
        let frames;
        try {
            // @ts-expect-error we only care about frames if the whole thing here is defined
            frames = event.exception.values[0].stacktrace.frames;
        } catch (e) {
        // ignore
        }
        return frames ? _getLastValidUrl(frames) : null;
    } catch (oO) {
        esm_debug_build_DEBUG_BUILD && logger_logger.error(`Cannot extract url for event ${getEventDescription(event)}`);
        return null;
    }
}
 //# sourceMappingURL=inboundfilters.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/integrations/functiontostring.js



let originalFunctionToString;
const functiontostring_INTEGRATION_NAME = "FunctionToString";
const SETUP_CLIENTS = new WeakMap();
const _functionToStringIntegration = ()=>{
    return {
        name: functiontostring_INTEGRATION_NAME,
        setupOnce () {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            originalFunctionToString = Function.prototype.toString;
            // intrinsics (like Function.prototype) might be immutable in some environments
            // e.g. Node with --frozen-intrinsics, XS (an embedded JavaScript engine) or SES (a JavaScript proposal)
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Function.prototype.toString = function(...args) {
                    const originalFunction = getOriginalFunction(this);
                    const context = SETUP_CLIENTS.has(exports_getClient()) && originalFunction !== undefined ? originalFunction : this;
                    return originalFunctionToString.apply(context, args);
                };
            } catch (e) {
            // ignore errors here, just don't patch this
            }
        },
        setup (client) {
            SETUP_CLIENTS.set(client, true);
        }
    };
};
/**
 * Patch toString calls to return proper name for wrapped functions.
 *
 * ```js
 * Sentry.init({
 *   integrations: [
 *     functionToStringIntegration(),
 *   ],
 * });
 * ```
 */ const functionToStringIntegration = defineIntegration(_functionToStringIntegration);
/**
 * Patch toString calls to return proper name for wrapped functions.
 *
 * @deprecated Use `functionToStringIntegration()` instead.
 */ // eslint-disable-next-line deprecation/deprecation
const FunctionToString = convertIntegrationFnToClass(functiontostring_INTEGRATION_NAME, functionToStringIntegration);
// eslint-disable-next-line deprecation/deprecation
 //# sourceMappingURL=functiontostring.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/aggregate-errors.js


/**
 * Creates exceptions inside `event.exception.values` for errors that are nested on properties based on the `key` parameter.
 */ function applyAggregateErrorsToEvent(exceptionFromErrorImplementation, parser, maxValueLimit = 250, key, limit, event, hint) {
    if (!event.exception || !event.exception.values || !hint || !isInstanceOf(hint.originalException, Error)) {
        return;
    }
    // Generally speaking the last item in `event.exception.values` is the exception originating from the original Error
    const originalException = event.exception.values.length > 0 ? event.exception.values[event.exception.values.length - 1] : undefined;
    // We only create exception grouping if there is an exception in the event.
    if (originalException) {
        event.exception.values = truncateAggregateExceptions(aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, hint.originalException, key, event.exception.values, originalException, 0), maxValueLimit);
    }
}
function aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, error, key, prevExceptions, exception, exceptionId) {
    if (prevExceptions.length >= limit + 1) {
        return prevExceptions;
    }
    let newExceptions = [
        ...prevExceptions
    ];
    if (isInstanceOf(error[key], Error)) {
        applyExceptionGroupFieldsForParentException(exception, exceptionId);
        const newException = exceptionFromErrorImplementation(parser, error[key]);
        const newExceptionId = newExceptions.length;
        applyExceptionGroupFieldsForChildException(newException, key, newExceptionId, exceptionId);
        newExceptions = aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, error[key], key, [
            newException,
            ...newExceptions
        ], newException, newExceptionId);
    }
    // This will create exception grouping for AggregateErrors
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError
    if (Array.isArray(error.errors)) {
        error.errors.forEach((childError, i)=>{
            if (isInstanceOf(childError, Error)) {
                applyExceptionGroupFieldsForParentException(exception, exceptionId);
                const newException = exceptionFromErrorImplementation(parser, childError);
                const newExceptionId = newExceptions.length;
                applyExceptionGroupFieldsForChildException(newException, `errors[${i}]`, newExceptionId, exceptionId);
                newExceptions = aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, childError, key, [
                    newException,
                    ...newExceptions
                ], newException, newExceptionId);
            }
        });
    }
    return newExceptions;
}
function applyExceptionGroupFieldsForParentException(exception, exceptionId) {
    // Don't know if this default makes sense. The protocol requires us to set these values so we pick *some* default.
    exception.mechanism = exception.mechanism || {
        type: "generic",
        handled: true
    };
    exception.mechanism = {
        ...exception.mechanism,
        is_exception_group: true,
        exception_id: exceptionId
    };
}
function applyExceptionGroupFieldsForChildException(exception, source, exceptionId, parentId) {
    // Don't know if this default makes sense. The protocol requires us to set these values so we pick *some* default.
    exception.mechanism = exception.mechanism || {
        type: "generic",
        handled: true
    };
    exception.mechanism = {
        ...exception.mechanism,
        type: "chained",
        source,
        exception_id: exceptionId,
        parent_id: parentId
    };
}
/**
 * Truncate the message (exception.value) of all exceptions in the event.
 * Because this event processor is ran after `applyClientOptions`,
 * we need to truncate the message of the added exceptions here.
 */ function truncateAggregateExceptions(exceptions, maxValueLength) {
    return exceptions.map((exception)=>{
        if (exception.value) {
            exception.value = truncate(exception.value, maxValueLength);
        }
        return exception;
    });
}
 //# sourceMappingURL=aggregate-errors.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/eventbuilder.js




/**
 * Extracts stack frames from the error.stack string
 */ function parseStackFrames(stackParser, error) {
    return stackParser(error.stack || "", 1);
}
/**
 * Extracts stack frames from the error and builds a Sentry Exception
 */ function exceptionFromError(stackParser, error) {
    const exception = {
        type: error.name || error.constructor.name,
        value: error.message
    };
    const frames = parseStackFrames(stackParser, error);
    if (frames.length) {
        exception.stacktrace = {
            frames
        };
    }
    return exception;
}
function getMessageForObject(exception) {
    if ("name" in exception && typeof exception.name === "string") {
        let message = `'${exception.name}' captured as exception`;
        if ("message" in exception && typeof exception.message === "string") {
            message += ` with message '${exception.message}'`;
        }
        return message;
    } else if ("message" in exception && typeof exception.message === "string") {
        return exception.message;
    } else {
        // This will allow us to group events based on top-level keys
        // which is much better than creating new group when any key/value change
        return `Object captured as exception with keys: ${extractExceptionKeysForMessage(exception)}`;
    }
}
/**
 * Builds and Event from a Exception
 *
 * TODO(v8): Remove getHub fallback
 * @hidden
 */ function eventFromUnknownInput(getHubOrClient, stackParser, exception, hint) {
    const client = typeof getHubOrClient === "function" ? getHubOrClient().getClient() : getHubOrClient;
    let ex = exception;
    const providedMechanism = hint && hint.data && hint.data.mechanism;
    const mechanism = providedMechanism || {
        handled: true,
        type: "generic"
    };
    let extras;
    if (!isError(exception)) {
        if (isPlainObject(exception)) {
            const normalizeDepth = client && client.getOptions().normalizeDepth;
            extras = {
                ["__serialized__"]: normalizeToSize(exception, normalizeDepth)
            };
            const message = getMessageForObject(exception);
            ex = hint && hint.syntheticException || new Error(message);
            ex.message = message;
        } else {
            // This handles when someone does: `throw "something awesome";`
            // We use synthesized Error here so we can extract a (rough) stack trace.
            ex = hint && hint.syntheticException || new Error(exception);
            ex.message = exception;
        }
        mechanism.synthetic = true;
    }
    const event = {
        exception: {
            values: [
                exceptionFromError(stackParser, ex)
            ]
        }
    };
    if (extras) {
        event.extra = extras;
    }
    addExceptionTypeValue(event, undefined, undefined);
    addExceptionMechanism(event, mechanism);
    return {
        ...event,
        event_id: hint && hint.event_id
    };
}
/**
 * Builds and Event from a Message
 * @hidden
 */ function eventFromMessage(stackParser, message, // eslint-disable-next-line deprecation/deprecation
level = "info", hint, attachStacktrace) {
    const event = {
        event_id: hint && hint.event_id,
        level
    };
    if (attachStacktrace && hint && hint.syntheticException) {
        const frames = parseStackFrames(stackParser, hint.syntheticException);
        if (frames.length) {
            event.exception = {
                values: [
                    {
                        value: message,
                        stacktrace: {
                            frames
                        }
                    }
                ]
            };
        }
    }
    if (isParameterizedString(message)) {
        const { __sentry_template_string__, __sentry_template_values__ } = message;
        event.logentry = {
            message: __sentry_template_string__,
            params: __sentry_template_values__
        };
        return event;
    }
    event.message = message;
    return event;
}
 //# sourceMappingURL=eventbuilder.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/integrations/linkederrors.js


const DEFAULT_KEY = "cause";
const DEFAULT_LIMIT = 5;
const linkederrors_INTEGRATION_NAME = "LinkedErrors";
const _linkedErrorsIntegration = (options = {})=>{
    const limit = options.limit || DEFAULT_LIMIT;
    const key = options.key || DEFAULT_KEY;
    return {
        name: linkederrors_INTEGRATION_NAME,
        // TODO v8: Remove this
        setupOnce () {},
        preprocessEvent (event, hint, client) {
            const options = client.getOptions();
            applyAggregateErrorsToEvent(exceptionFromError, options.stackParser, options.maxValueLength, key, limit, event, hint);
        }
    };
};
const linkedErrorsIntegration = defineIntegration(_linkedErrorsIntegration);
/**
 * Adds SDK info to an event.
 * @deprecated Use `linkedErrorsIntegration()` instead.
 */ // eslint-disable-next-line deprecation/deprecation
const LinkedErrors = convertIntegrationFnToClass(linkederrors_INTEGRATION_NAME, linkedErrorsIntegration);
 //# sourceMappingURL=linkederrors.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/cookie.js
/**
 * This code was originally copied from the 'cookie` module at v0.5.0 and was simplified for our use case.
 * https://github.com/jshttp/cookie/blob/a0c84147aab6266bdb3996cf4062e93907c0b0fc/index.js
 * It had the following license:
 *
 * (The MIT License)
 *
 * Copyright (c) 2012-2014 Roman Shtylman <shtylman@gmail.com>
 * Copyright (c) 2015 Douglas Christopher Wilson <doug@somethingdoug.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */ /**
 * Parses a cookie string
 */ function parseCookie(str) {
    const obj = {};
    let index = 0;
    while(index < str.length){
        const eqIdx = str.indexOf("=", index);
        // no more cookie pairs
        if (eqIdx === -1) {
            break;
        }
        let endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
            endIdx = str.length;
        } else if (endIdx < eqIdx) {
            // backtrack on prior semicolon
            index = str.lastIndexOf(";", eqIdx - 1) + 1;
            continue;
        }
        const key = str.slice(index, eqIdx).trim();
        // only assign once
        if (undefined === obj[key]) {
            let val = str.slice(eqIdx + 1, endIdx).trim();
            // quoted values
            if (val.charCodeAt(0) === 0x22) {
                val = val.slice(1, -1);
            }
            try {
                obj[key] = val.indexOf("%") !== -1 ? decodeURIComponent(val) : val;
            } catch (e) {
                obj[key] = val;
            }
        }
        index = endIdx + 1;
    }
    return obj;
}
 //# sourceMappingURL=cookie.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/url.js
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */ function parseUrl(url) {
    if (!url) {
        return {};
    }
    const match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!match) {
        return {};
    }
    // coerce to undefined values to empty string so we don't get 'undefined'
    const query = match[6] || "";
    const fragment = match[8] || "";
    return {
        host: match[4],
        path: match[5],
        protocol: match[2],
        search: query,
        hash: fragment,
        relative: match[5] + query + fragment
    };
}
/**
 * Strip the query string and fragment off of a given URL or path (if present)
 *
 * @param urlPath Full URL or path, including possible query string and/or fragment
 * @returns URL or path without query string or fragment
 */ function stripUrlQueryAndFragment(urlPath) {
    // eslint-disable-next-line no-useless-escape
    return urlPath.split(/[\?#]/, 1)[0];
}
/**
 * Returns number of URL segments of a passed string URL.
 */ function getNumberOfUrlSegments(url) {
    // split at '/' or at '\/' to split regex urls correctly
    return url.split(/\\?\//).filter((s)=>s.length > 0 && s !== ",").length;
}
/**
 * Takes a URL object and returns a sanitized string which is safe to use as span description
 * see: https://develop.sentry.dev/sdk/data-handling/#structuring-data
 */ function getSanitizedUrlString(url) {
    const { protocol, host, path } = url;
    const filteredHost = host && host// Always filter out authority
    .replace(/^.*@/, "[filtered]:[filtered]@")// Don't show standard :80 (http) and :443 (https) ports to reduce the noise
    // TODO: Use new URL global if it exists
    .replace(/(:80)$/, "").replace(/(:443)$/, "") || "";
    return `${protocol ? `${protocol}://` : ""}${filteredHost}${path}`;
}
 //# sourceMappingURL=url.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/requestdata.js






const DEFAULT_INCLUDES = {
    ip: false,
    request: true,
    transaction: true,
    user: true
};
const DEFAULT_REQUEST_INCLUDES = [
    "cookies",
    "data",
    "headers",
    "method",
    "query_string",
    "url"
];
const DEFAULT_USER_INCLUDES = [
    "id",
    "username",
    "email"
];
/**
 * Sets parameterized route as transaction name e.g.: `GET /users/:id`
 * Also adds more context data on the transaction from the request
 */ function addRequestDataToTransaction(transaction, req, deps) {
    if (!transaction) return;
    // eslint-disable-next-line deprecation/deprecation
    if (!transaction.metadata.source || transaction.metadata.source === "url") {
        // Attempt to grab a parameterized route off of the request
        const [name, source] = extractPathForTransaction(req, {
            path: true,
            method: true
        });
        transaction.updateName(name);
        // TODO: SEMANTIC_ATTRIBUTE_SENTRY_SOURCE is in core, align this once we merge utils & core
        // eslint-disable-next-line deprecation/deprecation
        transaction.setMetadata({
            source
        });
    }
    transaction.setAttribute("url", req.originalUrl || req.url);
    if (req.baseUrl) {
        transaction.setAttribute("baseUrl", req.baseUrl);
    }
    // TODO: We need to rewrite this to a flat format?
    // eslint-disable-next-line deprecation/deprecation
    transaction.setData("query", extractQueryParams(req, deps));
}
/**
 * Extracts a complete and parameterized path from the request object and uses it to construct transaction name.
 * If the parameterized transaction name cannot be extracted, we fall back to the raw URL.
 *
 * Additionally, this function determines and returns the transaction name source
 *
 * eg. GET /mountpoint/user/:id
 *
 * @param req A request object
 * @param options What to include in the transaction name (method, path, or a custom route name to be
 *                used instead of the request's route)
 *
 * @returns A tuple of the fully constructed transaction name [0] and its source [1] (can be either 'route' or 'url')
 */ function extractPathForTransaction(req, options = {}) {
    const method = req.method && req.method.toUpperCase();
    let path = "";
    let source = "url";
    // Check to see if there's a parameterized route we can use (as there is in Express)
    if (options.customRoute || req.route) {
        path = options.customRoute || `${req.baseUrl || ""}${req.route && req.route.path}`;
        source = "route";
    } else if (req.originalUrl || req.url) {
        path = stripUrlQueryAndFragment(req.originalUrl || req.url || "");
    }
    let name = "";
    if (options.method && method) {
        name += method;
    }
    if (options.method && options.path) {
        name += " ";
    }
    if (options.path && path) {
        name += path;
    }
    return [
        name,
        source
    ];
}
/** JSDoc */ function extractTransaction(req, type) {
    switch(type){
        case "path":
            {
                return extractPathForTransaction(req, {
                    path: true
                })[0];
            }
        case "handler":
            {
                return req.route && req.route.stack && req.route.stack[0] && req.route.stack[0].name || "<anonymous>";
            }
        case "methodPath":
        default:
            {
                // if exist _reconstructedRoute return that path instead of route.path
                const customRoute = req._reconstructedRoute ? req._reconstructedRoute : undefined;
                return extractPathForTransaction(req, {
                    path: true,
                    method: true,
                    customRoute
                })[0];
            }
    }
}
/** JSDoc */ function extractUserData(user, keys) {
    const extractedUser = {};
    const attributes = Array.isArray(keys) ? keys : DEFAULT_USER_INCLUDES;
    attributes.forEach((key)=>{
        if (user && key in user) {
            extractedUser[key] = user[key];
        }
    });
    return extractedUser;
}
/**
 * Normalize data from the request object, accounting for framework differences.
 *
 * @param req The request object from which to extract data
 * @param options.include An optional array of keys to include in the normalized data. Defaults to
 * DEFAULT_REQUEST_INCLUDES if not provided.
 * @param options.deps Injected, platform-specific dependencies
 * @returns An object containing normalized request data
 */ function extractRequestData(req, options) {
    const { include = DEFAULT_REQUEST_INCLUDES, deps } = options || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestData = {};
    // headers:
    //   node, express, koa, nextjs: req.headers
    const headers = req.headers || {};
    // method:
    //   node, express, koa, nextjs: req.method
    const method = req.method;
    // host:
    //   express: req.hostname in > 4 and req.host in < 4
    //   koa: req.host
    //   node, nextjs: req.headers.host
    // Express 4 mistakenly strips off port number from req.host / req.hostname so we can't rely on them
    // See: https://github.com/expressjs/express/issues/3047#issuecomment-236653223
    // Also: https://github.com/getsentry/sentry-javascript/issues/1917
    const host = headers.host || req.hostname || req.host || "<no host>";
    // protocol:
    //   node, nextjs: <n/a>
    //   express, koa: req.protocol
    const protocol = req.protocol === "https" || req.socket && req.socket.encrypted ? "https" : "http";
    // url (including path and query string):
    //   node, express: req.originalUrl
    //   koa, nextjs: req.url
    const originalUrl = req.originalUrl || req.url || "";
    // absolute url
    const absoluteUrl = originalUrl.startsWith(protocol) ? originalUrl : `${protocol}://${host}${originalUrl}`;
    include.forEach((key)=>{
        switch(key){
            case "headers":
                {
                    requestData.headers = headers;
                    // Remove the Cookie header in case cookie data should not be included in the event
                    if (!include.includes("cookies")) {
                        delete requestData.headers.cookie;
                    }
                    break;
                }
            case "method":
                {
                    requestData.method = method;
                    break;
                }
            case "url":
                {
                    requestData.url = absoluteUrl;
                    break;
                }
            case "cookies":
                {
                    // cookies:
                    //   node, express, koa: req.headers.cookie
                    //   vercel, sails.js, express (w/ cookie middleware), nextjs: req.cookies
                    requestData.cookies = // TODO (v8 / #5257): We're only sending the empty object for backwards compatibility, so the last bit can
                    // come off in v8
                    req.cookies || headers.cookie && parseCookie(headers.cookie) || {};
                    break;
                }
            case "query_string":
                {
                    // query string:
                    //   node: req.url (raw)
                    //   express, koa, nextjs: req.query
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    requestData.query_string = extractQueryParams(req, deps);
                    break;
                }
            case "data":
                {
                    if (method === "GET" || method === "HEAD") {
                        break;
                    }
                    // body data:
                    //   express, koa, nextjs: req.body
                    //
                    //   when using node by itself, you have to read the incoming stream(see
                    //   https://nodejs.dev/learn/get-http-request-body-data-using-nodejs); if a user is doing that, we can't know
                    //   where they're going to store the final result, so they'll have to capture this data themselves
                    if (req.body !== undefined) {
                        requestData.data = isString(req.body) ? req.body : JSON.stringify(normalize(req.body));
                    }
                    break;
                }
            default:
                {
                    if (({}).hasOwnProperty.call(req, key)) {
                        requestData[key] = req[key];
                    }
                }
        }
    });
    return requestData;
}
/**
 * Add data from the given request to the given event
 *
 * @param event The event to which the request data will be added
 * @param req Request object
 * @param options.include Flags to control what data is included
 * @param options.deps Injected platform-specific dependencies
 * @returns The mutated `Event` object
 */ function addRequestDataToEvent(event, req, options) {
    const include = {
        ...DEFAULT_INCLUDES,
        ...options && options.include
    };
    if (include.request) {
        const extractedRequestData = Array.isArray(include.request) ? extractRequestData(req, {
            include: include.request,
            deps: options && options.deps
        }) : extractRequestData(req, {
            deps: options && options.deps
        });
        event.request = {
            ...event.request,
            ...extractedRequestData
        };
    }
    if (include.user) {
        const extractedUser = req.user && isPlainObject(req.user) ? extractUserData(req.user, include.user) : {};
        if (Object.keys(extractedUser).length) {
            event.user = {
                ...event.user,
                ...extractedUser
            };
        }
    }
    // client ip:
    //   node, nextjs: req.socket.remoteAddress
    //   express, koa: req.ip
    if (include.ip) {
        const ip = req.ip || req.socket && req.socket.remoteAddress;
        if (ip) {
            event.user = {
                ...event.user,
                ip_address: ip
            };
        }
    }
    if (include.transaction && !event.transaction) {
        // TODO do we even need this anymore?
        // TODO make this work for nextjs
        event.transaction = extractTransaction(req, include.transaction);
    }
    return event;
}
function extractQueryParams(req, deps) {
    // url (including path and query string):
    //   node, express: req.originalUrl
    //   koa, nextjs: req.url
    let originalUrl = req.originalUrl || req.url || "";
    if (!originalUrl) {
        return;
    }
    // The `URL` constructor can't handle internal URLs of the form `/some/path/here`, so stick a dummy protocol and
    // hostname on the beginning. Since the point here is just to grab the query string, it doesn't matter what we use.
    if (originalUrl.startsWith("/")) {
        originalUrl = `http://dogs.are.great${originalUrl}`;
    }
    try {
        return req.query || typeof URL !== "undefined" && new URL(originalUrl).search.slice(1) || // In Node 8, `URL` isn't in the global scope, so we have to use the built-in module from Node
        deps && deps.url && deps.url.parse(originalUrl).query || undefined;
    } catch (e2) {
        return undefined;
    }
}
/**
 * Transforms a `Headers` object that implements the `Web Fetch API` (https://developer.mozilla.org/en-US/docs/Web/API/Headers) into a simple key-value dict.
 * The header keys will be lower case: e.g. A "Content-Type" header will be stored as "content-type".
 */ // TODO(v8): Make this function return undefined when the extraction fails.
function winterCGHeadersToDict(winterCGHeaders) {
    const headers = {};
    try {
        winterCGHeaders.forEach((value, key)=>{
            if (typeof value === "string") {
                // We check that value is a string even though it might be redundant to make sure prototype pollution is not possible.
                headers[key] = value;
            }
        });
    } catch (e) {
        debug_build_DEBUG_BUILD && logger_logger.warn("Sentry failed extracting headers from a request object. If you see this, please file an issue.");
    }
    return headers;
}
/**
 * Converts a `Request` object that implements the `Web Fetch API` (https://developer.mozilla.org/en-US/docs/Web/API/Headers) into the format that the `RequestData` integration understands.
 */ function winterCGRequestToRequestData(req) {
    const headers = winterCGHeadersToDict(req.headers);
    return {
        method: req.method,
        url: req.url,
        headers
    };
}
 //# sourceMappingURL=requestdata.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/integrations/requestdata.js



const DEFAULT_OPTIONS = {
    include: {
        cookies: true,
        data: true,
        headers: true,
        ip: false,
        query_string: true,
        url: true,
        user: {
            id: true,
            username: true,
            email: true
        }
    },
    transactionNamingScheme: "methodPath"
};
const requestdata_INTEGRATION_NAME = "RequestData";
const _requestDataIntegration = (options = {})=>{
    const _addRequestData = addRequestDataToEvent;
    const _options = {
        ...DEFAULT_OPTIONS,
        ...options,
        include: {
            // @ts-expect-error It's mad because `method` isn't a known `include` key. (It's only here and not set by default in
            // `addRequestDataToEvent` for legacy reasons. TODO (v8): Change that.)
            method: true,
            ...DEFAULT_OPTIONS.include,
            ...options.include,
            user: options.include && typeof options.include.user === "boolean" ? options.include.user : {
                ...DEFAULT_OPTIONS.include.user,
                // Unclear why TS still thinks `options.include.user` could be a boolean at this point
                ...(options.include || {}).user
            }
        }
    };
    return {
        name: requestdata_INTEGRATION_NAME,
        // TODO v8: Remove this
        setupOnce () {},
        processEvent (event, _hint, client) {
            // Note: In the long run, most of the logic here should probably move into the request data utility functions. For
            // the moment it lives here, though, until https://github.com/getsentry/sentry-javascript/issues/5718 is addressed.
            // (TL;DR: Those functions touch many parts of the repo in many different ways, and need to be clened up. Once
            // that's happened, it will be easier to add this logic in without worrying about unexpected side effects.)
            const { transactionNamingScheme } = _options;
            const { sdkProcessingMetadata = {} } = event;
            const req = sdkProcessingMetadata.request;
            if (!req) {
                return event;
            }
            // The Express request handler takes a similar `include` option to that which can be passed to this integration.
            // If passed there, we store it in `sdkProcessingMetadata`. TODO(v8): Force express and GCP people to use this
            // integration, so that all of this passing and conversion isn't necessary
            const addRequestDataOptions = sdkProcessingMetadata.requestDataOptionsFromExpressHandler || sdkProcessingMetadata.requestDataOptionsFromGCPWrapper || convertReqDataIntegrationOptsToAddReqDataOpts(_options);
            const processedEvent = _addRequestData(event, req, addRequestDataOptions);
            // Transaction events already have the right `transaction` value
            if (event.type === "transaction" || transactionNamingScheme === "handler") {
                return processedEvent;
            }
            // In all other cases, use the request's associated transaction (if any) to overwrite the event's `transaction`
            // value with a high-quality one
            const reqWithTransaction = req;
            const transaction = reqWithTransaction._sentryTransaction;
            if (transaction) {
                const name = spanUtils_spanToJSON(transaction).description || "";
                // TODO (v8): Remove the nextjs check and just base it on `transactionNamingScheme` for all SDKs. (We have to
                // keep it the way it is for the moment, because changing the names of transactions in Sentry has the potential
                // to break things like alert rules.)
                const shouldIncludeMethodInTransactionName = getSDKName(client) === "sentry.javascript.nextjs" ? name.startsWith("/api") : transactionNamingScheme !== "path";
                const [transactionValue] = extractPathForTransaction(req, {
                    path: true,
                    method: shouldIncludeMethodInTransactionName,
                    customRoute: name
                });
                processedEvent.transaction = transactionValue;
            }
            return processedEvent;
        }
    };
};
const requestDataIntegration = defineIntegration(_requestDataIntegration);
/**
 * Add data about a request to an event. Primarily for use in Node-based SDKs, but included in `@sentry/integrations`
 * so it can be used in cross-platform SDKs like `@sentry/nextjs`.
 * @deprecated Use `requestDataIntegration()` instead.
 */ // eslint-disable-next-line deprecation/deprecation
const RequestData = convertIntegrationFnToClass(requestdata_INTEGRATION_NAME, requestDataIntegration);
/** Convert this integration's options to match what `addRequestDataToEvent` expects */ /** TODO: Can possibly be deleted once https://github.com/getsentry/sentry-javascript/issues/5718 is fixed */ function convertReqDataIntegrationOptsToAddReqDataOpts(integrationOptions) {
    const { transactionNamingScheme, include: { ip, user, ...requestOptions } } = integrationOptions;
    const requestIncludeKeys = [];
    for (const [key, value] of Object.entries(requestOptions)){
        if (value) {
            requestIncludeKeys.push(key);
        }
    }
    let addReqDataUserOpt;
    if (user === undefined) {
        addReqDataUserOpt = true;
    } else if (typeof user === "boolean") {
        addReqDataUserOpt = user;
    } else {
        const userIncludeKeys = [];
        for (const [key, value] of Object.entries(user)){
            if (value) {
                userIncludeKeys.push(key);
            }
        }
        addReqDataUserOpt = userIncludeKeys;
    }
    return {
        include: {
            ip,
            user: addReqDataUserOpt,
            request: requestIncludeKeys.length !== 0 ? requestIncludeKeys : undefined,
            transaction: transactionNamingScheme
        }
    };
}
function getSDKName(client) {
    try {
        // For a long chain like this, it's fewer bytes to combine a try-catch with assuming everything is there than to
        // write out a long chain of `a && a.b && a.b.c && ...`
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return client.getOptions()._metadata.sdk.name;
    } catch (err) {
        // In theory we should never get here
        return undefined;
    }
}
 //# sourceMappingURL=requestdata.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/sdk.js




/** A class object that can instantiate Client objects. */ /**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */ function initAndBind(clientClass, options) {
    if (options.debug === true) {
        if (esm_debug_build_DEBUG_BUILD) {
            logger_logger.enable();
        } else {
            // use `console.warn` rather than `logger.warn` since by non-debug bundles have all `logger.x` statements stripped
            consoleSandbox(()=>{
                // eslint-disable-next-line no-console
                console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.");
            });
        }
    }
    const scope = exports_getCurrentScope();
    scope.update(options.initialScope);
    const client = new clientClass(options);
    setCurrentClient(client);
    initializeClient(client);
}
/**
 * Make the given client the current client.
 */ function setCurrentClient(client) {
    // eslint-disable-next-line deprecation/deprecation
    const hub = hub_getCurrentHub();
    // eslint-disable-next-line deprecation/deprecation
    const top = hub.getStackTop();
    top.client = client;
    top.scope.setClient(client);
}
/**
 * Initialize the client for the current scope.
 * Make sure to call this after `setCurrentClient()`.
 */ function initializeClient(client) {
    if (client.init) {
        client.init();
    // TODO v8: Remove this fallback
    // eslint-disable-next-line deprecation/deprecation
    } else if (client.setupIntegrations) {
        // eslint-disable-next-line deprecation/deprecation
        client.setupIntegrations();
    }
}
 //# sourceMappingURL=sdk.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js
/**
 * Polyfill for the optional chain operator, `?.`, given previous conversion of the expression into an array of values,
 * descriptors, and functions.
 *
 * Adapted from Sucrase (https://github.com/alangpierce/sucrase)
 * See https://github.com/alangpierce/sucrase/blob/265887868966917f3b924ce38dfad01fbab1329f/src/transformers/OptionalChainingNullishTransformer.ts#L15
 *
 * @param ops Array result of expression conversion
 * @returns The value of the expression
 */ function _optionalChain(ops) {
    let lastAccessLHS = undefined;
    let value = ops[0];
    let i = 1;
    while(i < ops.length){
        const op = ops[i];
        const fn = ops[i + 1];
        i += 2;
        // by checking for loose equality to `null`, we catch both `null` and `undefined`
        if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
            // really we're meaning to return `undefined` as an actual value here, but it saves bytes not to write it
            return;
        }
        if (op === "access" || op === "optionalAccess") {
            lastAccessLHS = value;
            value = fn(value);
        } else if (op === "call" || op === "optionalCall") {
            value = fn((...args)=>value.call(lastAccessLHS, ...args));
            lastAccessLHS = undefined;
        }
    }
    return value;
}
// Sucrase version
// function _optionalChain(ops) {
//   let lastAccessLHS = undefined;
//   let value = ops[0];
//   let i = 1;
//   while (i < ops.length) {
//     const op = ops[i];
//     const fn = ops[i + 1];
//     i += 2;
//     if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
//       return undefined;
//     }
//     if (op === 'access' || op === 'optionalAccess') {
//       lastAccessLHS = value;
//       value = fn(value);
//     } else if (op === 'call' || op === 'optionalCall') {
//       value = fn((...args) => value.call(lastAccessLHS, ...args));
//       lastAccessLHS = undefined;
//     }
//   }
//   return value;
// }
 //# sourceMappingURL=_optionalChain.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/vercel-edge/esm/debug-build.js
/**
 * This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
 *
 * ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
 */ const vercel_edge_esm_debug_build_DEBUG_BUILD = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
 //# sourceMappingURL=debug-build.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/vercel-edge/esm/async.js




// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
const MaybeGlobalAsyncLocalStorage = worldwide_GLOBAL_OBJ.AsyncLocalStorage;
let asyncStorage;
/**
 * Sets the async context strategy to use AsyncLocalStorage which should be available in the edge runtime.
 */ function setAsyncLocalStorageAsyncContextStrategy() {
    if (!MaybeGlobalAsyncLocalStorage) {
        vercel_edge_esm_debug_build_DEBUG_BUILD && logger_logger.warn("Tried to register AsyncLocalStorage async context strategy in a runtime that doesn't support AsyncLocalStorage.");
        return;
    }
    if (!asyncStorage) {
        asyncStorage = new MaybeGlobalAsyncLocalStorage();
    }
    function getCurrentHub() {
        return asyncStorage.getStore();
    }
    function createNewHub(parent) {
        const carrier = {};
        ensureHubOnCarrier(carrier, parent);
        return getHubFromCarrier(carrier);
    }
    function runWithAsyncContext(callback, options) {
        const existingHub = getCurrentHub();
        if (existingHub && _optionalChain([
            options,
            "optionalAccess",
            (_)=>_.reuseExisting
        ])) {
            // We're already in an async context, so we don't need to create a new one
            // just call the callback with the current hub
            return callback();
        }
        const newHub = createNewHub(existingHub);
        return asyncStorage.run(newHub, ()=>{
            return callback();
        });
    }
    setAsyncContextStrategy({
        getCurrentHub,
        runWithAsyncContext
    });
}
 //# sourceMappingURL=async.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/dsn.js


/** Regular expression used to parse a Dsn. */ const DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function isValidProtocol(protocol) {
    return protocol === "http" || protocol === "https";
}
/**
 * Renders the string representation of this Dsn.
 *
 * By default, this will render the public representation without the password
 * component. To get the deprecated private representation, set `withPassword`
 * to true.
 *
 * @param withPassword When set to true, the password will be included.
 */ function dsn_dsnToString(dsn, withPassword = false) {
    const { host, path, pass, port, projectId, protocol, publicKey } = dsn;
    return `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ""}` + `@${host}${port ? `:${port}` : ""}/${path ? `${path}/` : path}${projectId}`;
}
/**
 * Parses a Dsn from a given string.
 *
 * @param str A Dsn as string
 * @returns Dsn as DsnComponents or undefined if @param str is not a valid DSN string
 */ function dsnFromString(str) {
    const match = DSN_REGEX.exec(str);
    if (!match) {
        // This should be logged to the console
        consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.error(`Invalid Sentry Dsn: ${str}`);
        });
        return undefined;
    }
    const [protocol, publicKey, pass = "", host, port = "", lastPath] = match.slice(1);
    let path = "";
    let projectId = lastPath;
    const split = projectId.split("/");
    if (split.length > 1) {
        path = split.slice(0, -1).join("/");
        projectId = split.pop();
    }
    if (projectId) {
        const projectMatch = projectId.match(/^\d+/);
        if (projectMatch) {
            projectId = projectMatch[0];
        }
    }
    return dsnFromComponents({
        host,
        pass,
        path,
        projectId,
        port,
        protocol: protocol,
        publicKey
    });
}
function dsnFromComponents(components) {
    return {
        protocol: components.protocol,
        publicKey: components.publicKey || "",
        pass: components.pass || "",
        host: components.host,
        port: components.port || "",
        path: components.path || "",
        projectId: components.projectId
    };
}
function validateDsn(dsn) {
    if (!debug_build_DEBUG_BUILD) {
        return true;
    }
    const { port, projectId, protocol } = dsn;
    const requiredComponents = [
        "protocol",
        "publicKey",
        "host",
        "projectId"
    ];
    const hasMissingRequiredComponent = requiredComponents.find((component)=>{
        if (!dsn[component]) {
            logger_logger.error(`Invalid Sentry Dsn: ${component} missing`);
            return true;
        }
        return false;
    });
    if (hasMissingRequiredComponent) {
        return false;
    }
    if (!projectId.match(/^\d+$/)) {
        logger_logger.error(`Invalid Sentry Dsn: Invalid projectId ${projectId}`);
        return false;
    }
    if (!isValidProtocol(protocol)) {
        logger_logger.error(`Invalid Sentry Dsn: Invalid protocol ${protocol}`);
        return false;
    }
    if (port && isNaN(parseInt(port, 10))) {
        logger_logger.error(`Invalid Sentry Dsn: Invalid port ${port}`);
        return false;
    }
    return true;
}
/**
 * Creates a valid Sentry Dsn object, identifying a Sentry instance and project.
 * @returns a valid DsnComponents object or `undefined` if @param from is an invalid DSN source
 */ function dsn_makeDsn(from) {
    const components = typeof from === "string" ? dsnFromString(from) : dsnFromComponents(from);
    if (!components || !validateDsn(components)) {
        return undefined;
    }
    return components;
}
 //# sourceMappingURL=dsn.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/envelope.js



/**
 * Creates an envelope.
 * Make sure to always explicitly provide the generic to this function
 * so that the envelope types resolve correctly.
 */ function createEnvelope(headers, items = []) {
    return [
        headers,
        items
    ];
}
/**
 * Add an item to an envelope.
 * Make sure to always explicitly provide the generic to this function
 * so that the envelope types resolve correctly.
 */ function addItemToEnvelope(envelope, newItem) {
    const [headers, items] = envelope;
    return [
        headers,
        [
            ...items,
            newItem
        ]
    ];
}
/**
 * Convenience function to loop through the items and item types of an envelope.
 * (This function was mostly created because working with envelope types is painful at the moment)
 *
 * If the callback returns true, the rest of the items will be skipped.
 */ function forEachEnvelopeItem(envelope, callback) {
    const envelopeItems = envelope[1];
    for (const envelopeItem of envelopeItems){
        const envelopeItemType = envelopeItem[0].type;
        const result = callback(envelopeItem, envelopeItemType);
        if (result) {
            return true;
        }
    }
    return false;
}
/**
 * Returns true if the envelope contains any of the given envelope item types
 */ function envelopeContainsItemType(envelope, types) {
    return forEachEnvelopeItem(envelope, (_, type)=>types.includes(type));
}
/**
 * Encode a string to UTF8.
 */ function encodeUTF8(input, textEncoder) {
    const utf8 = textEncoder || new TextEncoder();
    return utf8.encode(input);
}
/**
 * Serializes an envelope.
 */ function serializeEnvelope(envelope, textEncoder) {
    const [envHeaders, items] = envelope;
    // Initially we construct our envelope as a string and only convert to binary chunks if we encounter binary data
    let parts = JSON.stringify(envHeaders);
    function append(next) {
        if (typeof parts === "string") {
            parts = typeof next === "string" ? parts + next : [
                encodeUTF8(parts, textEncoder),
                next
            ];
        } else {
            parts.push(typeof next === "string" ? encodeUTF8(next, textEncoder) : next);
        }
    }
    for (const item of items){
        const [itemHeaders, payload] = item;
        append(`\n${JSON.stringify(itemHeaders)}\n`);
        if (typeof payload === "string" || payload instanceof Uint8Array) {
            append(payload);
        } else {
            let stringifiedPayload;
            try {
                stringifiedPayload = JSON.stringify(payload);
            } catch (e) {
                // In case, despite all our efforts to keep `payload` circular-dependency-free, `JSON.strinify()` still
                // fails, we try again after normalizing it again with infinite normalization depth. This of course has a
                // performance impact but in this case a performance hit is better than throwing.
                stringifiedPayload = JSON.stringify(normalize(payload));
            }
            append(stringifiedPayload);
        }
    }
    return typeof parts === "string" ? parts : concatBuffers(parts);
}
function concatBuffers(buffers) {
    const totalLength = buffers.reduce((acc, buf)=>acc + buf.length, 0);
    const merged = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of buffers){
        merged.set(buffer, offset);
        offset += buffer.length;
    }
    return merged;
}
/**
 * Parses an envelope
 */ function parseEnvelope(env, textEncoder, textDecoder) {
    let buffer = typeof env === "string" ? textEncoder.encode(env) : env;
    function readBinary(length) {
        const bin = buffer.subarray(0, length);
        // Replace the buffer with the remaining data excluding trailing newline
        buffer = buffer.subarray(length + 1);
        return bin;
    }
    function readJson() {
        let i = buffer.indexOf(0xa);
        // If we couldn't find a newline, we must have found the end of the buffer
        if (i < 0) {
            i = buffer.length;
        }
        return JSON.parse(textDecoder.decode(readBinary(i)));
    }
    const envelopeHeader = readJson();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = [];
    while(buffer.length){
        const itemHeader = readJson();
        const binaryLength = typeof itemHeader.length === "number" ? itemHeader.length : undefined;
        items.push([
            itemHeader,
            binaryLength ? readBinary(binaryLength) : readJson()
        ]);
    }
    return [
        envelopeHeader,
        items
    ];
}
/**
 * Creates attachment envelope items
 */ function createAttachmentEnvelopeItem(attachment, textEncoder) {
    const buffer = typeof attachment.data === "string" ? encodeUTF8(attachment.data, textEncoder) : attachment.data;
    return [
        dropUndefinedKeys({
            type: "attachment",
            length: buffer.length,
            filename: attachment.filename,
            content_type: attachment.contentType,
            attachment_type: attachment.attachmentType
        }),
        buffer
    ];
}
const ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
    session: "session",
    sessions: "session",
    attachment: "attachment",
    transaction: "transaction",
    event: "error",
    client_report: "internal",
    user_report: "default",
    profile: "profile",
    replay_event: "replay",
    replay_recording: "replay",
    check_in: "monitor",
    feedback: "feedback",
    // TODO: This is a temporary workaround until we have a proper data category for metrics
    statsd: "unknown"
};
/**
 * Maps the type of an envelope item to a data category.
 */ function envelopeItemTypeToDataCategory(type) {
    return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
}
/** Extracts the minimal SDK info from from the metadata or an events */ function getSdkMetadataForEnvelopeHeader(metadataOrEvent) {
    if (!metadataOrEvent || !metadataOrEvent.sdk) {
        return;
    }
    const { name, version } = metadataOrEvent.sdk;
    return {
        name,
        version
    };
}
/**
 * Creates event envelope headers, based on event, sdk info and tunnel
 * Note: This function was extracted from the core package to make it available in Replay
 */ function createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn) {
    const dynamicSamplingContext = event.sdkProcessingMetadata && event.sdkProcessingMetadata.dynamicSamplingContext;
    return {
        event_id: event.event_id,
        sent_at: new Date().toISOString(),
        ...sdkInfo && {
            sdk: sdkInfo
        },
        ...!!tunnel && dsn && {
            dsn: dsn_dsnToString(dsn)
        },
        ...dynamicSamplingContext && {
            trace: dropUndefinedKeys({
                ...dynamicSamplingContext
            })
        }
    };
}
 //# sourceMappingURL=envelope.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/error.js
/** An error emitted by Sentry SDKs and related utilities. */ class SentryError extends Error {
    /** Display name of this error instance. */ constructor(message, logLevel = "warn"){
        super(message);
        this.message = message;
        this.name = new.target.prototype.constructor.name;
        // This sets the prototype to be `Error`, not `SentryError`. It's unclear why we do this, but commenting this line
        // out causes various (seemingly totally unrelated) playwright tests consistently time out. FYI, this makes
        // instances of `SentryError` fail `obj instanceof SentryError` checks.
        Object.setPrototypeOf(this, new.target.prototype);
        this.logLevel = logLevel;
    }
}
 //# sourceMappingURL=error.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/api.js

const SENTRY_API_VERSION = "7";
/** Returns the prefix to construct Sentry ingestion API endpoints. */ function getBaseApiEndpoint(dsn) {
    const protocol = dsn.protocol ? `${dsn.protocol}:` : "";
    const port = dsn.port ? `:${dsn.port}` : "";
    return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ""}/api/`;
}
/** Returns the ingest API endpoint for target. */ function _getIngestEndpoint(dsn) {
    return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
}
/** Returns a URL-encoded string with auth config suitable for a query string. */ function _encodedAuth(dsn, sdkInfo) {
    return urlEncode({
        // We send only the minimum set of required information. See
        // https://github.com/getsentry/sentry-javascript/issues/2572.
        sentry_key: dsn.publicKey,
        sentry_version: SENTRY_API_VERSION,
        ...sdkInfo && {
            sentry_client: `${sdkInfo.name}/${sdkInfo.version}`
        }
    });
}
/**
 * Returns the envelope endpoint URL with auth in the query string.
 *
 * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
 */ function getEnvelopeEndpointWithUrlEncodedAuth(dsn, // TODO (v8): Remove `tunnelOrOptions` in favor of `options`, and use the substitute code below
// options: ClientOptions = {} as ClientOptions,
tunnelOrOptions = {}) {
    // TODO (v8): Use this code instead
    // const { tunnel, _metadata = {} } = options;
    // return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, _metadata.sdk)}`;
    const tunnel = typeof tunnelOrOptions === "string" ? tunnelOrOptions : tunnelOrOptions.tunnel;
    const sdkInfo = typeof tunnelOrOptions === "string" || !tunnelOrOptions._metadata ? undefined : tunnelOrOptions._metadata.sdk;
    return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
}
/** Returns the url to the report dialog endpoint. */ function getReportDialogEndpoint(dsnLike, dialogOptions) {
    const dsn = makeDsn(dsnLike);
    if (!dsn) {
        return "";
    }
    const endpoint = `${getBaseApiEndpoint(dsn)}embed/error-page/`;
    let encodedOptions = `dsn=${dsnToString(dsn)}`;
    for(const key in dialogOptions){
        if (key === "dsn") {
            continue;
        }
        if (key === "onClose") {
            continue;
        }
        if (key === "user") {
            const user = dialogOptions.user;
            if (!user) {
                continue;
            }
            if (user.name) {
                encodedOptions += `&name=${encodeURIComponent(user.name)}`;
            }
            if (user.email) {
                encodedOptions += `&email=${encodeURIComponent(user.email)}`;
            }
        } else {
            encodedOptions += `&${encodeURIComponent(key)}=${encodeURIComponent(dialogOptions[key])}`;
        }
    }
    return `${endpoint}?${encodedOptions}`;
}
 //# sourceMappingURL=api.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/envelope.js

/**
 * Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.
 * Merge with existing data if any.
 **/ function enhanceEventWithSdkInfo(event, sdkInfo) {
    if (!sdkInfo) {
        return event;
    }
    event.sdk = event.sdk || {};
    event.sdk.name = event.sdk.name || sdkInfo.name;
    event.sdk.version = event.sdk.version || sdkInfo.version;
    event.sdk.integrations = [
        ...event.sdk.integrations || [],
        ...sdkInfo.integrations || []
    ];
    event.sdk.packages = [
        ...event.sdk.packages || [],
        ...sdkInfo.packages || []
    ];
    return event;
}
/** Creates an envelope from a Session */ function createSessionEnvelope(session, dsn, metadata, tunnel) {
    const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
    const envelopeHeaders = {
        sent_at: new Date().toISOString(),
        ...sdkInfo && {
            sdk: sdkInfo
        },
        ...!!tunnel && dsn && {
            dsn: dsn_dsnToString(dsn)
        }
    };
    const envelopeItem = "aggregates" in session ? [
        {
            type: "sessions"
        },
        session
    ] : [
        {
            type: "session"
        },
        session.toJSON()
    ];
    return createEnvelope(envelopeHeaders, [
        envelopeItem
    ]);
}
/**
 * Create an Envelope from an event.
 */ function createEventEnvelope(event, dsn, metadata, tunnel) {
    const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
    /*
    Note: Due to TS, event.type may be `replay_event`, theoretically.
    In practice, we never call `createEventEnvelope` with `replay_event` type,
    and we'd have to adjut a looot of types to make this work properly.
    We want to avoid casting this around, as that could lead to bugs (e.g. when we add another type)
    So the safe choice is to really guard against the replay_event type here.
  */ const eventType = event.type && event.type !== "replay_event" ? event.type : "event";
    enhanceEventWithSdkInfo(event, metadata && metadata.sdk);
    const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
    // Prevent this data (which, if it exists, was used in earlier steps in the processing pipeline) from being sent to
    // sentry. (Note: Our use of this property comes and goes with whatever we might be debugging, whatever hacks we may
    // have temporarily added, etc. Even if we don't happen to be using it at some point in the future, let's not get rid
    // of this `delete`, lest we miss putting it back in the next time the property is in use.)
    delete event.sdkProcessingMetadata;
    const eventItem = [
        {
            type: eventType
        },
        event
    ];
    return createEnvelope(envelopeHeaders, [
        eventItem
    ]);
}
 //# sourceMappingURL=envelope.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/metrics/constants.js
const COUNTER_METRIC_TYPE = "c";
const GAUGE_METRIC_TYPE = "g";
const SET_METRIC_TYPE = "s";
const DISTRIBUTION_METRIC_TYPE = "d";
/**
 * Normalization regex for metric names and metric tag names.
 *
 * This enforces that names and tag keys only contain alphanumeric characters,
 * underscores, forward slashes, periods, and dashes.
 *
 * See: https://develop.sentry.dev/sdk/metrics/#normalization
 */ const NAME_AND_TAG_KEY_NORMALIZATION_REGEX = /[^a-zA-Z0-9_/.-]+/g;
/**
 * Normalization regex for metric tag values.
 *
 * This enforces that values only contain words, digits, or the following
 * special characters: _:/@.{}[\]$-
 *
 * See: https://develop.sentry.dev/sdk/metrics/#normalization
 */ const TAG_VALUE_NORMALIZATION_REGEX = /[^\w\d_:/@.{}[\]$-]+/g;
/**
 * This does not match spec in https://develop.sentry.dev/sdk/metrics
 * but was chosen to optimize for the most common case in browser environments.
 */ const DEFAULT_BROWSER_FLUSH_INTERVAL = 5000;
/**
 * SDKs are required to bucket into 10 second intervals (rollup in seconds)
 * which is the current lower bound of metric accuracy.
 */ const DEFAULT_FLUSH_INTERVAL = 10000;
/**
 * The maximum number of metrics that should be stored in memory.
 */ const MAX_WEIGHT = 10000;
 //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/metrics/utils.js


/**
 * Generate bucket key from metric properties.
 */ function getBucketKey(metricType, name, unit, tags) {
    const stringifiedTags = Object.entries(dropUndefinedKeys(tags)).sort((a, b)=>a[0].localeCompare(b[0]));
    return `${metricType}${name}${unit}${stringifiedTags}`;
}
/* eslint-disable no-bitwise */ /**
 * Simple hash function for strings.
 */ function simpleHash(s) {
    let rv = 0;
    for(let i = 0; i < s.length; i++){
        const c = s.charCodeAt(i);
        rv = (rv << 5) - rv + c;
        rv &= rv;
    }
    return rv >>> 0;
}
/* eslint-enable no-bitwise */ /**
 * Serialize metrics buckets into a string based on statsd format.
 *
 * Example of format:
 * metric.name@second:1:1.2|d|#a:value,b:anothervalue|T12345677
 * Segments:
 * name: metric.name
 * unit: second
 * value: [1, 1.2]
 * type of metric: d (distribution)
 * tags: { a: value, b: anothervalue }
 * timestamp: 12345677
 */ function serializeMetricBuckets(metricBucketItems) {
    let out = "";
    for (const item of metricBucketItems){
        const tagEntries = Object.entries(item.tags);
        const maybeTags = tagEntries.length > 0 ? `|#${tagEntries.map(([key, value])=>`${key}:${value}`).join(",")}` : "";
        out += `${item.name}@${item.unit}:${item.metric}|${item.metricType}${maybeTags}|T${item.timestamp}\n`;
    }
    return out;
}
/**
 * Sanitizes tags.
 */ function sanitizeTags(unsanitizedTags) {
    const tags = {};
    for(const key in unsanitizedTags){
        if (Object.prototype.hasOwnProperty.call(unsanitizedTags, key)) {
            const sanitizedKey = key.replace(NAME_AND_TAG_KEY_NORMALIZATION_REGEX, "_");
            tags[sanitizedKey] = String(unsanitizedTags[key]).replace(TAG_VALUE_NORMALIZATION_REGEX, "_");
        }
    }
    return tags;
}
 //# sourceMappingURL=utils.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/metrics/envelope.js


/**
 * Create envelope from a metric aggregate.
 */ function createMetricEnvelope(metricBucketItems, dsn, metadata, tunnel) {
    const headers = {
        sent_at: new Date().toISOString()
    };
    if (metadata && metadata.sdk) {
        headers.sdk = {
            name: metadata.sdk.name,
            version: metadata.sdk.version
        };
    }
    if (!!tunnel && dsn) {
        headers.dsn = dsn_dsnToString(dsn);
    }
    const item = createMetricEnvelopeItem(metricBucketItems);
    return createEnvelope(headers, [
        item
    ]);
}
function createMetricEnvelopeItem(metricBucketItems) {
    const payload = serializeMetricBuckets(metricBucketItems);
    const metricHeaders = {
        type: "statsd",
        length: payload.length
    };
    return [
        metricHeaders,
        payload
    ];
}
 //# sourceMappingURL=envelope.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/baseclient.js











const ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event, it is passed through
 * {@link BaseClient._prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends BaseClient<NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(options);
 *   }
 *
 *   // ...
 * }
 */ class BaseClient {
    /**
   * A reference to a metrics aggregator
   *
   * @experimental Note this is alpha API. It may experience breaking changes in the future.
   */ /** Options passed to the SDK. */ /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */ /** Array of set up integrations. */ /** Indicates whether this client's integrations have been set up. */ /** Number of calls being processed */ /** Holds flushable  */ // eslint-disable-next-line @typescript-eslint/ban-types
    /**
   * Initializes this client instance.
   *
   * @param options Options for the client.
   */ constructor(options){
        this._options = options;
        this._integrations = {};
        this._integrationsInitialized = false;
        this._numProcessing = 0;
        this._outcomes = {};
        this._hooks = {};
        this._eventProcessors = [];
        if (options.dsn) {
            this._dsn = dsn_makeDsn(options.dsn);
        } else {
            esm_debug_build_DEBUG_BUILD && logger_logger.warn("No DSN provided, client will not send events.");
        }
        if (this._dsn) {
            const url = getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, options);
            this._transport = options.transport({
                recordDroppedEvent: this.recordDroppedEvent.bind(this),
                ...options.transportOptions,
                url
            });
        }
    }
    /**
   * @inheritDoc
   */ // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    captureException(exception, hint, scope) {
        // ensure we haven't captured this very object before
        if (checkOrSetAlreadyCaught(exception)) {
            esm_debug_build_DEBUG_BUILD && logger_logger.log(ALREADY_SEEN_ERROR);
            return;
        }
        let eventId = hint && hint.event_id;
        this._process(this.eventFromException(exception, hint).then((event)=>this._captureEvent(event, hint, scope)).then((result)=>{
            eventId = result;
        }));
        return eventId;
    }
    /**
   * @inheritDoc
   */ captureMessage(message, // eslint-disable-next-line deprecation/deprecation
    level, hint, scope) {
        let eventId = hint && hint.event_id;
        const eventMessage = isParameterizedString(message) ? message : String(message);
        const promisedEvent = is_isPrimitive(message) ? this.eventFromMessage(eventMessage, level, hint) : this.eventFromException(message, hint);
        this._process(promisedEvent.then((event)=>this._captureEvent(event, hint, scope)).then((result)=>{
            eventId = result;
        }));
        return eventId;
    }
    /**
   * @inheritDoc
   */ captureEvent(event, hint, scope) {
        // ensure we haven't captured this very object before
        if (hint && hint.originalException && checkOrSetAlreadyCaught(hint.originalException)) {
            esm_debug_build_DEBUG_BUILD && logger_logger.log(ALREADY_SEEN_ERROR);
            return;
        }
        let eventId = hint && hint.event_id;
        const sdkProcessingMetadata = event.sdkProcessingMetadata || {};
        const capturedSpanScope = sdkProcessingMetadata.capturedSpanScope;
        this._process(this._captureEvent(event, hint, capturedSpanScope || scope).then((result)=>{
            eventId = result;
        }));
        return eventId;
    }
    /**
   * @inheritDoc
   */ captureSession(session) {
        if (!(typeof session.release === "string")) {
            esm_debug_build_DEBUG_BUILD && logger_logger.warn("Discarded session because of missing or non-string release");
        } else {
            this.sendSession(session);
            // After sending, we set init false to indicate it's not the first occurrence
            session_updateSession(session, {
                init: false
            });
        }
    }
    /**
   * @inheritDoc
   */ getDsn() {
        return this._dsn;
    }
    /**
   * @inheritDoc
   */ getOptions() {
        return this._options;
    }
    /**
   * @see SdkMetadata in @sentry/types
   *
   * @return The metadata of the SDK
   */ getSdkMetadata() {
        return this._options._metadata;
    }
    /**
   * @inheritDoc
   */ getTransport() {
        return this._transport;
    }
    /**
   * @inheritDoc
   */ flush(timeout) {
        const transport = this._transport;
        if (transport) {
            if (this.metricsAggregator) {
                this.metricsAggregator.flush();
            }
            return this._isClientDoneProcessing(timeout).then((clientFinished)=>{
                return transport.flush(timeout).then((transportFlushed)=>clientFinished && transportFlushed);
            });
        } else {
            return resolvedSyncPromise(true);
        }
    }
    /**
   * @inheritDoc
   */ close(timeout) {
        return this.flush(timeout).then((result)=>{
            this.getOptions().enabled = false;
            if (this.metricsAggregator) {
                this.metricsAggregator.close();
            }
            return result;
        });
    }
    /** Get all installed event processors. */ getEventProcessors() {
        return this._eventProcessors;
    }
    /** @inheritDoc */ addEventProcessor(eventProcessor) {
        this._eventProcessors.push(eventProcessor);
    }
    /**
   * This is an internal function to setup all integrations that should run on the client.
   * @deprecated Use `client.init()` instead.
   */ setupIntegrations(forceInitialize) {
        if (forceInitialize && !this._integrationsInitialized || this._isEnabled() && !this._integrationsInitialized) {
            this._setupIntegrations();
        }
    }
    /** @inheritdoc */ init() {
        if (this._isEnabled()) {
            this._setupIntegrations();
        }
    }
    /**
   * Gets an installed integration by its `id`.
   *
   * @returns The installed integration or `undefined` if no integration with that `id` was installed.
   * @deprecated Use `getIntegrationByName()` instead.
   */ getIntegrationById(integrationId) {
        return this.getIntegrationByName(integrationId);
    }
    /**
   * Gets an installed integration by its name.
   *
   * @returns The installed integration or `undefined` if no integration with that `name` was installed.
   */ getIntegrationByName(integrationName) {
        return this._integrations[integrationName];
    }
    /**
   * Returns the client's instance of the given integration class, it any.
   * @deprecated Use `getIntegrationByName()` instead.
   */ getIntegration(integration) {
        try {
            return this._integrations[integration.id] || null;
        } catch (_oO) {
            esm_debug_build_DEBUG_BUILD && logger_logger.warn(`Cannot retrieve integration ${integration.id} from the current Client`);
            return null;
        }
    }
    /**
   * @inheritDoc
   */ addIntegration(integration) {
        const isAlreadyInstalled = this._integrations[integration.name];
        // This hook takes care of only installing if not already installed
        setupIntegration(this, integration, this._integrations);
        // Here we need to check manually to make sure to not run this multiple times
        if (!isAlreadyInstalled) {
            afterSetupIntegrations(this, [
                integration
            ]);
        }
    }
    /**
   * @inheritDoc
   */ sendEvent(event, hint = {}) {
        this.emit("beforeSendEvent", event, hint);
        let env = createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
        for (const attachment of hint.attachments || []){
            env = addItemToEnvelope(env, createAttachmentEnvelopeItem(attachment, this._options.transportOptions && this._options.transportOptions.textEncoder));
        }
        const promise = this._sendEnvelope(env);
        if (promise) {
            promise.then((sendResponse)=>this.emit("afterSendEvent", event, sendResponse), null);
        }
    }
    /**
   * @inheritDoc
   */ sendSession(session) {
        const env = createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
        // _sendEnvelope should not throw
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._sendEnvelope(env);
    }
    /**
   * @inheritDoc
   */ recordDroppedEvent(reason, category, _event) {
        // Note: we use `event` in replay, where we overwrite this hook.
        if (this._options.sendClientReports) {
            // We want to track each category (error, transaction, session, replay_event) separately
            // but still keep the distinction between different type of outcomes.
            // We could use nested maps, but it's much easier to read and type this way.
            // A correct type for map-based implementation if we want to go that route
            // would be `Partial<Record<SentryRequestType, Partial<Record<Outcome, number>>>>`
            // With typescript 4.1 we could even use template literal types
            const key = `${reason}:${category}`;
            esm_debug_build_DEBUG_BUILD && logger_logger.log(`Adding outcome: "${key}"`);
            // The following works because undefined + 1 === NaN and NaN is falsy
            this._outcomes[key] = this._outcomes[key] + 1 || 1;
        }
    }
    /**
   * @inheritDoc
   */ captureAggregateMetrics(metricBucketItems) {
        esm_debug_build_DEBUG_BUILD && logger_logger.log(`Flushing aggregated metrics, number of metrics: ${metricBucketItems.length}`);
        const metricsEnvelope = createMetricEnvelope(metricBucketItems, this._dsn, this._options._metadata, this._options.tunnel);
        // _sendEnvelope should not throw
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._sendEnvelope(metricsEnvelope);
    }
    // Keep on() & emit() signatures in sync with types' client.ts interface
    /* eslint-disable @typescript-eslint/unified-signatures */ /** @inheritdoc */ /** @inheritdoc */ on(hook, callback) {
        if (!this._hooks[hook]) {
            this._hooks[hook] = [];
        }
        // @ts-expect-error We assue the types are correct
        this._hooks[hook].push(callback);
    }
    /** @inheritdoc */ /** @inheritdoc */ emit(hook, ...rest) {
        if (this._hooks[hook]) {
            this._hooks[hook].forEach((callback)=>callback(...rest));
        }
    }
    /* eslint-enable @typescript-eslint/unified-signatures */ /** Setup integrations for this client. */ _setupIntegrations() {
        const { integrations } = this._options;
        this._integrations = setupIntegrations(this, integrations);
        afterSetupIntegrations(this, integrations);
        // TODO v8: We don't need this flag anymore
        this._integrationsInitialized = true;
    }
    /** Updates existing session based on the provided event */ _updateSessionFromEvent(session, event) {
        let crashed = false;
        let errored = false;
        const exceptions = event.exception && event.exception.values;
        if (exceptions) {
            errored = true;
            for (const ex of exceptions){
                const mechanism = ex.mechanism;
                if (mechanism && mechanism.handled === false) {
                    crashed = true;
                    break;
                }
            }
        }
        // A session is updated and that session update is sent in only one of the two following scenarios:
        // 1. Session with non terminal status and 0 errors + an error occurred -> Will set error count to 1 and send update
        // 2. Session with non terminal status and 1 error + a crash occurred -> Will set status crashed and send update
        const sessionNonTerminal = session.status === "ok";
        const shouldUpdateAndSend = sessionNonTerminal && session.errors === 0 || sessionNonTerminal && crashed;
        if (shouldUpdateAndSend) {
            session_updateSession(session, {
                ...crashed && {
                    status: "crashed"
                },
                errors: session.errors || Number(errored || crashed)
            });
            this.captureSession(session);
        }
    }
    /**
   * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
   * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
   * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
   * `false` otherwise
   */ _isClientDoneProcessing(timeout) {
        return new SyncPromise((resolve)=>{
            let ticked = 0;
            const tick = 1;
            const interval = setInterval(()=>{
                if (this._numProcessing == 0) {
                    clearInterval(interval);
                    resolve(true);
                } else {
                    ticked += tick;
                    if (timeout && ticked >= timeout) {
                        clearInterval(interval);
                        resolve(false);
                    }
                }
            }, tick);
        });
    }
    /** Determines whether this SDK is enabled and a transport is present. */ _isEnabled() {
        return this.getOptions().enabled !== false && this._transport !== undefined;
    }
    /**
   * Adds common information to events.
   *
   * The information includes release and environment from `options`,
   * breadcrumbs and context (extra, tags and user) from the scope.
   *
   * Information that is already present in the event is never overwritten. For
   * nested objects, such as the context, keys are merged.
   *
   * @param event The original event.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A new event with more information.
   */ _prepareEvent(event, hint, scope, isolationScope = hub_getIsolationScope()) {
        const options = this.getOptions();
        const integrations = Object.keys(this._integrations);
        if (!hint.integrations && integrations.length > 0) {
            hint.integrations = integrations;
        }
        this.emit("preprocessEvent", event, hint);
        return prepareEvent(options, event, hint, scope, this, isolationScope).then((evt)=>{
            if (evt === null) {
                return evt;
            }
            const propagationContext = {
                ...isolationScope.getPropagationContext(),
                ...scope ? scope.getPropagationContext() : undefined
            };
            const trace = evt.contexts && evt.contexts.trace;
            if (!trace && propagationContext) {
                const { traceId: trace_id, spanId, parentSpanId, dsc } = propagationContext;
                evt.contexts = {
                    trace: {
                        trace_id,
                        span_id: spanId,
                        parent_span_id: parentSpanId
                    },
                    ...evt.contexts
                };
                const dynamicSamplingContext = dsc ? dsc : getDynamicSamplingContextFromClient(trace_id, this, scope);
                evt.sdkProcessingMetadata = {
                    dynamicSamplingContext,
                    ...evt.sdkProcessingMetadata
                };
            }
            return evt;
        });
    }
    /**
   * Processes the event and logs an error in case of rejection
   * @param event
   * @param hint
   * @param scope
   */ _captureEvent(event, hint = {}, scope) {
        return this._processEvent(event, hint, scope).then((finalEvent)=>{
            return finalEvent.event_id;
        }, (reason)=>{
            if (esm_debug_build_DEBUG_BUILD) {
                // If something's gone wrong, log the error as a warning. If it's just us having used a `SentryError` for
                // control flow, log just the message (no stack) as a log-level log.
                const sentryError = reason;
                if (sentryError.logLevel === "log") {
                    logger_logger.log(sentryError.message);
                } else {
                    logger_logger.warn(sentryError);
                }
            }
            return undefined;
        });
    }
    /**
   * Processes an event (either error or message) and sends it to Sentry.
   *
   * This also adds breadcrumbs and context information to the event. However,
   * platform specific meta data (such as the User's IP address) must be added
   * by the SDK implementor.
   *
   *
   * @param event The event to send to Sentry.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */ _processEvent(event, hint, scope) {
        const options = this.getOptions();
        const { sampleRate } = options;
        const isTransaction = isTransactionEvent(event);
        const isError = baseclient_isErrorEvent(event);
        const eventType = event.type || "error";
        const beforeSendLabel = `before send for type \`${eventType}\``;
        // 1.0 === 100% events are sent
        // 0.0 === 0% events are sent
        // Sampling for transaction happens somewhere else
        if (isError && typeof sampleRate === "number" && Math.random() > sampleRate) {
            this.recordDroppedEvent("sample_rate", "error", event);
            return rejectedSyncPromise(new SentryError(`Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`, "log"));
        }
        const dataCategory = eventType === "replay_event" ? "replay" : eventType;
        const sdkProcessingMetadata = event.sdkProcessingMetadata || {};
        const capturedSpanIsolationScope = sdkProcessingMetadata.capturedSpanIsolationScope;
        return this._prepareEvent(event, hint, scope, capturedSpanIsolationScope).then((prepared)=>{
            if (prepared === null) {
                this.recordDroppedEvent("event_processor", dataCategory, event);
                throw new SentryError("An event processor returned `null`, will not send event.", "log");
            }
            const isInternalException = hint.data && hint.data.__sentry__ === true;
            if (isInternalException) {
                return prepared;
            }
            const result = processBeforeSend(options, prepared, hint);
            return _validateBeforeSendResult(result, beforeSendLabel);
        }).then((processedEvent)=>{
            if (processedEvent === null) {
                this.recordDroppedEvent("before_send", dataCategory, event);
                throw new SentryError(`${beforeSendLabel} returned \`null\`, will not send event.`, "log");
            }
            const session = scope && scope.getSession();
            if (!isTransaction && session) {
                this._updateSessionFromEvent(session, processedEvent);
            }
            // None of the Sentry built event processor will update transaction name,
            // so if the transaction name has been changed by an event processor, we know
            // it has to come from custom event processor added by a user
            const transactionInfo = processedEvent.transaction_info;
            if (isTransaction && transactionInfo && processedEvent.transaction !== event.transaction) {
                const source = "custom";
                processedEvent.transaction_info = {
                    ...transactionInfo,
                    source
                };
            }
            this.sendEvent(processedEvent, hint);
            return processedEvent;
        }).then(null, (reason)=>{
            if (reason instanceof SentryError) {
                throw reason;
            }
            this.captureException(reason, {
                data: {
                    __sentry__: true
                },
                originalException: reason
            });
            throw new SentryError(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: ${reason}`);
        });
    }
    /**
   * Occupies the client with processing and event
   */ _process(promise) {
        this._numProcessing++;
        void promise.then((value)=>{
            this._numProcessing--;
            return value;
        }, (reason)=>{
            this._numProcessing--;
            return reason;
        });
    }
    /**
   * @inheritdoc
   */ _sendEnvelope(envelope) {
        this.emit("beforeEnvelope", envelope);
        if (this._isEnabled() && this._transport) {
            return this._transport.send(envelope).then(null, (reason)=>{
                esm_debug_build_DEBUG_BUILD && logger_logger.error("Error while sending event:", reason);
            });
        } else {
            esm_debug_build_DEBUG_BUILD && logger_logger.error("Transport disabled");
        }
    }
    /**
   * Clears outcomes on this client and returns them.
   */ _clearOutcomes() {
        const outcomes = this._outcomes;
        this._outcomes = {};
        return Object.keys(outcomes).map((key)=>{
            const [reason, category] = key.split(":");
            return {
                reason,
                category,
                quantity: outcomes[key]
            };
        });
    }
}
/**
 * Verifies that return value of configured `beforeSend` or `beforeSendTransaction` is of expected type, and returns the value if so.
 */ function _validateBeforeSendResult(beforeSendResult, beforeSendLabel) {
    const invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
    if (is_isThenable(beforeSendResult)) {
        return beforeSendResult.then((event)=>{
            if (!isPlainObject(event) && event !== null) {
                throw new SentryError(invalidValueError);
            }
            return event;
        }, (e)=>{
            throw new SentryError(`${beforeSendLabel} rejected with ${e}`);
        });
    } else if (!isPlainObject(beforeSendResult) && beforeSendResult !== null) {
        throw new SentryError(invalidValueError);
    }
    return beforeSendResult;
}
/**
 * Process the matching `beforeSendXXX` callback.
 */ function processBeforeSend(options, event, hint) {
    const { beforeSend, beforeSendTransaction } = options;
    if (baseclient_isErrorEvent(event) && beforeSend) {
        return beforeSend(event, hint);
    }
    if (isTransactionEvent(event) && beforeSendTransaction) {
        return beforeSendTransaction(event, hint);
    }
    return event;
}
function baseclient_isErrorEvent(event) {
    return event.type === undefined;
}
function isTransactionEvent(event) {
    return event.type === "transaction";
}
/**
 * Add an event processor to the current client.
 * This event processor will run for all events processed by this client.
 */ function addEventProcessor(callback) {
    const client = getClient();
    if (!client || !client.addEventProcessor) {
        return;
    }
    client.addEventProcessor(callback);
}
 //# sourceMappingURL=baseclient.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/checkin.js

/**
 * Create envelope from check in item.
 */ function createCheckInEnvelope(checkIn, dynamicSamplingContext, metadata, tunnel, dsn) {
    const headers = {
        sent_at: new Date().toISOString()
    };
    if (metadata && metadata.sdk) {
        headers.sdk = {
            name: metadata.sdk.name,
            version: metadata.sdk.version
        };
    }
    if (!!tunnel && !!dsn) {
        headers.dsn = dsn_dsnToString(dsn);
    }
    if (dynamicSamplingContext) {
        headers.trace = dropUndefinedKeys(dynamicSamplingContext);
    }
    const item = createCheckInEnvelopeItem(checkIn);
    return createEnvelope(headers, [
        item
    ]);
}
function createCheckInEnvelopeItem(checkIn) {
    const checkInHeaders = {
        type: "check_in"
    };
    return [
        checkInHeaders,
        checkIn
    ];
}
 //# sourceMappingURL=checkin.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/metrics/instance.js


/**
 * A metric instance representing a counter.
 */ class CounterMetric {
    constructor(_value){
        this._value = _value;
    }
    /** @inheritDoc */ get weight() {
        return 1;
    }
    /** @inheritdoc */ add(value) {
        this._value += value;
    }
    /** @inheritdoc */ toString() {
        return `${this._value}`;
    }
}
/**
 * A metric instance representing a gauge.
 */ class GaugeMetric {
    constructor(value){
        this._last = value;
        this._min = value;
        this._max = value;
        this._sum = value;
        this._count = 1;
    }
    /** @inheritDoc */ get weight() {
        return 5;
    }
    /** @inheritdoc */ add(value) {
        this._last = value;
        if (value < this._min) {
            this._min = value;
        }
        if (value > this._max) {
            this._max = value;
        }
        this._sum += value;
        this._count++;
    }
    /** @inheritdoc */ toString() {
        return `${this._last}:${this._min}:${this._max}:${this._sum}:${this._count}`;
    }
}
/**
 * A metric instance representing a distribution.
 */ class DistributionMetric {
    constructor(first){
        this._value = [
            first
        ];
    }
    /** @inheritDoc */ get weight() {
        return this._value.length;
    }
    /** @inheritdoc */ add(value) {
        this._value.push(value);
    }
    /** @inheritdoc */ toString() {
        return this._value.join(":");
    }
}
/**
 * A metric instance representing a set.
 */ class SetMetric {
    constructor(first){
        this.first = first;
        this._value = new Set([
            first
        ]);
    }
    /** @inheritDoc */ get weight() {
        return this._value.size;
    }
    /** @inheritdoc */ add(value) {
        this._value.add(value);
    }
    /** @inheritdoc */ toString() {
        return Array.from(this._value).map((val)=>typeof val === "string" ? simpleHash(val) : val).join(":");
    }
}
const METRIC_MAP = {
    [COUNTER_METRIC_TYPE]: CounterMetric,
    [GAUGE_METRIC_TYPE]: GaugeMetric,
    [DISTRIBUTION_METRIC_TYPE]: DistributionMetric,
    [SET_METRIC_TYPE]: SetMetric
};
 //# sourceMappingURL=instance.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/metrics/aggregator.js




/**
 * A metrics aggregator that aggregates metrics in memory and flushes them periodically.
 */ class MetricsAggregator {
    // TODO(@anonrig): Use FinalizationRegistry to have a proper way of flushing the buckets
    // when the aggregator is garbage collected.
    // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
    // Different metrics have different weights. We use this to limit the number of metrics
    // that we store in memory.
    // SDKs are required to shift the flush interval by random() * rollup_in_seconds.
    // That shift is determined once per startup to create jittering.
    // An SDK is required to perform force flushing ahead of scheduled time if the memory
    // pressure is too high. There is no rule for this other than that SDKs should be tracking
    // abstract aggregation complexity (eg: a counter only carries a single float, whereas a
    // distribution is a float per emission).
    //
    // Force flush is used on either shutdown, flush() or when we exceed the max weight.
    constructor(_client){
        this._client = _client;
        this._buckets = new Map();
        this._bucketsTotalWeight = 0;
        this._interval = setInterval(()=>this._flush(), DEFAULT_FLUSH_INTERVAL);
        this._flushShift = Math.floor(Math.random() * DEFAULT_FLUSH_INTERVAL / 1000);
        this._forceFlush = false;
    }
    /**
   * @inheritDoc
   */ add(metricType, unsanitizedName, value, unit = "none", unsanitizedTags = {}, maybeFloatTimestamp = time_timestampInSeconds()) {
        const timestamp = Math.floor(maybeFloatTimestamp);
        const name = unsanitizedName.replace(NAME_AND_TAG_KEY_NORMALIZATION_REGEX, "_");
        const tags = sanitizeTags(unsanitizedTags);
        const bucketKey = getBucketKey(metricType, name, unit, tags);
        let bucketItem = this._buckets.get(bucketKey);
        if (bucketItem) {
            bucketItem.metric.add(value);
            // TODO(abhi): Do we need this check?
            if (bucketItem.timestamp < timestamp) {
                bucketItem.timestamp = timestamp;
            }
        } else {
            bucketItem = {
                // @ts-expect-error we don't need to narrow down the type of value here, saves bundle size.
                metric: new METRIC_MAP[metricType](value),
                timestamp,
                metricType,
                name,
                unit,
                tags
            };
            this._buckets.set(bucketKey, bucketItem);
        }
        // We need to keep track of the total weight of the buckets so that we can
        // flush them when we exceed the max weight.
        this._bucketsTotalWeight += bucketItem.metric.weight;
        if (this._bucketsTotalWeight >= MAX_WEIGHT) {
            this.flush();
        }
    }
    /**
   * Flushes the current metrics to the transport via the transport.
   */ flush() {
        this._forceFlush = true;
        this._flush();
    }
    /**
   * Shuts down metrics aggregator and clears all metrics.
   */ close() {
        this._forceFlush = true;
        clearInterval(this._interval);
        this._flush();
    }
    /**
   * Flushes the buckets according to the internal state of the aggregator.
   * If it is a force flush, which happens on shutdown, it will flush all buckets.
   * Otherwise, it will only flush buckets that are older than the flush interval,
   * and according to the flush shift.
   *
   * This function mutates `_forceFlush` and `_bucketsTotalWeight` properties.
   */ _flush() {
        // TODO(@anonrig): Add Atomics for locking to avoid having force flush and regular flush
        // running at the same time.
        // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics
        // This path eliminates the need for checking for timestamps since we're forcing a flush.
        // Remember to reset the flag, or it will always flush all metrics.
        if (this._forceFlush) {
            this._forceFlush = false;
            this._bucketsTotalWeight = 0;
            this._captureMetrics(this._buckets);
            this._buckets.clear();
            return;
        }
        const cutoffSeconds = Math.floor(time_timestampInSeconds()) - DEFAULT_FLUSH_INTERVAL / 1000 - this._flushShift;
        // TODO(@anonrig): Optimization opportunity.
        // Convert this map to an array and store key in the bucketItem.
        const flushedBuckets = new Map();
        for (const [key, bucket] of this._buckets){
            if (bucket.timestamp <= cutoffSeconds) {
                flushedBuckets.set(key, bucket);
                this._bucketsTotalWeight -= bucket.metric.weight;
            }
        }
        for (const [key] of flushedBuckets){
            this._buckets.delete(key);
        }
        this._captureMetrics(flushedBuckets);
    }
    /**
   * Only captures a subset of the buckets passed to this function.
   * @param flushedBuckets
   */ _captureMetrics(flushedBuckets) {
        if (flushedBuckets.size > 0 && this._client.captureAggregateMetrics) {
            // TODO(@anonrig): Optimization opportunity.
            // This copy operation can be avoided if we store the key in the bucketItem.
            const buckets = Array.from(flushedBuckets).map(([, bucketItem])=>bucketItem);
            this._client.captureAggregateMetrics(buckets);
        }
    }
}
 //# sourceMappingURL=aggregator.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/sessionflusher.js


/**
 * @inheritdoc
 */ class SessionFlusher {
    constructor(client, attrs){
        this._client = client;
        this.flushTimeout = 60;
        this._pendingAggregates = {};
        this._isEnabled = true;
        // Call to setInterval, so that flush is called every 60 seconds
        this._intervalId = setInterval(()=>this.flush(), this.flushTimeout * 1000);
        this._sessionAttrs = attrs;
    }
    /** Checks if `pendingAggregates` has entries, and if it does flushes them by calling `sendSession` */ flush() {
        const sessionAggregates = this.getSessionAggregates();
        if (sessionAggregates.aggregates.length === 0) {
            return;
        }
        this._pendingAggregates = {};
        this._client.sendSession(sessionAggregates);
    }
    /** Massages the entries in `pendingAggregates` and returns aggregated sessions */ getSessionAggregates() {
        const aggregates = Object.keys(this._pendingAggregates).map((key)=>{
            return this._pendingAggregates[parseInt(key)];
        });
        const sessionAggregates = {
            attrs: this._sessionAttrs,
            aggregates
        };
        return dropUndefinedKeys(sessionAggregates);
    }
    /** JSDoc */ close() {
        clearInterval(this._intervalId);
        this._isEnabled = false;
        this.flush();
    }
    /**
   * Wrapper function for _incrementSessionStatusCount that checks if the instance of SessionFlusher is enabled then
   * fetches the session status of the request from `Scope.getRequestSession().status` on the scope and passes them to
   * `_incrementSessionStatusCount` along with the start date
   */ incrementSessionStatusCount() {
        if (!this._isEnabled) {
            return;
        }
        const scope = exports_getCurrentScope();
        const requestSession = scope.getRequestSession();
        if (requestSession && requestSession.status) {
            this._incrementSessionStatusCount(requestSession.status, new Date());
            // This is not entirely necessarily but is added as a safe guard to indicate the bounds of a request and so in
            // case captureRequestSession is called more than once to prevent double count
            scope.setRequestSession(undefined);
        /* eslint-enable @typescript-eslint/no-unsafe-member-access */ }
    }
    /**
   * Increments status bucket in pendingAggregates buffer (internal state) corresponding to status of
   * the session received
   */ _incrementSessionStatusCount(status, date) {
        // Truncate minutes and seconds on Session Started attribute to have one minute bucket keys
        const sessionStartedTrunc = new Date(date).setSeconds(0, 0);
        this._pendingAggregates[sessionStartedTrunc] = this._pendingAggregates[sessionStartedTrunc] || {};
        // corresponds to aggregated sessions in one specific minute bucket
        // for example, {"started":"2021-03-16T08:00:00.000Z","exited":4, "errored": 1}
        const aggregationCounts = this._pendingAggregates[sessionStartedTrunc];
        if (!aggregationCounts.started) {
            aggregationCounts.started = new Date(sessionStartedTrunc).toISOString();
        }
        switch(status){
            case "errored":
                aggregationCounts.errored = (aggregationCounts.errored || 0) + 1;
                return aggregationCounts.errored;
            case "ok":
                aggregationCounts.exited = (aggregationCounts.exited || 0) + 1;
                return aggregationCounts.exited;
            default:
                aggregationCounts.crashed = (aggregationCounts.crashed || 0) + 1;
                return aggregationCounts.crashed;
        }
    }
}
 //# sourceMappingURL=sessionflusher.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/server-runtime-client.js












/**
 * The Sentry Server Runtime Client SDK.
 */ class ServerRuntimeClient extends BaseClient {
    /**
   * Creates a new Edge SDK instance.
   * @param options Configuration options for this SDK.
   */ constructor(options){
        // Server clients always support tracing
        addTracingExtensions();
        super(options);
        if (options._experiments && options._experiments["metricsAggregator"]) {
            this.metricsAggregator = new MetricsAggregator(this);
        }
    }
    /**
   * @inheritDoc
   */ eventFromException(exception, hint) {
        return resolvedSyncPromise(eventFromUnknownInput(exports_getClient(), this._options.stackParser, exception, hint));
    }
    /**
   * @inheritDoc
   */ eventFromMessage(message, // eslint-disable-next-line deprecation/deprecation
    level = "info", hint) {
        return resolvedSyncPromise(eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace));
    }
    /**
   * @inheritDoc
   */ // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    captureException(exception, hint, scope) {
        // Check if the flag `autoSessionTracking` is enabled, and if `_sessionFlusher` exists because it is initialised only
        // when the `requestHandler` middleware is used, and hence the expectation is to have SessionAggregates payload
        // sent to the Server only when the `requestHandler` middleware is used
        if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
            const requestSession = scope.getRequestSession();
            // Necessary checks to ensure this is code block is executed only within a request
            // Should override the status only if `requestSession.status` is `Ok`, which is its initial stage
            if (requestSession && requestSession.status === "ok") {
                requestSession.status = "errored";
            }
        }
        return super.captureException(exception, hint, scope);
    }
    /**
   * @inheritDoc
   */ captureEvent(event, hint, scope) {
        // Check if the flag `autoSessionTracking` is enabled, and if `_sessionFlusher` exists because it is initialised only
        // when the `requestHandler` middleware is used, and hence the expectation is to have SessionAggregates payload
        // sent to the Server only when the `requestHandler` middleware is used
        if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
            const eventType = event.type || "exception";
            const isException = eventType === "exception" && event.exception && event.exception.values && event.exception.values.length > 0;
            // If the event is of type Exception, then a request session should be captured
            if (isException) {
                const requestSession = scope.getRequestSession();
                // Ensure that this is happening within the bounds of a request, and make sure not to override
                // Session Status if Errored / Crashed
                if (requestSession && requestSession.status === "ok") {
                    requestSession.status = "errored";
                }
            }
        }
        return super.captureEvent(event, hint, scope);
    }
    /**
   *
   * @inheritdoc
   */ close(timeout) {
        if (this._sessionFlusher) {
            this._sessionFlusher.close();
        }
        return super.close(timeout);
    }
    /** Method that initialises an instance of SessionFlusher on Client */ initSessionFlusher() {
        const { release, environment } = this._options;
        if (!release) {
            esm_debug_build_DEBUG_BUILD && logger_logger.warn("Cannot initialise an instance of SessionFlusher if no release is provided!");
        } else {
            this._sessionFlusher = new SessionFlusher(this, {
                release,
                environment
            });
        }
    }
    /**
   * Create a cron monitor check in and send it to Sentry.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   */ captureCheckIn(checkIn, monitorConfig, scope) {
        const id = "checkInId" in checkIn && checkIn.checkInId ? checkIn.checkInId : misc_uuid4();
        if (!this._isEnabled()) {
            esm_debug_build_DEBUG_BUILD && logger_logger.warn("SDK not enabled, will not capture checkin.");
            return id;
        }
        const options = this.getOptions();
        const { release, environment, tunnel } = options;
        const serializedCheckIn = {
            check_in_id: id,
            monitor_slug: checkIn.monitorSlug,
            status: checkIn.status,
            release,
            environment
        };
        if ("duration" in checkIn) {
            serializedCheckIn.duration = checkIn.duration;
        }
        if (monitorConfig) {
            serializedCheckIn.monitor_config = {
                schedule: monitorConfig.schedule,
                checkin_margin: monitorConfig.checkinMargin,
                max_runtime: monitorConfig.maxRuntime,
                timezone: monitorConfig.timezone
            };
        }
        const [dynamicSamplingContext, traceContext] = this._getTraceInfoFromScope(scope);
        if (traceContext) {
            serializedCheckIn.contexts = {
                trace: traceContext
            };
        }
        const envelope = createCheckInEnvelope(serializedCheckIn, dynamicSamplingContext, this.getSdkMetadata(), tunnel, this.getDsn());
        esm_debug_build_DEBUG_BUILD && logger_logger.info("Sending checkin:", checkIn.monitorSlug, checkIn.status);
        // _sendEnvelope should not throw
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._sendEnvelope(envelope);
        return id;
    }
    /**
   * Method responsible for capturing/ending a request session by calling `incrementSessionStatusCount` to increment
   * appropriate session aggregates bucket
   */ _captureRequestSession() {
        if (!this._sessionFlusher) {
            esm_debug_build_DEBUG_BUILD && logger_logger.warn("Discarded request mode session because autoSessionTracking option was disabled");
        } else {
            this._sessionFlusher.incrementSessionStatusCount();
        }
    }
    /**
   * @inheritDoc
   */ _prepareEvent(event, hint, scope, isolationScope) {
        if (this._options.platform) {
            event.platform = event.platform || this._options.platform;
        }
        if (this._options.runtime) {
            event.contexts = {
                ...event.contexts,
                runtime: (event.contexts || {}).runtime || this._options.runtime
            };
        }
        if (this._options.serverName) {
            event.server_name = event.server_name || this._options.serverName;
        }
        return super._prepareEvent(event, hint, scope, isolationScope);
    }
    /** Extract trace information from scope */ _getTraceInfoFromScope(scope) {
        if (!scope) {
            return [
                undefined,
                undefined
            ];
        }
        // eslint-disable-next-line deprecation/deprecation
        const span = scope.getSpan();
        if (span) {
            const samplingContext = getRootSpan(span) ? getDynamicSamplingContextFromSpan(span) : undefined;
            return [
                samplingContext,
                spanToTraceContext(span)
            ];
        }
        const { traceId, spanId, parentSpanId, dsc } = scope.getPropagationContext();
        const traceContext = {
            trace_id: traceId,
            span_id: spanId,
            parent_span_id: parentSpanId
        };
        if (dsc) {
            return [
                dsc,
                traceContext
            ];
        }
        return [
            getDynamicSamplingContextFromClient(traceId, this, scope),
            traceContext
        ];
    }
}
 //# sourceMappingURL=server-runtime-client.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/vercel-edge/esm/client.js

/**
 * The Sentry Vercel Edge Runtime SDK Client.
 *
 * @see VercelEdgeClientOptions for documentation on configuration options.
 * @see ServerRuntimeClient for usage documentation.
 */ class VercelEdgeClient extends ServerRuntimeClient {
    /**
   * Creates a new Vercel Edge Runtime SDK instance.
   * @param options Configuration options for this SDK.
   */ constructor(options){
        applySdkMetadata(options, "vercel-edge");
        options._metadata = options._metadata || {};
        const clientOptions = {
            ...options,
            platform: "javascript",
            // TODO: Grab version information
            runtime: {
                name: "vercel-edge"
            },
            serverName: options.serverName || process.env.SENTRY_NAME
        };
        super(clientOptions);
    }
}
 //# sourceMappingURL=client.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry-internal/tracing/esm/common/fetch.js


/**
 * Create and track fetch request spans for usage in combination with `addInstrumentationHandler`.
 *
 * @returns Span if a span was created, otherwise void.
 */ function instrumentFetchRequest(handlerData, shouldCreateSpan, shouldAttachHeaders, spans, spanOrigin = "auto.http.browser") {
    if (!hasTracingEnabled() || !handlerData.fetchData) {
        return undefined;
    }
    const shouldCreateSpanResult = shouldCreateSpan(handlerData.fetchData.url);
    if (handlerData.endTimestamp && shouldCreateSpanResult) {
        const spanId = handlerData.fetchData.__span;
        if (!spanId) return;
        const span = spans[spanId];
        if (span) {
            if (handlerData.response) {
                spanstatus_setHttpStatus(span, handlerData.response.status);
                const contentLength = handlerData.response && handlerData.response.headers && handlerData.response.headers.get("content-length");
                if (contentLength) {
                    const contentLengthNum = parseInt(contentLength);
                    if (contentLengthNum > 0) {
                        span.setAttribute("http.response_content_length", contentLengthNum);
                    }
                }
            } else if (handlerData.error) {
                span.setStatus("internal_error");
            }
            span.end();
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete spans[spanId];
        }
        return undefined;
    }
    const scope = exports_getCurrentScope();
    const client = exports_getClient();
    const { method, url } = handlerData.fetchData;
    const span = shouldCreateSpanResult ? startInactiveSpan({
        name: `${method} ${url}`,
        onlyIfParent: true,
        attributes: {
            url,
            type: "fetch",
            "http.method": method,
            [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanOrigin
        },
        op: "http.client"
    }) : undefined;
    if (span) {
        handlerData.fetchData.__span = span.spanContext().spanId;
        spans[span.spanContext().spanId] = span;
    }
    if (shouldAttachHeaders(handlerData.fetchData.url) && client) {
        const request = handlerData.args[0];
        // In case the user hasn't set the second argument of a fetch call we default it to `{}`.
        handlerData.args[1] = handlerData.args[1] || {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = handlerData.args[1];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        options.headers = addTracingHeadersToFetchRequest(request, client, scope, options, span);
    }
    return span;
}
/**
 * Adds sentry-trace and baggage headers to the various forms of fetch headers
 */ function addTracingHeadersToFetchRequest(request, client, scope, options, requestSpan) {
    // eslint-disable-next-line deprecation/deprecation
    const span = requestSpan || scope.getSpan();
    const isolationScope = hub_getIsolationScope();
    const { traceId, spanId, sampled, dsc } = {
        ...isolationScope.getPropagationContext(),
        ...scope.getPropagationContext()
    };
    const sentryTraceHeader = span ? spanToTraceHeader(span) : generateSentryTraceHeader(traceId, spanId, sampled);
    const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dsc || (span ? getDynamicSamplingContextFromSpan(span) : getDynamicSamplingContextFromClient(traceId, client, scope)));
    const headers = options.headers || (typeof Request !== "undefined" && isInstanceOf(request, Request) ? request.headers : undefined);
    if (!headers) {
        return {
            "sentry-trace": sentryTraceHeader,
            baggage: sentryBaggageHeader
        };
    } else if (typeof Headers !== "undefined" && isInstanceOf(headers, Headers)) {
        const newHeaders = new Headers(headers);
        newHeaders.append("sentry-trace", sentryTraceHeader);
        if (sentryBaggageHeader) {
            // If the same header is appended multiple times the browser will merge the values into a single request header.
            // Its therefore safe to simply push a "baggage" entry, even though there might already be another baggage header.
            newHeaders.append(BAGGAGE_HEADER_NAME, sentryBaggageHeader);
        }
        return newHeaders;
    } else if (Array.isArray(headers)) {
        const newHeaders = [
            ...headers,
            [
                "sentry-trace",
                sentryTraceHeader
            ]
        ];
        if (sentryBaggageHeader) {
            // If there are multiple entries with the same key, the browser will merge the values into a single request header.
            // Its therefore safe to simply push a "baggage" entry, even though there might already be another baggage header.
            newHeaders.push([
                BAGGAGE_HEADER_NAME,
                sentryBaggageHeader
            ]);
        }
        return newHeaders;
    } else {
        const existingBaggageHeader = "baggage" in headers ? headers.baggage : undefined;
        const newBaggageHeaders = [];
        if (Array.isArray(existingBaggageHeader)) {
            newBaggageHeaders.push(...existingBaggageHeader);
        } else if (existingBaggageHeader) {
            newBaggageHeaders.push(existingBaggageHeader);
        }
        if (sentryBaggageHeader) {
            newBaggageHeaders.push(sentryBaggageHeader);
        }
        return {
            ...headers,
            "sentry-trace": sentryTraceHeader,
            baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(",") : undefined
        };
    }
}
 //# sourceMappingURL=fetch.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/utils/isSentryRequestUrl.js
/**
 * Checks whether given url points to Sentry server
 * @param url url to verify
 *
 * TODO(v8): Remove Hub fallback type
 */ function isSentryRequestUrl(url, hubOrClient) {
    const client = hubOrClient && isHub(hubOrClient) ? hubOrClient.getClient() : hubOrClient;
    const dsn = client && client.getDsn();
    const tunnel = client && client.getOptions().tunnel;
    return checkDsn(url, dsn) || checkTunnel(url, tunnel);
}
function checkTunnel(url, tunnel) {
    if (!tunnel) {
        return false;
    }
    return isSentryRequestUrl_removeTrailingSlash(url) === isSentryRequestUrl_removeTrailingSlash(tunnel);
}
function checkDsn(url, dsn) {
    return dsn ? url.includes(dsn.host) : false;
}
function isSentryRequestUrl_removeTrailingSlash(str) {
    return str[str.length - 1] === "/" ? str.slice(0, -1) : str;
}
function isHub(hubOrClient) {
    // eslint-disable-next-line deprecation/deprecation
    return hubOrClient.getClient !== undefined;
}
 //# sourceMappingURL=isSentryRequestUrl.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/lru.js
/** A simple Least Recently Used map */ class LRUMap {
    constructor(_maxSize){
        this._maxSize = _maxSize;
        this._cache = new Map();
    }
    /** Get the current size of the cache */ get size() {
        return this._cache.size;
    }
    /** Get an entry or undefined if it was not in the cache. Re-inserts to update the recently used order */ get(key) {
        const value = this._cache.get(key);
        if (value === undefined) {
            return undefined;
        }
        // Remove and re-insert to update the order
        this._cache.delete(key);
        this._cache.set(key, value);
        return value;
    }
    /** Insert an entry and evict an older entry if we've reached maxSize */ set(key, value) {
        if (this._cache.size >= this._maxSize) {
            // keys() returns an iterator in insertion order so keys().next() gives us the oldest key
            this._cache.delete(this._cache.keys().next().value);
        }
        this._cache.set(key, value);
    }
    /** Remove an entry and return the entry if it was in the cache */ remove(key) {
        const value = this._cache.get(key);
        if (value) {
            this._cache.delete(key);
        }
        return value;
    }
    /** Clear all entries */ clear() {
        this._cache.clear();
    }
    /** Get all the keys */ keys() {
        return Array.from(this._cache.keys());
    }
    /** Get all the values */ values() {
        const values = [];
        this._cache.forEach((value)=>values.push(value));
        return values;
    }
}
 //# sourceMappingURL=lru.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/supports.js



// eslint-disable-next-line deprecation/deprecation
const supports_WINDOW = getGlobalObject();
/**
 * Tells whether current environment supports ErrorEvent objects
 * {@link supportsErrorEvent}.
 *
 * @returns Answer to the given question.
 */ function supportsErrorEvent() {
    try {
        new ErrorEvent("");
        return true;
    } catch (e) {
        return false;
    }
}
/**
 * Tells whether current environment supports DOMError objects
 * {@link supportsDOMError}.
 *
 * @returns Answer to the given question.
 */ function supportsDOMError() {
    try {
        // Chrome: VM89:1 Uncaught TypeError: Failed to construct 'DOMError':
        // 1 argument required, but only 0 present.
        // @ts-expect-error It really needs 1 argument, not 0.
        new DOMError("");
        return true;
    } catch (e) {
        return false;
    }
}
/**
 * Tells whether current environment supports DOMException objects
 * {@link supportsDOMException}.
 *
 * @returns Answer to the given question.
 */ function supportsDOMException() {
    try {
        new DOMException("");
        return true;
    } catch (e) {
        return false;
    }
}
/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 */ function supportsFetch() {
    if (!("fetch" in supports_WINDOW)) {
        return false;
    }
    try {
        new Headers();
        new Request("http://www.example.com");
        new Response();
        return true;
    } catch (e) {
        return false;
    }
}
/**
 * isNativeFetch checks if the given function is a native implementation of fetch()
 */ // eslint-disable-next-line @typescript-eslint/ban-types
function isNativeFetch(func) {
    return func && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}
/**
 * Tells whether current environment supports Fetch API natively
 * {@link supportsNativeFetch}.
 *
 * @returns true if `window.fetch` is natively implemented, false otherwise
 */ function supportsNativeFetch() {
    if (true) {
        return true;
    }
    if (!supportsFetch()) {
        return false;
    }
    // Fast path to avoid DOM I/O
    // eslint-disable-next-line @typescript-eslint/unbound-method
    if (isNativeFetch(supports_WINDOW.fetch)) {
        return true;
    }
    // window.fetch is implemented, but is polyfilled or already wrapped (e.g: by a chrome extension)
    // so create a "pure" iframe to see if that has native fetch
    let result = false;
    const doc = supports_WINDOW.document;
    // eslint-disable-next-line deprecation/deprecation
    if (doc && typeof doc.createElement === "function") {
        try {
            const sandbox = doc.createElement("iframe");
            sandbox.hidden = true;
            doc.head.appendChild(sandbox);
            if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                result = isNativeFetch(sandbox.contentWindow.fetch);
            }
            doc.head.removeChild(sandbox);
        } catch (err) {
            debug_build_DEBUG_BUILD && logger_logger.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", err);
        }
    }
    return result;
}
/**
 * Tells whether current environment supports ReportingObserver API
 * {@link supportsReportingObserver}.
 *
 * @returns Answer to the given question.
 */ function supportsReportingObserver() {
    return "ReportingObserver" in supports_WINDOW;
}
/**
 * Tells whether current environment supports Referrer Policy API
 * {@link supportsReferrerPolicy}.
 *
 * @returns Answer to the given question.
 */ function supportsReferrerPolicy() {
    // Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default'
    // (see https://caniuse.com/#feat=referrer-policy),
    // it doesn't. And it throws an exception instead of ignoring this parameter...
    // REF: https://github.com/getsentry/raven-js/issues/1233
    if (!supportsFetch()) {
        return false;
    }
    try {
        new Request("_", {
            referrerPolicy: "origin"
        });
        return true;
    } catch (e) {
        return false;
    }
}
 //# sourceMappingURL=supports.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/instrument/fetch.js




/**
 * Add an instrumentation handler for when a fetch request happens.
 * The handler function is called once when the request starts and once when it ends,
 * which can be identified by checking if it has an `endTimestamp`.
 *
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */ function addFetchInstrumentationHandler(handler) {
    const type = "fetch";
    addHandler(type, handler);
    maybeInstrument(type, instrumentFetch);
}
function instrumentFetch() {
    if (!supportsNativeFetch()) {
        return;
    }
    object_fill(worldwide_GLOBAL_OBJ, "fetch", function(originalFetch) {
        return function(...args) {
            const { method, url } = parseFetchArgs(args);
            const handlerData = {
                args,
                fetchData: {
                    method,
                    url
                },
                startTimestamp: Date.now()
            };
            triggerHandlers("fetch", {
                ...handlerData
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return originalFetch.apply(worldwide_GLOBAL_OBJ, args).then((response)=>{
                const finishedHandlerData = {
                    ...handlerData,
                    endTimestamp: Date.now(),
                    response
                };
                triggerHandlers("fetch", finishedHandlerData);
                return response;
            }, (error)=>{
                const erroredHandlerData = {
                    ...handlerData,
                    endTimestamp: Date.now(),
                    error
                };
                triggerHandlers("fetch", erroredHandlerData);
                // NOTE: If you are a Sentry user, and you are seeing this stack frame,
                //       it means the sentry.javascript SDK caught an error invoking your application code.
                //       This is expected behavior and NOT indicative of a bug with sentry.javascript.
                throw error;
            });
        };
    });
}
function hasProp(obj, prop) {
    return !!obj && typeof obj === "object" && !!obj[prop];
}
function getUrlFromResource(resource) {
    if (typeof resource === "string") {
        return resource;
    }
    if (!resource) {
        return "";
    }
    if (hasProp(resource, "url")) {
        return resource.url;
    }
    if (resource.toString) {
        return resource.toString();
    }
    return "";
}
/**
 * Parses the fetch arguments to find the used Http method and the url of the request.
 * Exported for tests only.
 */ function parseFetchArgs(fetchArgs) {
    if (fetchArgs.length === 0) {
        return {
            method: "GET",
            url: ""
        };
    }
    if (fetchArgs.length === 2) {
        const [url, options] = fetchArgs;
        return {
            url: getUrlFromResource(url),
            method: hasProp(options, "method") ? String(options.method).toUpperCase() : "GET"
        };
    }
    const arg = fetchArgs[0];
    return {
        url: getUrlFromResource(arg),
        method: hasProp(arg, "method") ? String(arg.method).toUpperCase() : "GET"
    };
}
 //# sourceMappingURL=fetch.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/vercel-edge/esm/integrations/wintercg-fetch.js



const wintercg_fetch_INTEGRATION_NAME = "WinterCGFetch";
const HAS_CLIENT_MAP = new WeakMap();
const _winterCGFetch = (options = {})=>{
    const breadcrumbs = options.breadcrumbs === undefined ? true : options.breadcrumbs;
    const shouldCreateSpanForRequest = options.shouldCreateSpanForRequest;
    const _createSpanUrlMap = new LRUMap(100);
    const _headersUrlMap = new LRUMap(100);
    const spans = {};
    /** Decides whether to attach trace data to the outgoing fetch request */ function _shouldAttachTraceData(url) {
        const client = exports_getClient();
        if (!client) {
            return false;
        }
        const clientOptions = client.getOptions();
        if (clientOptions.tracePropagationTargets === undefined) {
            return true;
        }
        const cachedDecision = _headersUrlMap.get(url);
        if (cachedDecision !== undefined) {
            return cachedDecision;
        }
        const decision = stringMatchesSomePattern(url, clientOptions.tracePropagationTargets);
        _headersUrlMap.set(url, decision);
        return decision;
    }
    /** Helper that wraps shouldCreateSpanForRequest option */ function _shouldCreateSpan(url) {
        if (shouldCreateSpanForRequest === undefined) {
            return true;
        }
        const cachedDecision = _createSpanUrlMap.get(url);
        if (cachedDecision !== undefined) {
            return cachedDecision;
        }
        const decision = shouldCreateSpanForRequest(url);
        _createSpanUrlMap.set(url, decision);
        return decision;
    }
    return {
        name: wintercg_fetch_INTEGRATION_NAME,
        // TODO v8: Remove this again
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setupOnce () {
            addFetchInstrumentationHandler((handlerData)=>{
                const client = exports_getClient();
                if (!client || !HAS_CLIENT_MAP.get(client)) {
                    return;
                }
                if (isSentryRequestUrl(handlerData.fetchData.url, client)) {
                    return;
                }
                instrumentFetchRequest(handlerData, _shouldCreateSpan, _shouldAttachTraceData, spans, "auto.http.wintercg_fetch");
                if (breadcrumbs) {
                    createBreadcrumb(handlerData);
                }
            });
        },
        setup (client) {
            HAS_CLIENT_MAP.set(client, true);
        }
    };
};
const winterCGFetchIntegration = defineIntegration(_winterCGFetch);
/**
 * Creates spans and attaches tracing headers to fetch requests on WinterCG runtimes.
 *
 * @deprecated Use `winterCGFetchIntegration()` instead.
 */ // eslint-disable-next-line deprecation/deprecation
const WinterCGFetch = convertIntegrationFnToClass(wintercg_fetch_INTEGRATION_NAME, winterCGFetchIntegration);
// eslint-disable-next-line deprecation/deprecation
function createBreadcrumb(handlerData) {
    const { startTimestamp, endTimestamp } = handlerData;
    // We only capture complete fetch requests
    if (!endTimestamp) {
        return;
    }
    if (handlerData.error) {
        const data = handlerData.fetchData;
        const hint = {
            data: handlerData.error,
            input: handlerData.args,
            startTimestamp,
            endTimestamp
        };
        addBreadcrumb({
            category: "fetch",
            data,
            level: "error",
            type: "http"
        }, hint);
    } else {
        const data = {
            ...handlerData.fetchData,
            status_code: handlerData.response && handlerData.response.status
        };
        const hint = {
            input: handlerData.args,
            response: handlerData.response,
            startTimestamp,
            endTimestamp
        };
        addBreadcrumb({
            category: "fetch",
            data,
            type: "http"
        }, hint);
    }
}
 //# sourceMappingURL=wintercg-fetch.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/promisebuffer.js


/**
 * Creates an new PromiseBuffer object with the specified limit
 * @param limit max number of promises that can be stored in the buffer
 */ function makePromiseBuffer(limit) {
    const buffer = [];
    function isReady() {
        return limit === undefined || buffer.length < limit;
    }
    /**
   * Remove a promise from the queue.
   *
   * @param task Can be any PromiseLike<T>
   * @returns Removed promise.
   */ function remove(task) {
        return buffer.splice(buffer.indexOf(task), 1)[0];
    }
    /**
   * Add a promise (representing an in-flight action) to the queue, and set it to remove itself on fulfillment.
   *
   * @param taskProducer A function producing any PromiseLike<T>; In previous versions this used to be `task:
   *        PromiseLike<T>`, but under that model, Promises were instantly created on the call-site and their executor
   *        functions therefore ran immediately. Thus, even if the buffer was full, the action still happened. By
   *        requiring the promise to be wrapped in a function, we can defer promise creation until after the buffer
   *        limit check.
   * @returns The original promise.
   */ function add(taskProducer) {
        if (!isReady()) {
            return rejectedSyncPromise(new SentryError("Not adding Promise because buffer limit was reached."));
        }
        // start the task and add its promise to the queue
        const task = taskProducer();
        if (buffer.indexOf(task) === -1) {
            buffer.push(task);
        }
        void task.then(()=>remove(task))// Use `then(null, rejectionHandler)` rather than `catch(rejectionHandler)` so that we can use `PromiseLike`
        // rather than `Promise`. `PromiseLike` doesn't have a `.catch` method, making its polyfill smaller. (ES5 didn't
        // have promises, so TS has to polyfill when down-compiling.)
        .then(null, ()=>remove(task).then(null, ()=>{
            // We have to add another catch here because `remove()` starts a new promise chain.
            }));
        return task;
    }
    /**
   * Wait for all promises in the queue to resolve or for timeout to expire, whichever comes first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the queue is still non-empty. Passing `0` (or
   * not passing anything) will make the promise wait as long as it takes for the queue to drain before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if the queue is already empty or drains before the timeout, and
   * `false` otherwise
   */ function drain(timeout) {
        return new SyncPromise((resolve, reject)=>{
            let counter = buffer.length;
            if (!counter) {
                return resolve(true);
            }
            // wait for `timeout` ms and then resolve to `false` (if not cancelled first)
            const capturedSetTimeout = setTimeout(()=>{
                if (timeout && timeout > 0) {
                    resolve(false);
                }
            }, timeout);
            // if all promises resolve in time, cancel the timer and resolve to `true`
            buffer.forEach((item)=>{
                void resolvedSyncPromise(item).then(()=>{
                    if (!--counter) {
                        clearTimeout(capturedSetTimeout);
                        resolve(true);
                    }
                }, reject);
            });
        });
    }
    return {
        $: buffer,
        add,
        drain
    };
}
 //# sourceMappingURL=promisebuffer.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/ratelimit.js
// Intentionally keeping the key broad, as we don't know for sure what rate limit headers get returned from backend
const DEFAULT_RETRY_AFTER = 60 * 1000; // 60 seconds
/**
 * Extracts Retry-After value from the request header or returns default value
 * @param header string representation of 'Retry-After' header
 * @param now current unix timestamp
 *
 */ function parseRetryAfterHeader(header, now = Date.now()) {
    const headerDelay = parseInt(`${header}`, 10);
    if (!isNaN(headerDelay)) {
        return headerDelay * 1000;
    }
    const headerDate = Date.parse(`${header}`);
    if (!isNaN(headerDate)) {
        return headerDate - now;
    }
    return DEFAULT_RETRY_AFTER;
}
/**
 * Gets the time that the given category is disabled until for rate limiting.
 * In case no category-specific limit is set but a general rate limit across all categories is active,
 * that time is returned.
 *
 * @return the time in ms that the category is disabled until or 0 if there's no active rate limit.
 */ function disabledUntil(limits, category) {
    return limits[category] || limits.all || 0;
}
/**
 * Checks if a category is rate limited
 */ function isRateLimited(limits, category, now = Date.now()) {
    return disabledUntil(limits, category) > now;
}
/**
 * Update ratelimits from incoming headers.
 *
 * @return the updated RateLimits object.
 */ function updateRateLimits(limits, { statusCode, headers }, now = Date.now()) {
    const updatedRateLimits = {
        ...limits
    };
    // "The name is case-insensitive."
    // https://developer.mozilla.org/en-US/docs/Web/API/Headers/get
    const rateLimitHeader = headers && headers["x-sentry-rate-limits"];
    const retryAfterHeader = headers && headers["retry-after"];
    if (rateLimitHeader) {
        /**
     * rate limit headers are of the form
     *     <header>,<header>,..
     * where each <header> is of the form
     *     <retry_after>: <categories>: <scope>: <reason_code>
     * where
     *     <retry_after> is a delay in seconds
     *     <categories> is the event type(s) (error, transaction, etc) being rate limited and is of the form
     *         <category>;<category>;...
     *     <scope> is what's being limited (org, project, or key) - ignored by SDK
     *     <reason_code> is an arbitrary string like "org_quota" - ignored by SDK
     */ for (const limit of rateLimitHeader.trim().split(",")){
            const [retryAfter, categories] = limit.split(":", 2);
            const headerDelay = parseInt(retryAfter, 10);
            const delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1000; // 60sec default
            if (!categories) {
                updatedRateLimits.all = now + delay;
            } else {
                for (const category of categories.split(";")){
                    updatedRateLimits[category] = now + delay;
                }
            }
        }
    } else if (retryAfterHeader) {
        updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
    } else if (statusCode === 429) {
        updatedRateLimits.all = now + 60 * 1000;
    }
    return updatedRateLimits;
}
 //# sourceMappingURL=ratelimit.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/core/esm/transports/base.js


const DEFAULT_TRANSPORT_BUFFER_SIZE = 30;
/**
 * Creates an instance of a Sentry `Transport`
 *
 * @param options
 * @param makeRequest
 */ function createTransport(options, makeRequest, buffer = makePromiseBuffer(options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE)) {
    let rateLimits = {};
    const flush = (timeout)=>buffer.drain(timeout);
    function send(envelope) {
        const filteredEnvelopeItems = [];
        // Drop rate limited items from envelope
        forEachEnvelopeItem(envelope, (item, type)=>{
            const envelopeItemDataCategory = envelopeItemTypeToDataCategory(type);
            if (isRateLimited(rateLimits, envelopeItemDataCategory)) {
                const event = getEventForEnvelopeItem(item, type);
                options.recordDroppedEvent("ratelimit_backoff", envelopeItemDataCategory, event);
            } else {
                filteredEnvelopeItems.push(item);
            }
        });
        // Skip sending if envelope is empty after filtering out rate limited events
        if (filteredEnvelopeItems.length === 0) {
            return resolvedSyncPromise();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filteredEnvelope = createEnvelope(envelope[0], filteredEnvelopeItems);
        // Creates client report for each item in an envelope
        const recordEnvelopeLoss = (reason)=>{
            forEachEnvelopeItem(filteredEnvelope, (item, type)=>{
                const event = getEventForEnvelopeItem(item, type);
                options.recordDroppedEvent(reason, envelopeItemTypeToDataCategory(type), event);
            });
        };
        const requestTask = ()=>makeRequest({
                body: serializeEnvelope(filteredEnvelope, options.textEncoder)
            }).then((response)=>{
                // We don't want to throw on NOK responses, but we want to at least log them
                if (response.statusCode !== undefined && (response.statusCode < 200 || response.statusCode >= 300)) {
                    esm_debug_build_DEBUG_BUILD && logger_logger.warn(`Sentry responded with status code ${response.statusCode} to sent event.`);
                }
                rateLimits = updateRateLimits(rateLimits, response);
                return response;
            }, (error)=>{
                recordEnvelopeLoss("network_error");
                throw error;
            });
        return buffer.add(requestTask).then((result)=>result, (error)=>{
            if (error instanceof SentryError) {
                esm_debug_build_DEBUG_BUILD && logger_logger.error("Skipped sending event because buffer is full.");
                recordEnvelopeLoss("queue_overflow");
                return resolvedSyncPromise();
            } else {
                throw error;
            }
        });
    }
    // We use this to identifify if the transport is the base transport
    // TODO (v8): Remove this again as we'll no longer need it
    send.__sentry__baseTransport__ = true;
    return {
        send,
        flush
    };
}
function getEventForEnvelopeItem(item, type) {
    if (type !== "event" && type !== "transaction") {
        return undefined;
    }
    return Array.isArray(item) ? item[1] : undefined;
}
 //# sourceMappingURL=base.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/vercel-edge/esm/transports/index.js


const transports_DEFAULT_TRANSPORT_BUFFER_SIZE = 30;
/**
 * This is a modified promise buffer that collects tasks until drain is called.
 * We need this in the edge runtime because edge function invocations may not share I/O objects, like fetch requests
 * and responses, and the normal PromiseBuffer inherently buffers stuff inbetween incoming requests.
 *
 * A limitation we need to be aware of is that DEFAULT_TRANSPORT_BUFFER_SIZE is the maximum amount of payloads the
 * SDK can send for a given edge function invocation.
 */ class IsolatedPromiseBuffer {
    // We just have this field because the promise buffer interface requires it.
    // If we ever remove it from the interface we should also remove it here.
    constructor(_bufferSize = transports_DEFAULT_TRANSPORT_BUFFER_SIZE){
        this.$ = [];
        this._taskProducers = [];
        this._bufferSize = _bufferSize;
    }
    /**
   * @inheritdoc
   */ add(taskProducer) {
        if (this._taskProducers.length >= this._bufferSize) {
            return Promise.reject(new SentryError("Not adding Promise because buffer limit was reached."));
        }
        this._taskProducers.push(taskProducer);
        return Promise.resolve();
    }
    /**
   * @inheritdoc
   */ drain(timeout) {
        const oldTaskProducers = [
            ...this._taskProducers
        ];
        this._taskProducers = [];
        return new Promise((resolve)=>{
            const timer = setTimeout(()=>{
                if (timeout && timeout > 0) {
                    resolve(false);
                }
            }, timeout);
            // This cannot reject
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.all(oldTaskProducers.map((taskProducer)=>taskProducer().then(null, ()=>{
                // catch all failed requests
                }))).then(()=>{
                // resolve to true if all fetch requests settled
                clearTimeout(timer);
                resolve(true);
            });
        });
    }
}
/**
 * Creates a Transport that uses the Edge Runtimes native fetch API to send events to Sentry.
 */ function makeEdgeTransport(options) {
    function makeRequest(request) {
        const requestOptions = {
            body: request.body,
            method: "POST",
            headers: options.headers,
            ...options.fetchOptions
        };
        return fetch(options.url, requestOptions).then((response)=>{
            return {
                statusCode: response.status,
                headers: {
                    "x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits"),
                    "retry-after": response.headers.get("Retry-After")
                }
            };
        });
    }
    return createTransport(options, makeRequest, new IsolatedPromiseBuffer(options.bufferSize));
}
 //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/vercel-edge/esm/utils/vercel.js
/**
 * Returns an environment setting value determined by Vercel's `VERCEL_ENV` environment variable.
 *
 * @param isClient Flag to indicate whether to use the `NEXT_PUBLIC_` prefixed version of the environment variable.
 */ function getVercelEnv(isClient) {
    const vercelEnvVar = isClient ? process.env.NEXT_PUBLIC_VERCEL_ENV : process.env.VERCEL_ENV;
    return vercelEnvVar ? `vercel-${vercelEnvVar}` : undefined;
}
 //# sourceMappingURL=vercel.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/vercel-edge/esm/sdk.js







const nodeStackParser = createStackParser(nodeStackLineParser());
/** @deprecated Use `getDefaultIntegrations(options)` instead. */ const defaultIntegrations = [
    inboundFiltersIntegration(),
    functionToStringIntegration(),
    linkedErrorsIntegration(),
    winterCGFetchIntegration()
];
/** Get the default integrations for the browser SDK. */ function getDefaultIntegrations(options) {
    return [
        // eslint-disable-next-line deprecation/deprecation
        ...defaultIntegrations,
        ...options.sendDefaultPii ? [
            requestDataIntegration()
        ] : []
    ];
}
/** Inits the Sentry NextJS SDK on the Edge Runtime. */ function init(options = {}) {
    setAsyncLocalStorageAsyncContextStrategy();
    if (options.defaultIntegrations === undefined) {
        options.defaultIntegrations = getDefaultIntegrations(options);
    }
    if (options.dsn === undefined && process.env.SENTRY_DSN) {
        options.dsn = process.env.SENTRY_DSN;
    }
    if (options.tracesSampleRate === undefined && process.env.SENTRY_TRACES_SAMPLE_RATE) {
        const tracesSampleRate = parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE);
        if (isFinite(tracesSampleRate)) {
            options.tracesSampleRate = tracesSampleRate;
        }
    }
    if (options.release === undefined) {
        const detectedRelease = getSentryRelease();
        if (detectedRelease !== undefined) {
            options.release = detectedRelease;
        } else {
            // If release is not provided, then we should disable autoSessionTracking
            options.autoSessionTracking = false;
        }
    }
    options.environment = options.environment || process.env.SENTRY_ENVIRONMENT || getVercelEnv(false) || "production";
    if (options.autoSessionTracking === undefined && options.dsn !== undefined) {
        options.autoSessionTracking = true;
    }
    if (options.instrumenter === undefined) {
        options.instrumenter = "sentry";
    }
    const clientOptions = {
        ...options,
        stackParser: stackParserFromStackParserOptions(options.stackParser || nodeStackParser),
        integrations: getIntegrationsToSetup(options),
        transport: options.transport || makeEdgeTransport
    };
    initAndBind(VercelEdgeClient, clientOptions);
}
/**
 * Returns a release dynamically from environment variables.
 */ function getSentryRelease(fallback) {
    // Always read first as Sentry takes this as precedence
    if (process.env.SENTRY_RELEASE) {
        return process.env.SENTRY_RELEASE;
    }
    // This supports the variable that sentry-webpack-plugin injects
    if (worldwide_GLOBAL_OBJ.SENTRY_RELEASE && worldwide_GLOBAL_OBJ.SENTRY_RELEASE.id) {
        return worldwide_GLOBAL_OBJ.SENTRY_RELEASE.id;
    }
    return(// GitHub Actions - https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables
    process.env.GITHUB_SHA || // Vercel - https://vercel.com/docs/v2/build-step#system-environment-variables
    process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GITHUB_COMMIT_SHA || process.env.VERCEL_GITLAB_COMMIT_SHA || process.env.VERCEL_BITBUCKET_COMMIT_SHA || // Zeit (now known as Vercel)
    process.env.ZEIT_GITHUB_COMMIT_SHA || process.env.ZEIT_GITLAB_COMMIT_SHA || process.env.ZEIT_BITBUCKET_COMMIT_SHA || fallback);
}
 //# sourceMappingURL=sdk.js.map

// EXTERNAL MODULE: ./node_modules/next/constants.js
var constants = __webpack_require__(673);
;// CONCATENATED MODULE: ./node_modules/@sentry/nextjs/esm/common/utils/isBuild.js

/**
 * Decide if the currently running process is part of the build phase or happening at runtime.
 */ function isBuild() {
    return process.env.NEXT_PHASE === constants.PHASE_PRODUCTION_BUILD;
}
 //# sourceMappingURL=isBuild.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/path.js
// Slightly modified (no IE8 support, ES6) and transcribed to TypeScript
// https://github.com/calvinmetcalf/rollup-plugin-node-builtins/blob/63ab8aacd013767445ca299e468d9a60a95328d7/src/es6/path.js
//
// Copyright Joyent, Inc.and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
/** JSDoc */ function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    let up = 0;
    for(let i = parts.length - 1; i >= 0; i--){
        const last = parts[i];
        if (last === ".") {
            parts.splice(i, 1);
        } else if (last === "..") {
            parts.splice(i, 1);
            up++;
        } else if (up) {
            parts.splice(i, 1);
            up--;
        }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
        for(; up--; up){
            parts.unshift("..");
        }
    }
    return parts;
}
// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
const splitPathRe = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
/** JSDoc */ function splitPath(filename) {
    // Truncate files names greater than 1024 characters to avoid regex dos
    // https://github.com/getsentry/sentry-javascript/pull/8737#discussion_r1285719172
    const truncated = filename.length > 1024 ? `<truncated>${filename.slice(-1024)}` : filename;
    const parts = splitPathRe.exec(truncated);
    return parts ? parts.slice(1) : [];
}
// path.resolve([from ...], to)
// posix version
/** JSDoc */ function resolve(...args) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i = args.length - 1; i >= -1 && !resolvedAbsolute; i--){
        const path = i >= 0 ? args[i] : "/";
        // Skip empty entries
        if (!path) {
            continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = path.charAt(0) === "/";
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    // Normalize the path
    resolvedPath = normalizeArray(resolvedPath.split("/").filter((p)=>!!p), !resolvedAbsolute).join("/");
    return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
}
/** JSDoc */ function trim(arr) {
    let start = 0;
    for(; start < arr.length; start++){
        if (arr[start] !== "") {
            break;
        }
    }
    let end = arr.length - 1;
    for(; end >= 0; end--){
        if (arr[end] !== "") {
            break;
        }
    }
    if (start > end) {
        return [];
    }
    return arr.slice(start, end - start + 1);
}
// path.relative(from, to)
// posix version
/** JSDoc */ function relative(from, to) {
    /* eslint-disable no-param-reassign */ from = resolve(from).slice(1);
    to = resolve(to).slice(1);
    /* eslint-enable no-param-reassign */ const fromParts = trim(from.split("/"));
    const toParts = trim(to.split("/"));
    const length = Math.min(fromParts.length, toParts.length);
    let samePartsLength = length;
    for(let i = 0; i < length; i++){
        if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
        }
    }
    let outputParts = [];
    for(let i = samePartsLength; i < fromParts.length; i++){
        outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
}
// path.normalize(path)
// posix version
/** JSDoc */ function normalizePath(path) {
    const isPathAbsolute = isAbsolute(path);
    const trailingSlash = path.slice(-1) === "/";
    // Normalize the path
    let normalizedPath = normalizeArray(path.split("/").filter((p)=>!!p), !isPathAbsolute).join("/");
    if (!normalizedPath && !isPathAbsolute) {
        normalizedPath = ".";
    }
    if (normalizedPath && trailingSlash) {
        normalizedPath += "/";
    }
    return (isPathAbsolute ? "/" : "") + normalizedPath;
}
// posix version
/** JSDoc */ function isAbsolute(path) {
    return path.charAt(0) === "/";
}
// posix version
/** JSDoc */ function join(...args) {
    return normalizePath(args.join("/"));
}
/** JSDoc */ function dirname(path) {
    const result = splitPath(path);
    const root = result[0];
    let dir = result[1];
    if (!root && !dir) {
        // No dirname whatsoever
        return ".";
    }
    if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.slice(0, dir.length - 1);
    }
    return root + dir;
}
/** JSDoc */ function basename(path, ext) {
    let f = splitPath(path)[2];
    if (ext && f.slice(ext.length * -1) === ext) {
        f = f.slice(0, f.length - ext.length);
    }
    return f;
}
 //# sourceMappingURL=path.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/integrations/esm/rewriteframes.js


const rewriteframes_INTEGRATION_NAME = "RewriteFrames";
const _rewriteFramesIntegration = (options = {})=>{
    const root = options.root;
    const prefix = options.prefix || "app:///";
    const iteratee = options.iteratee || ((frame)=>{
        if (!frame.filename) {
            return frame;
        }
        // Determine if this is a Windows frame by checking for a Windows-style prefix such as `C:\`
        const isWindowsFrame = /^[a-zA-Z]:\\/.test(frame.filename) || // or the presence of a backslash without a forward slash (which are not allowed on Windows)
        frame.filename.includes("\\") && !frame.filename.includes("/");
        // Check if the frame filename begins with `/`
        const startsWithSlash = /^\//.test(frame.filename);
        if (isWindowsFrame || startsWithSlash) {
            const filename = isWindowsFrame ? frame.filename.replace(/^[a-zA-Z]:/, "") // remove Windows-style prefix
            .replace(/\\/g, "/") // replace all `\\` instances with `/`
             : frame.filename;
            const base = root ? relative(root, filename) : basename(filename);
            frame.filename = `${prefix}${base}`;
        }
        return frame;
    });
    /** Process an exception event. */ function _processExceptionsEvent(event) {
        try {
            return {
                ...event,
                exception: {
                    ...event.exception,
                    // The check for this is performed inside `process` call itself, safe to skip here
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    values: event.exception.values.map((value)=>({
                            ...value,
                            ...value.stacktrace && {
                                stacktrace: _processStacktrace(value.stacktrace)
                            }
                        }))
                }
            };
        } catch (_oO) {
            return event;
        }
    }
    /** Process a stack trace. */ function _processStacktrace(stacktrace) {
        return {
            ...stacktrace,
            frames: stacktrace && stacktrace.frames && stacktrace.frames.map((f)=>iteratee(f))
        };
    }
    return {
        name: rewriteframes_INTEGRATION_NAME,
        // TODO v8: Remove this
        setupOnce () {},
        processEvent (originalEvent) {
            let processedEvent = originalEvent;
            if (originalEvent.exception && Array.isArray(originalEvent.exception.values)) {
                processedEvent = _processExceptionsEvent(processedEvent);
            }
            return processedEvent;
        }
    };
};
const rewriteFramesIntegration = defineIntegration(_rewriteFramesIntegration);
/**
 * Rewrite event frames paths.
 * @deprecated Use `rewriteFramesIntegration()` instead.
 */ // eslint-disable-next-line deprecation/deprecation
const RewriteFrames = convertIntegrationFnToClass(rewriteframes_INTEGRATION_NAME, rewriteFramesIntegration);
 //# sourceMappingURL=rewriteframes.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/utils/esm/vendor/escapeStringForRegex.js
// Based on https://github.com/sindresorhus/escape-string-regexp but with modifications to:
//   a) reduce the size by skipping the runtime type - checking
//   b) ensure it gets down - compiled for old versions of Node(the published package only supports Node 12+).
//
// MIT License
//
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files(the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of
// the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
/**
 * Given a string, escape characters which have meaning in the regex grammar, such that the result is safe to feed to
 * `new RegExp()`.
 *
 * @param regexString The string to escape
 * @returns An version of the string with all special regex characters escaped
 */ function escapeStringForRegex(regexString) {
    // escape the hyphen separately so we can also replace it with a unicode literal hyphen, to avoid the problems
    // discussed in https://github.com/sindresorhus/escape-string-regexp/issues/20.
    return regexString.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
 //# sourceMappingURL=escapeStringForRegex.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/nextjs/esm/edge/rewriteFramesIntegration.js




const globalWithInjectedValues = worldwide_GLOBAL_OBJ;
const customRewriteFramesIntegration = (options)=>{
    // This value is injected at build time, based on the output directory specified in the build config. Though a default
    // is set there, we set it here as well, just in case something has gone wrong with the injection.
    const distDirName = globalWithInjectedValues.__rewriteFramesDistDir__;
    if (distDirName) {
        const distDirAbsPath = distDirName.replace(/(\/|\\)$/, ""); // We strip trailing slashes because "app:///_next" also doesn't have one
        // Normally we would use `path.resolve` to obtain the absolute path we will strip from the stack frame to align with
        // the uploaded artifacts, however we don't have access to that API in edge so we need to be a bit more lax.
        // eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor -- user input is escaped
        const SOURCEMAP_FILENAME_REGEX = new RegExp(`.*${escapeStringForRegex(distDirAbsPath)}`);
        return rewriteFramesIntegration({
            iteratee: (frame)=>{
                frame.filename = _optionalChain([
                    frame,
                    "access",
                    (_)=>_.filename,
                    "optionalAccess",
                    (_2)=>_2.replace,
                    "call",
                    (_3)=>_3(SOURCEMAP_FILENAME_REGEX, "app:///_next")
                ]);
                return frame;
            },
            ...options
        });
    }
    // Do nothing if we can't find a distDirName
    return {
        // eslint-disable-next-line deprecation/deprecation
        name: RewriteFrames.id,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setupOnce: ()=>{},
        processEvent: (event)=>event
    };
};
const rewriteFramesIntegration_rewriteFramesIntegration = defineIntegration(customRewriteFramesIntegration);
 //# sourceMappingURL=rewriteFramesIntegration.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/nextjs/esm/edge/index.js





















/** Inits the Sentry NextJS SDK on the Edge Runtime. */ function edge_init(options = {}) {
    addTracingExtensions();
    if (isBuild()) {
        return;
    }
    const customDefaultIntegrations = [
        ...getDefaultIntegrations(options),
        rewriteFramesIntegration_rewriteFramesIntegration()
    ];
    const opts = {
        defaultIntegrations: customDefaultIntegrations,
        ...options
    };
    applySdkMetadata(opts, "nextjs");
    init(opts);
}
/**
 * Just a passthrough in case this is imported from the client.
 */ function withSentryConfig(exportedUserNextConfig) {
    return exportedUserNextConfig;
}
 //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ./sentry.edge.config.ts
var _sentryCollisionFreeGlobalObject =  false ? 0 : typeof __webpack_require__.g != "undefined" ? __webpack_require__.g : typeof self != "undefined" ? self : {};
_sentryCollisionFreeGlobalObject["__sentryRewritesTunnelPath__"] = undefined;
_sentryCollisionFreeGlobalObject["SENTRY_RELEASE"] = {
    "id": "15ajf7g8aQknSFjwEsxw1"
};
_sentryCollisionFreeGlobalObject["__sentryBasePath"] = undefined;
_sentryCollisionFreeGlobalObject["__rewriteFramesDistDir__"] = ".next";

// Same config as server, but for Edge Runtime
edge_init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENVIRONMENT || "production",
    release: process.env.GIT_COMMIT_HASH || "unknown",
    tracesSampleRate: 0.1,
    // Before Send Hook
    beforeSend (event, hint) {
        // Filter sensitive data
        if (event.request && event.request.headers) {
            const sensitiveHeaders = [
                "authorization",
                "x-api-key",
                "cookie"
            ];
            sensitiveHeaders.forEach((header)=>{
                const headerLower = header.toLowerCase();
                Object.keys(event.request.headers).forEach((key)=>{
                    if (key.toLowerCase() === headerLower) {
                        event.request.headers[key] = "[Filtered]";
                    }
                });
            });
        }
        return event;
    }
});

;// CONCATENATED MODULE: ./node_modules/@sentry/nextjs/esm/common/debug-build.js
/**
 * This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
 *
 * ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
 */ const common_debug_build_DEBUG_BUILD = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
 //# sourceMappingURL=debug-build.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/nextjs/esm/common/utils/responseEnd.js



/**
 * Wrap `res.end()` so that it ends the span and flushes events before letting the request finish.
 *
 * Note: This wraps a sync method with an async method. While in general that's not a great idea in terms of keeping
 * things in the right order, in this case it's safe, because the native `.end()` actually *is* (effectively) async, and
 * its run actually *is* (literally) awaited, just manually so (which reflects the fact that the core of the
 * request/response code in Node by far predates the introduction of `async`/`await`). When `.end()` is done, it emits
 * the `prefinish` event, and only once that fires does request processing continue. See
 * https://github.com/nodejs/node/commit/7c9b607048f13741173d397795bac37707405ba7.
 *
 * Also note: `res.end()` isn't called until *after* all response data and headers have been sent, so blocking inside of
 * `end` doesn't delay data getting to the end user. See
 * https://nodejs.org/api/http.html#responseenddata-encoding-callback.
 *
 * @param span The span tracking the request
 * @param res: The request's corresponding response
 */ function autoEndSpanOnResponseEnd(span, res) {
    const wrapEndMethod = (origEnd)=>{
        return function sentryWrappedEnd(...args) {
            finishSpan(span, this);
            return origEnd.call(this, ...args);
        };
    };
    // Prevent double-wrapping
    // res.end may be undefined during build when using `next export` to statically export a Next.js app
    if (res.end && !res.end.__sentry_original__) {
        fill(res, "end", wrapEndMethod);
    }
}
/** Finish the given response's span and set HTTP status data */ function finishSpan(span, res) {
    if (span) {
        setHttpStatus(span, res.statusCode);
        span.end();
    }
}
/** Flush the event queue to ensure that events get sent to Sentry before the response is finished and the lambda ends */ async function flushQueue() {
    try {
        common_debug_build_DEBUG_BUILD && logger_logger.log("Flushing events...");
        await flush(2000);
        common_debug_build_DEBUG_BUILD && logger_logger.log("Done flushing events");
    } catch (e) {
        common_debug_build_DEBUG_BUILD && logger_logger.log("Error while flushing events:\n", e);
    }
}
 //# sourceMappingURL=responseEnd.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/nextjs/esm/common/utils/edgeWrapperUtils.js



/**
 * Wraps a function on the edge runtime with error and performance monitoring.
 */ function withEdgeWrapping(handler, options) {
    return async function(...args) {
        addTracingExtensions();
        const req = args[0];
        let sentryTrace;
        let baggage;
        if (req instanceof Request) {
            sentryTrace = req.headers.get("sentry-trace") || "";
            baggage = req.headers.get("baggage");
        }
        return continueTrace({
            sentryTrace,
            baggage
        }, ()=>{
            return startSpan({
                name: options.spanDescription,
                op: options.spanOp,
                attributes: {
                    [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "route",
                    [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.function.nextjs.withEdgeWrapping"
                },
                metadata: {
                    request: req instanceof Request ? winterCGRequestToRequestData(req) : undefined
                }
            }, async (span)=>{
                const handlerResult = await handleCallbackErrors_handleCallbackErrors(()=>handler.apply(this, args), (error)=>{
                    captureException(error, {
                        mechanism: {
                            type: "instrument",
                            handled: false,
                            data: {
                                function: options.mechanismFunctionName
                            }
                        }
                    });
                });
                if (span) {
                    if (handlerResult instanceof Response) {
                        spanstatus_setHttpStatus(span, handlerResult.status);
                    } else {
                        span.setStatus("ok");
                    }
                }
                return handlerResult;
            }).finally(()=>flushQueue());
        });
    };
}
 //# sourceMappingURL=edgeWrapperUtils.js.map

;// CONCATENATED MODULE: ./node_modules/@sentry/nextjs/esm/common/wrapMiddlewareWithSentry.js

/**
 * Wraps Next.js middleware with Sentry error and performance instrumentation.
 *
 * @param middleware The middleware handler.
 * @returns a wrapped middleware handler.
 */ function wrapMiddlewareWithSentry(middleware) {
    return new Proxy(middleware, {
        apply: (wrappingTarget, thisArg, args)=>{
            return withEdgeWrapping(wrappingTarget, {
                spanDescription: "middleware",
                spanOp: "middleware.nextjs",
                mechanismFunctionName: "withSentryMiddleware"
            }).apply(thisArg, args);
        }
    });
}
 //# sourceMappingURL=wrapMiddlewareWithSentry.js.map

;// CONCATENATED MODULE: ./node_modules/next/dist/esm/server/web/exports/next-response.js
// This file is for modularized imports for next/server to get fully-treeshaking.
 //# sourceMappingURL=next-response.js.map

;// CONCATENATED MODULE: ./node_modules/next-intl/dist/esm/production/routing/config.js
function e(e) {
    return {
        ...e,
        localePrefix: (a = e.localePrefix, "object" == typeof a ? a : {
            mode: a || "always"
        }),
        localeCookie: (o = e.localeCookie, !!(o ?? 1) && {
            name: "NEXT_LOCALE",
            sameSite: "lax",
            ..."object" == typeof o && o
        }),
        localeDetection: e.localeDetection ?? !0,
        alternateLinks: e.alternateLinks ?? !0
    };
    var o, a;
}


;// CONCATENATED MODULE: ./node_modules/next-intl/dist/esm/production/shared/constants.js
const constants_L = "X-NEXT-INTL-LOCALE";


;// CONCATENATED MODULE: ./node_modules/next-intl/dist/esm/production/shared/utils.js
function n(n) {
    return function(n) {
        return "object" == typeof n ? null == n.host && null == n.hostname : !/^[a-z]+:/i.test(n);
    }(n) && !function(n) {
        const t = "object" == typeof n ? n.pathname : n;
        return null != t && !t.startsWith("/");
    }(n);
}
function t(n, t) {
    return n.replace(new RegExp(`^${t}`), "") || "/";
}
function utils_e(n, t) {
    let e = n;
    return /^\/(\?.*)?$/.test(t) && (t = t.slice(1)), e += t, e;
}
function r(n, t) {
    return t === n || t.startsWith(`${n}/`);
}
function u(n, t, e) {
    return "string" == typeof n ? n : n[t] || e;
}
function utils_i(n) {
    const t = function() {
        try {
            return "true" === process.env._next_intl_trailing_slash;
        } catch  {
            return !1;
        }
    }(), [e, ...r] = n.split("#"), u = r.join("#");
    let i = e;
    if ("/" !== i) {
        const n = i.endsWith("/");
        t && !n ? i += "/" : !t && n && (i = i.slice(0, -1));
    }
    return u && (i += "#" + u), i;
}
function utils_c(n, t) {
    const e = utils_i(n), r = utils_i(t);
    return utils_s(e).test(r);
}
function utils_o(n, t) {
    return "never" !== t.mode && t.prefixes?.[n] || f(n);
}
function f(n) {
    return "/" + n;
}
function utils_s(n) {
    const t = n.replace(/\/\[\[(\.\.\.[^\]]+)\]\]/g, "(?:/(.*))?").replace(/\[\[(\.\.\.[^\]]+)\]\]/g, "(?:/(.*))?").replace(/\[(\.\.\.[^\]]+)\]/g, "(.+)").replace(/\[([^\]]+)\]/g, "([^/]+)");
    return new RegExp(`^${t}$`);
}
function l(n) {
    return n.includes("[[...");
}
function p(n) {
    return n.includes("[...");
}
function a(n) {
    return n.includes("[");
}
function h(n, t) {
    const e = n.split("/"), r = t.split("/"), u = Math.max(e.length, r.length);
    for(let n = 0; n < u; n++){
        const t = e[n], u = r[n];
        if (!t && u) return -1;
        if (t && !u) return 1;
        if (t || u) {
            if (!a(t) && a(u)) return -1;
            if (a(t) && !a(u)) return 1;
            if (!p(t) && p(u)) return -1;
            if (p(t) && !p(u)) return 1;
            if (!l(t) && l(u)) return -1;
            if (l(t) && !l(u)) return 1;
        }
    }
    return 0;
}
function g(n) {
    return n.sort(h);
}
function x(n) {
    return "function" == typeof n.then;
}


;// CONCATENATED MODULE: ./node_modules/next-intl/dist/esm/production/middleware/utils.js

function s(e, r, o) {
    const c = g(Object.keys(e));
    for (const t of c){
        const c = e[t];
        if ("string" == typeof c) {
            if (utils_c(c, r)) return [
                void 0,
                t
            ];
        } else {
            const s = Object.entries(c), f = s.findIndex(([e])=>e === o);
            f > 0 && s.unshift(s.splice(f, 1)[0]);
            for (const [o] of s){
                const c = u(e[t], o, t);
                if (utils_c(c, r)) return [
                    o,
                    t
                ];
            }
        }
    }
    for (const t of Object.keys(e))if (utils_c(t, r)) return [
        void 0,
        t
    ];
    return [
        void 0,
        void 0
    ];
}
function utils_f(t, n, r, o) {
    let c = "";
    return c += utils_h(r, d(n, t)), c = utils_i(c), c;
}
function utils_l(t, n, r) {
    t.endsWith("/") || (t += "/");
    const o = utils_u(n, r), c = new RegExp(`^(${o.map(([, e])=>e.replaceAll("/", "\\/")).join("|")})/(.*)`, "i"), i = t.match(c);
    let s = i ? "/" + i[2] : t;
    return "/" !== s && (s = utils_i(s)), s;
}
function utils_u(e, t, n = !0) {
    const r = e.map((e)=>[
            e,
            utils_o(e, t)
        ]);
    return n && r.sort((e, t)=>t[1].length - e[1].length), r;
}
function utils_a(e, t, n, r) {
    const o = utils_u(t, n);
    r && o.sort(([e], [t])=>{
        if (e === r.defaultLocale) return -1;
        if (t === r.defaultLocale) return 1;
        const n = r.locales.includes(e), o = r.locales.includes(t);
        return n && !o ? -1 : !n && o ? 1 : 0;
    });
    for (const [t, n] of o){
        let r, o;
        if (e === n || e.startsWith(n + "/")) r = o = !0;
        else {
            const t = e.toLowerCase(), c = n.toLowerCase();
            (t === c || t.startsWith(c + "/")) && (r = !1, o = !0);
        }
        if (o) return {
            locale: t,
            prefix: n,
            matchedPrefix: e.slice(0, n.length),
            exact: r
        };
    }
}
function d(t, n) {
    const r = utils_i(n), o = utils_i(t), i = utils_s(o).exec(r);
    if (!i) return;
    const s = {}, f = o.match(/\[([^\]]+)\]/g) ?? [];
    for(let e = 1; e < i.length; e++){
        const t = f[e - 1];
        if (!t) continue;
        const n = t.replace(/[[\]]/g, ""), r = i[e] ?? "";
        s[n] = r;
    }
    return s;
}
function utils_h(e, t) {
    if (!t) return e;
    let n = e = e.replace(/\[\[/g, "[").replace(/\]\]/g, "]");
    return Object.entries(t).forEach(([e, t])=>{
        n = n.replace(`[${e}]`, t);
    }), n;
}
function utils_p(e, t, n) {
    let o = e;
    return t && (o = utils_e(t, o)), n && (o += n), o;
}
function utils_g(e) {
    return e.get("x-forwarded-host") ?? e.get("host") ?? void 0;
}
function utils_x(e, t) {
    return t.defaultLocale === e || t.locales.includes(e);
}
function m(e, t, n) {
    let r;
    return e && utils_x(t, e) && (r = e), r || (r = n.find((e)=>e.defaultLocale === t)), r || (r = n.find((e)=>e.locales.includes(t))), r;
}
function utils_j(t, n) {
    return utils_i(n + t);
}
function utils_L(e) {
    return `/${e}`;
}
function utils_v(e) {
    return e.replace(/\\/g, "%5C").replace(/\/+/g, "/");
}


;// CONCATENATED MODULE: ./node_modules/next-intl/dist/esm/production/middleware/getAlternateLinksHeaderValue.js


function getAlternateLinksHeaderValue_s({ internalTemplateName: s, localizedPathnames: m, request: i, resolvedLocale: p, routing: c }) {
    const f = i.nextUrl.clone(), h = utils_g(i.headers);
    function u(a, t) {
        return a.pathname = utils_i(a.pathname), i.nextUrl.basePath && ((a = new URL(a)).pathname = utils_j(a.pathname, i.nextUrl.basePath)), `<${a.toString()}>; rel="alternate"; hreflang="${t}"`;
    }
    function d(e, a) {
        if (m && "object" == typeof m) {
            const t = m[p];
            return utils_f(e, t ?? s, m[a] ?? s);
        }
        return e;
    }
    h && (f.port = "", f.host = h), f.protocol = i.headers.get("x-forwarded-proto") ?? f.protocol, f.pathname = utils_l(f.pathname, c.locales, c.localePrefix);
    const x = utils_u(c.locales, c.localePrefix, !1).flatMap(([e, a])=>{
        function t(e) {
            return "/" === e ? a : a + e;
        }
        let n;
        if (c.domains) {
            return c.domains.filter((a)=>utils_x(e, a)).map((a)=>(n = new URL(f), n.port = "", n.host = a.domain, n.pathname = d(f.pathname, e), e === a.defaultLocale && "always" !== c.localePrefix.mode || (n.pathname = t(n.pathname)), u(n, e)));
        }
        {
            let a;
            a = m && "object" == typeof m ? d(f.pathname, e) : f.pathname, e === c.defaultLocale && "always" !== c.localePrefix.mode || (a = t(a)), n = new URL(a, f);
        }
        return u(n, e);
    });
    if (!c.domains || 0 === c.domains.length) {
        const e = d(f.pathname, c.defaultLocale);
        if (e) {
            const a = new URL(e, f);
            x.push(u(a, "x-default"));
        }
    }
    return x.join(", ");
}


;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/CanonicalizeLocaleList.js
/**
 * http://ecma-international.org/ecma-402/7.0/index.html#sec-canonicalizelocalelist
 * @param locales
 */ function CanonicalizeLocaleList(locales) {
    return Intl.getCanonicalLocales(locales);
}

;// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.mjs
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ /* global Reflect, Promise, SuppressedError, Symbol, Iterator */ var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(d, b) {
        d.__proto__ = b;
    } || function(d, b) {
        for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
    return extendStatics(d, b);
};
function __extends(d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __rest(s, e) {
    var t = {};
    for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++){
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
}
function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) {
        if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
        return f;
    }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for(var i = decorators.length - 1; i >= 0; i--){
        var context = {};
        for(var p in contextIn)context[p] = p === "access" ? {} : contextIn[p];
        for(var p in contextIn.access)context.access[p] = contextIn.access[p];
        context.addInitializer = function(f) {
            if (done) throw new TypeError("Cannot add initializers after decoration has completed");
            extraInitializers.push(accept(f || null));
        };
        var result = (0, decorators[i])(kind === "accessor" ? {
            get: descriptor.get,
            set: descriptor.set
        } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        } else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
}
;
function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for(var i = 0; i < initializers.length; i++){
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
}
;
function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
}
;
function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", {
        configurable: true,
        value: prefix ? "".concat(prefix, " ", name) : name
    });
}
;
function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
function __generator(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var __createBinding = Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
};
function __exportStar(m, o) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
}
/** @deprecated */ function __spread() {
    for(var ar = [], i = 0; i < arguments.length; i++)ar = ar.concat(__read(arguments[i]));
    return ar;
}
/** @deprecated */ function __spreadArrays() {
    for(var s = 0, i = 0, il = arguments.length; i < il; i++)s += arguments[i].length;
    for(var r = Array(s), k = 0, i = 0; i < il; i++)for(var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)r[k] = a[j];
    return r;
}
function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
        return this;
    }, i;
    function awaitReturn(f) {
        return function(v) {
            return Promise.resolve(v).then(f, reject);
        };
    }
    function verb(n, f) {
        if (g[n]) {
            i[n] = function(v) {
                return new Promise(function(a, b) {
                    q.push([
                        n,
                        v,
                        a,
                        b
                    ]) > 1 || resume(n, v);
                });
            };
            if (f) i[n] = f(i[n]);
        }
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
}
function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function(e) {
        throw e;
    }), verb("return"), i[Symbol.iterator] = function() {
        return this;
    }, i;
    function verb(n, f) {
        i[n] = o[n] ? function(v) {
            return (p = !p) ? {
                value: __await(o[n](v)),
                done: false
            } : f ? f(v) : v;
        } : f;
    }
}
function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i);
    function verb(n) {
        i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
                v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
        };
    }
    function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function(v) {
            resolve({
                value: v,
                done: d
            });
        }, reject);
    }
}
function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", {
            value: raw
        });
    } else {
        cooked.raw = raw;
    }
    return cooked;
}
;
var __setModuleDefault = Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
};
var ownKeys = function(o) {
    ownKeys = Object.getOwnPropertyNames || function(o) {
        var ar = [];
        for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
        return ar;
    };
    return ownKeys(o);
};
function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
    }
    __setModuleDefault(result, mod);
    return result;
}
function __importDefault(mod) {
    return mod && mod.__esModule ? mod : {
        default: mod
    };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() {
            try {
                inner.call(this);
            } catch (e) {
                return Promise.reject(e);
            }
        };
        env.stack.push({
            value: value,
            dispose: dispose,
            async: async
        });
    } else if (async) {
        env.stack.push({
            async: true
        });
    }
    return value;
}
var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function __disposeResources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    var r, s = 0;
    function next() {
        while(r = env.stack.pop()){
            try {
                if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                if (r.dispose) {
                    var result = r.dispose.call(r.value);
                    if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
                        fail(e);
                        return next();
                    });
                } else s |= 1;
            } catch (e) {
                fail(e);
            }
        }
        if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        if (env.hasError) throw env.error;
    }
    return next();
}
function __rewriteRelativeImportExtension(path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
        });
    }
    return path;
}
/* harmony default export */ const tslib_es6 = ({
    __extends,
    __assign,
    __rest,
    __decorate,
    __param,
    __esDecorate,
    __runInitializers,
    __propKey,
    __setFunctionName,
    __metadata,
    __awaiter,
    __generator,
    __createBinding,
    __exportStar,
    __values,
    __read,
    __spread,
    __spreadArrays,
    __spreadArray,
    __await,
    __asyncGenerator,
    __asyncDelegator,
    __asyncValues,
    __makeTemplateObject,
    __importStar,
    __importDefault,
    __classPrivateFieldGet,
    __classPrivateFieldSet,
    __classPrivateFieldIn,
    __addDisposableResource,
    __disposeResources,
    __rewriteRelativeImportExtension
});

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/languageMatching.js
var languageMatching_data = {
    supplemental: {
        languageMatching: {
            "written-new": [
                {
                    paradigmLocales: {
                        _locales: "en en_GB es es_419 pt_BR pt_PT"
                    }
                },
                {
                    $enUS: {
                        _value: "AS+CA+GU+MH+MP+PH+PR+UM+US+VI"
                    }
                },
                {
                    $cnsar: {
                        _value: "HK+MO"
                    }
                },
                {
                    $americas: {
                        _value: "019"
                    }
                },
                {
                    $maghreb: {
                        _value: "MA+DZ+TN+LY+MR+EH"
                    }
                },
                {
                    no: {
                        _desired: "nb",
                        _distance: "1"
                    }
                },
                {
                    bs: {
                        _desired: "hr",
                        _distance: "4"
                    }
                },
                {
                    bs: {
                        _desired: "sh",
                        _distance: "4"
                    }
                },
                {
                    hr: {
                        _desired: "sh",
                        _distance: "4"
                    }
                },
                {
                    sr: {
                        _desired: "sh",
                        _distance: "4"
                    }
                },
                {
                    aa: {
                        _desired: "ssy",
                        _distance: "4"
                    }
                },
                {
                    de: {
                        _desired: "gsw",
                        _distance: "4",
                        _oneway: "true"
                    }
                },
                {
                    de: {
                        _desired: "lb",
                        _distance: "4",
                        _oneway: "true"
                    }
                },
                {
                    no: {
                        _desired: "da",
                        _distance: "8"
                    }
                },
                {
                    nb: {
                        _desired: "da",
                        _distance: "8"
                    }
                },
                {
                    ru: {
                        _desired: "ab",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ach",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    nl: {
                        _desired: "af",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ak",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "am",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    es: {
                        _desired: "ay",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "az",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    ur: {
                        _desired: "bal",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "be",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "bem",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    hi: {
                        _desired: "bh",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "bn",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "bo",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "br",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    es: {
                        _desired: "ca",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    fil: {
                        _desired: "ceb",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "chr",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "ckb",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "co",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "crs",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    sk: {
                        _desired: "cs",
                        _distance: "20"
                    }
                },
                {
                    en: {
                        _desired: "cy",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ee",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "eo",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    es: {
                        _desired: "eu",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    da: {
                        _desired: "fo",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    nl: {
                        _desired: "fy",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ga",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "gaa",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "gd",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    es: {
                        _desired: "gl",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    es: {
                        _desired: "gn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    hi: {
                        _desired: "gu",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ha",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "haw",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "ht",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "hy",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ia",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ig",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "is",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    id: {
                        _desired: "jv",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ka",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "kg",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "kk",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "km",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "kn",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "kri",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    tr: {
                        _desired: "ku",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "ky",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    it: {
                        _desired: "la",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "lg",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "ln",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "lo",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "loz",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "lua",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    hi: {
                        _desired: "mai",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "mfe",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "mg",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "mi",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ml",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "mn",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    hi: {
                        _desired: "mr",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    id: {
                        _desired: "ms",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "mt",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "my",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ne",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    nb: {
                        _desired: "nn",
                        _distance: "20"
                    }
                },
                {
                    no: {
                        _desired: "nn",
                        _distance: "20"
                    }
                },
                {
                    en: {
                        _desired: "nso",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ny",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "nyn",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "oc",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "om",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "or",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "pa",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "pcm",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ps",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    es: {
                        _desired: "qu",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    de: {
                        _desired: "rm",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "rn",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "rw",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    hi: {
                        _desired: "sa",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "sd",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "si",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "sn",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "so",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "sq",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "st",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    id: {
                        _desired: "su",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "sw",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ta",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "te",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "tg",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ti",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "tk",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "tlh",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "tn",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "to",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "tt",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "tum",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "ug",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "uk",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "ur",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    ru: {
                        _desired: "uz",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    fr: {
                        _desired: "wo",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "xh",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "yi",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "yo",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "za",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    en: {
                        _desired: "zu",
                        _distance: "30",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "aao",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "abh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "abv",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "acm",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "acq",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "acw",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "acx",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "acy",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "adf",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "aeb",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "aec",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "afb",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "ajp",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "apc",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "apd",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "arq",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "ars",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "ary",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "arz",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "auz",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "avl",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "ayh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "ayl",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "ayn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "ayp",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "bbz",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "pga",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "shu",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ar: {
                        _desired: "ssh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    az: {
                        _desired: "azb",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    et: {
                        _desired: "vro",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ff: {
                        _desired: "ffm",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ff: {
                        _desired: "fub",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ff: {
                        _desired: "fue",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ff: {
                        _desired: "fuf",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ff: {
                        _desired: "fuh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ff: {
                        _desired: "fui",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ff: {
                        _desired: "fuq",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ff: {
                        _desired: "fuv",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    gn: {
                        _desired: "gnw",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    gn: {
                        _desired: "gui",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    gn: {
                        _desired: "gun",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    gn: {
                        _desired: "nhd",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    iu: {
                        _desired: "ikt",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    kln: {
                        _desired: "enb",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    kln: {
                        _desired: "eyo",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    kln: {
                        _desired: "niq",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    kln: {
                        _desired: "oki",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    kln: {
                        _desired: "pko",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    kln: {
                        _desired: "sgc",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    kln: {
                        _desired: "tec",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    kln: {
                        _desired: "tuy",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    kok: {
                        _desired: "gom",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    kpe: {
                        _desired: "gkp",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "ida",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "lkb",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "lko",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "lks",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "lri",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "lrm",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "lsm",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "lto",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "lts",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "lwg",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "nle",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "nyd",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    luy: {
                        _desired: "rag",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    lv: {
                        _desired: "ltg",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "bhr",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "bjq",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "bmm",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "bzc",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "msh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "skg",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "tdx",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "tkg",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "txy",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "xmv",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mg: {
                        _desired: "xmw",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    mn: {
                        _desired: "mvf",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "bjn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "btj",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "bve",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "bvu",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "coa",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "dup",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "hji",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "id",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "jak",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "jax",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "kvb",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "kvr",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "kxd",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "lce",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "lcf",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "liw",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "max",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "meo",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "mfa",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "mfb",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "min",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "mqg",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "msi",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "mui",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "orn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "ors",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "pel",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "pse",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "tmw",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "urk",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "vkk",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "vkt",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "xmm",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "zlm",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ms: {
                        _desired: "zmi",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ne: {
                        _desired: "dty",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    om: {
                        _desired: "gax",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    om: {
                        _desired: "hae",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    om: {
                        _desired: "orc",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    or: {
                        _desired: "spv",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ps: {
                        _desired: "pbt",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    ps: {
                        _desired: "pst",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qub",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qud",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "quf",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qug",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "quh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "quk",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qul",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qup",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qur",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qus",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "quw",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qux",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "quy",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qva",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvc",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qve",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvi",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvj",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvl",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvm",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvo",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvp",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvs",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvw",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qvz",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qwa",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qwc",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qwh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qws",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxa",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxc",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxl",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxo",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxp",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxr",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxt",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxu",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    qu: {
                        _desired: "qxw",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    sc: {
                        _desired: "sdc",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    sc: {
                        _desired: "sdn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    sc: {
                        _desired: "sro",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    sq: {
                        _desired: "aae",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    sq: {
                        _desired: "aat",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    sq: {
                        _desired: "aln",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    syr: {
                        _desired: "aii",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    uz: {
                        _desired: "uzs",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    yi: {
                        _desired: "yih",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "cdo",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "cjy",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "cpx",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "czh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "czo",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "gan",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "hak",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "hsn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "lzh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "mnp",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "nan",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "wuu",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    zh: {
                        _desired: "yue",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "*": {
                        _desired: "*",
                        _distance: "80"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "am-Ethi",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "ru-Cyrl": {
                        _desired: "az-Latn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "bn-Beng",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "zh-Hans": {
                        _desired: "bo-Tibt",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "ru-Cyrl": {
                        _desired: "hy-Armn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "ka-Geor",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "km-Khmr",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "kn-Knda",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "lo-Laoo",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "ml-Mlym",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "my-Mymr",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "ne-Deva",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "or-Orya",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "pa-Guru",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "ps-Arab",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "sd-Arab",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "si-Sinh",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "ta-Taml",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "te-Telu",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "ti-Ethi",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "ru-Cyrl": {
                        _desired: "tk-Latn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "ur-Arab",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "ru-Cyrl": {
                        _desired: "uz-Latn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "en-Latn": {
                        _desired: "yi-Hebr",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "sr-Cyrl": {
                        _desired: "sr-Latn",
                        _distance: "5"
                    }
                },
                {
                    "zh-Hans": {
                        _desired: "za-Latn",
                        _distance: "10",
                        _oneway: "true"
                    }
                },
                {
                    "zh-Hans": {
                        _desired: "zh-Hani",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "zh-Hant": {
                        _desired: "zh-Hani",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "ar-Arab": {
                        _desired: "ar-Latn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "bn-Beng": {
                        _desired: "bn-Latn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "gu-Gujr": {
                        _desired: "gu-Latn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "hi-Deva": {
                        _desired: "hi-Latn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "kn-Knda": {
                        _desired: "kn-Latn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "ml-Mlym": {
                        _desired: "ml-Latn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "mr-Deva": {
                        _desired: "mr-Latn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "ta-Taml": {
                        _desired: "ta-Latn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "te-Telu": {
                        _desired: "te-Latn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "zh-Hans": {
                        _desired: "zh-Latn",
                        _distance: "20",
                        _oneway: "true"
                    }
                },
                {
                    "ja-Jpan": {
                        _desired: "ja-Latn",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "ja-Jpan": {
                        _desired: "ja-Hani",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "ja-Jpan": {
                        _desired: "ja-Hira",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "ja-Jpan": {
                        _desired: "ja-Kana",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "ja-Jpan": {
                        _desired: "ja-Hrkt",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "ja-Hrkt": {
                        _desired: "ja-Hira",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "ja-Hrkt": {
                        _desired: "ja-Kana",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "ko-Kore": {
                        _desired: "ko-Hani",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "ko-Kore": {
                        _desired: "ko-Hang",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "ko-Kore": {
                        _desired: "ko-Jamo",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "ko-Hang": {
                        _desired: "ko-Jamo",
                        _distance: "5",
                        _oneway: "true"
                    }
                },
                {
                    "*-*": {
                        _desired: "*-*",
                        _distance: "50"
                    }
                },
                {
                    "ar-*-$maghreb": {
                        _desired: "ar-*-$maghreb",
                        _distance: "4"
                    }
                },
                {
                    "ar-*-$!maghreb": {
                        _desired: "ar-*-$!maghreb",
                        _distance: "4"
                    }
                },
                {
                    "ar-*-*": {
                        _desired: "ar-*-*",
                        _distance: "5"
                    }
                },
                {
                    "en-*-$enUS": {
                        _desired: "en-*-$enUS",
                        _distance: "4"
                    }
                },
                {
                    "en-*-GB": {
                        _desired: "en-*-$!enUS",
                        _distance: "3"
                    }
                },
                {
                    "en-*-$!enUS": {
                        _desired: "en-*-$!enUS",
                        _distance: "4"
                    }
                },
                {
                    "en-*-*": {
                        _desired: "en-*-*",
                        _distance: "5"
                    }
                },
                {
                    "es-*-$americas": {
                        _desired: "es-*-$americas",
                        _distance: "4"
                    }
                },
                {
                    "es-*-$!americas": {
                        _desired: "es-*-$!americas",
                        _distance: "4"
                    }
                },
                {
                    "es-*-*": {
                        _desired: "es-*-*",
                        _distance: "5"
                    }
                },
                {
                    "pt-*-$americas": {
                        _desired: "pt-*-$americas",
                        _distance: "4"
                    }
                },
                {
                    "pt-*-$!americas": {
                        _desired: "pt-*-$!americas",
                        _distance: "4"
                    }
                },
                {
                    "pt-*-*": {
                        _desired: "pt-*-*",
                        _distance: "5"
                    }
                },
                {
                    "zh-Hant-$cnsar": {
                        _desired: "zh-Hant-$cnsar",
                        _distance: "4"
                    }
                },
                {
                    "zh-Hant-$!cnsar": {
                        _desired: "zh-Hant-$!cnsar",
                        _distance: "4"
                    }
                },
                {
                    "zh-Hant-*": {
                        _desired: "zh-Hant-*",
                        _distance: "5"
                    }
                },
                {
                    "*-*-*": {
                        _desired: "*-*-*",
                        _distance: "4"
                    }
                }
            ]
        }
    }
};

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/regions.generated.js
// This file is generated from regions-gen.ts
var regions = {
    "001": [
        "001",
        "001-status-grouping",
        "002",
        "005",
        "009",
        "011",
        "013",
        "014",
        "015",
        "017",
        "018",
        "019",
        "021",
        "029",
        "030",
        "034",
        "035",
        "039",
        "053",
        "054",
        "057",
        "061",
        "142",
        "143",
        "145",
        "150",
        "151",
        "154",
        "155",
        "AC",
        "AD",
        "AE",
        "AF",
        "AG",
        "AI",
        "AL",
        "AM",
        "AO",
        "AQ",
        "AR",
        "AS",
        "AT",
        "AU",
        "AW",
        "AX",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BL",
        "BM",
        "BN",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BT",
        "BV",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CC",
        "CD",
        "CF",
        "CG",
        "CH",
        "CI",
        "CK",
        "CL",
        "CM",
        "CN",
        "CO",
        "CP",
        "CQ",
        "CR",
        "CU",
        "CV",
        "CW",
        "CX",
        "CY",
        "CZ",
        "DE",
        "DG",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EA",
        "EC",
        "EE",
        "EG",
        "EH",
        "ER",
        "ES",
        "ET",
        "EU",
        "EZ",
        "FI",
        "FJ",
        "FK",
        "FM",
        "FO",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GF",
        "GG",
        "GH",
        "GI",
        "GL",
        "GM",
        "GN",
        "GP",
        "GQ",
        "GR",
        "GS",
        "GT",
        "GU",
        "GW",
        "GY",
        "HK",
        "HM",
        "HN",
        "HR",
        "HT",
        "HU",
        "IC",
        "ID",
        "IE",
        "IL",
        "IM",
        "IN",
        "IO",
        "IQ",
        "IR",
        "IS",
        "IT",
        "JE",
        "JM",
        "JO",
        "JP",
        "KE",
        "KG",
        "KH",
        "KI",
        "KM",
        "KN",
        "KP",
        "KR",
        "KW",
        "KY",
        "KZ",
        "LA",
        "LB",
        "LC",
        "LI",
        "LK",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "LY",
        "MA",
        "MC",
        "MD",
        "ME",
        "MF",
        "MG",
        "MH",
        "MK",
        "ML",
        "MM",
        "MN",
        "MO",
        "MP",
        "MQ",
        "MR",
        "MS",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NC",
        "NE",
        "NF",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NU",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PF",
        "PG",
        "PH",
        "PK",
        "PL",
        "PM",
        "PN",
        "PR",
        "PS",
        "PT",
        "PW",
        "PY",
        "QA",
        "QO",
        "RE",
        "RO",
        "RS",
        "RU",
        "RW",
        "SA",
        "SB",
        "SC",
        "SD",
        "SE",
        "SG",
        "SH",
        "SI",
        "SJ",
        "SK",
        "SL",
        "SM",
        "SN",
        "SO",
        "SR",
        "SS",
        "ST",
        "SV",
        "SX",
        "SY",
        "SZ",
        "TA",
        "TC",
        "TD",
        "TF",
        "TG",
        "TH",
        "TJ",
        "TK",
        "TL",
        "TM",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TW",
        "TZ",
        "UA",
        "UG",
        "UM",
        "UN",
        "US",
        "UY",
        "UZ",
        "VA",
        "VC",
        "VE",
        "VG",
        "VI",
        "VN",
        "VU",
        "WF",
        "WS",
        "XK",
        "YE",
        "YT",
        "ZA",
        "ZM",
        "ZW"
    ],
    "002": [
        "002",
        "002-status-grouping",
        "011",
        "014",
        "015",
        "017",
        "018",
        "202",
        "AO",
        "BF",
        "BI",
        "BJ",
        "BW",
        "CD",
        "CF",
        "CG",
        "CI",
        "CM",
        "CV",
        "DJ",
        "DZ",
        "EA",
        "EG",
        "EH",
        "ER",
        "ET",
        "GA",
        "GH",
        "GM",
        "GN",
        "GQ",
        "GW",
        "IC",
        "IO",
        "KE",
        "KM",
        "LR",
        "LS",
        "LY",
        "MA",
        "MG",
        "ML",
        "MR",
        "MU",
        "MW",
        "MZ",
        "NA",
        "NE",
        "NG",
        "RE",
        "RW",
        "SC",
        "SD",
        "SH",
        "SL",
        "SN",
        "SO",
        "SS",
        "ST",
        "SZ",
        "TD",
        "TF",
        "TG",
        "TN",
        "TZ",
        "UG",
        "YT",
        "ZA",
        "ZM",
        "ZW"
    ],
    "003": [
        "003",
        "013",
        "021",
        "029",
        "AG",
        "AI",
        "AW",
        "BB",
        "BL",
        "BM",
        "BQ",
        "BS",
        "BZ",
        "CA",
        "CR",
        "CU",
        "CW",
        "DM",
        "DO",
        "GD",
        "GL",
        "GP",
        "GT",
        "HN",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "MX",
        "NI",
        "PA",
        "PM",
        "PR",
        "SV",
        "SX",
        "TC",
        "TT",
        "US",
        "VC",
        "VG",
        "VI"
    ],
    "005": [
        "005",
        "AR",
        "BO",
        "BR",
        "BV",
        "CL",
        "CO",
        "EC",
        "FK",
        "GF",
        "GS",
        "GY",
        "PE",
        "PY",
        "SR",
        "UY",
        "VE"
    ],
    "009": [
        "009",
        "053",
        "054",
        "057",
        "061",
        "AC",
        "AQ",
        "AS",
        "AU",
        "CC",
        "CK",
        "CP",
        "CX",
        "DG",
        "FJ",
        "FM",
        "GU",
        "HM",
        "KI",
        "MH",
        "MP",
        "NC",
        "NF",
        "NR",
        "NU",
        "NZ",
        "PF",
        "PG",
        "PN",
        "PW",
        "QO",
        "SB",
        "TA",
        "TK",
        "TO",
        "TV",
        "UM",
        "VU",
        "WF",
        "WS"
    ],
    "011": [
        "011",
        "BF",
        "BJ",
        "CI",
        "CV",
        "GH",
        "GM",
        "GN",
        "GW",
        "LR",
        "ML",
        "MR",
        "NE",
        "NG",
        "SH",
        "SL",
        "SN",
        "TG"
    ],
    "013": [
        "013",
        "BZ",
        "CR",
        "GT",
        "HN",
        "MX",
        "NI",
        "PA",
        "SV"
    ],
    "014": [
        "014",
        "BI",
        "DJ",
        "ER",
        "ET",
        "IO",
        "KE",
        "KM",
        "MG",
        "MU",
        "MW",
        "MZ",
        "RE",
        "RW",
        "SC",
        "SO",
        "SS",
        "TF",
        "TZ",
        "UG",
        "YT",
        "ZM",
        "ZW"
    ],
    "015": [
        "015",
        "DZ",
        "EA",
        "EG",
        "EH",
        "IC",
        "LY",
        "MA",
        "SD",
        "TN"
    ],
    "017": [
        "017",
        "AO",
        "CD",
        "CF",
        "CG",
        "CM",
        "GA",
        "GQ",
        "ST",
        "TD"
    ],
    "018": [
        "018",
        "BW",
        "LS",
        "NA",
        "SZ",
        "ZA"
    ],
    "019": [
        "003",
        "005",
        "013",
        "019",
        "019-status-grouping",
        "021",
        "029",
        "419",
        "AG",
        "AI",
        "AR",
        "AW",
        "BB",
        "BL",
        "BM",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BV",
        "BZ",
        "CA",
        "CL",
        "CO",
        "CR",
        "CU",
        "CW",
        "DM",
        "DO",
        "EC",
        "FK",
        "GD",
        "GF",
        "GL",
        "GP",
        "GS",
        "GT",
        "GY",
        "HN",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "MX",
        "NI",
        "PA",
        "PE",
        "PM",
        "PR",
        "PY",
        "SR",
        "SV",
        "SX",
        "TC",
        "TT",
        "US",
        "UY",
        "VC",
        "VE",
        "VG",
        "VI"
    ],
    "021": [
        "021",
        "BM",
        "CA",
        "GL",
        "PM",
        "US"
    ],
    "029": [
        "029",
        "AG",
        "AI",
        "AW",
        "BB",
        "BL",
        "BQ",
        "BS",
        "CU",
        "CW",
        "DM",
        "DO",
        "GD",
        "GP",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "PR",
        "SX",
        "TC",
        "TT",
        "VC",
        "VG",
        "VI"
    ],
    "030": [
        "030",
        "CN",
        "HK",
        "JP",
        "KP",
        "KR",
        "MN",
        "MO",
        "TW"
    ],
    "034": [
        "034",
        "AF",
        "BD",
        "BT",
        "IN",
        "IR",
        "LK",
        "MV",
        "NP",
        "PK"
    ],
    "035": [
        "035",
        "BN",
        "ID",
        "KH",
        "LA",
        "MM",
        "MY",
        "PH",
        "SG",
        "TH",
        "TL",
        "VN"
    ],
    "039": [
        "039",
        "AD",
        "AL",
        "BA",
        "ES",
        "GI",
        "GR",
        "HR",
        "IT",
        "ME",
        "MK",
        "MT",
        "PT",
        "RS",
        "SI",
        "SM",
        "VA",
        "XK"
    ],
    "053": [
        "053",
        "AU",
        "CC",
        "CX",
        "HM",
        "NF",
        "NZ"
    ],
    "054": [
        "054",
        "FJ",
        "NC",
        "PG",
        "SB",
        "VU"
    ],
    "057": [
        "057",
        "FM",
        "GU",
        "KI",
        "MH",
        "MP",
        "NR",
        "PW",
        "UM"
    ],
    "061": [
        "061",
        "AS",
        "CK",
        "NU",
        "PF",
        "PN",
        "TK",
        "TO",
        "TV",
        "WF",
        "WS"
    ],
    "142": [
        "030",
        "034",
        "035",
        "142",
        "143",
        "145",
        "AE",
        "AF",
        "AM",
        "AZ",
        "BD",
        "BH",
        "BN",
        "BT",
        "CN",
        "CY",
        "GE",
        "HK",
        "ID",
        "IL",
        "IN",
        "IQ",
        "IR",
        "JO",
        "JP",
        "KG",
        "KH",
        "KP",
        "KR",
        "KW",
        "KZ",
        "LA",
        "LB",
        "LK",
        "MM",
        "MN",
        "MO",
        "MV",
        "MY",
        "NP",
        "OM",
        "PH",
        "PK",
        "PS",
        "QA",
        "SA",
        "SG",
        "SY",
        "TH",
        "TJ",
        "TL",
        "TM",
        "TR",
        "TW",
        "UZ",
        "VN",
        "YE"
    ],
    "143": [
        "143",
        "KG",
        "KZ",
        "TJ",
        "TM",
        "UZ"
    ],
    "145": [
        "145",
        "AE",
        "AM",
        "AZ",
        "BH",
        "CY",
        "GE",
        "IL",
        "IQ",
        "JO",
        "KW",
        "LB",
        "OM",
        "PS",
        "QA",
        "SA",
        "SY",
        "TR",
        "YE"
    ],
    "150": [
        "039",
        "150",
        "151",
        "154",
        "155",
        "AD",
        "AL",
        "AT",
        "AX",
        "BA",
        "BE",
        "BG",
        "BY",
        "CH",
        "CQ",
        "CZ",
        "DE",
        "DK",
        "EE",
        "ES",
        "FI",
        "FO",
        "FR",
        "GB",
        "GG",
        "GI",
        "GR",
        "HR",
        "HU",
        "IE",
        "IM",
        "IS",
        "IT",
        "JE",
        "LI",
        "LT",
        "LU",
        "LV",
        "MC",
        "MD",
        "ME",
        "MK",
        "MT",
        "NL",
        "NO",
        "PL",
        "PT",
        "RO",
        "RS",
        "RU",
        "SE",
        "SI",
        "SJ",
        "SK",
        "SM",
        "UA",
        "VA",
        "XK"
    ],
    "151": [
        "151",
        "BG",
        "BY",
        "CZ",
        "HU",
        "MD",
        "PL",
        "RO",
        "RU",
        "SK",
        "UA"
    ],
    "154": [
        "154",
        "AX",
        "CQ",
        "DK",
        "EE",
        "FI",
        "FO",
        "GB",
        "GG",
        "IE",
        "IM",
        "IS",
        "JE",
        "LT",
        "LV",
        "NO",
        "SE",
        "SJ"
    ],
    "155": [
        "155",
        "AT",
        "BE",
        "CH",
        "DE",
        "FR",
        "LI",
        "LU",
        "MC",
        "NL"
    ],
    "202": [
        "011",
        "014",
        "017",
        "018",
        "202",
        "AO",
        "BF",
        "BI",
        "BJ",
        "BW",
        "CD",
        "CF",
        "CG",
        "CI",
        "CM",
        "CV",
        "DJ",
        "ER",
        "ET",
        "GA",
        "GH",
        "GM",
        "GN",
        "GQ",
        "GW",
        "IO",
        "KE",
        "KM",
        "LR",
        "LS",
        "MG",
        "ML",
        "MR",
        "MU",
        "MW",
        "MZ",
        "NA",
        "NE",
        "NG",
        "RE",
        "RW",
        "SC",
        "SH",
        "SL",
        "SN",
        "SO",
        "SS",
        "ST",
        "SZ",
        "TD",
        "TF",
        "TG",
        "TZ",
        "UG",
        "YT",
        "ZA",
        "ZM",
        "ZW"
    ],
    "419": [
        "005",
        "013",
        "029",
        "419",
        "AG",
        "AI",
        "AR",
        "AW",
        "BB",
        "BL",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BV",
        "BZ",
        "CL",
        "CO",
        "CR",
        "CU",
        "CW",
        "DM",
        "DO",
        "EC",
        "FK",
        "GD",
        "GF",
        "GP",
        "GS",
        "GT",
        "GY",
        "HN",
        "HT",
        "JM",
        "KN",
        "KY",
        "LC",
        "MF",
        "MQ",
        "MS",
        "MX",
        "NI",
        "PA",
        "PE",
        "PR",
        "PY",
        "SR",
        "SV",
        "SX",
        "TC",
        "TT",
        "UY",
        "VC",
        "VE",
        "VG",
        "VI"
    ],
    "EU": [
        "AT",
        "BE",
        "BG",
        "CY",
        "CZ",
        "DE",
        "DK",
        "EE",
        "ES",
        "EU",
        "FI",
        "FR",
        "GR",
        "HR",
        "HU",
        "IE",
        "IT",
        "LT",
        "LU",
        "LV",
        "MT",
        "NL",
        "PL",
        "PT",
        "RO",
        "SE",
        "SI",
        "SK"
    ],
    "EZ": [
        "AT",
        "BE",
        "CY",
        "DE",
        "EE",
        "ES",
        "EZ",
        "FI",
        "FR",
        "GR",
        "IE",
        "IT",
        "LT",
        "LU",
        "LV",
        "MT",
        "NL",
        "PT",
        "SI",
        "SK"
    ],
    "QO": [
        "AC",
        "AQ",
        "CP",
        "DG",
        "QO",
        "TA"
    ],
    "UN": [
        "AD",
        "AE",
        "AF",
        "AG",
        "AL",
        "AM",
        "AO",
        "AR",
        "AT",
        "AU",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BN",
        "BO",
        "BR",
        "BS",
        "BT",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CD",
        "CF",
        "CG",
        "CH",
        "CI",
        "CL",
        "CM",
        "CN",
        "CO",
        "CR",
        "CU",
        "CV",
        "CY",
        "CZ",
        "DE",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EC",
        "EE",
        "EG",
        "ER",
        "ES",
        "ET",
        "FI",
        "FJ",
        "FM",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GH",
        "GM",
        "GN",
        "GQ",
        "GR",
        "GT",
        "GW",
        "GY",
        "HN",
        "HR",
        "HT",
        "HU",
        "ID",
        "IE",
        "IL",
        "IN",
        "IQ",
        "IR",
        "IS",
        "IT",
        "JM",
        "JO",
        "JP",
        "KE",
        "KG",
        "KH",
        "KI",
        "KM",
        "KN",
        "KP",
        "KR",
        "KW",
        "KZ",
        "LA",
        "LB",
        "LC",
        "LI",
        "LK",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "LY",
        "MA",
        "MC",
        "MD",
        "ME",
        "MG",
        "MH",
        "MK",
        "ML",
        "MM",
        "MN",
        "MR",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NE",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PG",
        "PH",
        "PK",
        "PL",
        "PT",
        "PW",
        "PY",
        "QA",
        "RO",
        "RS",
        "RU",
        "RW",
        "SA",
        "SB",
        "SC",
        "SD",
        "SE",
        "SG",
        "SI",
        "SK",
        "SL",
        "SM",
        "SN",
        "SO",
        "SR",
        "SS",
        "ST",
        "SV",
        "SY",
        "SZ",
        "TD",
        "TG",
        "TH",
        "TJ",
        "TL",
        "TM",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TZ",
        "UA",
        "UG",
        "UN",
        "US",
        "UY",
        "UZ",
        "VC",
        "VE",
        "VN",
        "VU",
        "WS",
        "YE",
        "ZA",
        "ZM",
        "ZW"
    ]
};

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/utils.js



var utils_UNICODE_EXTENSION_SEQUENCE_REGEX = /-u(?:-[0-9a-z]{2,8})+/gi;
function invariant(condition, message, Err) {
    if (Err === void 0) {
        Err = Error;
    }
    if (!condition) {
        throw new Err(message);
    }
}
// This is effectively 2 languages in 2 different regions in the same cluster
var DEFAULT_MATCHING_THRESHOLD = 838;
var PROCESSED_DATA;
function processData() {
    var _a, _b;
    if (!PROCESSED_DATA) {
        var paradigmLocales = (_b = (_a = languageMatching_data.supplemental.languageMatching["written-new"][0]) === null || _a === void 0 ? void 0 : _a.paradigmLocales) === null || _b === void 0 ? void 0 : _b._locales.split(" ");
        var matchVariables = languageMatching_data.supplemental.languageMatching["written-new"].slice(1, 5);
        var data = languageMatching_data.supplemental.languageMatching["written-new"].slice(5);
        var matches = data.map(function(d) {
            var key = Object.keys(d)[0];
            var value = d[key];
            return {
                supported: key,
                desired: value._desired,
                distance: +value._distance,
                oneway: value.oneway === "true" ? true : false
            };
        }, {});
        PROCESSED_DATA = {
            matches: matches,
            matchVariables: matchVariables.reduce(function(all, d) {
                var key = Object.keys(d)[0];
                var value = d[key];
                all[key.slice(1)] = value._value.split("+");
                return all;
            }, {}),
            paradigmLocales: __spreadArray(__spreadArray([], paradigmLocales, true), paradigmLocales.map(function(l) {
                return new Intl.Locale(l.replace(/_/g, "-")).maximize().toString();
            }), true)
        };
    }
    return PROCESSED_DATA;
}
function isMatched(locale, languageMatchInfoLocale, matchVariables) {
    var _a = languageMatchInfoLocale.split("-"), language = _a[0], script = _a[1], region = _a[2];
    var matches = true;
    if (region && region[0] === "$") {
        var shouldInclude = region[1] !== "!";
        var matchRegions = shouldInclude ? matchVariables[region.slice(1)] : matchVariables[region.slice(2)];
        var expandedMatchedRegions = matchRegions.map(function(r) {
            return regions[r] || [
                r
            ];
        }).reduce(function(all, list) {
            return __spreadArray(__spreadArray([], all, true), list, true);
        }, []);
        matches && (matches = !(expandedMatchedRegions.indexOf(locale.region || "") > 1 != shouldInclude));
    } else {
        matches && (matches = locale.region ? region === "*" || region === locale.region : true);
    }
    matches && (matches = locale.script ? script === "*" || script === locale.script : true);
    matches && (matches = locale.language ? language === "*" || language === locale.language : true);
    return matches;
}
function serializeLSR(lsr) {
    return [
        lsr.language,
        lsr.script,
        lsr.region
    ].filter(Boolean).join("-");
}
function findMatchingDistanceForLSR(desired, supported, data) {
    for(var _i = 0, _a = data.matches; _i < _a.length; _i++){
        var d = _a[_i];
        var matches = isMatched(desired, d.desired, data.matchVariables) && isMatched(supported, d.supported, data.matchVariables);
        if (!d.oneway && !matches) {
            matches = isMatched(desired, d.supported, data.matchVariables) && isMatched(supported, d.desired, data.matchVariables);
        }
        if (matches) {
            var distance = d.distance * 10;
            if (data.paradigmLocales.indexOf(serializeLSR(desired)) > -1 != data.paradigmLocales.indexOf(serializeLSR(supported)) > -1) {
                return distance - 1;
            }
            return distance;
        }
    }
    throw new Error("No matching distance found");
}
function findMatchingDistance(desired, supported) {
    var desiredLocale = new Intl.Locale(desired).maximize();
    var supportedLocale = new Intl.Locale(supported).maximize();
    var desiredLSR = {
        language: desiredLocale.language,
        script: desiredLocale.script || "",
        region: desiredLocale.region || ""
    };
    var supportedLSR = {
        language: supportedLocale.language,
        script: supportedLocale.script || "",
        region: supportedLocale.region || ""
    };
    var matchingDistance = 0;
    var data = processData();
    if (desiredLSR.language !== supportedLSR.language) {
        matchingDistance += findMatchingDistanceForLSR({
            language: desiredLocale.language,
            script: "",
            region: ""
        }, {
            language: supportedLocale.language,
            script: "",
            region: ""
        }, data);
    }
    if (desiredLSR.script !== supportedLSR.script) {
        matchingDistance += findMatchingDistanceForLSR({
            language: desiredLocale.language,
            script: desiredLSR.script,
            region: ""
        }, {
            language: supportedLocale.language,
            script: desiredLSR.script,
            region: ""
        }, data);
    }
    if (desiredLSR.region !== supportedLSR.region) {
        matchingDistance += findMatchingDistanceForLSR(desiredLSR, supportedLSR, data);
    }
    return matchingDistance;
}
function findBestMatch(requestedLocales, supportedLocales, threshold) {
    if (threshold === void 0) {
        threshold = DEFAULT_MATCHING_THRESHOLD;
    }
    var lowestDistance = Infinity;
    var result = {
        matchedDesiredLocale: "",
        distances: {}
    };
    requestedLocales.forEach(function(desired, i) {
        if (!result.distances[desired]) {
            result.distances[desired] = {};
        }
        supportedLocales.forEach(function(supported) {
            // Add some weight to the distance based on the order of the supported locales
            // Add penalty for the order of the requested locales, which currently is 0 since ECMA-402
            // doesn't really have room for weighted locales like `en; q=0.1`
            var distance = findMatchingDistance(desired, supported) + 0 + i * 40;
            result.distances[desired][supported] = distance;
            if (distance < lowestDistance) {
                lowestDistance = distance;
                result.matchedDesiredLocale = desired;
                result.matchedSupportedLocale = supported;
            }
        });
    });
    if (lowestDistance >= threshold) {
        result.matchedDesiredLocale = undefined;
        result.matchedSupportedLocale = undefined;
    }
    return result;
}

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/BestFitMatcher.js

/**
 * https://tc39.es/ecma402/#sec-bestfitmatcher
 * @param availableLocales
 * @param requestedLocales
 * @param getDefaultLocale
 */ function BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var foundLocale;
    var extension;
    var noExtensionLocales = [];
    var noExtensionLocaleMap = requestedLocales.reduce(function(all, l) {
        var noExtensionLocale = l.replace(utils_UNICODE_EXTENSION_SEQUENCE_REGEX, "");
        noExtensionLocales.push(noExtensionLocale);
        all[noExtensionLocale] = l;
        return all;
    }, {});
    var result = findBestMatch(noExtensionLocales, availableLocales);
    if (result.matchedSupportedLocale && result.matchedDesiredLocale) {
        foundLocale = result.matchedSupportedLocale;
        extension = noExtensionLocaleMap[result.matchedDesiredLocale].slice(result.matchedDesiredLocale.length) || undefined;
    }
    if (!foundLocale) {
        return {
            locale: getDefaultLocale()
        };
    }
    return {
        locale: foundLocale,
        extension: extension
    };
}

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/CanonicalizeUValue.js

function CanonicalizeUValue(ukey, uvalue) {
    // TODO: Implement algorithm for CanonicalizeUValue per https://tc39.es/ecma402/#sec-canonicalizeuvalue
    var lowerValue = uvalue.toLowerCase();
    invariant(ukey !== undefined, "ukey must be defined");
    var canonicalized = lowerValue;
    return canonicalized;
}

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/CanonicalizeUnicodeLocaleId.js
function CanonicalizeUnicodeLocaleId(locale) {
    return Intl.getCanonicalLocales(locale)[0];
}

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/InsertUnicodeExtensionAndCanonicalize.js


function InsertUnicodeExtensionAndCanonicalize(locale, attributes, keywords) {
    invariant(locale.indexOf("-u-") === -1, "Expected locale to not have a Unicode locale extension");
    var extension = "-u";
    for(var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++){
        var attr = attributes_1[_i];
        extension += "-".concat(attr);
    }
    for(var _a = 0, keywords_1 = keywords; _a < keywords_1.length; _a++){
        var kw = keywords_1[_a];
        var key = kw.key, value = kw.value;
        extension += "-".concat(key);
        if (value !== "") {
            extension += "-".concat(value);
        }
    }
    if (extension === "-u") {
        return CanonicalizeUnicodeLocaleId(locale);
    }
    var privateIndex = locale.indexOf("-x-");
    var newLocale;
    if (privateIndex === -1) {
        newLocale = locale + extension;
    } else {
        var preExtension = locale.slice(0, privateIndex);
        var postExtension = locale.slice(privateIndex);
        newLocale = preExtension + extension + postExtension;
    }
    return CanonicalizeUnicodeLocaleId(newLocale);
}

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/BestAvailableLocale.js
/**
 * https://tc39.es/ecma402/#sec-bestavailablelocale
 * @param availableLocales
 * @param locale
 */ function BestAvailableLocale_BestAvailableLocale(availableLocales, locale) {
    var candidate = locale;
    while(true){
        if (availableLocales.indexOf(candidate) > -1) {
            return candidate;
        }
        var pos = candidate.lastIndexOf("-");
        if (!~pos) {
            return undefined;
        }
        if (pos >= 2 && candidate[pos - 2] === "-") {
            pos -= 2;
        }
        candidate = candidate.slice(0, pos);
    }
}

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/LookupMatcher.js


/**
 * https://tc39.es/ecma402/#sec-lookupmatcher
 * @param availableLocales
 * @param requestedLocales
 * @param getDefaultLocale
 */ function LookupMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var result = {
        locale: ""
    };
    for(var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++){
        var locale = requestedLocales_1[_i];
        var noExtensionLocale = locale.replace(utils_UNICODE_EXTENSION_SEQUENCE_REGEX, "");
        var availableLocale = BestAvailableLocale_BestAvailableLocale(availableLocales, noExtensionLocale);
        if (availableLocale) {
            result.locale = availableLocale;
            if (locale !== noExtensionLocale) {
                result.extension = locale.slice(noExtensionLocale.length, locale.length);
            }
            return result;
        }
    }
    result.locale = getDefaultLocale();
    return result;
}

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/UnicodeExtensionComponents.js

function UnicodeExtensionComponents(extension) {
    invariant(extension === extension.toLowerCase(), "Expected extension to be lowercase");
    invariant(extension.slice(0, 3) === "-u-", "Expected extension to be a Unicode locale extension");
    var attributes = [];
    var keywords = [];
    var keyword;
    var size = extension.length;
    var k = 3;
    while(k < size){
        var e = extension.indexOf("-", k);
        var len = void 0;
        if (e === -1) {
            len = size - k;
        } else {
            len = e - k;
        }
        var subtag = extension.slice(k, k + len);
        invariant(len >= 2, "Expected a subtag to have at least 2 characters");
        if (keyword === undefined && len != 2) {
            if (attributes.indexOf(subtag) === -1) {
                attributes.push(subtag);
            }
        } else if (len === 2) {
            keyword = {
                key: subtag,
                value: ""
            };
            if (keywords.find(function(k) {
                return k.key === (keyword === null || keyword === void 0 ? void 0 : keyword.key);
            }) === undefined) {
                keywords.push(keyword);
            }
        } else if ((keyword === null || keyword === void 0 ? void 0 : keyword.value) === "") {
            keyword.value = subtag;
        } else {
            invariant(keyword !== undefined, "Expected keyword to be defined");
            keyword.value += "-" + subtag;
        }
        k += len + 1;
    }
    return {
        attributes: attributes,
        keywords: keywords
    };
}

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/ResolveLocale.js






/**
 * https://tc39.es/ecma402/#sec-resolvelocale
 */ function ResolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData, getDefaultLocale) {
    var _a;
    var matcher = options.localeMatcher;
    var r;
    if (matcher === "lookup") {
        r = LookupMatcher(Array.from(availableLocales), requestedLocales, getDefaultLocale);
    } else {
        r = BestFitMatcher(Array.from(availableLocales), requestedLocales, getDefaultLocale);
    }
    if (r == null) {
        r = {
            locale: getDefaultLocale(),
            extension: ""
        };
    }
    var foundLocale = r.locale;
    var foundLocaleData = localeData[foundLocale];
    // TODO: We can't really guarantee that the locale data is available
    // invariant(
    //   foundLocaleData !== undefined,
    //   `Missing locale data for ${foundLocale}`
    // )
    var result = {
        locale: "en",
        dataLocale: foundLocale
    };
    var components;
    var keywords;
    if (r.extension) {
        components = UnicodeExtensionComponents(r.extension);
        keywords = components.keywords;
    } else {
        keywords = [];
    }
    var supportedKeywords = [];
    var _loop_1 = function(key) {
        // TODO: Shouldn't default to empty array, see TODO above
        var keyLocaleData = (_a = foundLocaleData === null || foundLocaleData === void 0 ? void 0 : foundLocaleData[key]) !== null && _a !== void 0 ? _a : [];
        invariant(Array.isArray(keyLocaleData), "keyLocaleData for ".concat(key, " must be an array"));
        var value = keyLocaleData[0];
        invariant(value === undefined || typeof value === "string", "value must be a string or undefined");
        var supportedKeyword = void 0;
        var entry = keywords.find(function(k) {
            return k.key === key;
        });
        if (entry) {
            var requestedValue = entry.value;
            if (requestedValue !== "") {
                if (keyLocaleData.indexOf(requestedValue) > -1) {
                    value = requestedValue;
                    supportedKeyword = {
                        key: key,
                        value: value
                    };
                }
            } else if (keyLocaleData.indexOf("true") > -1) {
                value = "true";
                supportedKeyword = {
                    key: key,
                    value: value
                };
            }
        }
        var optionsValue = options[key];
        invariant(optionsValue == null || typeof optionsValue === "string", "optionsValue must be a string or undefined");
        if (typeof optionsValue === "string") {
            var ukey = key.toLowerCase();
            optionsValue = CanonicalizeUValue(ukey, optionsValue);
            if (optionsValue === "") {
                optionsValue = "true";
            }
        }
        if (optionsValue !== value && keyLocaleData.indexOf(optionsValue) > -1) {
            value = optionsValue;
            supportedKeyword = undefined;
        }
        if (supportedKeyword) {
            supportedKeywords.push(supportedKeyword);
        }
        result[key] = value;
    };
    for(var _i = 0, relevantExtensionKeys_1 = relevantExtensionKeys; _i < relevantExtensionKeys_1.length; _i++){
        var key = relevantExtensionKeys_1[_i];
        _loop_1(key);
    }
    var supportedAttributes = [];
    if (supportedKeywords.length > 0) {
        supportedAttributes = [];
        foundLocale = InsertUnicodeExtensionAndCanonicalize(foundLocale, supportedAttributes, supportedKeywords);
    }
    result.locale = foundLocale;
    return result;
}

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/abstract/LookupSupportedLocales.js


/**
 * https://tc39.es/ecma402/#sec-lookupsupportedlocales
 * @param availableLocales
 * @param requestedLocales
 */ function LookupSupportedLocales(availableLocales, requestedLocales) {
    var subset = [];
    for(var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++){
        var locale = requestedLocales_1[_i];
        var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
        var availableLocale = BestAvailableLocale(availableLocales, noExtensionLocale);
        if (availableLocale) {
            subset.push(availableLocale);
        }
    }
    return subset;
}

;// CONCATENATED MODULE: ./node_modules/@formatjs/intl-localematcher/lib/index.js


function match(requestedLocales, availableLocales, defaultLocale, opts) {
    return ResolveLocale(availableLocales, CanonicalizeLocaleList(requestedLocales), {
        localeMatcher: (opts === null || opts === void 0 ? void 0 : opts.algorithm) || "best fit"
    }, [], {}, function() {
        return defaultLocale;
    }).locale;
}



// EXTERNAL MODULE: ./node_modules/negotiator/index.js
var negotiator = __webpack_require__(493);
;// CONCATENATED MODULE: ./node_modules/next-intl/dist/esm/production/middleware/resolveLocale.js



function resolveLocale_c(l, t, a) {
    let c;
    const n = new negotiator({
        headers: {
            "accept-language": l.get("accept-language") || void 0
        }
    }).languages();
    try {
        const o = function(e) {
            return e.slice().sort((e, o)=>o.length - e.length);
        }(t);
        c = match(n, o, a);
    } catch  {}
    return c;
}
function resolveLocale_n(e, o) {
    if (e.localeCookie && o.has(e.localeCookie.name)) {
        const l = o.get(e.localeCookie.name)?.value;
        if (l && e.locales.includes(l)) return l;
    }
}
function i(e, o, t, a) {
    let i;
    return a && (i = utils_a(a, e.locales, e.localePrefix)?.locale), !i && e.localeDetection && (i = resolveLocale_n(e, t)), !i && e.localeDetection && (i = resolveLocale_c(o, e.locales, e.defaultLocale)), i || (i = e.defaultLocale), i;
}
function resolveLocale_r(e, o, r, f) {
    const u = function(e, o) {
        const l = utils_g(e);
        if (l) return o.find((e)=>e.domain === l);
    }(o, e.domains);
    if (!u) return {
        locale: i(e, o, r, f)
    };
    let s;
    if (f) {
        const o = utils_a(f, e.locales, e.localePrefix, u)?.locale;
        if (o) {
            if (!utils_x(o, u)) return {
                locale: o,
                domain: u
            };
            s = o;
        }
    }
    if (!s && e.localeDetection) {
        const o = resolveLocale_n(e, r);
        o && utils_x(o, u) && (s = o);
    }
    if (!s && e.localeDetection) {
        const e = resolveLocale_c(o, u.locales, u.defaultLocale);
        e && (s = e);
    }
    return s || (s = u.defaultLocale), {
        locale: s,
        domain: u
    };
}
function resolveLocale_f(e, o, l, t) {
    return e.domains ? resolveLocale_r(e, o, l, t) : {
        locale: i(e, o, l, t)
    };
}


;// CONCATENATED MODULE: ./node_modules/next-intl/dist/esm/production/middleware/syncCookie.js

function o(o, a, l, s, t) {
    if (!s.localeCookie) return;
    const { name: i, ...c } = s.localeCookie, r = o.cookies.has(i);
    if (r && o.cookies.get(i)?.value !== l) a.cookies.set(i, l, {
        path: o.nextUrl.basePath || void 0,
        ...c
    });
    else if (!r) {
        resolveLocale_c(o.headers, t?.locales || s.locales, s.defaultLocale) !== l && a.cookies.set(i, l, {
            path: o.nextUrl.basePath || void 0,
            ...c
        });
    }
}


;// CONCATENATED MODULE: ./node_modules/next-intl/dist/esm/production/middleware/middleware.js








function v(v) {
    const L = e(v);
    return function(t) {
        let v;
        try {
            v = decodeURI(t.nextUrl.pathname);
        } catch  {
            return NextResponse.next();
        }
        const j = utils_v(v), { domain: w, locale: k } = resolveLocale_f(L, t.headers, t.cookies, j), b = w ? w.defaultLocale === k : k === L.defaultLocale, q = L.domains?.filter((e)=>utils_x(k, e)) || [], R = null != L.domains && !w;
        function y(a) {
            const l = new URL(a, t.url);
            t.nextUrl.basePath && (l.pathname = utils_j(l.pathname, t.nextUrl.basePath));
            const n = new Headers(t.headers);
            n.set(constants_L, k);
            return utils_i(t.nextUrl.pathname) !== utils_i(l.pathname) ? NextResponse.rewrite(l, {
                request: {
                    headers: n
                }
            }) : NextResponse.next({
                request: {
                    headers: n
                }
            });
        }
        function H(r, a) {
            const l = new URL(r, t.url);
            if (l.pathname = utils_i(l.pathname), q.length > 0 && !a && w) {
                const e = m(w, k, q);
                e && (a = e.domain, e.defaultLocale === k && "as-needed" === L.localePrefix.mode && (l.pathname = utils_l(l.pathname, L.locales, L.localePrefix)));
            }
            if (a && (l.host = a, t.headers.get("x-forwarded-host"))) {
                l.protocol = t.headers.get("x-forwarded-proto") ?? t.nextUrl.protocol;
                const e = a.split(":")[1];
                l.port = e ?? t.headers.get("x-forwarded-port") ?? "";
            }
            return t.nextUrl.basePath && (l.pathname = utils_j(l.pathname, t.nextUrl.basePath)), T = !0, NextResponse.redirect(l.toString());
        }
        const z = utils_l(j, L.locales, L.localePrefix), A = utils_a(j, L.locales, L.localePrefix, w), C = null != A, I = "never" === L.localePrefix.mode || b && "as-needed" === L.localePrefix.mode;
        let N, S, T, V = z;
        const B = L.pathnames;
        if (B) {
            let e;
            if ([e, S] = s(B, z, k), S) {
                const r = B[S], o = u(r, k, S);
                if (utils_c(o, z)) V = utils_f(z, o, S);
                else {
                    let a;
                    a = e ? u(r, e, S) : S;
                    const s = I ? void 0 : utils_o(k, L.localePrefix), i = utils_f(z, a, o);
                    N = H(utils_p(i, s, t.nextUrl.search));
                }
            }
        }
        if (!N) if ("/" !== V || C) {
            const e = utils_p(V, utils_L(k), t.nextUrl.search);
            if (C) {
                const r = utils_p(z, A.prefix, t.nextUrl.search);
                if ("never" === L.localePrefix.mode) N = H(utils_p(z, void 0, t.nextUrl.search));
                else if (A.exact) if (b && I) N = H(utils_p(z, void 0, t.nextUrl.search));
                else if (L.domains) {
                    const t = m(w, A.locale, q);
                    N = w?.domain === t?.domain || R ? y(e) : H(r, t?.domain);
                } else N = y(e);
                else N = H(r);
            } else N = I ? y(e) : H(utils_p(z, utils_o(k, L.localePrefix), t.nextUrl.search));
        } else N = I ? y(utils_p(V, utils_L(k), t.nextUrl.search)) : H(utils_p(z, utils_o(k, L.localePrefix), t.nextUrl.search));
        return o(t, N, k, L, w), !T && "never" !== L.localePrefix.mode && L.alternateLinks && L.locales.length > 1 && N.headers.set("Link", getAlternateLinksHeaderValue_s({
            routing: L,
            internalTemplateName: S,
            localizedPathnames: null != S && B ? B[S] : void 0,
            request: t,
            resolvedLocale: k
        })), N;
    };
}


;// CONCATENATED MODULE: ./node_modules/next-intl/dist/esm/production/routing/defineRouting.js
function defineRouting_t(t) {
    return t;
}


;// CONCATENATED MODULE: ./i18n/routing.ts

const routing = defineRouting_t({
    locales: [
        "de",
        "en"
    ],
    defaultLocale: "de",
    localePrefix: "as-needed" // Deutsch ohne /de/ Prefix, nur /en/ in URL
});

;// CONCATENATED MODULE: ./middleware.ts





const intlMiddleware = v({
    ...routing,
    localeDetection: true // Browser-Sprache automatisch erkennen
});
function middleware$1(request) {
    // Exclude /dashboard from i18n middleware (direct route, no locale prefix)
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        return; // Skip i18n middleware for /dashboard
    }
    // Apply i18n middleware for all other routes
    return intlMiddleware(request);
}
const config = {
    // Match all pathnames except for API routes, static files, dashboard, etc.
    matcher: [
        "/",
        "/(de|en)/:path*",
        "/((?!api|_next|_vercel|dashboard|.*\\..*).*)"
    ]
};

var serverComponentModule = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': middleware$1,
    config: config
});

/*
 * This file is a template for the code which will be substituted when our webpack loader handles middleware files.
 *
 * We use `__SENTRY_WRAPPING_TARGET_FILE__.cjs` as a placeholder for the path to the file being wrapped. Because it's not a real package,
 * this causes both TS and ESLint to complain, hence the pragma comments below.
 */

const userApiModule = serverComponentModule ;

// Default to undefined. It's possible for Next.js users to not define any exports/handlers in an API route. If that is
// the case Next.js wil crash during runtime but the Sentry SDK should definitely not crash so we need tohandle it.
let userProvidedNamedHandler = undefined;
let userProvidedDefaultHandler = undefined;

if ('middleware' in userApiModule && typeof userApiModule.middleware === 'function') {
  // Handle when user defines via named ESM export: `export { middleware };`
  userProvidedNamedHandler = userApiModule.middleware;
} else if ('default' in userApiModule && typeof userApiModule.default === 'function') {
  // Handle when user defines via ESM export: `export default myFunction;`
  userProvidedDefaultHandler = userApiModule.default;
} else if (typeof userApiModule === 'function') {
  // Handle when user defines via CJS export: "module.exports = myFunction;"
  userProvidedDefaultHandler = userApiModule;
}

const middleware = userProvidedNamedHandler
  ? wrapMiddlewareWithSentry(userProvidedNamedHandler)
  : undefined;
const middlewareWrapperTemplate = userProvidedDefaultHandler ? wrapMiddlewareWithSentry(userProvidedDefaultHandler) : undefined;



;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=private-next-root-dir%2Fmiddleware.ts&page=%2Fmiddleware&rootDir=C%3A%5CUsers%5CKujti%5CDesktop%5CTrading%20Tools%5CMVP%20PRICE%5Cfrontend&matchers=W3sicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpPyg%2FOlxcLyhcXC8%2FaW5kZXh8XFwvP2luZGV4XFwuanNvbikpP1tcXC8jXFw%2FXT8kIiwib3JpZ2luYWxTb3VyY2UiOiIvIn0seyJyZWdleHAiOiJeKD86XFwvKF9uZXh0XFwvZGF0YVxcL1teL117MSx9KSk%2FKD86XFwvKGRlfGVuKSkoPzpcXC8oKD86W15cXC8jXFw%2FXSs%2FKSg%2FOlxcLyg%2FOlteXFwvI1xcP10rPykpKikpPyguanNvbik%2FW1xcLyNcXD9dPyQiLCJvcmlnaW5hbFNvdXJjZSI6Ii8oZGV8ZW4pLzpwYXRoKiJ9LHsicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpPyg%2FOlxcLygoPyFhcGl8X25leHR8X3ZlcmNlbHxkYXNoYm9hcmR8LipcXC4uKikuKikpKC5qc29uKT9bXFwvI1xcP10%2FJCIsIm9yaWdpbmFsU291cmNlIjoiLygoPyFhcGl8X25leHR8X3ZlcmNlbHxkYXNoYm9hcmR8LipcXC4uKikuKikifV0%3D&preferredRegion=&middlewareConfig=eyJtYXRjaGVycyI6W3sicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpPyg%2FOlxcLyhcXC8%2FaW5kZXh8XFwvP2luZGV4XFwuanNvbikpP1tcXC8jXFw%2FXT8kIiwib3JpZ2luYWxTb3VyY2UiOiIvIn0seyJyZWdleHAiOiJeKD86XFwvKF9uZXh0XFwvZGF0YVxcL1teL117MSx9KSk%2FKD86XFwvKGRlfGVuKSkoPzpcXC8oKD86W15cXC8jXFw%2FXSs%2FKSg%2FOlxcLyg%2FOlteXFwvI1xcP10rPykpKikpPyguanNvbik%2FW1xcLyNcXD9dPyQiLCJvcmlnaW5hbFNvdXJjZSI6Ii8oZGV8ZW4pLzpwYXRoKiJ9LHsicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpPyg%2FOlxcLygoPyFhcGl8X25leHR8X3ZlcmNlbHxkYXNoYm9hcmR8LipcXC4uKikuKikpKC5qc29uKT9bXFwvI1xcP10%2FJCIsIm9yaWdpbmFsU291cmNlIjoiLygoPyFhcGl8X25leHR8X3ZlcmNlbHxkYXNoYm9hcmR8LipcXC4uKikuKikifV19!


// Import the userland code.

const mod = {
    ...middleware_namespaceObject_0
};
const handler = mod.middleware || mod.default;
const page = "/middleware";
if (typeof handler !== "function") {
    throw new Error(`The Middleware "${page}" must export a \`middleware\` or a \`default\` function`);
}
function nHandler(opts) {
    return adapter({
        ...opts,
        page,
        handler
    });
}

//# sourceMappingURL=middleware.js.map

/***/ }),

/***/ 493:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*!
 * negotiator
 * Copyright(c) 2012 Federico Romero
 * Copyright(c) 2012-2014 Isaac Z. Schlueter
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ 
var preferredCharsets = __webpack_require__(760);
var preferredEncodings = __webpack_require__(278);
var preferredLanguages = __webpack_require__(734);
var preferredMediaTypes = __webpack_require__(627);
/**
 * Module exports.
 * @public
 */ module.exports = Negotiator;
module.exports.Negotiator = Negotiator;
/**
 * Create a Negotiator instance from a request.
 * @param {object} request
 * @public
 */ function Negotiator(request) {
    if (!(this instanceof Negotiator)) {
        return new Negotiator(request);
    }
    this.request = request;
}
Negotiator.prototype.charset = function charset(available) {
    var set = this.charsets(available);
    return set && set[0];
};
Negotiator.prototype.charsets = function charsets(available) {
    return preferredCharsets(this.request.headers["accept-charset"], available);
};
Negotiator.prototype.encoding = function encoding(available, opts) {
    var set = this.encodings(available, opts);
    return set && set[0];
};
Negotiator.prototype.encodings = function encodings(available, options) {
    var opts = options || {};
    return preferredEncodings(this.request.headers["accept-encoding"], available, opts.preferred);
};
Negotiator.prototype.language = function language(available) {
    var set = this.languages(available);
    return set && set[0];
};
Negotiator.prototype.languages = function languages(available) {
    return preferredLanguages(this.request.headers["accept-language"], available);
};
Negotiator.prototype.mediaType = function mediaType(available) {
    var set = this.mediaTypes(available);
    return set && set[0];
};
Negotiator.prototype.mediaTypes = function mediaTypes(available) {
    return preferredMediaTypes(this.request.headers.accept, available);
};
// Backwards compatibility
Negotiator.prototype.preferredCharset = Negotiator.prototype.charset;
Negotiator.prototype.preferredCharsets = Negotiator.prototype.charsets;
Negotiator.prototype.preferredEncoding = Negotiator.prototype.encoding;
Negotiator.prototype.preferredEncodings = Negotiator.prototype.encodings;
Negotiator.prototype.preferredLanguage = Negotiator.prototype.language;
Negotiator.prototype.preferredLanguages = Negotiator.prototype.languages;
Negotiator.prototype.preferredMediaType = Negotiator.prototype.mediaType;
Negotiator.prototype.preferredMediaTypes = Negotiator.prototype.mediaTypes;


/***/ }),

/***/ 760:
/***/ ((module) => {

"use strict";
/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */ 
/**
 * Module exports.
 * @public
 */ module.exports = preferredCharsets;
module.exports.preferredCharsets = preferredCharsets;
/**
 * Module variables.
 * @private
 */ var simpleCharsetRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
/**
 * Parse the Accept-Charset header.
 * @private
 */ function parseAcceptCharset(accept) {
    var accepts = accept.split(",");
    for(var i = 0, j = 0; i < accepts.length; i++){
        var charset = parseCharset(accepts[i].trim(), i);
        if (charset) {
            accepts[j++] = charset;
        }
    }
    // trim accepts
    accepts.length = j;
    return accepts;
}
/**
 * Parse a charset from the Accept-Charset header.
 * @private
 */ function parseCharset(str, i) {
    var match = simpleCharsetRegExp.exec(str);
    if (!match) return null;
    var charset = match[1];
    var q = 1;
    if (match[2]) {
        var params = match[2].split(";");
        for(var j = 0; j < params.length; j++){
            var p = params[j].trim().split("=");
            if (p[0] === "q") {
                q = parseFloat(p[1]);
                break;
            }
        }
    }
    return {
        charset: charset,
        q: q,
        i: i
    };
}
/**
 * Get the priority of a charset.
 * @private
 */ function getCharsetPriority(charset, accepted, index) {
    var priority = {
        o: -1,
        q: 0,
        s: 0
    };
    for(var i = 0; i < accepted.length; i++){
        var spec = specify(charset, accepted[i], index);
        if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
            priority = spec;
        }
    }
    return priority;
}
/**
 * Get the specificity of the charset.
 * @private
 */ function specify(charset, spec, index) {
    var s = 0;
    if (spec.charset.toLowerCase() === charset.toLowerCase()) {
        s |= 1;
    } else if (spec.charset !== "*") {
        return null;
    }
    return {
        i: index,
        o: spec.i,
        q: spec.q,
        s: s
    };
}
/**
 * Get the preferred charsets from an Accept-Charset header.
 * @public
 */ function preferredCharsets(accept, provided) {
    // RFC 2616 sec 14.2: no header = *
    var accepts = parseAcceptCharset(accept === undefined ? "*" : accept || "");
    if (!provided) {
        // sorted list of all charsets
        return accepts.filter(isQuality).sort(compareSpecs).map(getFullCharset);
    }
    var priorities = provided.map(function getPriority(type, index) {
        return getCharsetPriority(type, accepts, index);
    });
    // sorted list of accepted charsets
    return priorities.filter(isQuality).sort(compareSpecs).map(function getCharset(priority) {
        return provided[priorities.indexOf(priority)];
    });
}
/**
 * Compare two specs.
 * @private
 */ function compareSpecs(a, b) {
    return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i || 0;
}
/**
 * Get full charset string.
 * @private
 */ function getFullCharset(spec) {
    return spec.charset;
}
/**
 * Check if a spec has any quality.
 * @private
 */ function isQuality(spec) {
    return spec.q > 0;
}


/***/ }),

/***/ 278:
/***/ ((module) => {

"use strict";
/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */ 
/**
 * Module exports.
 * @public
 */ module.exports = preferredEncodings;
module.exports.preferredEncodings = preferredEncodings;
/**
 * Module variables.
 * @private
 */ var simpleEncodingRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
/**
 * Parse the Accept-Encoding header.
 * @private
 */ function parseAcceptEncoding(accept) {
    var accepts = accept.split(",");
    var hasIdentity = false;
    var minQuality = 1;
    for(var i = 0, j = 0; i < accepts.length; i++){
        var encoding = parseEncoding(accepts[i].trim(), i);
        if (encoding) {
            accepts[j++] = encoding;
            hasIdentity = hasIdentity || specify("identity", encoding);
            minQuality = Math.min(minQuality, encoding.q || 1);
        }
    }
    if (!hasIdentity) {
        /*
     * If identity doesn't explicitly appear in the accept-encoding header,
     * it's added to the list of acceptable encoding with the lowest q
     */ accepts[j++] = {
            encoding: "identity",
            q: minQuality,
            i: i
        };
    }
    // trim accepts
    accepts.length = j;
    return accepts;
}
/**
 * Parse an encoding from the Accept-Encoding header.
 * @private
 */ function parseEncoding(str, i) {
    var match = simpleEncodingRegExp.exec(str);
    if (!match) return null;
    var encoding = match[1];
    var q = 1;
    if (match[2]) {
        var params = match[2].split(";");
        for(var j = 0; j < params.length; j++){
            var p = params[j].trim().split("=");
            if (p[0] === "q") {
                q = parseFloat(p[1]);
                break;
            }
        }
    }
    return {
        encoding: encoding,
        q: q,
        i: i
    };
}
/**
 * Get the priority of an encoding.
 * @private
 */ function getEncodingPriority(encoding, accepted, index) {
    var priority = {
        encoding: encoding,
        o: -1,
        q: 0,
        s: 0
    };
    for(var i = 0; i < accepted.length; i++){
        var spec = specify(encoding, accepted[i], index);
        if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
            priority = spec;
        }
    }
    return priority;
}
/**
 * Get the specificity of the encoding.
 * @private
 */ function specify(encoding, spec, index) {
    var s = 0;
    if (spec.encoding.toLowerCase() === encoding.toLowerCase()) {
        s |= 1;
    } else if (spec.encoding !== "*") {
        return null;
    }
    return {
        encoding: encoding,
        i: index,
        o: spec.i,
        q: spec.q,
        s: s
    };
}
/**
 * Get the preferred encodings from an Accept-Encoding header.
 * @public
 */ function preferredEncodings(accept, provided, preferred) {
    var accepts = parseAcceptEncoding(accept || "");
    var comparator = preferred ? function comparator(a, b) {
        if (a.q !== b.q) {
            return b.q - a.q // higher quality first
            ;
        }
        var aPreferred = preferred.indexOf(a.encoding);
        var bPreferred = preferred.indexOf(b.encoding);
        if (aPreferred === -1 && bPreferred === -1) {
            // consider the original specifity/order
            return b.s - a.s || a.o - b.o || a.i - b.i;
        }
        if (aPreferred !== -1 && bPreferred !== -1) {
            return aPreferred - bPreferred // consider the preferred order
            ;
        }
        return aPreferred === -1 ? 1 : -1 // preferred first
        ;
    } : compareSpecs;
    if (!provided) {
        // sorted list of all encodings
        return accepts.filter(isQuality).sort(comparator).map(getFullEncoding);
    }
    var priorities = provided.map(function getPriority(type, index) {
        return getEncodingPriority(type, accepts, index);
    });
    // sorted list of accepted encodings
    return priorities.filter(isQuality).sort(comparator).map(function getEncoding(priority) {
        return provided[priorities.indexOf(priority)];
    });
}
/**
 * Compare two specs.
 * @private
 */ function compareSpecs(a, b) {
    return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i;
}
/**
 * Get full encoding string.
 * @private
 */ function getFullEncoding(spec) {
    return spec.encoding;
}
/**
 * Check if a spec has any quality.
 * @private
 */ function isQuality(spec) {
    return spec.q > 0;
}


/***/ }),

/***/ 734:
/***/ ((module) => {

"use strict";
/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */ 
/**
 * Module exports.
 * @public
 */ module.exports = preferredLanguages;
module.exports.preferredLanguages = preferredLanguages;
/**
 * Module variables.
 * @private
 */ var simpleLanguageRegExp = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;
/**
 * Parse the Accept-Language header.
 * @private
 */ function parseAcceptLanguage(accept) {
    var accepts = accept.split(",");
    for(var i = 0, j = 0; i < accepts.length; i++){
        var language = parseLanguage(accepts[i].trim(), i);
        if (language) {
            accepts[j++] = language;
        }
    }
    // trim accepts
    accepts.length = j;
    return accepts;
}
/**
 * Parse a language from the Accept-Language header.
 * @private
 */ function parseLanguage(str, i) {
    var match = simpleLanguageRegExp.exec(str);
    if (!match) return null;
    var prefix = match[1];
    var suffix = match[2];
    var full = prefix;
    if (suffix) full += "-" + suffix;
    var q = 1;
    if (match[3]) {
        var params = match[3].split(";");
        for(var j = 0; j < params.length; j++){
            var p = params[j].split("=");
            if (p[0] === "q") q = parseFloat(p[1]);
        }
    }
    return {
        prefix: prefix,
        suffix: suffix,
        q: q,
        i: i,
        full: full
    };
}
/**
 * Get the priority of a language.
 * @private
 */ function getLanguagePriority(language, accepted, index) {
    var priority = {
        o: -1,
        q: 0,
        s: 0
    };
    for(var i = 0; i < accepted.length; i++){
        var spec = specify(language, accepted[i], index);
        if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
            priority = spec;
        }
    }
    return priority;
}
/**
 * Get the specificity of the language.
 * @private
 */ function specify(language, spec, index) {
    var p = parseLanguage(language);
    if (!p) return null;
    var s = 0;
    if (spec.full.toLowerCase() === p.full.toLowerCase()) {
        s |= 4;
    } else if (spec.prefix.toLowerCase() === p.full.toLowerCase()) {
        s |= 2;
    } else if (spec.full.toLowerCase() === p.prefix.toLowerCase()) {
        s |= 1;
    } else if (spec.full !== "*") {
        return null;
    }
    return {
        i: index,
        o: spec.i,
        q: spec.q,
        s: s
    };
}
/**
 * Get the preferred languages from an Accept-Language header.
 * @public
 */ function preferredLanguages(accept, provided) {
    // RFC 2616 sec 14.4: no header = *
    var accepts = parseAcceptLanguage(accept === undefined ? "*" : accept || "");
    if (!provided) {
        // sorted list of all languages
        return accepts.filter(isQuality).sort(compareSpecs).map(getFullLanguage);
    }
    var priorities = provided.map(function getPriority(type, index) {
        return getLanguagePriority(type, accepts, index);
    });
    // sorted list of accepted languages
    return priorities.filter(isQuality).sort(compareSpecs).map(function getLanguage(priority) {
        return provided[priorities.indexOf(priority)];
    });
}
/**
 * Compare two specs.
 * @private
 */ function compareSpecs(a, b) {
    return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i || 0;
}
/**
 * Get full language string.
 * @private
 */ function getFullLanguage(spec) {
    return spec.full;
}
/**
 * Check if a spec has any quality.
 * @private
 */ function isQuality(spec) {
    return spec.q > 0;
}


/***/ }),

/***/ 627:
/***/ ((module) => {

"use strict";
/**
 * negotiator
 * Copyright(c) 2012 Isaac Z. Schlueter
 * Copyright(c) 2014 Federico Romero
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */ 
/**
 * Module exports.
 * @public
 */ module.exports = preferredMediaTypes;
module.exports.preferredMediaTypes = preferredMediaTypes;
/**
 * Module variables.
 * @private
 */ var simpleMediaTypeRegExp = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;
/**
 * Parse the Accept header.
 * @private
 */ function parseAccept(accept) {
    var accepts = splitMediaTypes(accept);
    for(var i = 0, j = 0; i < accepts.length; i++){
        var mediaType = parseMediaType(accepts[i].trim(), i);
        if (mediaType) {
            accepts[j++] = mediaType;
        }
    }
    // trim accepts
    accepts.length = j;
    return accepts;
}
/**
 * Parse a media type from the Accept header.
 * @private
 */ function parseMediaType(str, i) {
    var match = simpleMediaTypeRegExp.exec(str);
    if (!match) return null;
    var params = Object.create(null);
    var q = 1;
    var subtype = match[2];
    var type = match[1];
    if (match[3]) {
        var kvps = splitParameters(match[3]).map(splitKeyValuePair);
        for(var j = 0; j < kvps.length; j++){
            var pair = kvps[j];
            var key = pair[0].toLowerCase();
            var val = pair[1];
            // get the value, unwrapping quotes
            var value = val && val[0] === '"' && val[val.length - 1] === '"' ? val.slice(1, -1) : val;
            if (key === "q") {
                q = parseFloat(value);
                break;
            }
            // store parameter
            params[key] = value;
        }
    }
    return {
        type: type,
        subtype: subtype,
        params: params,
        q: q,
        i: i
    };
}
/**
 * Get the priority of a media type.
 * @private
 */ function getMediaTypePriority(type, accepted, index) {
    var priority = {
        o: -1,
        q: 0,
        s: 0
    };
    for(var i = 0; i < accepted.length; i++){
        var spec = specify(type, accepted[i], index);
        if (spec && (priority.s - spec.s || priority.q - spec.q || priority.o - spec.o) < 0) {
            priority = spec;
        }
    }
    return priority;
}
/**
 * Get the specificity of the media type.
 * @private
 */ function specify(type, spec, index) {
    var p = parseMediaType(type);
    var s = 0;
    if (!p) {
        return null;
    }
    if (spec.type.toLowerCase() == p.type.toLowerCase()) {
        s |= 4;
    } else if (spec.type != "*") {
        return null;
    }
    if (spec.subtype.toLowerCase() == p.subtype.toLowerCase()) {
        s |= 2;
    } else if (spec.subtype != "*") {
        return null;
    }
    var keys = Object.keys(spec.params);
    if (keys.length > 0) {
        if (keys.every(function(k) {
            return spec.params[k] == "*" || (spec.params[k] || "").toLowerCase() == (p.params[k] || "").toLowerCase();
        })) {
            s |= 1;
        } else {
            return null;
        }
    }
    return {
        i: index,
        o: spec.i,
        q: spec.q,
        s: s
    };
}
/**
 * Get the preferred media types from an Accept header.
 * @public
 */ function preferredMediaTypes(accept, provided) {
    // RFC 2616 sec 14.2: no header = */*
    var accepts = parseAccept(accept === undefined ? "*/*" : accept || "");
    if (!provided) {
        // sorted list of all types
        return accepts.filter(isQuality).sort(compareSpecs).map(getFullType);
    }
    var priorities = provided.map(function getPriority(type, index) {
        return getMediaTypePriority(type, accepts, index);
    });
    // sorted list of accepted types
    return priorities.filter(isQuality).sort(compareSpecs).map(function getType(priority) {
        return provided[priorities.indexOf(priority)];
    });
}
/**
 * Compare two specs.
 * @private
 */ function compareSpecs(a, b) {
    return b.q - a.q || b.s - a.s || a.o - b.o || a.i - b.i || 0;
}
/**
 * Get full type string.
 * @private
 */ function getFullType(spec) {
    return spec.type + "/" + spec.subtype;
}
/**
 * Check if a spec has any quality.
 * @private
 */ function isQuality(spec) {
    return spec.q > 0;
}
/**
 * Count the number of quotes in a string.
 * @private
 */ function quoteCount(string) {
    var count = 0;
    var index = 0;
    while((index = string.indexOf('"', index)) !== -1){
        count++;
        index++;
    }
    return count;
}
/**
 * Split a key value pair.
 * @private
 */ function splitKeyValuePair(str) {
    var index = str.indexOf("=");
    var key;
    var val;
    if (index === -1) {
        key = str;
    } else {
        key = str.slice(0, index);
        val = str.slice(index + 1);
    }
    return [
        key,
        val
    ];
}
/**
 * Split an Accept header into media types.
 * @private
 */ function splitMediaTypes(accept) {
    var accepts = accept.split(",");
    for(var i = 1, j = 0; i < accepts.length; i++){
        if (quoteCount(accepts[j]) % 2 == 0) {
            accepts[++j] = accepts[i];
        } else {
            accepts[j] += "," + accepts[i];
        }
    }
    // trim accepts
    accepts.length = j + 1;
    return accepts;
}
/**
 * Split a string of parameters.
 * @private
 */ function splitParameters(str) {
    var parameters = str.split(";");
    for(var i = 1, j = 0; i < parameters.length; i++){
        if (quoteCount(parameters[j]) % 2 == 0) {
            parameters[++j] = parameters[i];
        } else {
            parameters[j] += ";" + parameters[i];
        }
    }
    // trim parameters
    parameters.length = j + 1;
    for(var i = 0; i < parameters.length; i++){
        parameters[i] = parameters[i].trim();
    }
    return parameters;
}


/***/ }),

/***/ 673:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(324);


/***/ }),

/***/ 298:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// src/index.ts
var src_exports = {};
__export(src_exports, {
    RequestCookies: ()=>RequestCookies,
    ResponseCookies: ()=>ResponseCookies,
    parseCookie: ()=>parseCookie,
    parseSetCookie: ()=>parseSetCookie,
    stringifyCookie: ()=>stringifyCookie
});
module.exports = __toCommonJS(src_exports);
// src/serialize.ts
function stringifyCookie(c) {
    var _a;
    const attrs = [
        "path" in c && c.path && `Path=${c.path}`,
        "expires" in c && (c.expires || c.expires === 0) && `Expires=${(typeof c.expires === "number" ? new Date(c.expires) : c.expires).toUTCString()}`,
        "maxAge" in c && typeof c.maxAge === "number" && `Max-Age=${c.maxAge}`,
        "domain" in c && c.domain && `Domain=${c.domain}`,
        "secure" in c && c.secure && "Secure",
        "httpOnly" in c && c.httpOnly && "HttpOnly",
        "sameSite" in c && c.sameSite && `SameSite=${c.sameSite}`,
        "priority" in c && c.priority && `Priority=${c.priority}`
    ].filter(Boolean);
    return `${c.name}=${encodeURIComponent((_a = c.value) != null ? _a : "")}; ${attrs.join("; ")}`;
}
function parseCookie(cookie) {
    const map = /* @__PURE__ */ new Map();
    for (const pair of cookie.split(/; */)){
        if (!pair) continue;
        const splitAt = pair.indexOf("=");
        if (splitAt === -1) {
            map.set(pair, "true");
            continue;
        }
        const [key, value] = [
            pair.slice(0, splitAt),
            pair.slice(splitAt + 1)
        ];
        try {
            map.set(key, decodeURIComponent(value != null ? value : "true"));
        } catch  {}
    }
    return map;
}
function parseSetCookie(setCookie) {
    if (!setCookie) {
        return void 0;
    }
    const [[name, value], ...attributes] = parseCookie(setCookie);
    const { domain, expires, httponly, maxage, path, samesite, secure, priority } = Object.fromEntries(attributes.map(([key, value2])=>[
            key.toLowerCase(),
            value2
        ]));
    const cookie = {
        name,
        value: decodeURIComponent(value),
        domain,
        ...expires && {
            expires: new Date(expires)
        },
        ...httponly && {
            httpOnly: true
        },
        ...typeof maxage === "string" && {
            maxAge: Number(maxage)
        },
        path,
        ...samesite && {
            sameSite: parseSameSite(samesite)
        },
        ...secure && {
            secure: true
        },
        ...priority && {
            priority: parsePriority(priority)
        }
    };
    return compact(cookie);
}
function compact(t) {
    const newT = {};
    for(const key in t){
        if (t[key]) {
            newT[key] = t[key];
        }
    }
    return newT;
}
var SAME_SITE = [
    "strict",
    "lax",
    "none"
];
function parseSameSite(string) {
    string = string.toLowerCase();
    return SAME_SITE.includes(string) ? string : void 0;
}
var PRIORITY = [
    "low",
    "medium",
    "high"
];
function parsePriority(string) {
    string = string.toLowerCase();
    return PRIORITY.includes(string) ? string : void 0;
}
function splitCookiesString(cookiesString) {
    if (!cookiesString) return [];
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                    cookiesSeparatorFound = true;
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
// src/request-cookies.ts
var RequestCookies = class {
    constructor(requestHeaders){
        /** @internal */ this._parsed = /* @__PURE__ */ new Map();
        this._headers = requestHeaders;
        const header = requestHeaders.get("cookie");
        if (header) {
            const parsed = parseCookie(header);
            for (const [name, value] of parsed){
                this._parsed.set(name, {
                    name,
                    value
                });
            }
        }
    }
    [Symbol.iterator]() {
        return this._parsed[Symbol.iterator]();
    }
    /**
   * The amount of cookies received from the client
   */ get size() {
        return this._parsed.size;
    }
    get(...args) {
        const name = typeof args[0] === "string" ? args[0] : args[0].name;
        return this._parsed.get(name);
    }
    getAll(...args) {
        var _a;
        const all = Array.from(this._parsed);
        if (!args.length) {
            return all.map(([_, value])=>value);
        }
        const name = typeof args[0] === "string" ? args[0] : (_a = args[0]) == null ? void 0 : _a.name;
        return all.filter(([n])=>n === name).map(([_, value])=>value);
    }
    has(name) {
        return this._parsed.has(name);
    }
    set(...args) {
        const [name, value] = args.length === 1 ? [
            args[0].name,
            args[0].value
        ] : args;
        const map = this._parsed;
        map.set(name, {
            name,
            value
        });
        this._headers.set("cookie", Array.from(map).map(([_, value2])=>stringifyCookie(value2)).join("; "));
        return this;
    }
    /**
   * Delete the cookies matching the passed name or names in the request.
   */ delete(names) {
        const map = this._parsed;
        const result = !Array.isArray(names) ? map.delete(names) : names.map((name)=>map.delete(name));
        this._headers.set("cookie", Array.from(map).map(([_, value])=>stringifyCookie(value)).join("; "));
        return result;
    }
    /**
   * Delete all the cookies in the cookies in the request.
   */ clear() {
        this.delete(Array.from(this._parsed.keys()));
        return this;
    }
    /**
   * Format the cookies in the request as a string for logging
   */ [Symbol.for("edge-runtime.inspect.custom")]() {
        return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
    }
    toString() {
        return [
            ...this._parsed.values()
        ].map((v)=>`${v.name}=${encodeURIComponent(v.value)}`).join("; ");
    }
};
// src/response-cookies.ts
var ResponseCookies = class {
    constructor(responseHeaders){
        /** @internal */ this._parsed = /* @__PURE__ */ new Map();
        var _a, _b, _c;
        this._headers = responseHeaders;
        const setCookie = (_c = (_b = (_a = responseHeaders.getSetCookie) == null ? void 0 : _a.call(responseHeaders)) != null ? _b : responseHeaders.get("set-cookie")) != null ? _c : [];
        const cookieStrings = Array.isArray(setCookie) ? setCookie : splitCookiesString(setCookie);
        for (const cookieString of cookieStrings){
            const parsed = parseSetCookie(cookieString);
            if (parsed) this._parsed.set(parsed.name, parsed);
        }
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-get CookieStore#get} without the Promise.
   */ get(...args) {
        const key = typeof args[0] === "string" ? args[0] : args[0].name;
        return this._parsed.get(key);
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-getAll CookieStore#getAll} without the Promise.
   */ getAll(...args) {
        var _a;
        const all = Array.from(this._parsed.values());
        if (!args.length) {
            return all;
        }
        const key = typeof args[0] === "string" ? args[0] : (_a = args[0]) == null ? void 0 : _a.name;
        return all.filter((c)=>c.name === key);
    }
    has(name) {
        return this._parsed.has(name);
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-set CookieStore#set} without the Promise.
   */ set(...args) {
        const [name, value, cookie] = args.length === 1 ? [
            args[0].name,
            args[0].value,
            args[0]
        ] : args;
        const map = this._parsed;
        map.set(name, normalizeCookie({
            name,
            value,
            ...cookie
        }));
        replace(map, this._headers);
        return this;
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-delete CookieStore#delete} without the Promise.
   */ delete(...args) {
        const [name, path, domain] = typeof args[0] === "string" ? [
            args[0]
        ] : [
            args[0].name,
            args[0].path,
            args[0].domain
        ];
        return this.set({
            name,
            path,
            domain,
            value: "",
            expires: /* @__PURE__ */ new Date(0)
        });
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
    }
    toString() {
        return [
            ...this._parsed.values()
        ].map(stringifyCookie).join("; ");
    }
};
function replace(bag, headers) {
    headers.delete("set-cookie");
    for (const [, value] of bag){
        const serialized = stringifyCookie(value);
        headers.append("set-cookie", serialized);
    }
}
function normalizeCookie(cookie = {
    name: "",
    value: ""
}) {
    if (typeof cookie.expires === "number") {
        cookie.expires = new Date(cookie.expires);
    }
    if (cookie.maxAge) {
        cookie.expires = new Date(Date.now() + cookie.maxAge * 1e3);
    }
    if (cookie.path === null || cookie.path === void 0) {
        cookie.path = "/";
    }
    return cookie;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 940:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
var __dirname = "/";

(()=>{
    "use strict";
    var e = {
        491: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.ContextAPI = void 0;
            const n = r(223);
            const a = r(172);
            const o = r(930);
            const i = "context";
            const c = new n.NoopContextManager;
            class ContextAPI {
                constructor(){}
                static getInstance() {
                    if (!this._instance) {
                        this._instance = new ContextAPI;
                    }
                    return this._instance;
                }
                setGlobalContextManager(e) {
                    return (0, a.registerGlobal)(i, e, o.DiagAPI.instance());
                }
                active() {
                    return this._getContextManager().active();
                }
                with(e, t, r, ...n) {
                    return this._getContextManager().with(e, t, r, ...n);
                }
                bind(e, t) {
                    return this._getContextManager().bind(e, t);
                }
                _getContextManager() {
                    return (0, a.getGlobal)(i) || c;
                }
                disable() {
                    this._getContextManager().disable();
                    (0, a.unregisterGlobal)(i, o.DiagAPI.instance());
                }
            }
            t.ContextAPI = ContextAPI;
        },
        930: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.DiagAPI = void 0;
            const n = r(56);
            const a = r(912);
            const o = r(957);
            const i = r(172);
            const c = "diag";
            class DiagAPI {
                constructor(){
                    function _logProxy(e) {
                        return function(...t) {
                            const r = (0, i.getGlobal)("diag");
                            if (!r) return;
                            return r[e](...t);
                        };
                    }
                    const e = this;
                    const setLogger = (t, r = {
                        logLevel: o.DiagLogLevel.INFO
                    })=>{
                        var n, c, s;
                        if (t === e) {
                            const t = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                            e.error((n = t.stack) !== null && n !== void 0 ? n : t.message);
                            return false;
                        }
                        if (typeof r === "number") {
                            r = {
                                logLevel: r
                            };
                        }
                        const u = (0, i.getGlobal)("diag");
                        const l = (0, a.createLogLevelDiagLogger)((c = r.logLevel) !== null && c !== void 0 ? c : o.DiagLogLevel.INFO, t);
                        if (u && !r.suppressOverrideMessage) {
                            const e = (s = (new Error).stack) !== null && s !== void 0 ? s : "<failed to generate stacktrace>";
                            u.warn(`Current logger will be overwritten from ${e}`);
                            l.warn(`Current logger will overwrite one already registered from ${e}`);
                        }
                        return (0, i.registerGlobal)("diag", l, e, true);
                    };
                    e.setLogger = setLogger;
                    e.disable = ()=>{
                        (0, i.unregisterGlobal)(c, e);
                    };
                    e.createComponentLogger = (e)=>new n.DiagComponentLogger(e);
                    e.verbose = _logProxy("verbose");
                    e.debug = _logProxy("debug");
                    e.info = _logProxy("info");
                    e.warn = _logProxy("warn");
                    e.error = _logProxy("error");
                }
                static instance() {
                    if (!this._instance) {
                        this._instance = new DiagAPI;
                    }
                    return this._instance;
                }
            }
            t.DiagAPI = DiagAPI;
        },
        653: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.MetricsAPI = void 0;
            const n = r(660);
            const a = r(172);
            const o = r(930);
            const i = "metrics";
            class MetricsAPI {
                constructor(){}
                static getInstance() {
                    if (!this._instance) {
                        this._instance = new MetricsAPI;
                    }
                    return this._instance;
                }
                setGlobalMeterProvider(e) {
                    return (0, a.registerGlobal)(i, e, o.DiagAPI.instance());
                }
                getMeterProvider() {
                    return (0, a.getGlobal)(i) || n.NOOP_METER_PROVIDER;
                }
                getMeter(e, t, r) {
                    return this.getMeterProvider().getMeter(e, t, r);
                }
                disable() {
                    (0, a.unregisterGlobal)(i, o.DiagAPI.instance());
                }
            }
            t.MetricsAPI = MetricsAPI;
        },
        181: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.PropagationAPI = void 0;
            const n = r(172);
            const a = r(874);
            const o = r(194);
            const i = r(277);
            const c = r(369);
            const s = r(930);
            const u = "propagation";
            const l = new a.NoopTextMapPropagator;
            class PropagationAPI {
                constructor(){
                    this.createBaggage = c.createBaggage;
                    this.getBaggage = i.getBaggage;
                    this.getActiveBaggage = i.getActiveBaggage;
                    this.setBaggage = i.setBaggage;
                    this.deleteBaggage = i.deleteBaggage;
                }
                static getInstance() {
                    if (!this._instance) {
                        this._instance = new PropagationAPI;
                    }
                    return this._instance;
                }
                setGlobalPropagator(e) {
                    return (0, n.registerGlobal)(u, e, s.DiagAPI.instance());
                }
                inject(e, t, r = o.defaultTextMapSetter) {
                    return this._getGlobalPropagator().inject(e, t, r);
                }
                extract(e, t, r = o.defaultTextMapGetter) {
                    return this._getGlobalPropagator().extract(e, t, r);
                }
                fields() {
                    return this._getGlobalPropagator().fields();
                }
                disable() {
                    (0, n.unregisterGlobal)(u, s.DiagAPI.instance());
                }
                _getGlobalPropagator() {
                    return (0, n.getGlobal)(u) || l;
                }
            }
            t.PropagationAPI = PropagationAPI;
        },
        997: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.TraceAPI = void 0;
            const n = r(172);
            const a = r(846);
            const o = r(139);
            const i = r(607);
            const c = r(930);
            const s = "trace";
            class TraceAPI {
                constructor(){
                    this._proxyTracerProvider = new a.ProxyTracerProvider;
                    this.wrapSpanContext = o.wrapSpanContext;
                    this.isSpanContextValid = o.isSpanContextValid;
                    this.deleteSpan = i.deleteSpan;
                    this.getSpan = i.getSpan;
                    this.getActiveSpan = i.getActiveSpan;
                    this.getSpanContext = i.getSpanContext;
                    this.setSpan = i.setSpan;
                    this.setSpanContext = i.setSpanContext;
                }
                static getInstance() {
                    if (!this._instance) {
                        this._instance = new TraceAPI;
                    }
                    return this._instance;
                }
                setGlobalTracerProvider(e) {
                    const t = (0, n.registerGlobal)(s, this._proxyTracerProvider, c.DiagAPI.instance());
                    if (t) {
                        this._proxyTracerProvider.setDelegate(e);
                    }
                    return t;
                }
                getTracerProvider() {
                    return (0, n.getGlobal)(s) || this._proxyTracerProvider;
                }
                getTracer(e, t) {
                    return this.getTracerProvider().getTracer(e, t);
                }
                disable() {
                    (0, n.unregisterGlobal)(s, c.DiagAPI.instance());
                    this._proxyTracerProvider = new a.ProxyTracerProvider;
                }
            }
            t.TraceAPI = TraceAPI;
        },
        277: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.deleteBaggage = t.setBaggage = t.getActiveBaggage = t.getBaggage = void 0;
            const n = r(491);
            const a = r(780);
            const o = (0, a.createContextKey)("OpenTelemetry Baggage Key");
            function getBaggage(e) {
                return e.getValue(o) || undefined;
            }
            t.getBaggage = getBaggage;
            function getActiveBaggage() {
                return getBaggage(n.ContextAPI.getInstance().active());
            }
            t.getActiveBaggage = getActiveBaggage;
            function setBaggage(e, t) {
                return e.setValue(o, t);
            }
            t.setBaggage = setBaggage;
            function deleteBaggage(e) {
                return e.deleteValue(o);
            }
            t.deleteBaggage = deleteBaggage;
        },
        993: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.BaggageImpl = void 0;
            class BaggageImpl {
                constructor(e){
                    this._entries = e ? new Map(e) : new Map;
                }
                getEntry(e) {
                    const t = this._entries.get(e);
                    if (!t) {
                        return undefined;
                    }
                    return Object.assign({}, t);
                }
                getAllEntries() {
                    return Array.from(this._entries.entries()).map(([e, t])=>[
                            e,
                            t
                        ]);
                }
                setEntry(e, t) {
                    const r = new BaggageImpl(this._entries);
                    r._entries.set(e, t);
                    return r;
                }
                removeEntry(e) {
                    const t = new BaggageImpl(this._entries);
                    t._entries.delete(e);
                    return t;
                }
                removeEntries(...e) {
                    const t = new BaggageImpl(this._entries);
                    for (const r of e){
                        t._entries.delete(r);
                    }
                    return t;
                }
                clear() {
                    return new BaggageImpl;
                }
            }
            t.BaggageImpl = BaggageImpl;
        },
        830: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.baggageEntryMetadataSymbol = void 0;
            t.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        },
        369: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.baggageEntryMetadataFromString = t.createBaggage = void 0;
            const n = r(930);
            const a = r(993);
            const o = r(830);
            const i = n.DiagAPI.instance();
            function createBaggage(e = {}) {
                return new a.BaggageImpl(new Map(Object.entries(e)));
            }
            t.createBaggage = createBaggage;
            function baggageEntryMetadataFromString(e) {
                if (typeof e !== "string") {
                    i.error(`Cannot create baggage metadata from unknown type: ${typeof e}`);
                    e = "";
                }
                return {
                    __TYPE__: o.baggageEntryMetadataSymbol,
                    toString () {
                        return e;
                    }
                };
            }
            t.baggageEntryMetadataFromString = baggageEntryMetadataFromString;
        },
        67: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.context = void 0;
            const n = r(491);
            t.context = n.ContextAPI.getInstance();
        },
        223: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NoopContextManager = void 0;
            const n = r(780);
            class NoopContextManager {
                active() {
                    return n.ROOT_CONTEXT;
                }
                with(e, t, r, ...n) {
                    return t.call(r, ...n);
                }
                bind(e, t) {
                    return t;
                }
                enable() {
                    return this;
                }
                disable() {
                    return this;
                }
            }
            t.NoopContextManager = NoopContextManager;
        },
        780: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.ROOT_CONTEXT = t.createContextKey = void 0;
            function createContextKey(e) {
                return Symbol.for(e);
            }
            t.createContextKey = createContextKey;
            class BaseContext {
                constructor(e){
                    const t = this;
                    t._currentContext = e ? new Map(e) : new Map;
                    t.getValue = (e)=>t._currentContext.get(e);
                    t.setValue = (e, r)=>{
                        const n = new BaseContext(t._currentContext);
                        n._currentContext.set(e, r);
                        return n;
                    };
                    t.deleteValue = (e)=>{
                        const r = new BaseContext(t._currentContext);
                        r._currentContext.delete(e);
                        return r;
                    };
                }
            }
            t.ROOT_CONTEXT = new BaseContext;
        },
        506: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.diag = void 0;
            const n = r(930);
            t.diag = n.DiagAPI.instance();
        },
        56: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.DiagComponentLogger = void 0;
            const n = r(172);
            class DiagComponentLogger {
                constructor(e){
                    this._namespace = e.namespace || "DiagComponentLogger";
                }
                debug(...e) {
                    return logProxy("debug", this._namespace, e);
                }
                error(...e) {
                    return logProxy("error", this._namespace, e);
                }
                info(...e) {
                    return logProxy("info", this._namespace, e);
                }
                warn(...e) {
                    return logProxy("warn", this._namespace, e);
                }
                verbose(...e) {
                    return logProxy("verbose", this._namespace, e);
                }
            }
            t.DiagComponentLogger = DiagComponentLogger;
            function logProxy(e, t, r) {
                const a = (0, n.getGlobal)("diag");
                if (!a) {
                    return;
                }
                r.unshift(t);
                return a[e](...r);
            }
        },
        972: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.DiagConsoleLogger = void 0;
            const r = [
                {
                    n: "error",
                    c: "error"
                },
                {
                    n: "warn",
                    c: "warn"
                },
                {
                    n: "info",
                    c: "info"
                },
                {
                    n: "debug",
                    c: "debug"
                },
                {
                    n: "verbose",
                    c: "trace"
                }
            ];
            class DiagConsoleLogger {
                constructor(){
                    function _consoleFunc(e) {
                        return function(...t) {
                            if (console) {
                                let r = console[e];
                                if (typeof r !== "function") {
                                    r = console.log;
                                }
                                if (typeof r === "function") {
                                    return r.apply(console, t);
                                }
                            }
                        };
                    }
                    for(let e = 0; e < r.length; e++){
                        this[r[e].n] = _consoleFunc(r[e].c);
                    }
                }
            }
            t.DiagConsoleLogger = DiagConsoleLogger;
        },
        912: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.createLogLevelDiagLogger = void 0;
            const n = r(957);
            function createLogLevelDiagLogger(e, t) {
                if (e < n.DiagLogLevel.NONE) {
                    e = n.DiagLogLevel.NONE;
                } else if (e > n.DiagLogLevel.ALL) {
                    e = n.DiagLogLevel.ALL;
                }
                t = t || {};
                function _filterFunc(r, n) {
                    const a = t[r];
                    if (typeof a === "function" && e >= n) {
                        return a.bind(t);
                    }
                    return function() {};
                }
                return {
                    error: _filterFunc("error", n.DiagLogLevel.ERROR),
                    warn: _filterFunc("warn", n.DiagLogLevel.WARN),
                    info: _filterFunc("info", n.DiagLogLevel.INFO),
                    debug: _filterFunc("debug", n.DiagLogLevel.DEBUG),
                    verbose: _filterFunc("verbose", n.DiagLogLevel.VERBOSE)
                };
            }
            t.createLogLevelDiagLogger = createLogLevelDiagLogger;
        },
        957: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.DiagLogLevel = void 0;
            var r;
            (function(e) {
                e[e["NONE"] = 0] = "NONE";
                e[e["ERROR"] = 30] = "ERROR";
                e[e["WARN"] = 50] = "WARN";
                e[e["INFO"] = 60] = "INFO";
                e[e["DEBUG"] = 70] = "DEBUG";
                e[e["VERBOSE"] = 80] = "VERBOSE";
                e[e["ALL"] = 9999] = "ALL";
            })(r = t.DiagLogLevel || (t.DiagLogLevel = {}));
        },
        172: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.unregisterGlobal = t.getGlobal = t.registerGlobal = void 0;
            const n = r(200);
            const a = r(521);
            const o = r(130);
            const i = a.VERSION.split(".")[0];
            const c = Symbol.for(`opentelemetry.js.api.${i}`);
            const s = n._globalThis;
            function registerGlobal(e, t, r, n = false) {
                var o;
                const i = s[c] = (o = s[c]) !== null && o !== void 0 ? o : {
                    version: a.VERSION
                };
                if (!n && i[e]) {
                    const t = new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e}`);
                    r.error(t.stack || t.message);
                    return false;
                }
                if (i.version !== a.VERSION) {
                    const t = new Error(`@opentelemetry/api: Registration of version v${i.version} for ${e} does not match previously registered API v${a.VERSION}`);
                    r.error(t.stack || t.message);
                    return false;
                }
                i[e] = t;
                r.debug(`@opentelemetry/api: Registered a global for ${e} v${a.VERSION}.`);
                return true;
            }
            t.registerGlobal = registerGlobal;
            function getGlobal(e) {
                var t, r;
                const n = (t = s[c]) === null || t === void 0 ? void 0 : t.version;
                if (!n || !(0, o.isCompatible)(n)) {
                    return;
                }
                return (r = s[c]) === null || r === void 0 ? void 0 : r[e];
            }
            t.getGlobal = getGlobal;
            function unregisterGlobal(e, t) {
                t.debug(`@opentelemetry/api: Unregistering a global for ${e} v${a.VERSION}.`);
                const r = s[c];
                if (r) {
                    delete r[e];
                }
            }
            t.unregisterGlobal = unregisterGlobal;
        },
        130: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.isCompatible = t._makeCompatibilityCheck = void 0;
            const n = r(521);
            const a = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
            function _makeCompatibilityCheck(e) {
                const t = new Set([
                    e
                ]);
                const r = new Set;
                const n = e.match(a);
                if (!n) {
                    return ()=>false;
                }
                const o = {
                    major: +n[1],
                    minor: +n[2],
                    patch: +n[3],
                    prerelease: n[4]
                };
                if (o.prerelease != null) {
                    return function isExactmatch(t) {
                        return t === e;
                    };
                }
                function _reject(e) {
                    r.add(e);
                    return false;
                }
                function _accept(e) {
                    t.add(e);
                    return true;
                }
                return function isCompatible(e) {
                    if (t.has(e)) {
                        return true;
                    }
                    if (r.has(e)) {
                        return false;
                    }
                    const n = e.match(a);
                    if (!n) {
                        return _reject(e);
                    }
                    const i = {
                        major: +n[1],
                        minor: +n[2],
                        patch: +n[3],
                        prerelease: n[4]
                    };
                    if (i.prerelease != null) {
                        return _reject(e);
                    }
                    if (o.major !== i.major) {
                        return _reject(e);
                    }
                    if (o.major === 0) {
                        if (o.minor === i.minor && o.patch <= i.patch) {
                            return _accept(e);
                        }
                        return _reject(e);
                    }
                    if (o.minor <= i.minor) {
                        return _accept(e);
                    }
                    return _reject(e);
                };
            }
            t._makeCompatibilityCheck = _makeCompatibilityCheck;
            t.isCompatible = _makeCompatibilityCheck(n.VERSION);
        },
        886: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.metrics = void 0;
            const n = r(653);
            t.metrics = n.MetricsAPI.getInstance();
        },
        901: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.ValueType = void 0;
            var r;
            (function(e) {
                e[e["INT"] = 0] = "INT";
                e[e["DOUBLE"] = 1] = "DOUBLE";
            })(r = t.ValueType || (t.ValueType = {}));
        },
        102: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.createNoopMeter = t.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t.NOOP_OBSERVABLE_GAUGE_METRIC = t.NOOP_OBSERVABLE_COUNTER_METRIC = t.NOOP_UP_DOWN_COUNTER_METRIC = t.NOOP_HISTOGRAM_METRIC = t.NOOP_COUNTER_METRIC = t.NOOP_METER = t.NoopObservableUpDownCounterMetric = t.NoopObservableGaugeMetric = t.NoopObservableCounterMetric = t.NoopObservableMetric = t.NoopHistogramMetric = t.NoopUpDownCounterMetric = t.NoopCounterMetric = t.NoopMetric = t.NoopMeter = void 0;
            class NoopMeter {
                constructor(){}
                createHistogram(e, r) {
                    return t.NOOP_HISTOGRAM_METRIC;
                }
                createCounter(e, r) {
                    return t.NOOP_COUNTER_METRIC;
                }
                createUpDownCounter(e, r) {
                    return t.NOOP_UP_DOWN_COUNTER_METRIC;
                }
                createObservableGauge(e, r) {
                    return t.NOOP_OBSERVABLE_GAUGE_METRIC;
                }
                createObservableCounter(e, r) {
                    return t.NOOP_OBSERVABLE_COUNTER_METRIC;
                }
                createObservableUpDownCounter(e, r) {
                    return t.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
                }
                addBatchObservableCallback(e, t) {}
                removeBatchObservableCallback(e) {}
            }
            t.NoopMeter = NoopMeter;
            class NoopMetric {
            }
            t.NoopMetric = NoopMetric;
            class NoopCounterMetric extends NoopMetric {
                add(e, t) {}
            }
            t.NoopCounterMetric = NoopCounterMetric;
            class NoopUpDownCounterMetric extends NoopMetric {
                add(e, t) {}
            }
            t.NoopUpDownCounterMetric = NoopUpDownCounterMetric;
            class NoopHistogramMetric extends NoopMetric {
                record(e, t) {}
            }
            t.NoopHistogramMetric = NoopHistogramMetric;
            class NoopObservableMetric {
                addCallback(e) {}
                removeCallback(e) {}
            }
            t.NoopObservableMetric = NoopObservableMetric;
            class NoopObservableCounterMetric extends NoopObservableMetric {
            }
            t.NoopObservableCounterMetric = NoopObservableCounterMetric;
            class NoopObservableGaugeMetric extends NoopObservableMetric {
            }
            t.NoopObservableGaugeMetric = NoopObservableGaugeMetric;
            class NoopObservableUpDownCounterMetric extends NoopObservableMetric {
            }
            t.NoopObservableUpDownCounterMetric = NoopObservableUpDownCounterMetric;
            t.NOOP_METER = new NoopMeter;
            t.NOOP_COUNTER_METRIC = new NoopCounterMetric;
            t.NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric;
            t.NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric;
            t.NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric;
            t.NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric;
            t.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric;
            function createNoopMeter() {
                return t.NOOP_METER;
            }
            t.createNoopMeter = createNoopMeter;
        },
        660: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NOOP_METER_PROVIDER = t.NoopMeterProvider = void 0;
            const n = r(102);
            class NoopMeterProvider {
                getMeter(e, t, r) {
                    return n.NOOP_METER;
                }
            }
            t.NoopMeterProvider = NoopMeterProvider;
            t.NOOP_METER_PROVIDER = new NoopMeterProvider;
        },
        200: function(e, t, r) {
            var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                if (n === undefined) n = r;
                Object.defineProperty(e, n, {
                    enumerable: true,
                    get: function() {
                        return t[r];
                    }
                });
            } : function(e, t, r, n) {
                if (n === undefined) n = r;
                e[n] = t[r];
            });
            var a = this && this.__exportStar || function(e, t) {
                for(var r in e)if (r !== "default" && !Object.prototype.hasOwnProperty.call(t, r)) n(t, e, r);
            };
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            a(r(46), t);
        },
        651: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t._globalThis = void 0;
            t._globalThis = typeof globalThis === "object" ? globalThis : __webpack_require__.g;
        },
        46: function(e, t, r) {
            var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                if (n === undefined) n = r;
                Object.defineProperty(e, n, {
                    enumerable: true,
                    get: function() {
                        return t[r];
                    }
                });
            } : function(e, t, r, n) {
                if (n === undefined) n = r;
                e[n] = t[r];
            });
            var a = this && this.__exportStar || function(e, t) {
                for(var r in e)if (r !== "default" && !Object.prototype.hasOwnProperty.call(t, r)) n(t, e, r);
            };
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            a(r(651), t);
        },
        939: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.propagation = void 0;
            const n = r(181);
            t.propagation = n.PropagationAPI.getInstance();
        },
        874: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NoopTextMapPropagator = void 0;
            class NoopTextMapPropagator {
                inject(e, t) {}
                extract(e, t) {
                    return e;
                }
                fields() {
                    return [];
                }
            }
            t.NoopTextMapPropagator = NoopTextMapPropagator;
        },
        194: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.defaultTextMapSetter = t.defaultTextMapGetter = void 0;
            t.defaultTextMapGetter = {
                get (e, t) {
                    if (e == null) {
                        return undefined;
                    }
                    return e[t];
                },
                keys (e) {
                    if (e == null) {
                        return [];
                    }
                    return Object.keys(e);
                }
            };
            t.defaultTextMapSetter = {
                set (e, t, r) {
                    if (e == null) {
                        return;
                    }
                    e[t] = r;
                }
            };
        },
        845: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.trace = void 0;
            const n = r(997);
            t.trace = n.TraceAPI.getInstance();
        },
        403: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NonRecordingSpan = void 0;
            const n = r(476);
            class NonRecordingSpan {
                constructor(e = n.INVALID_SPAN_CONTEXT){
                    this._spanContext = e;
                }
                spanContext() {
                    return this._spanContext;
                }
                setAttribute(e, t) {
                    return this;
                }
                setAttributes(e) {
                    return this;
                }
                addEvent(e, t) {
                    return this;
                }
                setStatus(e) {
                    return this;
                }
                updateName(e) {
                    return this;
                }
                end(e) {}
                isRecording() {
                    return false;
                }
                recordException(e, t) {}
            }
            t.NonRecordingSpan = NonRecordingSpan;
        },
        614: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NoopTracer = void 0;
            const n = r(491);
            const a = r(607);
            const o = r(403);
            const i = r(139);
            const c = n.ContextAPI.getInstance();
            class NoopTracer {
                startSpan(e, t, r = c.active()) {
                    const n = Boolean(t === null || t === void 0 ? void 0 : t.root);
                    if (n) {
                        return new o.NonRecordingSpan;
                    }
                    const s = r && (0, a.getSpanContext)(r);
                    if (isSpanContext(s) && (0, i.isSpanContextValid)(s)) {
                        return new o.NonRecordingSpan(s);
                    } else {
                        return new o.NonRecordingSpan;
                    }
                }
                startActiveSpan(e, t, r, n) {
                    let o;
                    let i;
                    let s;
                    if (arguments.length < 2) {
                        return;
                    } else if (arguments.length === 2) {
                        s = t;
                    } else if (arguments.length === 3) {
                        o = t;
                        s = r;
                    } else {
                        o = t;
                        i = r;
                        s = n;
                    }
                    const u = i !== null && i !== void 0 ? i : c.active();
                    const l = this.startSpan(e, o, u);
                    const g = (0, a.setSpan)(u, l);
                    return c.with(g, s, undefined, l);
                }
            }
            t.NoopTracer = NoopTracer;
            function isSpanContext(e) {
                return typeof e === "object" && typeof e["spanId"] === "string" && typeof e["traceId"] === "string" && typeof e["traceFlags"] === "number";
            }
        },
        124: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NoopTracerProvider = void 0;
            const n = r(614);
            class NoopTracerProvider {
                getTracer(e, t, r) {
                    return new n.NoopTracer;
                }
            }
            t.NoopTracerProvider = NoopTracerProvider;
        },
        125: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.ProxyTracer = void 0;
            const n = r(614);
            const a = new n.NoopTracer;
            class ProxyTracer {
                constructor(e, t, r, n){
                    this._provider = e;
                    this.name = t;
                    this.version = r;
                    this.options = n;
                }
                startSpan(e, t, r) {
                    return this._getTracer().startSpan(e, t, r);
                }
                startActiveSpan(e, t, r, n) {
                    const a = this._getTracer();
                    return Reflect.apply(a.startActiveSpan, a, arguments);
                }
                _getTracer() {
                    if (this._delegate) {
                        return this._delegate;
                    }
                    const e = this._provider.getDelegateTracer(this.name, this.version, this.options);
                    if (!e) {
                        return a;
                    }
                    this._delegate = e;
                    return this._delegate;
                }
            }
            t.ProxyTracer = ProxyTracer;
        },
        846: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.ProxyTracerProvider = void 0;
            const n = r(125);
            const a = r(124);
            const o = new a.NoopTracerProvider;
            class ProxyTracerProvider {
                getTracer(e, t, r) {
                    var a;
                    return (a = this.getDelegateTracer(e, t, r)) !== null && a !== void 0 ? a : new n.ProxyTracer(this, e, t, r);
                }
                getDelegate() {
                    var e;
                    return (e = this._delegate) !== null && e !== void 0 ? e : o;
                }
                setDelegate(e) {
                    this._delegate = e;
                }
                getDelegateTracer(e, t, r) {
                    var n;
                    return (n = this._delegate) === null || n === void 0 ? void 0 : n.getTracer(e, t, r);
                }
            }
            t.ProxyTracerProvider = ProxyTracerProvider;
        },
        996: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.SamplingDecision = void 0;
            var r;
            (function(e) {
                e[e["NOT_RECORD"] = 0] = "NOT_RECORD";
                e[e["RECORD"] = 1] = "RECORD";
                e[e["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
            })(r = t.SamplingDecision || (t.SamplingDecision = {}));
        },
        607: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.getSpanContext = t.setSpanContext = t.deleteSpan = t.setSpan = t.getActiveSpan = t.getSpan = void 0;
            const n = r(780);
            const a = r(403);
            const o = r(491);
            const i = (0, n.createContextKey)("OpenTelemetry Context Key SPAN");
            function getSpan(e) {
                return e.getValue(i) || undefined;
            }
            t.getSpan = getSpan;
            function getActiveSpan() {
                return getSpan(o.ContextAPI.getInstance().active());
            }
            t.getActiveSpan = getActiveSpan;
            function setSpan(e, t) {
                return e.setValue(i, t);
            }
            t.setSpan = setSpan;
            function deleteSpan(e) {
                return e.deleteValue(i);
            }
            t.deleteSpan = deleteSpan;
            function setSpanContext(e, t) {
                return setSpan(e, new a.NonRecordingSpan(t));
            }
            t.setSpanContext = setSpanContext;
            function getSpanContext(e) {
                var t;
                return (t = getSpan(e)) === null || t === void 0 ? void 0 : t.spanContext();
            }
            t.getSpanContext = getSpanContext;
        },
        325: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.TraceStateImpl = void 0;
            const n = r(564);
            const a = 32;
            const o = 512;
            const i = ",";
            const c = "=";
            class TraceStateImpl {
                constructor(e){
                    this._internalState = new Map;
                    if (e) this._parse(e);
                }
                set(e, t) {
                    const r = this._clone();
                    if (r._internalState.has(e)) {
                        r._internalState.delete(e);
                    }
                    r._internalState.set(e, t);
                    return r;
                }
                unset(e) {
                    const t = this._clone();
                    t._internalState.delete(e);
                    return t;
                }
                get(e) {
                    return this._internalState.get(e);
                }
                serialize() {
                    return this._keys().reduce((e, t)=>{
                        e.push(t + c + this.get(t));
                        return e;
                    }, []).join(i);
                }
                _parse(e) {
                    if (e.length > o) return;
                    this._internalState = e.split(i).reverse().reduce((e, t)=>{
                        const r = t.trim();
                        const a = r.indexOf(c);
                        if (a !== -1) {
                            const o = r.slice(0, a);
                            const i = r.slice(a + 1, t.length);
                            if ((0, n.validateKey)(o) && (0, n.validateValue)(i)) {
                                e.set(o, i);
                            } else {}
                        }
                        return e;
                    }, new Map);
                    if (this._internalState.size > a) {
                        this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, a));
                    }
                }
                _keys() {
                    return Array.from(this._internalState.keys()).reverse();
                }
                _clone() {
                    const e = new TraceStateImpl;
                    e._internalState = new Map(this._internalState);
                    return e;
                }
            }
            t.TraceStateImpl = TraceStateImpl;
        },
        564: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.validateValue = t.validateKey = void 0;
            const r = "[_0-9a-z-*/]";
            const n = `[a-z]${r}{0,255}`;
            const a = `[a-z0-9]${r}{0,240}@[a-z]${r}{0,13}`;
            const o = new RegExp(`^(?:${n}|${a})$`);
            const i = /^[ -~]{0,255}[!-~]$/;
            const c = /,|=/;
            function validateKey(e) {
                return o.test(e);
            }
            t.validateKey = validateKey;
            function validateValue(e) {
                return i.test(e) && !c.test(e);
            }
            t.validateValue = validateValue;
        },
        98: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.createTraceState = void 0;
            const n = r(325);
            function createTraceState(e) {
                return new n.TraceStateImpl(e);
            }
            t.createTraceState = createTraceState;
        },
        476: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.INVALID_SPAN_CONTEXT = t.INVALID_TRACEID = t.INVALID_SPANID = void 0;
            const n = r(475);
            t.INVALID_SPANID = "0000000000000000";
            t.INVALID_TRACEID = "00000000000000000000000000000000";
            t.INVALID_SPAN_CONTEXT = {
                traceId: t.INVALID_TRACEID,
                spanId: t.INVALID_SPANID,
                traceFlags: n.TraceFlags.NONE
            };
        },
        357: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.SpanKind = void 0;
            var r;
            (function(e) {
                e[e["INTERNAL"] = 0] = "INTERNAL";
                e[e["SERVER"] = 1] = "SERVER";
                e[e["CLIENT"] = 2] = "CLIENT";
                e[e["PRODUCER"] = 3] = "PRODUCER";
                e[e["CONSUMER"] = 4] = "CONSUMER";
            })(r = t.SpanKind || (t.SpanKind = {}));
        },
        139: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.wrapSpanContext = t.isSpanContextValid = t.isValidSpanId = t.isValidTraceId = void 0;
            const n = r(476);
            const a = r(403);
            const o = /^([0-9a-f]{32})$/i;
            const i = /^[0-9a-f]{16}$/i;
            function isValidTraceId(e) {
                return o.test(e) && e !== n.INVALID_TRACEID;
            }
            t.isValidTraceId = isValidTraceId;
            function isValidSpanId(e) {
                return i.test(e) && e !== n.INVALID_SPANID;
            }
            t.isValidSpanId = isValidSpanId;
            function isSpanContextValid(e) {
                return isValidTraceId(e.traceId) && isValidSpanId(e.spanId);
            }
            t.isSpanContextValid = isSpanContextValid;
            function wrapSpanContext(e) {
                return new a.NonRecordingSpan(e);
            }
            t.wrapSpanContext = wrapSpanContext;
        },
        847: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.SpanStatusCode = void 0;
            var r;
            (function(e) {
                e[e["UNSET"] = 0] = "UNSET";
                e[e["OK"] = 1] = "OK";
                e[e["ERROR"] = 2] = "ERROR";
            })(r = t.SpanStatusCode || (t.SpanStatusCode = {}));
        },
        475: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.TraceFlags = void 0;
            var r;
            (function(e) {
                e[e["NONE"] = 0] = "NONE";
                e[e["SAMPLED"] = 1] = "SAMPLED";
            })(r = t.TraceFlags || (t.TraceFlags = {}));
        },
        521: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.VERSION = void 0;
            t.VERSION = "1.6.0";
        }
    };
    var t = {};
    function __nccwpck_require__(r) {
        var n = t[r];
        if (n !== undefined) {
            return n.exports;
        }
        var a = t[r] = {
            exports: {}
        };
        var o = true;
        try {
            e[r].call(a.exports, a, a.exports, __nccwpck_require__);
            o = false;
        } finally{
            if (o) delete t[r];
        }
        return a.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var r = {};
    (()=>{
        var e = r;
        Object.defineProperty(e, "__esModule", {
            value: true
        });
        e.trace = e.propagation = e.metrics = e.diag = e.context = e.INVALID_SPAN_CONTEXT = e.INVALID_TRACEID = e.INVALID_SPANID = e.isValidSpanId = e.isValidTraceId = e.isSpanContextValid = e.createTraceState = e.TraceFlags = e.SpanStatusCode = e.SpanKind = e.SamplingDecision = e.ProxyTracerProvider = e.ProxyTracer = e.defaultTextMapSetter = e.defaultTextMapGetter = e.ValueType = e.createNoopMeter = e.DiagLogLevel = e.DiagConsoleLogger = e.ROOT_CONTEXT = e.createContextKey = e.baggageEntryMetadataFromString = void 0;
        var t = __nccwpck_require__(369);
        Object.defineProperty(e, "baggageEntryMetadataFromString", {
            enumerable: true,
            get: function() {
                return t.baggageEntryMetadataFromString;
            }
        });
        var n = __nccwpck_require__(780);
        Object.defineProperty(e, "createContextKey", {
            enumerable: true,
            get: function() {
                return n.createContextKey;
            }
        });
        Object.defineProperty(e, "ROOT_CONTEXT", {
            enumerable: true,
            get: function() {
                return n.ROOT_CONTEXT;
            }
        });
        var a = __nccwpck_require__(972);
        Object.defineProperty(e, "DiagConsoleLogger", {
            enumerable: true,
            get: function() {
                return a.DiagConsoleLogger;
            }
        });
        var o = __nccwpck_require__(957);
        Object.defineProperty(e, "DiagLogLevel", {
            enumerable: true,
            get: function() {
                return o.DiagLogLevel;
            }
        });
        var i = __nccwpck_require__(102);
        Object.defineProperty(e, "createNoopMeter", {
            enumerable: true,
            get: function() {
                return i.createNoopMeter;
            }
        });
        var c = __nccwpck_require__(901);
        Object.defineProperty(e, "ValueType", {
            enumerable: true,
            get: function() {
                return c.ValueType;
            }
        });
        var s = __nccwpck_require__(194);
        Object.defineProperty(e, "defaultTextMapGetter", {
            enumerable: true,
            get: function() {
                return s.defaultTextMapGetter;
            }
        });
        Object.defineProperty(e, "defaultTextMapSetter", {
            enumerable: true,
            get: function() {
                return s.defaultTextMapSetter;
            }
        });
        var u = __nccwpck_require__(125);
        Object.defineProperty(e, "ProxyTracer", {
            enumerable: true,
            get: function() {
                return u.ProxyTracer;
            }
        });
        var l = __nccwpck_require__(846);
        Object.defineProperty(e, "ProxyTracerProvider", {
            enumerable: true,
            get: function() {
                return l.ProxyTracerProvider;
            }
        });
        var g = __nccwpck_require__(996);
        Object.defineProperty(e, "SamplingDecision", {
            enumerable: true,
            get: function() {
                return g.SamplingDecision;
            }
        });
        var p = __nccwpck_require__(357);
        Object.defineProperty(e, "SpanKind", {
            enumerable: true,
            get: function() {
                return p.SpanKind;
            }
        });
        var d = __nccwpck_require__(847);
        Object.defineProperty(e, "SpanStatusCode", {
            enumerable: true,
            get: function() {
                return d.SpanStatusCode;
            }
        });
        var _ = __nccwpck_require__(475);
        Object.defineProperty(e, "TraceFlags", {
            enumerable: true,
            get: function() {
                return _.TraceFlags;
            }
        });
        var f = __nccwpck_require__(98);
        Object.defineProperty(e, "createTraceState", {
            enumerable: true,
            get: function() {
                return f.createTraceState;
            }
        });
        var b = __nccwpck_require__(139);
        Object.defineProperty(e, "isSpanContextValid", {
            enumerable: true,
            get: function() {
                return b.isSpanContextValid;
            }
        });
        Object.defineProperty(e, "isValidTraceId", {
            enumerable: true,
            get: function() {
                return b.isValidTraceId;
            }
        });
        Object.defineProperty(e, "isValidSpanId", {
            enumerable: true,
            get: function() {
                return b.isValidSpanId;
            }
        });
        var v = __nccwpck_require__(476);
        Object.defineProperty(e, "INVALID_SPANID", {
            enumerable: true,
            get: function() {
                return v.INVALID_SPANID;
            }
        });
        Object.defineProperty(e, "INVALID_TRACEID", {
            enumerable: true,
            get: function() {
                return v.INVALID_TRACEID;
            }
        });
        Object.defineProperty(e, "INVALID_SPAN_CONTEXT", {
            enumerable: true,
            get: function() {
                return v.INVALID_SPAN_CONTEXT;
            }
        });
        const O = __nccwpck_require__(67);
        Object.defineProperty(e, "context", {
            enumerable: true,
            get: function() {
                return O.context;
            }
        });
        const P = __nccwpck_require__(506);
        Object.defineProperty(e, "diag", {
            enumerable: true,
            get: function() {
                return P.diag;
            }
        });
        const N = __nccwpck_require__(886);
        Object.defineProperty(e, "metrics", {
            enumerable: true,
            get: function() {
                return N.metrics;
            }
        });
        const S = __nccwpck_require__(939);
        Object.defineProperty(e, "propagation", {
            enumerable: true,
            get: function() {
                return S.propagation;
            }
        });
        const C = __nccwpck_require__(845);
        Object.defineProperty(e, "trace", {
            enumerable: true,
            get: function() {
                return C.trace;
            }
        });
        e["default"] = {
            context: O.context,
            diag: P.diag,
            metrics: N.metrics,
            propagation: S.propagation,
            trace: C.trace
        };
    })();
    module.exports = r;
})();


/***/ }),

/***/ 287:
/***/ ((module) => {

"use strict";
var __dirname = "/";

(()=>{
    "use strict";
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var e = {};
    (()=>{
        var r = e;
        /*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ r.parse = parse;
        r.serialize = serialize;
        var i = decodeURIComponent;
        var t = encodeURIComponent;
        var a = /; */;
        var n = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        function parse(e, r) {
            if (typeof e !== "string") {
                throw new TypeError("argument str must be a string");
            }
            var t = {};
            var n = r || {};
            var o = e.split(a);
            var s = n.decode || i;
            for(var p = 0; p < o.length; p++){
                var f = o[p];
                var u = f.indexOf("=");
                if (u < 0) {
                    continue;
                }
                var v = f.substr(0, u).trim();
                var c = f.substr(++u, f.length).trim();
                if ('"' == c[0]) {
                    c = c.slice(1, -1);
                }
                if (undefined == t[v]) {
                    t[v] = tryDecode(c, s);
                }
            }
            return t;
        }
        function serialize(e, r, i) {
            var a = i || {};
            var o = a.encode || t;
            if (typeof o !== "function") {
                throw new TypeError("option encode is invalid");
            }
            if (!n.test(e)) {
                throw new TypeError("argument name is invalid");
            }
            var s = o(r);
            if (s && !n.test(s)) {
                throw new TypeError("argument val is invalid");
            }
            var p = e + "=" + s;
            if (null != a.maxAge) {
                var f = a.maxAge - 0;
                if (isNaN(f) || !isFinite(f)) {
                    throw new TypeError("option maxAge is invalid");
                }
                p += "; Max-Age=" + Math.floor(f);
            }
            if (a.domain) {
                if (!n.test(a.domain)) {
                    throw new TypeError("option domain is invalid");
                }
                p += "; Domain=" + a.domain;
            }
            if (a.path) {
                if (!n.test(a.path)) {
                    throw new TypeError("option path is invalid");
                }
                p += "; Path=" + a.path;
            }
            if (a.expires) {
                if (typeof a.expires.toUTCString !== "function") {
                    throw new TypeError("option expires is invalid");
                }
                p += "; Expires=" + a.expires.toUTCString();
            }
            if (a.httpOnly) {
                p += "; HttpOnly";
            }
            if (a.secure) {
                p += "; Secure";
            }
            if (a.sameSite) {
                var u = typeof a.sameSite === "string" ? a.sameSite.toLowerCase() : a.sameSite;
                switch(u){
                    case true:
                        p += "; SameSite=Strict";
                        break;
                    case "lax":
                        p += "; SameSite=Lax";
                        break;
                    case "strict":
                        p += "; SameSite=Strict";
                        break;
                    case "none":
                        p += "; SameSite=None";
                        break;
                    default:
                        throw new TypeError("option sameSite is invalid");
                }
            }
            return p;
        }
        function tryDecode(e, r) {
            try {
                return r(e);
            } catch (r) {
                return e;
            }
        }
    })();
    module.exports = e;
})();


/***/ }),

/***/ 535:
/***/ ((module) => {

"use strict";
// Note: This file is JS because it's used by the taskfile-swc.js file, which is JS.
// Keep file changes in sync with the corresponding `.d.ts` files.
/**
 * These are the browser versions that support all of the following:
 * static import: https://caniuse.com/es6-module
 * dynamic import: https://caniuse.com/es6-module-dynamic-import
 * import.meta: https://caniuse.com/mdn-javascript_operators_import_meta
 */ 
const MODERN_BROWSERSLIST_TARGET = [
    "chrome 64",
    "edge 79",
    "firefox 67",
    "opera 51",
    "safari 12"
];
module.exports = MODERN_BROWSERSLIST_TARGET; //# sourceMappingURL=modern-browserslist-target.js.map


/***/ }),

/***/ 545:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    withRequest: function() {
        return withRequest;
    },
    getTestReqInfo: function() {
        return getTestReqInfo;
    }
});
const _nodeasync_hooks = __webpack_require__(67);
const testStorage = new _nodeasync_hooks.AsyncLocalStorage();
function extractTestInfoFromRequest(req, reader) {
    const proxyPortHeader = reader.header(req, "next-test-proxy-port");
    if (!proxyPortHeader) {
        return undefined;
    }
    const url = reader.url(req);
    const proxyPort = Number(proxyPortHeader);
    const testData = reader.header(req, "next-test-data") || "";
    return {
        url,
        proxyPort,
        testData
    };
}
function withRequest(req, reader, fn) {
    const testReqInfo = extractTestInfoFromRequest(req, reader);
    if (!testReqInfo) {
        return fn();
    }
    return testStorage.run(testReqInfo, fn);
}
function getTestReqInfo(req, reader) {
    const testReqInfo = testStorage.getStore();
    if (testReqInfo) {
        return testReqInfo;
    }
    if (req && reader) {
        return extractTestInfoFromRequest(req, reader);
    }
    return undefined;
} //# sourceMappingURL=context.js.map


/***/ }),

/***/ 702:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(195)["Buffer"];

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    reader: function() {
        return reader;
    },
    handleFetch: function() {
        return handleFetch;
    },
    interceptFetch: function() {
        return interceptFetch;
    }
});
const _context = __webpack_require__(545);
const reader = {
    url (req) {
        return req.url;
    },
    header (req, name) {
        return req.headers.get(name);
    }
};
function getTestStack() {
    let stack = (new Error().stack ?? "").split("\n");
    // Skip the first line and find first non-empty line.
    for(let i = 1; i < stack.length; i++){
        if (stack[i].length > 0) {
            stack = stack.slice(i);
            break;
        }
    }
    // Filter out franmework lines.
    stack = stack.filter((f)=>!f.includes("/next/dist/"));
    // At most 5 lines.
    stack = stack.slice(0, 5);
    // Cleanup some internal info and trim.
    stack = stack.map((s)=>s.replace("webpack-internal:///(rsc)/", "").trim());
    return stack.join("    ");
}
async function buildProxyRequest(testData, request) {
    const { url, method, headers, body, cache, credentials, integrity, mode, redirect, referrer, referrerPolicy } = request;
    return {
        testData,
        api: "fetch",
        request: {
            url,
            method,
            headers: [
                ...Array.from(headers),
                [
                    "next-test-stack",
                    getTestStack()
                ]
            ],
            body: body ? Buffer.from(await request.arrayBuffer()).toString("base64") : null,
            cache,
            credentials,
            integrity,
            mode,
            redirect,
            referrer,
            referrerPolicy
        }
    };
}
function buildResponse(proxyResponse) {
    const { status, headers, body } = proxyResponse.response;
    return new Response(body ? Buffer.from(body, "base64") : null, {
        status,
        headers: new Headers(headers)
    });
}
async function handleFetch(originalFetch, request) {
    const testInfo = (0, _context.getTestReqInfo)(request, reader);
    if (!testInfo) {
        throw new Error(`No test info for ${request.method} ${request.url}`);
    }
    const { testData, proxyPort } = testInfo;
    const proxyRequest = await buildProxyRequest(testData, request);
    const resp = await originalFetch(`http://localhost:${proxyPort}`, {
        method: "POST",
        body: JSON.stringify(proxyRequest),
        next: {
            // @ts-ignore
            internal: true
        }
    });
    if (!resp.ok) {
        throw new Error(`Proxy request failed: ${resp.status}`);
    }
    const proxyResponse = await resp.json();
    const { api } = proxyResponse;
    switch(api){
        case "continue":
            return originalFetch(request);
        case "abort":
        case "unhandled":
            throw new Error(`Proxy request aborted [${request.method} ${request.url}]`);
        default:
            break;
    }
    return buildResponse(proxyResponse);
}
function interceptFetch(originalFetch) {
    __webpack_require__.g.fetch = function testFetch(input, init) {
        var _init_next;
        // Passthrough internal requests.
        // @ts-ignore
        if (init == null ? void 0 : (_init_next = init.next) == null ? void 0 : _init_next.internal) {
            return originalFetch(input, init);
        }
        return handleFetch(originalFetch, new Request(input, init));
    };
    return ()=>{
        __webpack_require__.g.fetch = originalFetch;
    };
} //# sourceMappingURL=fetch.js.map


/***/ }),

/***/ 503:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    interceptTestApis: function() {
        return interceptTestApis;
    },
    wrapRequestHandler: function() {
        return wrapRequestHandler;
    }
});
const _context = __webpack_require__(545);
const _fetch = __webpack_require__(702);
function interceptTestApis() {
    return (0, _fetch.interceptFetch)(__webpack_require__.g.fetch);
}
function wrapRequestHandler(handler) {
    return (req, fn)=>(0, _context.withRequest)(req, _fetch.reader, ()=>handler(req, fn));
} //# sourceMappingURL=server-edge.js.map


/***/ }),

/***/ 324:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    MODERN_BROWSERSLIST_TARGET: function() {
        return _modernbrowserslisttarget.default;
    },
    COMPILER_NAMES: function() {
        return COMPILER_NAMES;
    },
    INTERNAL_HEADERS: function() {
        return INTERNAL_HEADERS;
    },
    COMPILER_INDEXES: function() {
        return COMPILER_INDEXES;
    },
    PHASE_EXPORT: function() {
        return PHASE_EXPORT;
    },
    PHASE_PRODUCTION_BUILD: function() {
        return PHASE_PRODUCTION_BUILD;
    },
    PHASE_PRODUCTION_SERVER: function() {
        return PHASE_PRODUCTION_SERVER;
    },
    PHASE_DEVELOPMENT_SERVER: function() {
        return PHASE_DEVELOPMENT_SERVER;
    },
    PHASE_TEST: function() {
        return PHASE_TEST;
    },
    PHASE_INFO: function() {
        return PHASE_INFO;
    },
    PAGES_MANIFEST: function() {
        return PAGES_MANIFEST;
    },
    APP_PATHS_MANIFEST: function() {
        return APP_PATHS_MANIFEST;
    },
    APP_PATH_ROUTES_MANIFEST: function() {
        return APP_PATH_ROUTES_MANIFEST;
    },
    BUILD_MANIFEST: function() {
        return BUILD_MANIFEST;
    },
    APP_BUILD_MANIFEST: function() {
        return APP_BUILD_MANIFEST;
    },
    FUNCTIONS_CONFIG_MANIFEST: function() {
        return FUNCTIONS_CONFIG_MANIFEST;
    },
    SUBRESOURCE_INTEGRITY_MANIFEST: function() {
        return SUBRESOURCE_INTEGRITY_MANIFEST;
    },
    NEXT_FONT_MANIFEST: function() {
        return NEXT_FONT_MANIFEST;
    },
    EXPORT_MARKER: function() {
        return EXPORT_MARKER;
    },
    EXPORT_DETAIL: function() {
        return EXPORT_DETAIL;
    },
    PRERENDER_MANIFEST: function() {
        return PRERENDER_MANIFEST;
    },
    ROUTES_MANIFEST: function() {
        return ROUTES_MANIFEST;
    },
    IMAGES_MANIFEST: function() {
        return IMAGES_MANIFEST;
    },
    SERVER_FILES_MANIFEST: function() {
        return SERVER_FILES_MANIFEST;
    },
    DEV_CLIENT_PAGES_MANIFEST: function() {
        return DEV_CLIENT_PAGES_MANIFEST;
    },
    MIDDLEWARE_MANIFEST: function() {
        return MIDDLEWARE_MANIFEST;
    },
    DEV_MIDDLEWARE_MANIFEST: function() {
        return DEV_MIDDLEWARE_MANIFEST;
    },
    REACT_LOADABLE_MANIFEST: function() {
        return REACT_LOADABLE_MANIFEST;
    },
    FONT_MANIFEST: function() {
        return FONT_MANIFEST;
    },
    SERVER_DIRECTORY: function() {
        return SERVER_DIRECTORY;
    },
    CONFIG_FILES: function() {
        return CONFIG_FILES;
    },
    BUILD_ID_FILE: function() {
        return BUILD_ID_FILE;
    },
    BLOCKED_PAGES: function() {
        return BLOCKED_PAGES;
    },
    CLIENT_PUBLIC_FILES_PATH: function() {
        return CLIENT_PUBLIC_FILES_PATH;
    },
    CLIENT_STATIC_FILES_PATH: function() {
        return CLIENT_STATIC_FILES_PATH;
    },
    STRING_LITERAL_DROP_BUNDLE: function() {
        return STRING_LITERAL_DROP_BUNDLE;
    },
    NEXT_BUILTIN_DOCUMENT: function() {
        return NEXT_BUILTIN_DOCUMENT;
    },
    BARREL_OPTIMIZATION_PREFIX: function() {
        return BARREL_OPTIMIZATION_PREFIX;
    },
    CLIENT_REFERENCE_MANIFEST: function() {
        return CLIENT_REFERENCE_MANIFEST;
    },
    SERVER_REFERENCE_MANIFEST: function() {
        return SERVER_REFERENCE_MANIFEST;
    },
    MIDDLEWARE_BUILD_MANIFEST: function() {
        return MIDDLEWARE_BUILD_MANIFEST;
    },
    MIDDLEWARE_REACT_LOADABLE_MANIFEST: function() {
        return MIDDLEWARE_REACT_LOADABLE_MANIFEST;
    },
    CLIENT_STATIC_FILES_RUNTIME_MAIN: function() {
        return CLIENT_STATIC_FILES_RUNTIME_MAIN;
    },
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP: function() {
        return CLIENT_STATIC_FILES_RUNTIME_MAIN_APP;
    },
    APP_CLIENT_INTERNALS: function() {
        return APP_CLIENT_INTERNALS;
    },
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH: function() {
        return CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH;
    },
    CLIENT_STATIC_FILES_RUNTIME_AMP: function() {
        return CLIENT_STATIC_FILES_RUNTIME_AMP;
    },
    CLIENT_STATIC_FILES_RUNTIME_WEBPACK: function() {
        return CLIENT_STATIC_FILES_RUNTIME_WEBPACK;
    },
    CLIENT_STATIC_FILES_RUNTIME_POLYFILLS: function() {
        return CLIENT_STATIC_FILES_RUNTIME_POLYFILLS;
    },
    CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL: function() {
        return CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL;
    },
    EDGE_RUNTIME_WEBPACK: function() {
        return EDGE_RUNTIME_WEBPACK;
    },
    STATIC_PROPS_ID: function() {
        return STATIC_PROPS_ID;
    },
    SERVER_PROPS_ID: function() {
        return SERVER_PROPS_ID;
    },
    PAGE_SEGMENT_KEY: function() {
        return PAGE_SEGMENT_KEY;
    },
    GOOGLE_FONT_PROVIDER: function() {
        return GOOGLE_FONT_PROVIDER;
    },
    OPTIMIZED_FONT_PROVIDERS: function() {
        return OPTIMIZED_FONT_PROVIDERS;
    },
    DEFAULT_SERIF_FONT: function() {
        return DEFAULT_SERIF_FONT;
    },
    DEFAULT_SANS_SERIF_FONT: function() {
        return DEFAULT_SANS_SERIF_FONT;
    },
    STATIC_STATUS_PAGES: function() {
        return STATIC_STATUS_PAGES;
    },
    TRACE_OUTPUT_VERSION: function() {
        return TRACE_OUTPUT_VERSION;
    },
    TURBO_TRACE_DEFAULT_MEMORY_LIMIT: function() {
        return TURBO_TRACE_DEFAULT_MEMORY_LIMIT;
    },
    RSC_MODULE_TYPES: function() {
        return RSC_MODULE_TYPES;
    },
    EDGE_UNSUPPORTED_NODE_APIS: function() {
        return EDGE_UNSUPPORTED_NODE_APIS;
    },
    SYSTEM_ENTRYPOINTS: function() {
        return SYSTEM_ENTRYPOINTS;
    }
});
const _interop_require_default = __webpack_require__(546);
const _modernbrowserslisttarget = /*#__PURE__*/ _interop_require_default._(__webpack_require__(575));
const COMPILER_NAMES = {
    client: "client",
    server: "server",
    edgeServer: "edge-server"
};
const INTERNAL_HEADERS = [
    "x-invoke-error",
    "x-invoke-output",
    "x-invoke-path",
    "x-invoke-query",
    "x-invoke-status",
    "x-middleware-invoke"
];
const COMPILER_INDEXES = {
    [COMPILER_NAMES.client]: 0,
    [COMPILER_NAMES.server]: 1,
    [COMPILER_NAMES.edgeServer]: 2
};
const PHASE_EXPORT = "phase-export";
const PHASE_PRODUCTION_BUILD = "phase-production-build";
const PHASE_PRODUCTION_SERVER = "phase-production-server";
const PHASE_DEVELOPMENT_SERVER = "phase-development-server";
const PHASE_TEST = "phase-test";
const PHASE_INFO = "phase-info";
const PAGES_MANIFEST = "pages-manifest.json";
const APP_PATHS_MANIFEST = "app-paths-manifest.json";
const APP_PATH_ROUTES_MANIFEST = "app-path-routes-manifest.json";
const BUILD_MANIFEST = "build-manifest.json";
const APP_BUILD_MANIFEST = "app-build-manifest.json";
const FUNCTIONS_CONFIG_MANIFEST = "functions-config-manifest.json";
const SUBRESOURCE_INTEGRITY_MANIFEST = "subresource-integrity-manifest";
const NEXT_FONT_MANIFEST = "next-font-manifest";
const EXPORT_MARKER = "export-marker.json";
const EXPORT_DETAIL = "export-detail.json";
const PRERENDER_MANIFEST = "prerender-manifest.json";
const ROUTES_MANIFEST = "routes-manifest.json";
const IMAGES_MANIFEST = "images-manifest.json";
const SERVER_FILES_MANIFEST = "required-server-files.json";
const DEV_CLIENT_PAGES_MANIFEST = "_devPagesManifest.json";
const MIDDLEWARE_MANIFEST = "middleware-manifest.json";
const DEV_MIDDLEWARE_MANIFEST = "_devMiddlewareManifest.json";
const REACT_LOADABLE_MANIFEST = "react-loadable-manifest.json";
const FONT_MANIFEST = "font-manifest.json";
const SERVER_DIRECTORY = "server";
const CONFIG_FILES = [
    "next.config.js",
    "next.config.mjs"
];
const BUILD_ID_FILE = "BUILD_ID";
const BLOCKED_PAGES = [
    "/_document",
    "/_app",
    "/_error"
];
const CLIENT_PUBLIC_FILES_PATH = "public";
const CLIENT_STATIC_FILES_PATH = "static";
const STRING_LITERAL_DROP_BUNDLE = "__NEXT_DROP_CLIENT_FILE__";
const NEXT_BUILTIN_DOCUMENT = "__NEXT_BUILTIN_DOCUMENT__";
const BARREL_OPTIMIZATION_PREFIX = "__barrel_optimize__";
const CLIENT_REFERENCE_MANIFEST = "client-reference-manifest";
const SERVER_REFERENCE_MANIFEST = "server-reference-manifest";
const MIDDLEWARE_BUILD_MANIFEST = "middleware-build-manifest";
const MIDDLEWARE_REACT_LOADABLE_MANIFEST = "middleware-react-loadable-manifest";
const CLIENT_STATIC_FILES_RUNTIME_MAIN = "main";
const CLIENT_STATIC_FILES_RUNTIME_MAIN_APP = "" + CLIENT_STATIC_FILES_RUNTIME_MAIN + "-app";
const APP_CLIENT_INTERNALS = "app-pages-internals";
const CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = "react-refresh";
const CLIENT_STATIC_FILES_RUNTIME_AMP = "amp";
const CLIENT_STATIC_FILES_RUNTIME_WEBPACK = "webpack";
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS = "polyfills";
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL = Symbol(CLIENT_STATIC_FILES_RUNTIME_POLYFILLS);
const EDGE_RUNTIME_WEBPACK = "edge-runtime-webpack";
const STATIC_PROPS_ID = "__N_SSG";
const SERVER_PROPS_ID = "__N_SSP";
const PAGE_SEGMENT_KEY = "__PAGE__";
const GOOGLE_FONT_PROVIDER = "https://fonts.googleapis.com/";
const OPTIMIZED_FONT_PROVIDERS = [
    {
        url: GOOGLE_FONT_PROVIDER,
        preconnect: "https://fonts.gstatic.com"
    },
    {
        url: "https://use.typekit.net",
        preconnect: "https://use.typekit.net"
    }
];
const DEFAULT_SERIF_FONT = {
    name: "Times New Roman",
    xAvgCharWidth: 821,
    azAvgWidth: 854.3953488372093,
    unitsPerEm: 2048
};
const DEFAULT_SANS_SERIF_FONT = {
    name: "Arial",
    xAvgCharWidth: 904,
    azAvgWidth: 934.5116279069767,
    unitsPerEm: 2048
};
const STATIC_STATUS_PAGES = [
    "/500"
];
const TRACE_OUTPUT_VERSION = 1;
const TURBO_TRACE_DEFAULT_MEMORY_LIMIT = 6000;
const RSC_MODULE_TYPES = {
    client: "client",
    server: "server"
};
const EDGE_UNSUPPORTED_NODE_APIS = [
    "clearImmediate",
    "setImmediate",
    "BroadcastChannel",
    "ByteLengthQueuingStrategy",
    "CompressionStream",
    "CountQueuingStrategy",
    "DecompressionStream",
    "DomException",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "ReadableByteStreamController",
    "ReadableStreamBYOBRequest",
    "ReadableStreamDefaultController",
    "TransformStreamDefaultController",
    "WritableStreamDefaultController"
];
const SYSTEM_ENTRYPOINTS = new Set([
    CLIENT_STATIC_FILES_RUNTIME_MAIN,
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH,
    CLIENT_STATIC_FILES_RUNTIME_AMP,
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP
]);
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=constants.js.map


/***/ }),

/***/ 575:
/***/ ((module) => {

"use strict";
// Note: This file is JS because it's used by the taskfile-swc.js file, which is JS.
// Keep file changes in sync with the corresponding `.d.ts` files.
/**
 * These are the browser versions that support all of the following:
 * static import: https://caniuse.com/es6-module
 * dynamic import: https://caniuse.com/es6-module-dynamic-import
 * import.meta: https://caniuse.com/mdn-javascript_operators_import_meta
 */ 
const MODERN_BROWSERSLIST_TARGET = [
    "chrome 64",
    "edge 79",
    "firefox 67",
    "opera 51",
    "safari 12"
];
module.exports = MODERN_BROWSERSLIST_TARGET; //# sourceMappingURL=modern-browserslist-target.js.map


/***/ }),

/***/ 546:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ _interop_require_default),
/* harmony export */   _interop_require_default: () => (/* binding */ _interop_require_default)
/* harmony export */ });
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}



/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(738));
/******/ (_ENTRIES = typeof _ENTRIES === "undefined" ? {} : _ENTRIES).middleware_middleware = __webpack_exports__;
/******/ }
]);
//# sourceMappingURL=middleware.js.map