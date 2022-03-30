import { TEXT_ELEMENT } from "./constants";

// 判断是否为事件属性
const isEvent = (name) => name.startsWith("on");

// 判断是否为特性属性
const isAttribute = (name) =>
  !isEvent(name) && name !== "children" && name !== "style";

// 判断是否为新增的属性
const isNew = (prev, next) => (key) => prev[key] !== next[key];

// 判断是否为移除的属性
const isGone = (prev, next) => (key) => !(key in next);

//
// 更新dom节点上的属性
//
export function updateDomProperties(dom, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLocaleLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  Object.keys(prevProps)
    .filter(isAttribute)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = null;
    });

  Object.keys(nextProps)
    .filter(isAttribute)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  prevProps.style = prevProps.style || {};
  nextProps.style = nextProps.style || {};
  Object.keys(nextProps.style)
    .filter(isNew(prevProps.style, nextProps.style))
    .forEach((key) => {
      dom.style[key] = nextProps.style[key];
    });
  Object.keys(prevProps.style)
    .filter(isGone(prevProps, nextProps))
    .forEach((key) => {
      dom.style[key] = "";
    });

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLocaleLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

//
// 创建dom节点
//
export function createDomElement(fiber) {
  const isTextElement = fiber.type === TEXT_ELEMENT;
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(fiber.type);
  updateDomProperties(dom, [], fiber.props);
  return dom;
}
