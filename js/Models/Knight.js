import { Piece } from './Piece.js';
import {
  KNIGHT_UP_LEFT,
  KNIGHT_UP_RIGHT,
  KNIGHT_DOWN_LEFT,
  KNIGHT_DOWN_RIGHT,
  KNIGHT_RIGHT_UP,
  KNIGHT_RIGHT_DOWN,
  KNIGHT_LEFT_UP,
  KNIGHT_LEFT_DOWN
} from '../Utils/directions.js';

export class Knight extends Piece {

  constructor(id, position, color, game) {
    super(id, 'knight', position, color, game, [KNIGHT_UP_LEFT, KNIGHT_UP_RIGHT, KNIGHT_DOWN_LEFT, KNIGHT_DOWN_RIGHT, KNIGHT_RIGHT_UP, KNIGHT_RIGHT_DOWN, KNIGHT_LEFT_UP, KNIGHT_LEFT_DOWN]);
  }

  /* 
    create all the knights of the game.
  */
  static initKnights(game) {
    const knights = [];
    let color = 'white';
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const knight = new Knight(i * 2 + j, [j * 5 + 2, i * 7 + 1], color, game);
        knights.push(knight);
      }
      color = 'black';
    }
    return knights;
  }

  /* 
    generates an array of possible moves for the knight
    */
  calculateMoves(pieces, king, ennemyKing) {
    const moves = [];
    const position = this.position;
    if (king.checkingPieces.length > 1) {
      this.moves = moves;
      return;
    }
    const directions = Object.keys(this.pinDirection).length === 0 ? this.directions : this.adaptDirections();
    let piece;
    let posToCheck;
    for (const direction of directions) {
      posToCheck = [position[0] + direction.x, position[1] + direction.y];
      piece = this.isOccupied(pieces, posToCheck);
      if (this.isInBoard(posToCheck) && (!piece || piece && piece.color !== this.color)) {
        if (piece && piece.name === 'king') {
          ennemyKing.check(direction, pieces, this);
        }
        if (this.isMoveValid(king, posToCheck)) {
          moves.push(posToCheck);
        }
      }
    }
    this.moves = moves;
  }
}