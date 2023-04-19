import { Piece } from './Piece.js';

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
  getMoves(pieces) {
    const moves = [];
    const position = this.getPosition();
    // console.log(position);
    let j;
    let piece;
    let posToCheck;
    let directions = [ // each object represent a direction, 1 is used to increment the position on the corresponding axis, -1 to decrement it and 0 to stay on the same line/column
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
      }
    ]
    if (Object.keys(this.getPinDirection()).length !== 0) {
      directions = this.containDirection(directions, this.getPinDirection());
      directions.push({ x: directions[0].x * -1, y: directions[0].y * -1 });
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
    return moves;
  }


}