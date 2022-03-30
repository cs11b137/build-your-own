import { Component, createInstance } from "./component";
import {
  HOST_ROOT,
  HOST_COMPONENT,
  CLASS_COMPONENT,
  ENOUGH_TIME,
  PLACEMENT,
  DELETION,
  UPDATE,
  FUNCTION_COMPONENT,
} from "./constants";
import { createDomElement, updateDomProperties } from "./dom-utils";

// 待更新队列
const updateQueue = [];
// 待执行的任务
let nextUnitOfWork = null;
// 待提交的dom更新
let pendingCommit = null;

let pendingEffects = [];

// 渲染：生成fiber和挂载dom
export function render(elements, containerDom) {
  updateQueue.push({
    from: HOST_ROOT,
    dom: containerDom,
    newProps: {
      children: elements,
    },
  });

  requestIdleCallback(performWork);
}

// 调用更新
export function scheduleUpdate(instance, partialState) {
  updateQueue.push({
    from: CLASS_COMPONENT,
    instance: instance,
    partialState: partialState,
  });

  requestIdleCallback(performWork);
}

// 浏览器空闲时执行任务
function performWork(deadline) {
  workLoop(deadline);
  // 如果还有待执行任务 或者待更新任务队列不为空，则继续等待浏览器空闲执行任务
  if (nextUnitOfWork || updateQueue.length > 0) {
    requestIdleCallback(performWork);
  }
}

// 任务循环执行
function workLoop(deadline) {
  if (!nextUnitOfWork) {
    resetNextUnitOfWork();
  }

  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (pendingCommit) {
    console.log(pendingCommit);
    commitAllWork(pendingCommit);
  }

  if (pendingEffects.length > 0) {
    pendingEffects.forEach((f) => {
      f();
    });
    pendingEffects.length = 0;
  }
}

// 重置下一个待执行任务
function resetNextUnitOfWork() {
  const update = updateQueue.shift();
  if (!update) {
    return;
  }

  if (update.partialState) {
    update.instance.__fiber.partialState = update.partialState;
  }

  let root;
  if (update.from == HOST_ROOT) {
    root = update.from._rootContainerFiber;
  } else if (update.from == FUNCTION_COMPONENT) {
    root = getRoot(update.fiber);
  } else {
    root = getRoot(update.instance.__fiber);
  }

  nextUnitOfWork = {
    tag: HOST_ROOT,
    stateNode: update.dom || root.stateNode,
    props: update.newProps || root.props,
    alternate: root,
  };
}

// 获取根fiber节点
function getRoot(fiber) {
  let node = fiber;
  while (node.parent) {
    node = node.parent;
  }
  return node;
}

// 执行一个任务单元
function performUnitOfWork(wipFiber) {
  beginWork(wipFiber);
  if (wipFiber.child) {
    return wipFiber.child;
  }

  let uov = wipFiber;
  while (uov) {
    completeWork(uov);
    if (uov.sibling) {
      return uov.sibling;
    }
    uov = uov.parent;
  }
}

function beginWork(wipFiber) {
  if (wipFiber.tag == CLASS_COMPONENT) {
    // class component
    updateClassComponent(wipFiber);
  } else if (wipFiber.tag == FUNCTION_COMPONENT) {
    // function component
    updateFunctionComponent(wipFiber);
  } else {
    updateHostComponent(wipFiber);
  }
}

let wipFiber = null;
let hookIndex = null;
let effectIndex = null;
let depsArray = [];

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  wipFiber.hooks = [];
  hookIndex = 0;
  effectIndex = 0;
  let newChildElements;
  if (fiber.type.name == "Provider") {
    fiber.type(fiber.props);
    newChildElements = fiber.props.children;
  } else {
    newChildElements = [fiber.type(fiber.props)];
  }
  reconcileChildrenArray(fiber, newChildElements);
}

export function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  hook.__fiber = wipFiber;

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    updateQueue.push({
      from: FUNCTION_COMPONENT,
      fiber: hook.__fiber,
    });

    requestIdleCallback(performWork);
  };

  wipFiber.hooks.push(hook);
  hookIndex++;

  return [hook.state, setState];
}

export function useEffect(cb, args) {
  if (Object.prototype.toString.call(cb) !== "[object Function]") {
    throw new Error("useEffect first parameter must be a function");
  }

  if (typeof args === "undefined") {
    pendingEffects.push(cb);
    return;
  }

  if (!Array.isArray(args)) {
    throw new Error("useEffect second parameter must be a array");
  }

  const preDeps = depsArray[effectIndex];
  const hasChanged = preDeps
    ? args.every((dep, index) => dep === preDeps[index]) === false
    : true;

  if (hasChanged) {
    pendingEffects.push(cb);
  }

  depsArray[effectIndex] = args;
  effectIndex++;
}

export function createContext(defaultVal) {
  let val = defaultVal;

  const Provider = (props) => {
    if (props) {
      if (props.value) {
        val = props.value;
      }
    }

    return val;
  };

  return {
    Provider,
  };
}

