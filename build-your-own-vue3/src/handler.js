import { track, trigger } from "./effect";
import { isObject } from "./util";
import { reactive } from "./reactive";

function createGetter(target, key, receiver) {
  if (key === "__isProxy") {
    return true;
  }

  const res = Reflect.get(target, key, receiver);

  if (isObject(res)) {
    return reactive(res);
  }

  track(target, "get", key);

  return res;
}

function createSetter(target, key, value, receiver) {
  const hasKey = Reflect.has(target, key);
  const oldValue = Reflect.get(target, key);
  const result = Reflect.set(target, key, value, receiver);
  if (!hasKey) {
    trigger(target, "add", key);
  } else if (oldValue !== result) {
    trigger(target, "set", key);
  }

  return result;
}

function createDeleteProperty(target, key, receiver) {
  trigger(target, "delete", key);
  const result = Reflect.deleteProperty(target, key);

  return result;
}

export const mutableHandler = {
  get: createGetter,
  set: createSetter,
  deleteProperty: createDeleteProperty,
};
