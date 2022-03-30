export default class Dep {
  static target = null;

  constructor() {
    this.subs = new Set();
  }

  addSub(sub) {
    this.subs.add(sub);
  }

  removeSub(sub) {
    this.subs.delete(sub);
  }

  depend() {
    if (Dep.target) {
      this.addSub(Dep.target);
    }
  }

  notify() {
    this.subs.forEach((sub) => sub.update());
  }
}
