import { TEXT_ELEMENT } from "./constants";

//
// 创建element对象
//
export function createElement(type, config, ...args) {
  const props = Object.assign({}, config);
  const rawChildren = args.length > 0 ? [].concat(args) : [];
  props.children = rawChildren
    .filter((c) => c !== null && c !== false)
    .map((c) => (c instanceof Object ? c : createTextElement(c)));
  const o = {
    type,
    props,
  };
  console.log(o);
  return {
    type,
    props,
  };
}

// 创建文本类型element对象
export function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}
