import { Piece } from './Piece.js';

export class Bishop extends Piece {

  constructor(id, position, color, game) {
    super(id, 'bishop', position, color, game);
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
  getMoves(pieces) {
    const moves = [];
    const position = this.getPosition();
    let i;
    let piece;
    let posToCheck;
    let directions = [ // each object represent a direction, 1 is used to increment the positions and -1 to decrement it
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
    for (let j = 0; j < directions.length; j++) { // for each direction
      i = 1;
      //if the next coordinates to check are contained in the chess board
      while (position[0] + i * directions[j].x > 0 && position[0] + i * directions[j].x <= 8 && position[1] + i * directions[j].y > 0 && position[1] + i * directions[j].y <= 8) {
        posToCheck = [position[0] + i * directions[j].x, position[1] + i * directions[j].y];
        // console.log(posToCheck);
        piece = this.isOccupied(pieces, posToCheck);
        // push it to the possible moves array
        if ((piece && piece.getColor() !== this.getColor())) { 
          moves.push(posToCheck);
          break;      // if its a piece to capture don't check futher
        } else if (!piece) {
          moves.push(posToCheck);
        } else { // if it's piece of the same color
          break;
        }
        i++;
      }
    }
    return moves;
  }

}
