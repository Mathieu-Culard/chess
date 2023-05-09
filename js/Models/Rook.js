import { Piece } from './Piece.js';
import { UP, DOWN, RIGHT, LEFT } from '../Utils/directions.js';

export class Rook extends Piece {
  #alreadyMoved = false;// used to check if castle is possible
  constructor(id, position, color, game) {
    super(id, 'rook', position, color, game, [UP, DOWN, RIGHT, LEFT]);

  }

  /* 
    create all the rooks of the game.
  */
  static initRooks(game) {
    const rooks = [];
    let color = 'white';
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const rook = new Rook(i * 2 + j, [j * 7 + 1, i * 7 + 1], color, game);
        rooks.push(rook);
      }
      color = 'black';
    }
    return rooks;
  }

  /* 
  generates an array of possible moves for the rooks
  */
  calculateMoves(pieces, king, ennemyKing) {
    const moves = [];
    if (king.checkingPieces.length > 1) {
      this.moves = moves;
      return;
    }
    const position = this.position;
    const directions = Object.keys(this.pinDirection).length === 0 ? this.directions : this.adaptDirections();
    let i;
    let piece;
    let posToCheck;
    for (const direction of directions) {
      i = 1
      posToCheck = [position[0] + i * direction.x, position[1] + i * direction.y];
      while (this.isInBoard(posToCheck)) {
        posToCheck = [position[0] + i * direction.x, position[1] + i * direction.y];
        piece = this.isOccupied(pieces, posToCheck);
        if (piece && piece.color === this.color) {
          break;
        }
        if ((piece && piece.color !== this.color)) {
          if (piece.name === 'king') {
            ennemyKing.check(direction, pieces, this);
          } else {
            if (this.isMoveValid(king, posToCheck)) {
              moves.push(posToCheck);
            }
            piece.checkPin(direction, pieces);
          }
          break;
        }
        if (this.isMoveValid(king, posToCheck)) {
          moves.push(posToCheck);
        }
        i++;
        posToCheck = [position[0] + i * direction.x, position[1] + i * direction.y];
      }
    }
    this.moves = moves;
  }
}