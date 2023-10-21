import "./style.css";
import { BLOCK_SIZE, BOARD_HEIGTH, BOARD_WIDTH, EVEN_MOVEMENTS } from "./const";
// 1. Inicializar el canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const $score = document.querySelector("span");

let score = 0;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGTH;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// 3. Board
const board = createBoard(BOARD_WIDTH, BOARD_HEIGTH);

function createBoard(width, height) {
  return Array(height)
    .fill()
    .map(() => Array(width).fill({ color: "", value: 0 }));
}

// 4. Pieza del Jugador

const colors = [
  "yellow",
  "red",
  "blue",
  "green",
  "maroon",
  "purple",
  "olive",
  "aqua",
  "orange",
  "aquamarine",
  "chocolate",
  "darkblue",
  "darkgrey",
  "indigo",
];

const piece = {
  position: { x: 5, y: 5 },
  color: "",
  shape: [
    [
      { color: "", value: 1 },
      { color: "", value: 1 },
    ],
    [
      { color: "", value: 1 },
      { color: "", value: 1 },
    ],
  ],
};

const PIECES = [
  [
    [
      { color: "", value: 1 },
      { color: "", value: 1 },
    ],
    [
      { color: "", value: 1 },
      { color: "", value: 1 },
    ],
  ],
  [
    [
      { color: "", value: 0 },
      { color: "", value: 1 },
      { color: "", value: 0 },
    ],
    [
      { color: "", value: 1 },
      { color: "", value: 1 },
      { color: "", value: 1 },
    ],
  ],
  [
    [
      { color: "", value: 1 },
      { color: "", value: 1 },
      { color: "", value: 1 },
      { color: "", value: 1 },
    ],
  ],
  [
    [
      { color: "", value: 1 },
      { color: "", value: 0 },
    ],
    [
      { color: "", value: 1 },
      { color: "", value: 0 },
    ],
    [
      { color: "", value: 1 },
      { color: "", value: 1 },
    ],
  ],
  [
    [
      { color: "", value: 1 },
      { color: "", value: 1 },
      { color: "", value: 0 },
    ],
    [
      { color: "", value: 0 },
      { color: "", value: 1 },
      { color: "", value: 1 },
    ],
  ],
];
// 2. Game Loop

// function update() {
//   draw();
//   window.requestAnimationFrame(update);
// }
let dropCounter = 0;
let lastTime = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;

  if (dropCounter > 1000) {
    piece.position.y++;
    dropCounter = 0;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      removeRows();
    }
  }
  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  board.forEach((row, y) => {
    row.forEach(({ value, color }, x) => {
      if (value === 1) {
        context.fillStyle = color;
        context.fillRect(x, y, 0.9, 0.9);
      } else {
        context.fillStyle = "#E7E5E4";
        // context.fillStyle = "black";
        context.fillRect(x, y, 0.9, 0.9);
        rellenarColores(context, 0.8, x, y);
      }
    });
  });

  if (!piece.color) {
    piece.color = colors[Math.floor(Math.random() * colors.length)];
  }
  piece.shape.forEach((row, y) => {
    row.forEach(({ value, color }, x) => {
      if (value) {
        // console.log(value);

        context.fillStyle = piece.color;

        context.fillRect(x + piece.position.x, y + piece.position.y, 0.9, 0.9);

        // context.fillRect(x + piece.position.x, y + piece.position.y, 0.1, 0.1);
      }
    });
  });

  $score.innerText = score;
}

function rellenarColores(context, tamanio, x, y) {
  context.fillStyle = "white";
  for (let contador = 0; contador < tamanio; contador + 0.1) {
    context.fillRect(x + contador, y + -0.1, 0.1, 0.1);
    contador = contador + 0.1;
  }
  for (let contador = -0.1; contador < tamanio; contador + 0.1) {
    context.fillRect(x + -0.1, y + contador, 0.1, 0.1);
    contador = contador + 0.1;
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === EVEN_MOVEMENTS.LEFT) {
    piece.position.x--;
    console.log(checkCollision());
    if (checkCollision()) {
      piece.position.x++;
    }
  }
  if (event.key === EVEN_MOVEMENTS.RIGHT) {
    piece.position.x++;
    if (checkCollision()) {
      piece.position.x--;
    }
  }
  if (event.key === EVEN_MOVEMENTS.DOWN) {
    piece.position.y++;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      removeRows();
    }
  }
  if (event.key === EVEN_MOVEMENTS.UP) {
    const rotated = [];
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = [];
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i]);
      }
      rotated.push(row);
    }

    piece.shape = rotated;
  }
});

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find(({ value }, x) => {
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x]?.value !== 0
      );
    });
  });
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach(({ value }, x) => {
      if (value === 1) {
        const newValue = {
          color: piece.color,
          value: 1,
        };
        board[y + piece.position.y][x + piece.position.x] = newValue;
        // console.log(board);
      }
    });
  });

  if (piece.color) {
    piece.color = "";
  }
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)];

  piece.position.x = Math.floor(BOARD_WIDTH / 2);
  piece.position.y = 0;

  //Game Over
  if (checkCollision()) {
    window.alert("Game over !! Sorry!");
    board.forEach((row) => row.fill({ color: "", value: 0 }));
  }
}

function removeRows() {
  const rowToRemove = [];
  board.forEach((row, y) => {
    if (row.every(({ value }) => value === 1)) {
      rowToRemove.push(y);
    }
  });

  rowToRemove.forEach((y) => {
    board.splice(y, 1);
    const newRow = Array(BOARD_WIDTH).fill({ color: "", value: 0 });
    board.unshift(newRow);
    score += 10;
  });
}

const $section = document.querySelector("section");

$section.addEventListener("click", () => {
  $section.remove();
  update();
  //   const audio = new Audio("./public/sountrack-tetris.mp3");
  //   audio.volume = 0.5;
  //   audio.play();
});
