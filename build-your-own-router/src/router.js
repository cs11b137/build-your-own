export class Router {
  constructor(options) {
    this.options = options || {};
    this.mode = this.options.mode || "hash";
    this.routes = {};
    this.curUrl = "";
    if (this.mode === "history") {
      this.trackHistory();
    } else {
      this.trackHash();
    }
  }

  trackHash() {
    window.addEventListener("hashchange", () => this.hashHandler());
    window.addEventListener("load", () => this.hashHandler());
  }

  hashHandler() {
    this.curUrl = window.location.hash.slice(1) || "/";
    this.routes[this.curUrl]();
  }

  trackHistory() {
    window.addEventListener("popstate", () => this.historyHandler());
    window.addEventListener("load", () => this.historyHandler());
  }

  historyHandler() {
    this.curUrl = window.location.pathname;
    this.routes[this.curUrl]();
  }

  route(url, fn) {
    this.routes[url] = fn || function () {};
  }

  push(url) {
    if (this.mode === "history") {
      window.history.pushState({}, "", url);
      this.routes[url]();
    } else {
      url = `#${url}`;
      window.location.hash = url;
    }
  }

  replace(url) {
    if (this.mode === "history") {
      window.history.replaceState({}, "", url);
      this.routes[url]();
    } else {
      url = `#${url}`;
      window.location.replace(url);
    }
  }
}
