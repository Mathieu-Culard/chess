import { dragend, dragover, dragstart, drop, mouseDown } from "../Utils/events.js";
import {
  UP,
  DOWN,
  RIGHT,
  LEFT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
  KNIGHT_UP_LEFT,
  KNIGHT_UP_RIGHT,
  KNIGHT_DOWN_LEFT,
  KNIGHT_DOWN_RIGHT,
  KNIGHT_RIGHT_UP,
  KNIGHT_RIGHT_DOWN,
  KNIGHT_LEFT_UP,
  KNIGHT_LEFT_DOWN
} from '../Utils/directions.js';


/* Abstract class used to extend all pieces classes */
export class Piece {
  #id;
  #name = '';
  #color = '';
  #position = [];
  #moves = [];
  #directions = [];
  #HTMLElement;
  #pinDirection = {};// represents the direction in which the piece can move if it is pinned to the king.

  constructor(id, name, position, color, game, directions) {
    if (this.constructor === Piece) {
      throw new TypeError('Abstract class "Piece" cannot be instantiated directly')
    }
    this.#directions = directions;
    this.#id = `${name}-${id}`;
    this.#name = name;
    this.#position = position;
    this.#color = color;
    this.#HTMLElement = this.makeHTMLElement(game);
  }

  /* 
    create the DOM elements that represents the pieces with all mouses events needed 
  */
  makeHTMLElement(game) {
    const HTMLElement = document.createElement('div');
    HTMLElement.id = this.#id;
    HTMLElement.classList.add('piece', this.#name, this.#color, `square-${this.#position[0]}${this.#position[1]}`)
    HTMLElement.style.backgroundImage = `url('assets/img/${this.#color}-${this.#name}.png')`
    HTMLElement.setAttribute('draggable', true);
    HTMLElement.addEventListener('dragstart', (e) => dragstart(e));
    HTMLElement.addEventListener('dragover', (e) => dragover(e));
    HTMLElement.addEventListener('dragend', (e) => dragend(e));
    HTMLElement.addEventListener('drop', (e) => drop(e, game));                 // pass the game to the events in order to get the mouved pieces and fetch the game pieces array
    HTMLElement.addEventListener('mousedown', (e) => mouseDown(e, this, game));
    HTMLElement.addEventListener('mouseup', (e) => dragend(e));
    return HTMLElement;
  }


  /* 
    replaces the position of the mouved piece by the passed coordinates if these coordinates are in the Array of possible moves for this piece 
  */
  move(coords, possibleMoves) {
    const pos = coords.split('');
    if (!possibleMoves.some(el => JSON.stringify(el) === JSON.stringify(pos.map(coord => parseInt(coord, 10))))) {
      return false;
    }

    const prevPos = this.position;
    this.position = pos;
    this.#HTMLElement.classList.replace(this.HTMLElement.classList[3], `square-${this.position[0]}${this.position[1]}`);
    if ((this.name === 'pawn' || this.name === 'king' || this.name === 'rook') && !this.alreadyMoved) {
      this.alreadyMoved = true;
    }
    return true;

  }

  /* 
  replaces the position of the mouved piece by the coordinates of the captured piece
  */
  capture(pieceToRemove, possibleMoves, game) {
    const pos = pieceToRemove.position;
    if (!possibleMoves.some(el => JSON.stringify(el) === JSON.stringify(pos))) { //prevent a piece to capture itself
      return false;
    }
    //remove piece
    pieceToRemove.HTMLElement.remove()
    //place piece
    this.#HTMLElement.classList.replace(this.#HTMLElement.classList[3], pieceToRemove.HTMLElement.classList[3]);
    const prevPos = this.position;
    this.setPosition(pos);
    if ((this.name === 'pawn' || this.name === 'king' || this.name === 'rook') && !this.alreadyMoved) {
      this.alreadyMoved = true;
    }
    game.pieces = game.pieces.filter(el => el !== pieceToRemove);// remove captured piece from the ingame pieces array
    return true;
  }

  /* 
  check if a square is occupied by a piece, return the piece if it the case, false otherwise
  */
  isOccupied(pieces, pos) {
    const piece = pieces.find((piece) => JSON.stringify(piece.position) === JSON.stringify(pos));
    if (piece) {
      return piece;
    }
    return false;
  }

  checkPin(direction, pieces) {
    const position = this.position;
    let i = 1;
    let posToCheck = [position[0] + i * direction.x, position[1] + i * direction.y];
    let piece;
    while (this.isInBoard(posToCheck)) {
      piece = this.isOccupied(pieces, posToCheck);
      if (piece && (piece.name !== 'king' || piece.name === 'king' && piece.color !== this.color)) {
        return false;
        break;
      }

      if (piece && piece.color === this.color && piece.name === 'king') {
        this.pinDirection = direction;
        return true;
        break;
      }
      i++;
      posToCheck = [position[0] + i * direction.x, position[1] + i * direction.y];
    }
    return false;
  }

  getInteractingPieces(pieces, position) {
    const directions = [
      UP,
      DOWN,
      RIGHT,
      LEFT,
      UP_LEFT,
      UP_RIGHT,
      DOWN_LEFT,
      DOWN_RIGHT,
    ];
    let i;
    let piece;
    let posToCheck;
    let piecesToUpdate = new Set();
    piecesToUpdate.add(this);
    const positions = [position, this.position];
    for (const [posIndex, pos] of positions.entries()) {
      for (const direction of directions) {
        i = 1;
        posToCheck = [pos[0] + i * direction.x, pos[1] + i * direction.y];
        while (this.isInBoard(posToCheck)) {
          piece = this.isOccupied(pieces, posToCheck);

          if (piece && piece.color === this.color) {
            if (piece.hasDirection(direction) && (piece.name === 'rook' || piece.name === 'bishop' || piece.name === 'queen')) {
              piecesToUpdate.add(piece);
            }
            if (Object.keys(piece.pinDirection).length !== 0 && Math.abs(piece.pinDirection.x) === Math.abs(direction.x) && Math.abs(piece.pinDirection.y) === Math.abs(direction.y)) {
              piece.unpin();
            }
            break;
          }
          if (piece && piece.color !== this.color) {
            if (Object.keys(piece.pinDirection).length !== 0 && piece.pinDirection.x === direction.x && piece.pinDirection.y === direction.y && (!this.hasDirection(direction) || posIndex === 0)) {
              piece.unpin();
            }
            break;
          }
          i++;
          posToCheck = [pos[0] + i * direction.x, pos[1] + i * direction.y];
        }
      }
    }
    return piecesToUpdate;
  }

  isMoveValid(king, position) {
    const blockingSquares = king.blockingSquares;
    if (blockingSquares.length === 0) {
      return true;
    }
    for (const square of blockingSquares) {
      if (square[0] === position[0] && square[1] === position[1]) {
        return true;
      }
    }
    return false;
  }

  hasDirection(direction) {
    for (const pieceDirection of this.directions) {
      if (direction.x === pieceDirection.x && direction.y === pieceDirection.y) {
        return true;
      }
    }
    return false;
  }

  isInBoard(posToCheck) {
    return posToCheck[0] > 0 && posToCheck[0] <= 8 && posToCheck[1] > 0 && posToCheck[1] <= 8;
  }

  adaptDirections() {
    const adaptedDirections = [];
    const pinDirection = this.pinDirection;
    for (const direction of this.directions) {
      if (pinDirection.x === direction.x && pinDirection.y === direction.y || pinDirection.x * -1 === direction.x && pinDirection.y * -1 === direction.y) {
        adaptedDirections.push(direction);
      }
    }
    return adaptedDirections
  }

  set moves(moves) {
    this.#moves = moves;
  }

  get moves() {
    return this.#moves;
  }

  set position(newPos) {
    this.#position = newPos.map(coord => parseInt(coord, 10));
  }

  get position() {
    return this.#position;
  }

  get directions() {
    return this.#directions;
  }

  get name() {
    return this.#name;
  }

  get HTMLElement() {
    return this.#HTMLElement;
  }

  setPosition(newPos) {
    this.#position = newPos.map(coord => parseInt(coord, 10));
  }

  get color() {
    return this.#color;
  }
  get id() {
    return this.#id;
  }
  get pinDirection() {
    return this.#pinDirection;
  }
  set pinDirection(direction) {
    this.#pinDirection = direction;
  }

  unpin() {
    this.#pinDirection = {};
  }

}