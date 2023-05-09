import { Piece } from './Piece.js';
import { UP, DOWN, RIGHT, LEFT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } from '../Utils/directions.js';

export class Queen extends Piece {

  constructor(id, position, color, game) {
    super(id, 'queen', position, color, game, [UP, DOWN, RIGHT, LEFT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT]);
  }


  /* 
    create all the queens of the game.
  */
  static initQueens(game) {
    const Queens = [];
    let color = 'white';
    for (let i = 0; i < 2; i++) {
      const queen = new Queen(i, [4, i * 7 + 1], color, game);
      Queens.push(queen);
      color = 'black';
    }
    return Queens;
  }

  /* 
    generates an array of possible moves for the queens
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
      i = 1;
      posToCheck = [position[0] + i * direction.x, position[1] + i * direction.y];
      while (this.isInBoard(posToCheck)) {
        posToCheck = [position[0] + i * direction.x, position[1] + i * direction.y];
        piece = this.isOccupied(pieces, posToCheck);
        if ((piece && piece.color === this.color)) {
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