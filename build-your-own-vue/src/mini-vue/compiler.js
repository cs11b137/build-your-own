import VNode from "./vnode";
import Watcher from "./watcher";

export default class Compiler {
  constructor(vm) {
    this.vm = vm;
    this.compileToFunctions();
    new Watcher(vm, this.updateComponent, true, null);
  }

  compileToFunctions() {
    const vm = this.vm;
    const template = vm.$options.template;
    const data = vm.$options.data;
    const h = () => {
      const vnode = new VNode("div", { class: "container" }, [
        new VNode("h1", null, data.firstName),
        new VNode("p", null, data.arr[0]),
      ]);

      return vnode;
    };
    vm.$options.h = h;
  }

  updateComponent() {
    const vm = this.vm;
    update(vm);
  }
}

export function render(vm) {
  const { h } = vm.$options;
  const vnode = h();
  return vnode;
}

export function update(vm) {
  const newvnode = render(vm);

  if (vm.vnode) {
    const prevnode = vm.vnode;
    patch(prevnode, newvnode);
  } else {
    const el = vm.$options.el.slice(1);
    const container = document.getElementById(el);
    mount(newvnode, container);
    vm.vnode = newvnode;
  }
}

export function patch(n1, n2) {
  const el = (n2.el = n1.el);

  if (n1.tag !== n2.tag) {
    mount(n2, el.parentNode);
    unmount(n1);
  } else {
    if (typeof n2.children === "string") {
      el.textContent = n2.children;
    } else {
      if (typeof n1.children === "string") {
        el.textContent = "";
        n2.children.forEach((child) => mount(child, el));
      } else {
        const c1 = n1.children;
        const c2 = n2.children;
        const commonLength = Math.min(c1.length, c2.length);

        for (let i = 0; i < commonLength; i++) {
          patch(c1[i], c2[i]);
        }

        if (c1.length > c2.length) {
          c1.slice(c2.length).forEach((child) => {
            unmount(child);
          });
        } else if (c2.length > c1.length) {
          c2.slice(c1.length).forEach((child) => {
            mount(child, el);
          });
        }
      }
    }
  }
}

export function unmount(vnode) {
  vnode.el.parentNode.removeChild(vnode.el);
}

export function mount(vnode, container) {
  const el = (vnode.el = document.createElement(vnode.tag));

  for (const key in vnode.props) {
    el.setAttribute(key, vnode.props[key]);
  }

  if (typeof vnode.children === "string") {
    el.textContent = vnode.children;
  } else {
    vnode.children.forEach((child) => {
      mount(child, el);
    });
  }

  container.appendChild(el);
}
