import Dep from "./dep";

const originalProto = Array.prototype;
const arrayProto = Object.create(null);
const arrayMethods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "sort",
  "splice",
  "reverse",
];

arrayMethods.forEach((method) => {
  arrayProto[method] = function () {
    originalProto[method].call(this, arguments);
    this.dep.notify();
    console.log("array mutation");
  };
});

export default class Observer {
  constructor(value = {}) {
    this.value = value;
    this.dep = new Dep();
    this.walk(value);
  }

  walk(obj) {
    for (const key in obj) {
      defineReactive(obj, key, obj[key]);
    }
  }
}

export function defineReactive(obj, key, val) {
  const dep = new Dep();
  if (Array.isArray(val)) {
    val.dep = dep;
  }
  observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend();
      }
      return val;
    },
    set(newVal) {
      if (val === newVal) {
        return;
      }
      observe(newVal);
      val = newVal;
      dep.notify();
    },
  });
}

export function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return;
  }

  if (Array.isArray(obj)) {
    obj.__proto__ = arrayProto;
    for (let i = 0; i < obj.length; i++) {
      observe(obj[i]);
    }
  }

  for (const key in obj) {
    defineReactive(obj, key, obj[key]);
  }
}
