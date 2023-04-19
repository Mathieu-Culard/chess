import { Piece } from './Piece.js';

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
  getMoves(pieces) {
    const moves = [];
    const position = this.getPosition();
    let j;
    let piece;
    let posToCheck;
    let directions = [ // each object represent a direction, 1 is used to increment the positions, -1 to decrement it ans 0 to stay on the same line/column
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
    if (Object.keys(this.getPinDirection()).length !== 0) {
      directions = this.containDirection(directions, this.getPinDirection());
      directions.push({ x: directions[0].x * -1, y: directions[0].y * -1 });
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
    return moves;
  }

}