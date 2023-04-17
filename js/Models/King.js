import { Piece } from './Piece.js';

export class King extends Piece {
  #alreadyMoved;
  constructor(id, position, color, game) {
    super(id, 'king', position, color, game);
    this.#alreadyMoved = false; // used to check if castle is possible
  }

  /* 
    create all the kings of the game.
  */
  static initKings(game) {
    const kings = [];
    let color = 'white';
    for (let i = 0; i < 2; i++) {
      const king = new King(i, [5, i * 7 + 1], color, game);
      kings.push(king);
      color = 'black';
    }
    return kings;
  }

  /* 
  generates an array of possible moves for the kings
  */
  getMoves(pieces) {
    const moves = [];
    const position = this.getPosition();
    let piece;
    let posToCheck;
    const directions = [ // each object represent a direction, 1 is used to increment the positions, -1 to decrement it ans 0 to stay on the same line/column
      {
        x: 1,
        y: 0,
      },
      {
        x: -1,
        y: 0,
      },
      {
        x: 0,
        y: 1,
      },
      {
        x: 0,
        y: -1,
      },
      {
        x: 1,
        y: 1,
      },
      {
        x: 1,
        y: -1,
      },
      {
        x: -1,
        y: 1,
      },
      {
        x: -1,
        y: -1,
      }
    ];
    for (let i = 0; i < directions.length; i++) {
      posToCheck = [position[0] + 1 * directions[i].x, position[1] + 1 * directions[i].y];
      if (posToCheck[0] > 0 && posToCheck[0] <= 8 && posToCheck[1] > 0 && posToCheck[1] <= 8) {
        piece = this.isOccupied(pieces, posToCheck);
        if ((piece && piece.getColor() !== this.getColor()) || !piece) {
          moves.push(posToCheck);
        }
      }
    }
    console.log(moves);
    return moves;
  }

}