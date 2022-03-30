import { Component, createStore } from "./src";

// state
const state = {
  count: 0,
};

// actions
const actions = {
  increase(context) {
    context.commit("increase");
  },
  decrease(context) {
    context.commit("decrease");
  },
  reset(context) {
    context.commit("reset");
  },
};

// mutations
const mutations = {
  increase(state) {
    state.count += 1;
    return state;
  },
  decrease(state) {
    state.count -= 1;
    return state;
  },
  reset(state) {
    state.count = 0;
    return state;
  },
};

// create a store
const store = createStore({
  state,
  actions,
  mutations,
});

class Counter extends Component {
  constructor(props) {
    super({
      store: props.store,
      element: props.element,
    });

    this.state = this.store.getState();
    this.div = document.createElement("div");
    this.div.setAttribute("id", "counter");
    this.element.appendChild(this.div);

    this.btn1 = createButton({
      className: "inc",
      content: "+1",
      id: "ins",
    });
    this.btn1.addEventListener("click", () => {
      this.store.dispatch("increase");
    });

    this.btn2 = createButton({
      className: "dec",
      content: "-1",
      id: "des",
    });
    this.btn2.addEventListener("click", () => {
      this.store.dispatch("decrease");
    });

    this.btn3 = createButton({
      className: "reset",
      content: "=0",
      id: "reset",
    });
    this.btn3.addEventListener("click", () => {
      this.store.dispatch("reset");
    });

    this.element.appendChild(this.btn1);
    this.element.appendChild(this.btn2);
    this.element.appendChild(this.btn3);
  }

  render() {
    this.div.innerHTML = `<span>${this.state.count}</span>`;
  }
}

function createButton(props) {
  const { className, content, id } = props;
  const button = document.createElement("button");
  button.textContent = content;
  button.setAttribute("class", className || "");
  button.setAttribute("id", id || "");

  return button;
}

const app = new Counter({
  store,
  element: document.getElementById("app"),
});

app.render();
