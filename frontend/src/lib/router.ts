/**
 * Minimal client-side SPA router.
 *
 * Uses the History API (pushState / popstate) to handle navigation without
 * full-page reloads. Route handlers receive any named parameters extracted
 * from the URL path.
 */

/** Named URL parameters extracted from a route pattern. */
export type RouteParams = Record<string, string>;

/** Function called when a route matches; receives extracted params. */
export type RouteHandler = (params: RouteParams) => void;

interface Route {
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

/** Base path used by Vite during build (e.g. `/repo-name/` on GitHub Pages). */
const BASE_PATH = (() => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  if (baseUrl === '/') {
    return '';
  }
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
})();

/** Adds the configured base path to an app-relative path. */
function withBase(path: string): string {
  if (!BASE_PATH) {
    return path;
  }
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Removes the configured base path from a browser pathname for route matching. */
function stripBase(path: string): string {
  if (!BASE_PATH) {
    return path || '/';
  }
  if (path.startsWith(BASE_PATH)) {
    return path.slice(BASE_PATH.length) || '/';
  }
  return path || '/';
}

/**
 * Converts a route pattern string such as `/contract/:id` into a RegExp
 * and returns the named parameter list alongside it.
 */
function compileRoute(pattern: string): {
  regex: RegExp;
  paramNames: string[];
} {
  const paramNames: string[] = [];
  // Tokenize on :paramName placeholders.
  // Even-indexed tokens are static segments; odd-indexed tokens are param names.
  const tokens = pattern.split(/:([a-zA-Z_][a-zA-Z0-9_]*)/);
  const regexParts: string[] = [];
  tokens.forEach((token, index) => {
    if (index % 2 === 0) {
      // Static segment — escape ALL regex metacharacters (including backslash)
      // so that a user-supplied pattern cannot inject regex syntax.
      regexParts.push(token.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'));
    } else {
      // Named capture group
      paramNames.push(token);
      regexParts.push('([^/]+)');
    }
  });
  return {
    regex: new RegExp(`^${regexParts.join('')}$`),
    paramNames,
  };
}

/** Registered routes list. */
const routes: Route[] = [];

/** Default fallback handler. */
function defaultNotFoundHandler() {
  console.warn('[router] No route matched for', currentPath());
}

/** Fallback handler called when no route matches the current path. */
let notFoundHandler: RouteHandler = defaultNotFoundHandler;

/** Named popstate handler to enable idempotent start and clean teardown. */
function onPopstate() {
  dispatch(currentPath());
}

/** Whether the popstate listener has been registered. */
let started = false;

/**
 * Reset all registered routes and restore the default not-found handler.
 * Removes the popstate listener if it was registered.
 * Call this before re-initialising the router (e.g. in tests or StrictMode remounts).
 */
export function resetRouter(): void {
  routes.length = 0;
  notFoundHandler = defaultNotFoundHandler;
  if (started) {
    window.removeEventListener('popstate', onPopstate);
    started = false;
  }
}

/**
 * Register a route pattern with a handler.
 *
 * @param pattern - URL pattern, e.g. `/`, `/explore`, `/contract/:id`
 * @param handler - Function invoked when the pattern matches
 */
export function route(pattern: string, handler: RouteHandler): void {
  const { regex, paramNames } = compileRoute(pattern);
  routes.push({ pattern: regex, paramNames, handler });
}

/**
 * Set a handler for unmatched routes (404 equivalent).
 */
export function setNotFound(handler: RouteHandler): void {
  notFoundHandler = handler;
}

/** Returns the current pathname (without query string or hash). */
function currentPath(): string {
  return stripBase(window.location.pathname || '/');
}

/** Match the given path against registered routes and invoke the handler. */
function dispatch(path: string): void {
  for (const { pattern, paramNames, handler } of routes) {
    const match = pattern.exec(path);
    if (match) {
      const params: RouteParams = {};
      paramNames.forEach((name, i) => {
        params[name] = decodeURIComponent(match[i + 1] ?? '');
      });
      handler(params);
      return;
    }
  }
  notFoundHandler({});
}

/**
 * Navigate to a new path by pushing a history entry.
 *
 * @param path - The target pathname, e.g. `/explore`
 */
export function navigate(path: string): void {
  window.history.pushState(null, '', withBase(path));
  dispatch(path);
}

/**
 * Start the router: listen for popstate events and dispatch the current path.
 * Idempotent — the popstate listener is registered only once regardless of how
 * many times this function is called.
 */
export function startRouter(): void {
  if (!started) {
    started = true;
    window.addEventListener('popstate', onPopstate);
  }
  dispatch(currentPath());
}
