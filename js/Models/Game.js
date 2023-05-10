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
  #whiteKing;
  #blackKing;

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
    pieces.forEach(piece => piece.calculateMoves(pieces, piece.color === 'white' ? this.getKing('white') : this.getKing('black'), piece.color === 'white' ? this.getKing('black') : this.getKing('white')));
    return pieces;
  }

  putPieces() {
    for (let i = 0; i < this.#pieces.length; i++) {
      this.#chessboard.append(this.#pieces[i].HTMLElement);
    }
  }

  play(pieceId, squareId) {
    const targetSquare = document.getElementById(squareId); // get the id of the arrival square
    const piece = this.getPiece(pieceId); // gets the mouved piece instance by the id of its dom element
    const king = this.getKing(piece.color);
    const ennemyKing = this.getKing(piece.color === 'white' ? 'black' : 'white');
    const moves = piece.moves; // gets an array of possible movement for this piece
    let moved;
    let prevPos = piece.position;
    if (piece.color === this.turn) {
      if (pieceId === king.id && Math.abs(piece.position[0] - squareId.slice(0, 1)) === 2) {
        moved = piece.move(squareId, moves);
        if (moved) {
          this.handleCastling(king, ennemyKing);
        }
      } else if (targetSquare.classList.contains('piece')) { // if the arrival square contains a piece, check if the capture is valid and update the in game pieces array
        moved = piece.capture(this.getPiece(squareId), moves, this);
      } else {
        moved = piece.move(squareId, moves);
      }
    }
    if (moved) {
      const piecesToUpdate = piece.getInteractingPieces(this.pieces, prevPos);
      piecesToUpdate.forEach(piece => piece.calculateMoves(this.pieces, king, ennemyKing));
      this.changeTurn();
      king.resetCheck();
      this.getPiecesByColor(this.turn).forEach(piece => piece.calculateMoves(this.pieces, ennemyKing, king));
      console.log('--------------------------------TURN-----------------------------------');
    }
  }

  handleCastling(king, ennemyKing) {
    let rookId;
    let targetSquare;
    if (king.color === 'white') {
      rookId = king.position[0] === 7 ? 1 : 0;
      targetSquare = rookId === 1 ? '61' : '41';
    } else {
      rookId = king.position[0] === 7 ? 3 : 2;
      targetSquare = rookId === 3 ? '68' : '48';
    }
    const rook = this.getPiece(`rook-${rookId}`);
    const position = rook.position;
    const oui = rook.move(targetSquare, rook.moves);
    const piecesToUpdate = rook.getInteractingPieces(this.pieces, position);
    piecesToUpdate.forEach(piece => piece.calculateMoves(this.pieces, king, ennemyKing));
  }

  get chessBoard() {
    return this.#chessboard;
  }

  get pieces() {
    return this.#pieces;
  }

  set pieces(pieces) {
    this.#pieces = pieces;
  }

  getPiece(id) {
    let p = this.#pieces.find(piece =>
      piece.HTMLElement.id === id
    )
    return p;
  }

  getPiecesByColor(color) {
    return this.#pieces.filter(piece => piece.color === color);
  }

  get turn() {
    return this.#turn;
  }
  changeTurn() {
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

  setKings(kings) {
    this.#whiteKing = kings[0];
    this.#blackKing = kings[1];
  }

  getKing(color) {
    if (color === 'white') {
      return this.#whiteKing;
    }
    return this.#blackKing;
  }

}