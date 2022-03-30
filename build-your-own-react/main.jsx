import MiniReact from "./src";

class Counter extends MiniReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  increase() {
    this.setState({
      count: (this.state.count += 1),
    });
  }

  decrease() {
    this.setState({
      count: (this.state.count -= 1),
    });
  }

  reset() {
    this.setState({
      count: 0,
    });
  }

  render() {
    const { count } = this.state;

    return (
      <div>
        <p>{count}</p>
        <button onClick={() => this.increase()}>+1</button>
        <button onClick={() => this.reset()}>=0</button>
        <button onClick={() => this.decrease()}>-1</button>
      </div>
    );
  }
}

MiniReact.render(<Counter />, document.getElementById("app"));
