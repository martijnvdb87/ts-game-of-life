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

  getNeighbours() {
    if(this.neighbours.length === 0) {

      for(let y = -1; y < 2; y++) {
        for(let x = -1; x < 2; x++) {
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
    for(let y = 0; y < height; y++) {
      let row: Array<Cell> = [];

      for(let x = 0; x < width; x++) {
        let cell: Cell = new Cell(this, x, y);
        row.push(cell);
      }

      this.cells.push(row);
    }
  };
}

let board: Board = new Board(10, 10);
console.log(board.cells[0][0].getNeighbours());
