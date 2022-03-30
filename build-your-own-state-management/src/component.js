import { Store } from "./store";

export default class Component {
  constructor(props = {}) {
    this.render = this.render || function () {};
    this.store = props.store;

    if (props.store instanceof Store) {
      this.store.effect(() => this.render());
    }

    if (Reflect.has(props, "element")) {
      this.element = props.element;
    }
  }
}
