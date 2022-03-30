import { reconcile } from "./render";

export class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this._internalInstance);
  }
}

export function createPublicInstance(element, internalInstance) {
  const { type, props } = element;

  const publicInstance = new type(props);

  publicInstance._internalInstance = internalInstance;

  return publicInstance;
}

export function updateInstance(internalInstance) {
  const parentDom = internalInstance.dom.parentNode;
  const element = internalInstance.element;

  reconcile(internalInstance, element, parentDom);
}
