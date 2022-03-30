import { trigger, track, setActiveEffect } from "./effect";

export class Store {
  constructor(options) {
    this.state = {};
    this.actions = {};
    this.mutations = {};
    this.status = "resting";
    this._target = options.state || {};
    this._init(options);
  }

  _init(options) {
    const self = this;

    if (Reflect.has(options, "actions")) {
      this.actions = options.actions;
    }

    if (Reflect.has(options, "mutations")) {
      this.mutations = options.mutations;
    }

    this.state = new Proxy(this._target, {
      set(target, key, value, receiver) {
        target[key] = value;

        trigger(target, "stateChange", "");

        if (self.status !== "mutation") {
          console.warn(`You should use a mutation to set ${key}`);
          return false;
        }

        self.status = "resting";

        return true;
      },
    });
  }

  effect(fn) {
    setActiveEffect(fn);
    track(this._target, "stateChange", "");
    setActiveEffect(null);
  }

  getState() {
    return this.state;
  }

  dispatch(actionKey, payload) {
    if (typeof this.actions[actionKey] !== "function") {
      console.error(`Actions: ${actionKey} doesn't exist`);
      return false;
    }

    this.status = "action";

    this.actions[actionKey](this, payload);

    return true;
  }

  commit(mutationKey, payload) {
    if (typeof this.mutations[mutationKey] !== "function") {
      console.error(`Mutations: ${mutationKey} doesn't exist`);
      return false;
    }

    this.status = "mutation";

    this.mutations[mutationKey](this.state, payload);

    return true;
  }
}

export default function createStore(options) {
  return new Store(options);
}
