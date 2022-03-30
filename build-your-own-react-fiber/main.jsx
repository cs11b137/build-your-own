import {
  Component,
  createElement,
  render,
  useState,
  useEffect,
  createContext,
  useContext,
} from "./src/index";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  increase() {
    this.setState({
      count: this.state.count + 1,
    });
  }

  decrease() {
    this.setState({
      count: this.state.count - 1,
    });
  }

  reset() {
    this.setState({
      count: 0,
    });
  }

  render() {
    const { title } = this.props;
    const { count } = this.state;

    return (
      <div>
        <h1>{title}</h1>
        <p>{count}</p>
        <button onClick={() => this.increase()}>+1</button>
        <button onClick={() => this.decrease()}>-1</button>
        <button onClick={() => this.reset()}>=0</button>
      </div>
    );
  }
}

const obj = {
  foo: 100,
  bar: 200,
};

const Context = createContext(obj.foo);

function App() {
  return (
    <Context.Provider value={obj.bar}>
      <Child></Child>
    </Context.Provider>
  );
}

function Child() {
  const val = useContext(Context);
  return <div>{val}</div>;
}

render(<App />, document.getElementById("root"));
