import Observer, { defineReactive } from "./observer";
import Compiler from "./compiler";
import Watcher from "./watcher";

export default class Vue {
  static config = {
    async: true,
    devtools: true,
    errorHandler: null,
    _lifecycleHooks: [
      "beforeCreate",
      "created",
      "beforeMount",
      "mounted",
      "beforeUpdate",
      "updated",
      "beforeDestroy",
      "destroyed",
      "activated",
      "deactivated",
      "errorCaptured",
      "serverPrefetch",
    ],
  };
  static util = {
    extend: function extend(to, _from) {},
    mergeOptions: function mergeOptions(parent, child, vm) {},
    defineReactive: function defineReactive(
      obj,
      key,
      val,
      customSetter,
      shadow
    ) {},
  };
  static options = {
    components: {
      KeepAlive: {},
      Transition: {},
      TransitionGroup: {},
    },
    directives: {
      model: {},
      show: {},
    },
    filters: {},
    _base: Vue,
  };
  static set = function (target, key, val) {};
  static delete = function del(target, key) {};
  static nextTick = function nextTick(cb, ctx) {};
  static observable = function (obj) {};
  static use = function (plugin) {};
  static mixin = function (mixin) {};
  static extend = function (extendOptions) {};
  static component = function (id, definition) {};
  static directive = function (id, definition) {};
  static filter = function (id, definition) {};

  constructor(options = {}) {
    this._init(options);
  }

  _init(options) {
    const vm = this;

    // mergeOptions
    vm.$options = {
      ...options,
      _base: Vue,
    };

    vm.vnode = null;
    vm.watcher = null;
    vm.watchers = new Set();

    // global api
    vm.$set = function (obj, key, val) {
      defineReactive(obj, key, val);
    };

    // initState
    const methods = vm.$options.methods;
    for (const key in methods) {
      vm[key] =
        typeof methods[key] !== "function" ? null : methods[key].bind(vm);
    }

    const data = vm.$options.data;
    new Observer(data);
    Object.keys(data).forEach((key) => {
      Object.defineProperty(vm, key, {
        get() {
          return data[key];
        },
        set(newVal) {
          data[key] = newVal;
        },
      });
    });

    const computed = vm.$options.computed;
    for (const key in computed) {
      const getter = computed[key];
      new Watcher(vm, getter, false, function (val) {
        vm[key] = val;
      });
    }
    Object.keys(computed).forEach((key) => {
      const f = computed[key];
      let val = f.call(vm);
      Object.defineProperty(vm, key, {
        get() {
          return val;
        },
        set(newVal) {
          val = newVal;
        },
      });
    });

    const watch = vm.$options.watch;
    for (const key in watch) {
      const f = watch[key];
      new Watcher(vm, key, false, function (value) {
        f.call(vm);
      });
    }

    new Compiler(vm);
  }
}
