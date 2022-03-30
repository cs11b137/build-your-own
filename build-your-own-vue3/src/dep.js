// 另一种依赖收集

import { activeEffect } from "./effect";

export class Dep {
  constructor() {
    this.subs = new Set();
  }

  addSub(sub) {
    if (activeEffect) {
      this.subs.add(sub);
    }
  }

  depend() {
    this.addSub();
  }

  notify() {
    this.subs.forEach((sub) => sub());
  }
}
