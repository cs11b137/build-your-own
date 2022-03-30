import { scheduleUpdate } from "./reconciler";

// 组件类
export class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(partialState) {
    scheduleUpdate(this, partialState);
  }
}

// 创建组件对象
export function createInstance(fiber) {
  const { type, props } = fiber;

  const instance = new type(props);

  instance.__fiber = fiber;

  return instance;
}
