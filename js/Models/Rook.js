import { Piece } from './Piece.js';
import { UP, DOWN, RIGHT, LEFT} from '../Utils/directions.js';

export class Rook extends Piece {
  #alreadyMoved;
  constructor(id, position, color, game) {
    super(id, 'rook', position, color, game);
    this.#alreadyMoved = false; // used to check if castle is possible
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
      // line = 8;
    }
    return rooks;
  }

  /* 
  generates an array of possible moves for the rooks
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
    let directions = [UP, DOWN, RIGHT, LEFT]
    if (Object.keys(this.getPinDirection()).length !== 0) {
      directions = this.containDirection(directions);
    }
    for (let i = 0; i < directions.length; i++) {
      j = 1
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