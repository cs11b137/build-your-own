//
// element 对象结构
//
let element = {
  type: "div",
  props: {
    className: "foo",
    onClick: () => {},
    children: [],
  },
};

//
// fiber 对象结构
//
let fiber = {
  tag: "HOST_COMPONENT",
  type: "div",
  props: {
    className: "foo",
    children: [],
  },
  parent: parentFiber,
  child: childFiber,
  sibling: null,
  alternate: currentFiber,
  stateNode: document.createElement("div"),
  parialState: null,
  effectTag: PLACEMENT,
  effects: [],
};
