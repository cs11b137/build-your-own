/**
 * 移除vnode对应dom
 */

export function unmount(vnode) {
  vnode.element.parentNode.removeChild(vnode.element);
}