export function useContext(context) {
  return context.Provider();
}

function updateClassComponent(wipFiber) {
  let instance = wipFiber.stateNode;
  if (instance == null) {
    instance = wipFiber.stateNode = createInstance(wipFiber);
  } else if (instance.props == wipFiber.props && !wipFiber.partialState) {
    cloneChildFibers(wipFiber);
    return;
  }

  instance.props = wipFiber.props;
  instance.state = Object.assign({}, instance.state, wipFiber.partialState);
  wipFiber.partialState = null;

  const newChildElements = wipFiber.stateNode.render();
  reconcileChildrenArray(wipFiber, newChildElements);
}

function updateHostComponent(wipFiber) {
  if (!wipFiber.stateNode) {
    wipFiber.stateNode = createDomElement(wipFiber);
  }

  const newChildElements = wipFiber.props.children;
  reconcileChildrenArray(wipFiber, newChildElements);
}

function reconcileChildrenArray(wipFiber, newChildElements) {
  const elements = arrify(newChildElements);

  let index = 0;
  let oldFiber = wipFiber.alternate ? wipFiber.alternate.child : null;
  let newFiber = null;

  while (index < elements.length || oldFiber != null) {
    const prevFiber = newFiber;
    const element = index < elements.length && elements[index];
    const isSameType = oldFiber && element && oldFiber.type == element.type;

    if (isSameType) {
      newFiber = {
        type: oldFiber.type,
        tag: oldFiber.tag,
        stateNode: oldFiber.stateNode,
        props: element.props,
        parent: wipFiber,
        alternate: oldFiber,
        partialState: oldFiber.partialState,
        effectTag: UPDATE,
      };
    }

    if (element && !isSameType) {
      let tag;
      if (element.type.prototype instanceof Component) {
        tag = CLASS_COMPONENT;
      } else if (element.type instanceof Function) {
        tag = FUNCTION_COMPONENT;
      } else {
        tag = HOST_COMPONENT;
      }

      newFiber = {
        type: element.type,
        tag: tag,
        props: element.props,
        parent: wipFiber,
        effectTag: PLACEMENT,
      };
    }

    if (oldFiber && !isSameType) {
      oldFiber.effectTag = DELETION;
      wipFiber.effects = wipFiber.effects || [];
      wipFiber.effects.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index == 0) {
      wipFiber.child = newFiber;
    } else if (prevFiber && element) {
      prevFiber.sibling = newFiber;
    }

    index++;
  }
}

function arrify(val) {
  return val == null ? [] : Array.isArray(val) ? val : [val];
}

function cloneChildFibers(parentFiber) {
  const oldFiber = parentFiber.alternate;
  if (!oldFiber.child) {
    return;
  }

  let oldChild = oldFiber.child;
  let prevChild = null;
  while (oldChild) {
    const newChild = {
      type: oldChild.type,
      tag: oldChild.tag,
      stateNode: oldChild.stateNode,
      props: oldChild.props,
      partialState: oldChild.partialState,
      alternate: oldChild,
      parent: parentFiber,
    };

    if (prevChild) {
      prevChild.sibling = newChild;
    } else {
      parentFiber.child = newChild;
    }
    prevChild = newChild;
    oldChild = oldChild.sibling;
  }
}

function completeWork(fiber) {
  if (fiber.tag === CLASS_COMPONENT) {
    fiber.stateNode.__fiber = fiber;
  }

  if (fiber.parent) {
    const childEffects = fiber.effects || [];
    const thisEffect = fiber.effectTag != null ? [fiber] : [];
    const parentEffects = fiber.parent.effects || [];
    fiber.parent.effects = parentEffects.concat(childEffects, thisEffect);
  } else {
    pendingCommit = fiber;
  }
}

// 提交所有任务的dom更新
function commitAllWork(fiber) {
  fiber.effects.forEach((f) => {
    commitWork(f);
  });
  fiber.stateNode.__rootContainerFiber = fiber;
  nextUnitOfWork = null;
  pendingCommit = null;
}

function commitWork(fiber) {
  if (fiber.tag == HOST_ROOT) {
    return;
  }
  let domParentFiber = fiber.parent;
  while (
    domParentFiber.tag == CLASS_COMPONENT ||
    domParentFiber.tag == FUNCTION_COMPONENT
  ) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.stateNode;

  if (fiber.effectTag == PLACEMENT && fiber.tag == HOST_COMPONENT) {
    domParent.appendChild(fiber.stateNode);
  } else if (fiber.effectTag == UPDATE) {
    updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag == DELETION) {
    commitDeletion(fiber, domParent);
  }
}

function commitDeletion(fiber, domParent) {
  let node = fiber;

  while (true) {
    if (node.tag == CLASS_COMPONENT) {
      node = node.child;
      continue;
    }
    domParent.removeChild(node.stateNode);
    while (node != fiber && !node.sibling) {
      node = node.parent;
    }

    if (node == fiber) {
      return;
    }
    node = node.parent;
  }
}
