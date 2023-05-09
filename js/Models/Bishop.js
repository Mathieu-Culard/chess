import { Piece } from './Piece.js';
import { UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } from '../Utils/directions.js';

export class Bishop extends Piece {

  constructor(id, position, color, game) {
    super(id, 'bishop', position, color, game, [UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT]);
  }
  /* 
    create all the bishops of the game.
  */
  static initBishops(game) {
    const bishops = [];
    let color = 'white';
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const bishop = new Bishop(i * 2 + j, [j * 3 + 3, i * 7 + 1], color, game);
        bishops.push(bishop);
      }
      color = 'black';
    }
    return bishops;
  }

  /* 
  generates an array of possible moves for the bishops
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
    for (const direction of directions) { // for each direction
      i = 1;
      posToCheck = [position[0] + i * direction.x, position[1] + i * direction.y];
      //if the next coordinates to check are contained in the chess board
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
          break;      // if its a piece to capture don't check futher
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
