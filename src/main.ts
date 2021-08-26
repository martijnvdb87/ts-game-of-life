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
  rules: Array<Rule> = new Array<Rule>();

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

  addRule(rule: Rule) {
    this.rules.push(rule);
  };

  nextTurn() {
    console.log(this.cells);
    for(let y = 0; y < this.cells.length; y++) {
      for(let x = 0; x < this.cells[y].length; x++) {
        const cell: Cell = this.cells[y][x];

        this.applyRules(cell);
      }
    }

    for(let y = 0; y < this.cells.length; y++) {
      for(let x = 0; x < this.cells[y].length; x++) {
        const cell: Cell = this.cells[y][x];

        cell.isAlive = cell.isAliveInNextTurn;
      }
    }
  };

  applyRules(cell: Cell) {
    this.rules.forEach((rule: Rule) => {
      rule.run(cell);
    });
  };
}

class Rule {
  action: CallableFunction;
  hasNeighboursAmount: number | undefined;

  constructor(action: CallableFunction, hasNeighboursAmount?: number) {
    this.action = action;
    this.hasNeighboursAmount = hasNeighboursAmount;
  };

  run(cell: Cell) {
    if (this.hasNeighboursAmount === null || cell.countLivingNeighbours() === this.hasNeighboursAmount) {
      cell.isAliveInNextTurn = !!this.action(cell);
    }
  };
}

let board: Board = new Board(10, 10);
board.addRule(new Rule((() => true)));

setInterval(() => board.nextTurn(), 3000);
