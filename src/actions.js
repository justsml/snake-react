import produce from "immer";

const applyMoveDirection = ({ x, y, direction }) => {
  if (direction === "up") {
    y -= 1;
  } else if (direction === "down") {
    y += 1;
  } else if (direction === "right") {
    x += 1;
  } else if (direction === "left") {
    x -= 1;
  }
  return { x, y };
};

// const collidesWithMoves = ({ x, y, moves }) => {
//   return moves.find(({ x, y }) => apple.row);
// };

const trimSnake = ({ moves, snakeLimit }) => {
  return moves.length > snakeLimit
    ? moves.slice(moves.length - snakeLimit)
    : moves;
};

export default function actions(store) {
  return {
    addMove(state, { x, y, direction, apple, snakeLimit }) {
      return produce(state, draft => {
        const myMove = applyMoveDirection({ x, y, direction });
        const newMoves = [...draft.moves, myMove];
        draft.moves = trimSnake({ moves: newMoves, snakeLimit });
      });
    },
    setApple(state, { x, y }) {
      return produce(state, draft => {
        draft.apple = { x, y };
      });
    },
    setDirection(state, { direction }) {
      return produce(state, draft => {
        draft.direction = direction;
      });
    },
    setSnakeLimit(state, { snakeLimit }) {
      return produce(state, draft => {
        draft.snakeLimit = snakeLimit;
      });
    }
  };
}
