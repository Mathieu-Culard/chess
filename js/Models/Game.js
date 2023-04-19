import { dragstart, dragend, dragover, drop } from "../Utils/events.js";
import { Pawn } from "./Pawn.js";
import { Rook } from './Rook.js';
import { Bishop } from "./Bishop.js";
import { Knight } from "./Knight.js";
import { Queen } from './Queen.js';
import { King } from './King.js';


/* 
initialize chessboard and pieces
*/
export class Game {
  #chessboard = document.getElementById('chess-board');
  #pieces = [];
  #turn = 'white';
  #moves = [];

  constructor() {
    this.initChessBoard();
    this.#pieces = this.initPieces();
    this.putPieces();
  }

  /* Create squares of the chessboard */
  initChessBoard() {
    for (let i = 8; i > 0; i--) {
      for (let j = 0; j < 8; j++) {
        const newSquare = document.createElement('div');
        newSquare.id = `${j + 1}${i}` //id of a square is its coordinates
        if ((i % 2 + j) % 2 === 0) {
          newSquare.classList.add('even');
        } else {
          newSquare.classList.add('odd');
        }
        newSquare.addEventListener('dragover', (e) => dragover(e));
        newSquare.addEventListener('drop', (e) => drop(e, this)); // each square is a drop zone to put pieces
        this.#chessboard.append(newSquare);
      }
    }
  }


  initPieces() {
    const pieces = [...Pawn.initPawns(this), ...Rook.initRooks(this), ...Bishop.initBishops(this), ...Knight.initKnights(this), ...Queen.initQueens(this), ...King.initKings(this)];
    return pieces;
  }

  putPieces() {
    for (let i = 0; i < this.#pieces.length; i++) {
      this.#chessboard.append(this.#pieces[i].getHTMLElement());
    }
  }

  getChessBoard() {
    return this.#chessboard;
  }

  getPieces() {
    return this.#pieces;
  }
  setPieces(pieces) {
    this.#pieces = pieces;
  }

  getPiece(id) {
    let p = this.#pieces.find(piece =>
      piece.getHTMLElement().id === id
    )
    return p;
  }

  getTurn() {
    return this.#turn;
  }
  setTurn() {
    this.#turn = this.#turn === 'white' ? 'black' : 'white';
  }

  setMoves(piece, type, prevPos) {
    let mouvName;
    const to = String.fromCharCode('a'.charCodeAt(0) + piece.getPosition()[0] - 1);
    if (type === 'capture' && piece.getName() === 'pawn') {
      const from = String.fromCharCode('a'.charCodeAt(0) + prevPos[0] - 1);
      mouvName = `${from}x${to}${piece.getPosition()[1]}`;
    } else {
      const pieceName = piece.getName() === 'knight' ? piece.getName().slice(1, 2) : piece.getName().slice(0, 1); // make the difference between king and knight
      mouvName = type === 'capture' ? `${pieceName.toUpperCase()}x${to}${piece.getPosition()[1]}` : `${pieceName === 'p' ? '' : pieceName.toUpperCase()}${to}${piece.getPosition()[1]}`;
    }
    this.#moves.push(mouvName);
  }

}