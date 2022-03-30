import { track, trigger } from "./effect";

export function ref(val) {
  const obj = {
    get value() {
      track(obj, "get", "");

      return val;
    },
    set value(newVal) {
      if (newVal === val) {
        return;
      }
      val = newVal;
      trigger(obj, "set", "");
    },
  };

  return obj;
}
