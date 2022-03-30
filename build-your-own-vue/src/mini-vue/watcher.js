import Dep from "./dep";

export default class Watcher {
  constructor(vm, expOrFn, isRenderWatcher, cb) {
    this.vm = vm;
    this.isRenderWatcher = isRenderWatcher || false;
    this.expression = expOrFn.toString();
    this.cb = cb;
    this.getter = expOrFn;
    this.value = this.get();
  }

  get() {
    Dep.target = this;
    this.vm.watchers.add(this);
    let value;
    const vm = this.vm;
    if (this.isRenderWatcher) {
      this.vm.watcher = this;
      value = this.getter();
    } else if (typeof this.getter !== "function") {
      const exp = this.getter;
      value = this.vm[exp];
    } else {
      value = this.getter.call(vm);
    }
    Dep.target = null;
    return value;
  }

  update() {
    const value = this.get();
    if (value !== this.value) {
      const oldValue = this.value;
      this.value = value;
      this.cb.call(this.vm, value);
    }
    // this.cb.call(this.vm, value, oldValue);
  }
}
