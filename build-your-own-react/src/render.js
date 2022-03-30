import { createPublicInstance } from "./component";

let rootInstance = null;

//
// 生成vnode节点和dom节点
//
export function render(element, container) {
  const prevInstance = rootInstance;
  const newInstance = reconcile(prevInstance, element, container);
  rootInstance = newInstance;
}

//
// 对比更新vnode和dom
//
export function reconcile(prevInstance, element, container) {
  if (prevInstance == null) {
    const newInstance = instantiate(element);
    container.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    container.removeChild(prevInstance.dom);
    return null;
  } else if (typeof element.type === "string") {
    updateDomProperties(
      prevInstance.dom,
      prevInstance.element.props,
      element.props
    );
    prevInstance.element = element;
    prevInstance.childInstances = reconcileChildren(prevInstance, element);
    return prevInstance;
  } else if (prevInstance.element.type !== element.type) {
    const newInstance = instantiate(element);
    container.replaceChild(newInstance.dom, prevInstance.dom);
    return newInstance;
  } else {
    prevInstance.publicInstance.props = element.props;
    const childElement = prevInstance.publicInstance.render();
    const oldChildInstance = prevInstance.childInstance;
    const childInstance = reconcile(oldChildInstance, childElement, container);

    prevInstance.dom = childInstance.dom;
    prevInstance.childInstance = childInstance;
    prevInstance.element = element;

    return prevInstance;
  }
}

//
// 对比相同vnode的子节点
//
export function reconcileChildren(prevInstance, element) {
  const dom = prevInstance.dom;
  const childInstances = prevInstance.childInstances;
  const nextChildrenElements = element.props.children || [];
  const newChildInstances = [];

  const count = Math.max(childInstances.length, nextChildrenElements.length);

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildrenElements[i];

    const newChildInstance = reconcile(childInstance, childElement, dom);
    newChildInstances.push(newChildInstance);
  }

  return newChildInstances.filter((instance) => instance != null);
}

//
// 创建vnode节点实例对象
//
export function instantiate(element) {
  const { type, props } = element;
  const isDomElement = typeof type === "string";

  if (isDomElement) {
    const isTextElement = type === "TEXT ELEMENT";

    const dom = isTextElement
      ? document.createTextNode("")
      : document.createElement(type);

    updateDomProperties(dom, [], props);

    // set childrens
    const childrens = props.children || [];
    const childInstances = childrens.map(instantiate);
    const childDoms = childInstances.map((c) => c.dom);
    childDoms.forEach((c) => dom.appendChild(c));

    return {
      element,
      dom,
      childInstances,
    };
  } else {
    let instance = {};

    const publicInstance = createPublicInstance(element, instance);

    const childElement = publicInstance.render();
    const childInstance = instantiate(childElement);
    const dom = childInstance.dom;

    instance = Object.assign(instance, {
      dom,
      element,
      childInstance,
      publicInstance,
    });

    return instance;
  }
}

//
// 更新dom节点的属性
//
export function updateDomProperties(dom, prevProps, nextProps) {
  const isEvent = (name) => name.startsWith("on");
  const isAttribute = (name) => !isEvent(name) && name !== "children";

  Object.keys(prevProps)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLocaleLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  Object.keys(prevProps)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = null;
    });

  Object.keys(nextProps)
    .filter(isAttribute)
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  Object.keys(nextProps)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLocaleLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
