export function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

export function hasOwn(obj, key) {
  return obj.hasOwnProperty(key);
}
