import './style.css'

class Cell {
  board: Board;
  element: HTMLElement | undefined;
  x: number;
  y: number;
  neighbours: Array<Cell> = new Array<Cell>();
  isAlive: boolean = false;
  isAliveInNextTurn: boolean | null = null;

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
        for(let x: number = -1; x < 2; x++) {
          if(y === 0 && x === 0) {
            continue;
          }

          let newY = this.y + y;
          let newX = this.x + x;

          newY = newY < 0 ? newY + this.board.cells.length : newY;
          newY = newY >= this.board.cells.length ? newY - this.board.cells.length : newY;          

          newX = newX < 0 ? newX + this.board.cells[newY].length : newX;
          newX = newX >= this.board.cells[newY].length ? newX - this.board.cells[newY].length : newX;

          if(this.board.cells[newY]?.[newX]) {
            this.neighbours.push(this.board.cells[newY][newX]);
          }
        }
      }
    }

    return this.neighbours;
  };
};

class Board {
  element: HTMLElement | null;
  width: number;
  height: number;
  cells: Array<Array<Cell>> = new Array<Array<Cell>>();
  rules: Array<Rule> = new Array<Rule>();
  interval: number = 500;
  intervalTimer: undefined | number;
  isDrawing: boolean = false;
  isDrawingStateAlive: boolean = false;
  isPlaying: boolean = false;

  constructor(element: HTMLElement | null, width: number, height: number) {
    this.element = element;
    this.width = width;
    this.height = height;

    for(let y: number = 0; y < height; y++) {
      const row: Array<Cell> = [];

      for(let x: number = 0; x < width; x++) {
        const cell: Cell = new Cell(this, x, y);
        row.push(cell);
      }

      this.cells.push(row);
    }

    this.render();
  };

  addRule(rule: Rule) {
    this.rules.push(rule);
  };

  setInterval(interval: number) {
    this.pause();
    clearTimeout(this.intervalTimer);
    this.interval = interval;
    this.play();
  };

  nextTurn() {
    for(let y = 0; y < this.cells.length; y++) {
      for(let x = 0; x < this.cells[y].length; x++) {
        const cell: Cell = this.cells[y][x];

        this.applyRules(cell);
      }
    }

    for(let y = 0; y < this.cells.length; y++) {
      for(let x = 0; x < this.cells[y].length; x++) {
        const cell: Cell = this.cells[y][x];

        if(cell.isAliveInNextTurn !== null) {
          cell.isAlive = cell.isAliveInNextTurn;
        }

        cell.isAliveInNextTurn = null;
      }
    }
    this.update();

    this.intervalTimer = setTimeout(() => {
      if(this.isPlaying) {
        this.nextTurn()
      }
    }, this.interval);
  };

