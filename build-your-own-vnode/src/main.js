/**
 * 示例
 */

import { h } from "./h";
import { mount } from "./mount";
import { patch } from "./patch";

// 创建虚拟dom
const vnode1 = h("div", { id: "comment" }, [
  h("h1", { class: "title" }, "这是一个标题"),
  h("p", { class: "decsription" }, "这是一段描述"),
]);

const container = document.getElementById("app");

// 初次渲染dom
mount(vnode1, container);

// 延迟1s更新
setTimeout(() => {
  const vnode2 = h("div", { id: "comment" }, [
    h("h2", { class: "title" }, "这是一个二级标题"),
    h("p", { class: "decsription" }, "这是一段描述"),
    h("span", { class: "tips" }, "这是一个小提示"),
  ]);

  // 对比更新dom
  patch(vnode1, vnode2);
}, 1000);
