import React from "react";
import "./App.css";
import unistore from "unistore/devtools.js";
import { Provider, connect } from "unistore/react";
import actions from "./actions";
import createStore from "unistore";
import devtools from "unistore/devtools";

let initialState = {
  moves: [{ x: 9, y: 9 }],
  snakeLimit: 2,
  direction: "up",
  apple: { x: 2, y: 2 }
};

let store =
  process.env.NODE_ENV === "production"
    ? createStore(initialState)
    : devtools(createStore(initialState));

const makeSequence = (size = 20, offset = 0) =>
  Array(size)
    .fill()
    .map((_, index) => offset + index);

const makeGrid = (rows = 20, cols = 20) =>
  makeSequence(rows).map(r =>
    makeSequence(cols).map(c => ({ row: r, col: c }))
  );

class SnakeGame extends React.Component {
  constructor() {
    super();
    this.loopTimeout = null;

    this.state = {
      grid: makeGrid(),
      apple: {
        y: Math.floor(Math.random() * 20),
        x: Math.floor(Math.random() * 20)
      }
    };
  }

  move = event => {
    const { target } = event;
  };

  componentWillUnmount() {
    document.removeEventListener("keydown", this.move);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.move);

    this.loopTimeout = setTimeout(this.gameLoop, 500);
  }

  getRandomApple = () => {
    const { snake } = this.state;
    const newApple = {
      row: Math.floor(Math.random() * 20),
      col: Math.floor(Math.random() * 20)
    };
    if (
      this.isTail(newApple) ||
      (snake.head.row === newApple.row && snake.head.col === newApple.col)
    ) {
      return this.getRandomApple();
    } else {
      return newApple;
    }
  };

  gameLoop = () => {
    if (this.state.gameOver) return;
    clearTimeout(this.loopTimeout);

    // this.setState(
    //   ({ snake, apple }) => {
    //     const collidesWithSnake = this.collidesWithSnake(apple);
    //     const nextState = {
    //       snake: {
    //         ...snake,
    //         head: {
    //           row: snake.head.y + snake.velocity.y,
    //           col: snake.head.x + snake.velocity.x
    //         },
    //         tail: [snake.head, ...snake.tail]
    //       },
    //       // apple: collidesWithApple ? this.getRandomApple() : apple
    //     };

    //     if (!collidesWithApple) nextState.snake.tail.pop();

    //     return nextState;
    //   },
    //   () => {
    //     const { snake } = this.state;
    //     if (this.isOffEdge() || this.isTail(snake.head)) {
    //       this.setState({
    //         gameOver: true
    //       });
    //       return;
    //     }

    //     this.loopTimeout = setTimeout(
    //       () => {
    //         this.gameLoop();
    //       },
    //       this.state.snake.tail.length
    //         ? 400 / this.state.snake.tail.length + 200
    //         : 400
    //     );
    //   }
    // );
  };

  isOffEdge = () => {
    const { snake } = this.state;

    if (
      snake.head.col > 19 ||
      snake.head.col < 0 ||
      snake.head.row > 19 ||
      snake.head.row < 0
    ) {
      return true;
    }
  };

  isApple = cell => {
    const { apple } = this.state;
    return apple.row === cell.row && apple.col === cell.col;
  };

  isHead = cell => {
    const { snake } = this.state;
    return snake.head.row === cell.row && snake.head.col === cell.col;
  };

  isTail = cell => {
    const { snake } = this.state;
    return snake.tail.find(
      inTail => inTail.row === cell.row && inTail.col === cell.col
    );
  };

  setVelocity = event => {
    const { snake } = this.state;
    if (event.keyCode === 38) {
      // up
      this.props.setDirection();
    } else if (event.keyCode === 40) {
      // down
      if (snake.velocity.y === -1) return;
      this.setState(({ snake }) => ({
        snake: {
          ...snake,
          velocity: {
            x: 0,
            y: 1
          }
        }
      }));
    } else if (event.keyCode === 39) {
      //right
      if (snake.velocity.x === -1) return;
      this.setState(({ snake }) => ({
        snake: {
          ...snake,
          velocity: {
            x: 1,
            y: 0
          }
        }
      }));
    } else if (event.keyCode === 37) {
      // left
      if (snake.velocity.x === 1) return;
      this.setState(({ snake }) => ({
        snake: {
          ...snake,
          velocity: {
            x: -1,
            y: 0
          }
        }
      }));
    }
  };

  render() {
    const { grid, snake, gameOver } = this.state;
    return (
      <div className="App">
        {gameOver ? (
          <h1>Game Over! You scored {snake.tail.length + 1}!</h1>
        ) : (
          <section className="grid">
            {grid.map((row, i) =>
              row.map(cell => (
                <div
                  key={`${cell.row} ${cell.col}`}
                  className={`cell
                ${
                  this.isHead(cell)
                    ? "head"
                    : this.isApple(cell)
                    ? "apple"
                    : this.isTail(cell)
                    ? "tail"
                    : ""
                }`}
                />
              ))
            )}
          </section>
        )}
      </div>
    );
  }
}

const App = connect(
  ["moves", "direction"],
  actions
)(SnakeGame);

export default App;
