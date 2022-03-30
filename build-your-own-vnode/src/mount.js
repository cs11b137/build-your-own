/**
 * 递归vnode，生成dom
 */

export function mount(vnode, container) {
  const element = (vnode.element = document.createElement(vnode.tag));

  Object.entries(vnode.props || {}).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  if (typeof vnode.children === "string") {
    element.textContent = vnode.children;
  } else {
    vnode.children.forEach((child) => {
      mount(child, element);
    });
  }

  container.appendChild(element);
}
