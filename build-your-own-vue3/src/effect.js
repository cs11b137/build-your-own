export let activeEffect;

export function setActiveEffect(effect) {
  activeEffect = effect;
}

const targetMap = new WeakMap();

export function watchEffect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

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
    return;
  }

  const deps = depsMap.get(key);
  if (deps) {
    deps.forEach((dep) => {
      if (dep.lazy) {
        dep.lazy();
      } else {
        dep();
      }
    });
  }

  if (type === "add") {
    const lengthDeps = depsMap.get("length");
    lengthDeps.forEach((dep) => dep());
  }
}
