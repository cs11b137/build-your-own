import { setActiveEffect } from "./effect";

export function computed(fn) {
  let dirty = true;
  let value;
  fn.lazy = function () {
    dirty = true;
  };

  return {
    get value() {
      if (dirty) {
        setActiveEffect(fn);
        value = fn();
        setActiveEffect(null);
        dirty = false;
      }

      return value;
    },
  };
}
