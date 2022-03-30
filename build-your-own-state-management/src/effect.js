let activeEffect;
const targetMap = new WeakMap();

export function track(target, type, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }

    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }

    deps.add(activeEffect);
  }
}

export function trigger(target, type, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return false;
  }

  const deps = depsMap.get(key);
  if (!deps) {
    return false;
  }

  deps.forEach((dep) => dep());
}

export function setActiveEffect(fn) {
  activeEffect = fn;
}
