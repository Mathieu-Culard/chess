import { Piece } from "./Piece.js";
import { UP, DOWN, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } from '../Utils/directions.js';

export class Pawn extends Piece {
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
        moves = this.getPossibleMoves(pieces, posToCheck, direction, moves, king, ennemyKing, true);
      } else if (direction.x === 0 && !piece || direction.x !== 0 && piece && piece.color !== this.color) {
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

  get alreadyMoved() {
    return this.#alreadyMoved;
  }

  set alreadyMoved(alreadyMoved) {
    this.#alreadyMoved = alreadyMoved;
  }

}
