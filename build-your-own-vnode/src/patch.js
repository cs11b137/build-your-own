/**
 * diff算法：对比两个vnode，修改变化的地方
 */

import { mount } from "./mount";
import { unmount } from "./unmount";

export function patch(vnode1, vnode2) {
  const element = (vnode2.element = vnode1.element);

  if (vnode1.tag !== vnode2.tag) {
    mount(vnode2, element.parentNode);
    unmount(vnode1);
  } else {
    if (typeof vnode2.children == "string") {
      if (vnode2.children !== vnode1.children) {
        element.textContent = vnode2.children;
      }
    } else {
      const children1 = vnode1.children;
      const children2 = vnode2.children;
      const commonLen = Math.min(children1.length, children2.length);

      for (let i = 0; i < commonLen; i++) {
        patch(children1[i], children2[i]);
      }

      if (children1.length > children2.length) {
        children1.slice(children2.length).forEach((child) => {
          unmount(child);
        });
      }

      if (children2.length > children1.length) {
        children2.slice(children1.length).forEach((child) => {
          mount(child, element);
        });
      }
    }
  }
}
