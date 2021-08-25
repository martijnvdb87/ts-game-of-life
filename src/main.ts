//import './style.css'

class Cell {
  board: Board;
  x: number;
  y: number;
  neighbours: Array<Cell> = new Array<Cell>();
  isAlive: boolean = false;
  isAliveInNextTurn: boolean = false;

  constructor(board: Board, x: number, y: number) {
    this.board = board;
    this.x = x;
    this.y = y;
  }

  countLivingNeighbours() {
    const neighbours: Array<Cell> = this.getNeighbours();
    let livingNeighbours: number = 0;

    for (let n: number = 0; n < neighbours.length; n++) {
      if(neighbours[n].isAlive) {
        livingNeighbours++;
      }
    }

    return livingNeighbours;
  };

  getNeighbours() {
    if(this.neighbours.length === 0) {

      for(let y: number = -1; y < 2; y++) {
        for(let x:number = -1; x < 2; x++) {
          if(y === 0 && x === 0) {
            continue;
          }

          if(this.board.cells[this.y + y]?.[this.x + x]) {
            this.neighbours.push(this.board.cells[this.y + y][this.x + x]);
          }
        }
      }
    }

    return this.neighbours;
  };
}

class Board {
  cells: Array<Array<Cell>> = new Array<Array<Cell>>();

  constructor(width: number, height: number) {
    this.createBoard(width, height);
  };

  createBoard(width: number, height: number) {
    for(let y: number = 0; y < height; y++) {
      const row: Array<Cell> = [];

      for(let x: number = 0; x < width; x++) {
        const cell: Cell = new Cell(this, x, y);
        row.push(cell);
      }

      this.cells.push(row);
    }
  };

  runNextTurn() {
    for(let y = 0; y < this.cells.length; y++) {
      for(let x = 0; x < this.cells[y].length; x++) {
        const cell: Cell = this.cells[y][x];
        const livingNeighbours: number = cell.countLivingNeighbours();
      }
    }
  };

  run() {

  };
}

type liveOrDie = "live" | "die";

class Rule {
  hasNeighboursAmount: number;
  newState: liveOrDie;

  constructor(hasNeighboursAmount: number, newState: liveOrDie) {
    this.hasNeighboursAmount = hasNeighboursAmount;
    this.newState = newState;
  }
}

let board: Board = new Board(10, 10);
console.log(board.cells[0][0].getNeighbours());
