import { mutableHandler } from "./handler";
import { isObject } from "./util";

const reactiveMap = new WeakMap();

export function reactive(target) {
  return createReactiveObject(target, mutableHandler, reactiveMap);
}

function createReactiveObject(target, handler, proxyMap) {
  if (!isObject(target)) {
    return target;
  }

  if (target.__isProxy) {
    return target;
  }

  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  const proxy = new Proxy(target, handler);
  proxyMap.set(target, proxy);

  return proxy;
}