  applyRules(cell: Cell) {
    this.rules.forEach((rule: Rule) => {
      rule.run(cell);
    });
  };

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.nextTurn();
    }
  };

  pause() {
    this.isPlaying = false;
  }

  render() {
    if (!this.element) {
      return;
    }

    this.element.innerHTML = ``;

    let containerElement: HTMLDivElement = document.createElement(`div`);
    containerElement.classList.add(`board__container`);

    for (let y: number = 0; y < this.cells.length; y++) {
      let rowElement: HTMLDivElement = document.createElement(`div`);
      rowElement.classList.add(`board__row`);
      rowElement.dataset.row = `${y + 1}`;

      for (let x: number = 0; x < this.cells[y].length; x++) {
        let cell: Cell = this.cells[y][x];

        let cellElement: HTMLDivElement = document.createElement(`div`);
        cellElement.classList.add(`board__cell`);
        cellElement.dataset.row = `${y + 1}`;
        cellElement.dataset.cell = `${x + 1}`;

        cellElement.addEventListener(`mousedown`, () => {
          cell.board.isDrawing = true;
          cell.board.isDrawingStateAlive = !cell.isAlive;
          cell.isAlive = cell.board.isDrawingStateAlive;
          
          cell.element?.classList[cell.isAlive ? `add` : `remove`](`board__cell--is-alive`);
        });

        document.addEventListener(`mouseup`, () => {
          cell.board.isDrawing = false;
        });

        cellElement.addEventListener(`mousemove`, () => {
          if(cell.board.isDrawing) {
            cell.isAlive = cell.board.isDrawingStateAlive;
            
            cell.element?.classList[cell.isAlive ? `add` : `remove`](`board__cell--is-alive`);
          }
        });

        cell.element = cellElement;

        rowElement.append(cellElement);
      }

      containerElement.append(rowElement);
    }

    const nextTurnElement: HTMLButtonElement = document.createElement(`button`);
    nextTurnElement.classList.add(`board__next-turn`);
    nextTurnElement.innerHTML = `Next Turn`;

    nextTurnElement.addEventListener(`click`, () => {
      if(!this.isPlaying) {
        this.nextTurn();
      }
    });

    const playButtonElement: HTMLButtonElement = document.createElement(`button`);
    playButtonElement.classList.add(`board__play-button`);
    playButtonElement.innerHTML = `Play`;

    playButtonElement.addEventListener(`click`, () => {
      this.play();
    });

    const pauseButtonElement: HTMLButtonElement = document.createElement(`button`);
    pauseButtonElement.classList.add(`board__pause-button`);
    pauseButtonElement.innerHTML = `Pause`;

    pauseButtonElement.addEventListener(`click`, () => {
      this.pause();
    });

    const intervalRangeElement: HTMLInputElement = document.createElement(`input`);
    intervalRangeElement.type = `range`;
    intervalRangeElement.classList.add(`board__interval-range`);
    intervalRangeElement.min = `1`;
    intervalRangeElement.max = `1000`;
    intervalRangeElement.value = `${1001 - this.interval}`;

    intervalRangeElement.addEventListener(`change`, e => {
      const target = e.target as HTMLInputElement;
      const value = 1001 - parseInt(target.value);
      this.setInterval(value);
    });

    this.element.classList.add(`board`);
    this.element.append(containerElement);
    this.element.append(nextTurnElement);
    this.element.append(playButtonElement);
    this.element.append(pauseButtonElement);
    this.element.append(intervalRangeElement);

    this.update();
  };

  update() {
    for (let y: number = 0; y < this.cells.length; y++) {
      for (let x: number = 0; x < this.cells[y].length; x++) {
        let cell: Cell = this.cells[y][x];

        if(cell.isAlive) {
          cell.element?.classList.add(`board__cell--is-alive`);
        } else {
          cell.element?.classList.remove(`board__cell--is-alive`);
        }
      }
    }
  };
};

class Rule {
  action: CallableFunction;

  constructor(action: CallableFunction) {
    this.action = action;
  };

  run(cell: Cell) {
    const newState = this.action(cell);

    if (newState !== null) {
      cell.isAliveInNextTurn = newState;
    }
  };
};

let board: Board = new Board(document.getElementById(`game`), 64, 48);

board.addRule(new Rule((cell: Cell) => {
  if(cell.isAlive) {
    return cell.countLivingNeighbours() > 2
  }
  
  return null;
}));

board.addRule(new Rule((cell: Cell) => {
  if(cell.isAlive) {
    if (cell.countLivingNeighbours() === 2 || cell.countLivingNeighbours() === 3) {
      return true;
    }

    return false;
  }

  return null;
}));

board.addRule(new Rule((cell: Cell) => {
  if (cell.isAlive && cell.countLivingNeighbours() > 3) {
    return false;
  }
  
  return null;
}));

board.addRule(new Rule((cell: Cell) => {
  if(!cell.isAlive && cell.countLivingNeighbours() === 3) {
    return true;
  }

  return null;
}));

board.render();