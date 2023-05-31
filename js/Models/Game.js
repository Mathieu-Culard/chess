import { dragstart, dragend, dragover, drop, click } from "../Utils/events.js";
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

  /* represent a turn, pieceId is the id of the moved piece and squareId the id of it's arrival square */
  play(pieceId, squareId) {
    const targetSquare = document.getElementById(squareId); // get the id of the arrival square
    const piece = this.getPiece(pieceId); // gets the mouved piece instance by the id of its dom element
    const king = this.getKing(piece.color);
    const ennemyKing = this.getKing(piece.color === 'white' ? 'black' : 'white');
    const moves = piece.moves; // gets an array of possible movement for this piece
    let moved;
    let prevPos = piece.position;
    if (piece.color === this.turn) {
      if (pieceId === king.id && Math.abs(piece.position[0] - squareId.slice(0, 1)) === 2) { // if the king moves two squares horizontally
        moved = piece.move(squareId, moves); //move the king first
        if (moved) {
          this.handleCastling(king, ennemyKing); // then handle the rook movement
        }
      } else if (targetSquare.classList.contains('piece')) { // if the arrival square contains a piece, check if the capture is valid and update the in game pieces array
        moved = piece.capture(this.getPiece(squareId), moves, this);
      } else if (piece.name === 'pawn' && Math.abs(piece.position[0] - squareId.split('')[0]) === 1) {
        moved = piece.captureEnPassant(squareId,this);
      } else {
        moved = piece.move(squareId, moves);
      }
    }
    if (moved) {
      if (piece.name === 'pawn' && piece.checkPromotion()) { // if a pawn reach the other side of the board it has to promote before processing to next turn 
        this.displayPromotion(piece, prevPos);
      } else {
        this.proceedToNextTurn(piece, prevPos);
      }
    }
  }

  /* 
  piece is the piece that just been moved and prevPos its previous position 
  */
  proceedToNextTurn(piece, prevPos) {
    const king = this.getKing(piece.color);
    const ennemyKing = this.getKing(piece.color === 'white' ? 'black' : 'white');
    const piecesToUpdate = piece.getInteractingPieces(this.pieces, prevPos);
    piecesToUpdate.forEach(p => p.calculateMoves(this.pieces, king, ennemyKing));
    if (piece.name === 'pawn' && Math.abs(prevPos[1] - piece.position[1]) === 2) {
      piece.enPassant = true;
    }
    this.changeTurn();
    king.resetCheck();
    this.getPiecesByColor(this.turn).forEach(piece => piece.calculateMoves(this.pieces, ennemyKing, king));
    if (ennemyKing.isChecked && this.checkMat(ennemyKing)) {
      this.endGame();
    }
    console.log('--------------------------------TURN-----------------------------------');
  }

  /* if a king is in check and no pieces can move the game is over*/
  checkMat(king) {
    const pieces = this.getPiecesByColor(this.turn);
    for (const piece of pieces) {
      if (piece.moves.length !== 0) {
        return false;
      }
    }
    return true;
  }

  /* displays a text to the player that tells him if he has won or lost*/
  endGame() {
    this.pieces.forEach(piece => piece.moves = []);
    const endGameDiv = document.getElementById('end-game');
    endGameDiv.style.display = 'flex';
    endGameDiv.innerHTML = `<p>${this.turn === 'white' ? 'DEFEAT' : 'VICTORY'}<p>`
  }


  handleCastling(king, ennemyKing) {
    let rookId;
    let targetSquare;
    // get the id of the rook that needs to move and it's arrival square depending on the king color and position.
    if (king.color === 'white') {
      rookId = king.position[0] === 7 ? 1 : 0;
      targetSquare = rookId === 1 ? '61' : '41';
    } else {
      rookId = king.position[0] === 7 ? 3 : 2;
      targetSquare = rookId === 3 ? '68' : '48';
    }
    const rook = this.getPiece(`rook-${rookId}`);
    const position = rook.position;
    rook.move(targetSquare, rook.moves);
    const piecesToUpdate = rook.getInteractingPieces(this.pieces, position);
    piecesToUpdate.forEach(piece => piece.calculateMoves(this.pieces, king, ennemyKing));
  }


  /* displays a div that allow the player to promote a pawn*/
  displayPromotion(pawn, prevPos) {
    const promotionDiv = document.getElementById('promotion');
    const promotionItems = document.querySelectorAll('.promotion-item');
    const promotedTo = ['queen', 'rook', 'bishop', 'knight'];
    promotionItems.forEach((el, i) => {
      el.style.backgroundImage = `url('assets/img/${pawn.color}-${promotedTo[i]}.png')`;
      el.dataset.name = promotedTo[i];
      el.onclick = (e) => click(e, pawn, this, prevPos);
    });
    // set the correct position for the div
    promotionDiv.style.display = 'flex';
    const left = 12.5 * (pawn.position[0] - 1) - 1;
    promotionDiv.style.left = `${left}%`;
    if (pawn.color === 'black') {
      promotionDiv.style.bottom = '0';
      promotionDiv.style.top = '';
    } else {
      promotionDiv.style.bottom = '';
      promotionDiv.style.top = '0';
    }
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