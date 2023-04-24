import { dragend, dragover, dragstart, drop, mouseDown, mouseUp } from "../Utils/events.js";
import { Pawn } from "./Pawn.js";

/* Abstract class used to extend all pieces classes */
export class Piece {
  #id;
  #name = '';
  #color = '';
  #position = [];
  #HTMLElement;
  #pinDirection = [];// represents the direction in which the piece can move if it is pinned to the king.

  constructor(id, name, position, color, game) {
    if (this.constructor === Piece) {
      throw new TypeError('Abstract class "Piece" cannot be instantiated directly')
    }
    this.#id = `${name}-${id}`
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
  move(coords, possibleMoves, game) {
    const pos = coords.split('');
    if (possibleMoves.some(el => JSON.stringify(el) === JSON.stringify(pos.map(coord => parseInt(coord, 10))))) {
      const prevPos = this.getPosition();
      this.setPosition(pos);
      this.#HTMLElement.classList.replace(this.#HTMLElement.classList[3], `square-${this.#position[0]}${this.#position[1]}`);
      if (this instanceof Pawn && !this.getAlreadyMoved()) {
        this.setAlreadyMoved();
      }
      game.setMoves(this, 'move', prevPos);
      return true;

    }
    return false;
  }

  /* 
  replaces the position of the mouved piece by the coordinates of the captured piece
  */
  capture(pieceToRemove, pieces, possibleMoves, game) {
    const pos = pieceToRemove.getPosition();
    if (possibleMoves.some(el => JSON.stringify(el) === JSON.stringify(pos))) { //prevent a piece to capture itself
      //remove piece
      pieceToRemove.getHTMLElement().remove();
      //place piece
      this.#HTMLElement.classList.replace(this.#HTMLElement.classList[3], pieceToRemove.getHTMLElement().classList[3]);
      const prevPos = this.getPosition();
      this.setPosition(pieceToRemove.getPosition());
      if (this instanceof Pawn && !this.getAlreadyMoved()) {
        this.setAlreadyMoved();
      }
      game.setMoves(this, 'capture', prevPos);
      game.setPieces(pieces.filter(el => el !== pieceToRemove));// remove captured piece from the ingame pieces array
      return true;
    }
    return false;
  }

  containDirection(pieceDirections) {
    const directions = [];
    for (let i = 0; i < this.#pinDirection.length; i++) {
      for (let j = 0; j < pieceDirections.length; j++) {
        if (pieceDirections[j].x === this.#pinDirection[i].x && pieceDirections[j].y === this.#pinDirection[i].y) {
          directions.push(this.#pinDirection[i]);
        }
      }
    }
    return directions;
  }

  //if the king is in check compare the possible moves of a piece (moves) with the moves that allow the king to get out of check (possibleMoves) and return the moves that are available in both arguments
  getPossibleMoves(moves, possibleMoves) {
    const finalMoves = [];
    for (let i = 0; i < possibleMoves.length; i++) {
      for (let j = 0; j < moves.length; j++) {
        if (possibleMoves[i][0] === moves[j][0] && possibleMoves[i][1] === moves[j][1]){
          finalMoves.push(possibleMoves[i]);
        }
      }
    }
    return finalMoves;
  }

  /* 
  check if a square is occupied by a piece, return the piece if it the case, false otherwise
  */
  isOccupied(pieces, pos) {
    const piece = pieces.find((piece) => JSON.stringify(piece.getPosition()) === JSON.stringify(pos));
    if (piece) {
      return piece;
    }
    return false;
  }
  getName() {
    return this.#name;
  }

  getHTMLElement() {
    return this.#HTMLElement;
  }

  getPosition() {
    return this.#position;
  }

  setPosition(newPos) {
    this.#position = newPos.map(coord => parseInt(coord, 10));
  }

  getColor() {
    return this.#color;
  }
  getId() {
    return this.#id;
  }
  getPinDirection() {
    return this.#pinDirection;
  }
  setPinDirection(pinDirection) {
    this.#pinDirection = pinDirection;
  }


}