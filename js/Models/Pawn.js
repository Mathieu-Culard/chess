import { Piece } from "./Piece.js";
import { UP, DOWN, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } from '../Utils/directions.js';

export class Pawn extends Piece {
  #alreadyMoved;
  constructor(id, position, color, game) {
    super(id, 'pawn', position, color, game);
    this.#alreadyMoved = false; // used to make the pawn advance 2squares only if it's its first move
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
  getMoves(pieces, king) {
    const moves = [];
    if (king.getCheckingPieces().length > 1) {
      return moves;
    }
    const position = this.getPosition();
    let posToCheck;
    let piece;
    const blackDirections = [DOWN, DOWN_LEFT, DOWN_RIGHT];
    const whiteDirections = [UP, UP_LEFT, UP_RIGHT];
    let usedDirections = this.getColor() === 'white' ? whiteDirections : blackDirections;
    if (Object.keys(this.getPinDirection()).length !== 0) {
      usedDirections = this.containDirection(usedDirections);
    }
    for (let i = 0; i < usedDirections.length; i++) {
      posToCheck = [position[0] + 1 * usedDirections[i].x, position[1] + 1 * usedDirections[i].y];
      if (posToCheck[0] > 0 && posToCheck[0] <= 8 && posToCheck[1] > 0 && posToCheck[1] <= 8) {
        piece = this.isOccupied(pieces, posToCheck);
        if (usedDirections[i].x === 0 && !piece) {
          moves.push(posToCheck);
          if (!this.getAlreadyMoved()) {
            posToCheck = [position[0], position[1] + 2 * usedDirections[i].y];
            piece = this.isOccupied(pieces, posToCheck);
            if (!piece) {
              moves.push(posToCheck);
            }
          }
        } else if (usedDirections[i].x !== 0 && piece && piece.getColor() !== this.getColor()) {
          moves.push(posToCheck);
        }
      }
    }
    if (king.getCheckingPieces().length === 1) {
      return this.getPossibleMoves(moves,king.getBlockingSquares());
    }

    return moves;
  }

  getAlreadyMoved() {
    return this.#alreadyMoved;
  }

  setAlreadyMoved() {
    this.#alreadyMoved = true;
  }

}
