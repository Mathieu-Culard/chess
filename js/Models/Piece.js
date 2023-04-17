import { dragend, dragover, dragstart, drop, mouseDown, mouseUp } from "../Utils/events.js";
import { Pawn } from "./Pawn.js";

/* Abstract class used to extend all pieces classes */
export class Piece {
  #id;
  #name = '';
  #color = '';
  #position = [];
  #HTMLElement;

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
    HTMLElement.addEventListener('drop', (e) => drop(e, game));                 // pass the game to the events in order to get the mouved pieces et fetch the game pieces array
    HTMLElement.addEventListener('mousedown', (e) => mouseDown(e, this, game));
    HTMLElement.addEventListener('mouseup', (e) => mouseUp(e));
    return HTMLElement;
  }


  /* 
    replaces the position of the mouved piece by the passed coordinates if these coordinates are in the Array of possible moves for this piece 
  */
  move(coords, possibleMoves) {
    const pos = coords.split('');
    if (possibleMoves.some(el => JSON.stringify(el) === JSON.stringify(pos.map(coord => parseInt(coord, 10))))) { 
      this.setPosition(pos);
      this.#HTMLElement.classList.replace(this.#HTMLElement.classList[3], `square-${this.#position[0]}${this.#position[1]}`);
      if (this instanceof Pawn) {
        this.setAlreadyMove();
      }
    }
  }

  /* 
  replaces the position of the mouved piece by the coordinates of the captured piece
  */
  capture(pieceToRemove, pieces, possibleMoves) {
    const pos = pieceToRemove.getPosition();
    if (possibleMoves.some(el => JSON.stringify(el) === JSON.stringify(pos))) { //prevent a piece to capture itself
      console.log(JSON.stringify(pos));
      //remove piece
      pieceToRemove.getHTMLElement().remove();
      //place piece
      this.#HTMLElement.classList.replace(this.#HTMLElement.classList[3], pieceToRemove.getHTMLElement().classList[3]);
      this.setPosition(pieceToRemove.getPosition());

      const newPieces = pieces.filter(el => el !== pieceToRemove); // remove captured piece from the ingame pieces array
      if (this instanceof Pawn) {
        this.setAlreadyMove();
      }
      return newPieces;

    }
    return pieces;
  }

  /* 
  check if a square is occupied by a piece, return the piece if it the case, false otherwise
  */
  isOccupied(pieces, pos) {
    // pieces.some((piece) => JSON.stringify(piece.getPosition()) === JSON.stringify(pos));
    const piece = pieces.find((piece) => JSON.stringify(piece.getPosition()) === JSON.stringify(pos));
    if (piece) {
      return piece;
    }
    return false;
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
  // toJson() {
  //   return JSON.stringify(this.#globalData);
  // }
}