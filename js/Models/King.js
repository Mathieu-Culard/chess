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
    return moves;
  }

  setPinnedPieces(pieces) {
    const position = this.getPosition();
    let piece;
    let posToCheck;
    let j;
    let breaked;
    let protector;
    const directions = [ // each object represent a direction, 1 is used to increment the positions, -1 to decrement it ans 0 to stay on the same line/column
      { // rooks and queens
        name: 'line right',
        usedBy: ['rook', 'queen'],
        x: 1,
        y: 0,
      },
      {
        name: 'line left',
        usedBy: ['rook', 'queen'],
        x: -1,
        y: 0,
      },
      {
        name: 'column up',
        usedBy: ['rook', 'queen'],
        x: 0,
        y: 1,
      },
      {
        name: 'column down',
        usedBy: ['rook', 'queen'],
        x: 0,
        y: -1,
      },
      { // bishops queens and white pawn
        name: 'diag up right',
        usedBy: ['bishop', 'queen'],
        x: 1,
        y: 1,
      },
      {
        name: 'diag up left',
        usedBy: ['bishop', 'queen'],
        x: -1,
        y: 1,
      },
      { // bishops queens and black pawn
        name: 'diag down right',
        usedBy: ['bishop', 'queen'],
        x: 1,
        y: -1,
      },
      {
        name: 'diag down left',
        usedBy: ['bishop', 'queen'],
        x: -1,
        y: -1,
      }
    ];
    for (let i = 0; i < directions.length; i++) { //for each direction
      j = 1;
      protector = '';
      breaked = false;
      while (position[0] + j * directions[i].x > 0 && position[0] + j * directions[i].x <= 8 && position[1] + j * directions[i].y > 0 && position[1] + j * directions[i].y <= 8) { //looks the next square ine that direction
        posToCheck = [position[0] + j * directions[i].x, position[1] + j * directions[i].y];
        piece = this.isOccupied(pieces, posToCheck);
        if (piece && piece.getColor() !== this.getColor() && directions[i].usedBy.includes(piece.getName()) && protector) {
          protector.setPinDirection([{
            x: directions[i].x,
            y: directions[i].y
          },
          {
            x: directions[i].x * -1,
            y: directions[i].y * -1
          }]);
          breaked = true;
          break;
        } else if (piece && (piece.getColor() === this.getColor() && protector || piece.getColor() !== this.getColor() && !directions[i].usedBy.includes(piece.getName()))) {
          if (protector && Object.keys(protector.getPinDirection()).length !== 0) {
            protector.setPinDirection([]);
          }
          if (piece.getColor() === this.getColor() && Object.keys(piece.getPinDirection()).length !== 0) {
            piece.setPinDirection([]);
          }
          break;
        } else if (piece && piece.getColor() === this.getColor() && !protector) {
          protector = piece;
        }
        j++;
      }
      if (!breaked && protector && Object.keys(protector.getPinDirection()).length !== 0) {
        protector.setPinDirection([]);
      }
    }
  }
}
