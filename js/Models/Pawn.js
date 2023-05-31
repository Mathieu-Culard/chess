import { Piece } from "./Piece.js";
import { Queen } from '../Models/Queen.js';
import { Bishop } from '../Models/Bishop.js';
import { Knight } from '../Models/Knight.js';
import { Rook } from '../Models/Rook.js';
import { UP, DOWN, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } from '../Utils/directions.js';

export class Pawn extends Piece {
  #enPassant = false;
  #alreadyMoved = false;// used to make the pawn advance 2squares only if it's its first move
  constructor(id, position, color, game) {
    const directions = color === 'white' ? [UP, UP_LEFT, UP_RIGHT] : [DOWN, DOWN_LEFT, DOWN_RIGHT];
    super(id, 'pawn', position, color, game, directions);
  }


  /* 
    create all the pawns of the game.
  */
  static initPawns(game) {
    const pawns = [];
    let color = 'white'
    let line = 2;
    for (let i = 0; i < 2; i++) {
      for (let col = 0; col < 8; col++) {
        const pawn = new Pawn(i * 8 + col, [col + 1, line], color, game);
        pawns.push(pawn);
      }
      color = 'black';
      line = 7;
    }
    return pawns;
  }

  /* 
    generates an array of possible moves for the pawns
    */
  calculateMoves(pieces, king, ennemyKing) {
    let moves = [];
    const position = this.position;
    if (this.enPassant) {
      this.enPassant = false;
    }
    if (king.checkingPieces.length > 1) {
      this.moves = moves;
      return;
    }

    const directions = Object.keys(this.pinDirection).length === 0 ? this.directions : this.adaptDirections();
    for (const direction of directions) {
      moves = this.getPossibleMoves(pieces, position, direction, moves, king, ennemyKing, false);
    }
    this.moves = moves;
  }

  getPossibleMoves(pieces, position, direction, moves, king, ennemyKing, stop) {
    let piece;
    const posToCheck = [position[0] + direction.x, position[1] + direction.y];
    if (this.isInBoard(posToCheck)) {
      piece = this.isOccupied(pieces, posToCheck);
      if (direction.x === 0 && !piece && !this.alreadyMoved && !stop) {
        if (this.isMoveValid(king, posToCheck)) {
          moves.push(posToCheck);
        }
        moves = this.getPossibleMoves(pieces, posToCheck, direction, moves, king, ennemyKing, true);  // if the pawn hasn't moved yet and isn't blocked, check a square futher.
      } else if (direction.x === 0 && !piece || direction.x !== 0 && piece && piece.color !== this.color || this.isEnPassant(pieces, direction)) {
        if (piece && piece.name === 'king') {
          ennemyKing.check(direction, pieces, this);
        }
        if (this.isMoveValid(king, posToCheck)) {
          moves.push(posToCheck);
        }
      }
    }
    return moves;
  }

  isEnPassant(pieces, direction) {
    let posToCheck = [this.position[0] + direction.x, this.position[1]];
    let piece = this.isOccupied(pieces, posToCheck);
    if (piece && piece.name === 'pawn' && piece.color !== this.color && piece.enPassant) {
      return true
    }
    return false;
  }

  /* return true if the pawn reach the other side of the board*/
  checkPromotion() {
    if (this.color === 'white' && this.position[1] === 8 || this.color === 'black' && this.position[1] === 1) {
      return true;
    }
    return false;
  }

  promote(e, game, prevPos) {
    let newPiece;
    switch (e.target.dataset.name) {
      case 'queen':
        newPiece = new Queen(10 + parseInt(this.id.slice(-1)), this.position, this.color, game);
        break;
      case 'knight':
        newPiece = new Knight(10 + parseInt(this.id.slice(-1)), this.position, this.color, game);
        break;
      case 'bishop':
        newPiece = new Bishop(10 + parseInt(this.id.slice(-1)), this.position, this.color, game);
        break;
      case 'rook':
        newPiece = new Rook(10 + parseInt(this.id.slice(-1)), this.position, this.color, game);
        break;
    }
    const pawnIndex = game.pieces.indexOf(this);
    const pieces = [...game.pieces];
    pieces[pawnIndex] = newPiece;
    game.pieces = pieces;
    this.HTMLElement.remove();
    game.chessBoard.append(newPiece.HTMLElement);
    document.getElementById('promotion').style.display = 'none';
    game.proceedToNextTurn(newPiece, prevPos);
  }
  
  get alreadyMoved() {
    return this.#alreadyMoved;
  }

  set alreadyMoved(alreadyMoved) {
    this.#alreadyMoved = alreadyMoved;
  }

  get enPassant() {
    return this.#enPassant;
  }

  set enPassant(enPassant) {
    this.#enPassant = enPassant;
  }

}
