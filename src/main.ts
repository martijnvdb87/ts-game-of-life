//import './style.css'

class Cell {
  x: number;
  y: number;
  isAlive: boolean = false;
  isAliveInNextTurn: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getNeighbours() {

  };
}

class Board {
  cells: Array<Array<Cell>> = new Array<Array<Cell>>();

  constructor(width: number, height: number) {
    this.createBoard(width, height);
  };

  createBoard(width: number, height: number) {
    for(let y = 0; y < height; y++) {
      let row: Array<Cell> = [];

      for(let x = 0; x < width; x++) {
        let cell: Cell = new Cell(x, y);
        row.push(cell);
      }

      this.cells.push(row);
    }
  };
}

let board: Board = new Board(10, 10);
console.log(board.cells);
