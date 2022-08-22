const DIM = 20;
const CANVAS_SIZE = 400;
const IMG_SIZE = CANVAS_SIZE / DIM;

let complete = false;
let selectedTileIndex = 1;
let images = [];
let tiles = [];
let grid = [];

let state = "PAUSED";

const pickOne = (cells) => {
  const minEntropy = cells[0].entropy();
  const options = cells.filter((cell) => cell.entropy() === minEntropy);
  return random(options);
};

const evaluateGrid = () => {
  for (let cell of grid) {
    if (!cell.collapsed) {
      const upTile = cell.index - DIM < 0 ? null : grid[cell.index - DIM].tile;
      const rightTile =
        (cell.index + 1) % DIM === 0 ? null : grid[cell.index + 1].tile;
      const downTile =
        cell.index + DIM >= grid.length ? null : grid[cell.index + DIM].tile;
      const leftTile =
        cell.index % DIM === 0 ? null : grid[cell.index - 1].tile;

      cell.evaluate(upTile, rightTile, downTile, leftTile);
    }
  }
};

const changeTile = (event) => {
  if (event.deltaY > 0) {
    selectedTileIndex = (tiles.length + selectedTileIndex - 1) % tiles.length;
  } else {
    selectedTileIndex = (selectedTileIndex + 1) % tiles.length;
  }
};

const drawGrid = () => {
  for (let cell of grid) {
    if (cell.collapsed) {
      image(cell.tile.img, cell.x, cell.y, IMG_SIZE, IMG_SIZE);
    } else {
      square(cell.x, cell.y, IMG_SIZE);
      line(cell.x, cell.y, cell.x, cell.y + IMG_SIZE);
      line(cell.x + IMG_SIZE, cell.y, cell.x + IMG_SIZE, cell.y + IMG_SIZE);
      line(cell.x, cell.y, cell.x + IMG_SIZE, cell.y);
      line(cell.x, cell.y + IMG_SIZE, cell.x + IMG_SIZE, cell.y + IMG_SIZE);
      textSize(6);
      textAlign(CENTER, CENTER);
      text(str(cell.entropy()), cell.x + IMG_SIZE / 2, cell.y + IMG_SIZE / 2);
    }
  }
};

const iterate = () => {
  if (grid.filter((cell) => !cell.collapsed).length === 0) {
    state = "COMPLETED";
    return;

    // saveCanvas("picture", "png");
    // noloop();
  }

  const sortedGrid = grid
    .filter((cell) => !cell.collapsed)
    .sort((a, b) => a.entropy() - b.entropy());
  //   console.log("sorted cells:", sortedGrid);

  const nextCell = pickOne(sortedGrid);
  //   console.log(nextCell);
  grid[nextCell.index].collapse();
  evaluateGrid();

  //   Draw grid
  drawGrid();
};

function preload() {
  images.push(loadImage("./tiles/blank.png"));
  images.push(loadImage("./tiles/corner.png"));
  images.push(loadImage("./tiles/road.png"));
  images.push(loadImage("./tiles/t.png"));
  return;
}

const buttonFunction = (callback) => callback();

function setup() {
  ctx = createCanvas(CANVAS_SIZE, CANVAS_SIZE);

  //   TODO: Iterate buttons
  //   const buttons = [
  //     { label: "Start", fn: () => (state = "RUNNING") },
  //     { label: "Pause", fn: () => (state = "PAUSED") },
  //     { label: "Draw", fn: () => (state = "DRAWING") },
  //     { label: "Save image", fn: () => () => saveCanvas("picture", "png") },
  //     { label: "Reset", fn: () => reset() },
  //   ];
  //   buttons.forEach((button, i) => {
  //     button = createButton(button.label);
  //     button.position(CANVAS_SIZE + 40, 20 + i * 30);
  //     button.mousePressed(() => buttonFunction(button.fn));
  //   });
  startButton = createButton("Start");
  startButton.position(CANVAS_SIZE + 40, 20);
  startButton.mousePressed(() => (state = "RUNNING"));
  startButton = createButton("Pause");
  startButton.position(CANVAS_SIZE + 40, 50);
  startButton.mousePressed(() => (state = "PAUSED"));
  drawButton = createButton("Draw");
  drawButton.position(CANVAS_SIZE + 40, 80);
  drawButton.mousePressed(() => (state = "DRAWING"));
  saveButton = createButton("Save image");
  saveButton.position(CANVAS_SIZE + 40, 110);
  saveButton.mousePressed(() => saveCanvas("picture", "png"));
  saveButton = createButton("Reset");
  saveButton.position(CANVAS_SIZE + 40, 140);
  saveButton.mousePressed(() => {
    state = "PAUSED";
    tiles = [];
    grid = [];
    setup();
  });
  frameRate(60);

  tiles.push(new Tile(images[0], [0, 0, 0, 0]));
  tiles.push(new Tile(images[1], [1, 0, 0, 1]));
  tiles.push(tiles[1].rotate(1));
  tiles.push(tiles[1].rotate(2));
  tiles.push(tiles[1].rotate(3));
  tiles.push(new Tile(images[2], [1, 0, 1, 0]));
  tiles.push(tiles[5].rotate(1));
  tiles.push(new Tile(images[3], [0, 1, 1, 1]));
  tiles.push(tiles[7].rotate(1));
  tiles.push(tiles[7].rotate(2));
  tiles.push(tiles[7].rotate(3));

  for (let i = 0; i < DIM * DIM; i++) {
    grid.push(
      new Cell(
        i,
        (i % DIM) * IMG_SIZE,
        Math.floor(i / DIM) * IMG_SIZE,
        null,
        tiles
      )
    );
  }

  ctx.mouseWheel(changeTile);
}

function draw() {
  background("#AAAAAA");
  //   Evaluate
  evaluateGrid();
  //   Draw grid
  drawGrid();

  if (state === "RUNNING") iterate();
  if (state === "DRAWING") {
    if (mouseX <= CANVAS_SIZE && mouseY <= CANVAS_SIZE) {
      const x = Math.floor(mouseX / IMG_SIZE);
      const y = Math.floor(mouseY / IMG_SIZE);
      image(
        tiles[selectedTileIndex].img,
        x * IMG_SIZE,
        y * IMG_SIZE,
        IMG_SIZE,
        IMG_SIZE
      );
    }
  }
}

function mouseClicked() {
  if (state === "DRAWING") {
    if (mouseX <= CANVAS_SIZE && mouseY <= CANVAS_SIZE) {
      const x = Math.floor(mouseX / IMG_SIZE);
      const y = Math.floor(mouseY / IMG_SIZE);
      grid[y * DIM + x].setTile(tiles[selectedTileIndex]);
      evaluateGrid();
      drawGrid();
    }
  }
  // prevent default
  return false;
}
