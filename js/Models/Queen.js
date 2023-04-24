import { Piece } from './Piece.js';
import { UP, DOWN, RIGHT, LEFT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } from '../Utils/directions.js';

export class Queen extends Piece {

  constructor(id, position, color, game) {
    super(id, 'queen', position, color, game);
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
  getMoves(pieces,king) {
    const moves = [];
    if (king.getCheckingPieces().length > 1) {
      return moves;
    }
    const position = this.getPosition();
    let j;
    let piece;
    let posToCheck;
    let directions = [UP, DOWN, RIGHT, LEFT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT];
    if (Object.keys(this.getPinDirection()).length !== 0) { //restrict the movement if it is pinned
      directions = this.containDirection(directions);
    }
    for (let i = 0; i < directions.length; i++) {
      j = 1;
      while (position[0] + j * directions[i].x > 0 && position[0] + j * directions[i].x <= 8 && position[1] + j * directions[i].y > 0 && position[1] + j * directions[i].y <= 8) {
        posToCheck = [position[0] + j * directions[i].x, position[1] + j * directions[i].y];
        piece = this.isOccupied(pieces, posToCheck);
        if ((piece && piece.getColor() !== this.getColor())) {
          moves.push(posToCheck);
          break;
        } else if (!piece) {
          moves.push(posToCheck);
        } else {
          break;
        }
        j++;
      }
    }
    if (king.getCheckingPieces().length === 1) {
      return this.getPossibleMoves(moves,king.getBlockingSquares());
    }
    return moves;
  }

}