import { Piece } from './Piece.js';

export class Knight extends Piece {

  constructor(id, position, color, game) {
    super(id, 'knight', position, color, game);
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
  getMoves(pieces) {
    const moves = [];
    const position = this.getPosition();
    let posToCheck;
    const directions = [ // each object represent a direction, 1 is used to increment the positions, -1 to decrement
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
      for (let j = 0; j < 2; j++) {
        posToCheck = j === 0 ?
          [position[0] + 1 * directions[i].x, position[1] + 2 * directions[i].y] :
          [position[0] + 2 * directions[i].x, position[1] + 1 * directions[i].y];
        // console.log(posToCheck);
        if (posToCheck[0] > 0 && posToCheck[0] <= 8 && posToCheck[1] > 0 && posToCheck[1] <= 8 && (!this.isOccupied(pieces,posToCheck) || this.isOccupied(pieces,posToCheck).getColor()!== this.getColor())){
          console.log(posToCheck);
          moves.push(posToCheck);
        }
      }

    }
    return moves;
  }
}