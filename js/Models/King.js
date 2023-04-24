import { Piece } from './Piece.js';
import { UP, DOWN, RIGHT, LEFT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT } from '../Utils/directions.js';

export class King extends Piece {
  #alreadyMoved;
  #blockingSquares
  #checkingPieces;
  constructor(id, position, color, game) {
    super(id, 'king', position, color, game);
    this.#alreadyMoved = false; // used to check if castle is possible
    this.#checkingPieces = [];
    this.#blockingSquares = []//squares that allow the king to get out of the check either by blocking or taking the checking piece
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
    const directions = [UP, DOWN, RIGHT, LEFT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT];
    for (let i = 0; i < directions.length; i++) {
      posToCheck = [position[0] + 1 * directions[i].x, position[1] + 1 * directions[i].y];
      if (posToCheck[0] > 0 && posToCheck[0] <= 8 && posToCheck[1] > 0 && posToCheck[1] <= 8) {
        piece = this.isOccupied(pieces, posToCheck);
        if (!this.isChecked(pieces, posToCheck, true) && (!piece || piece && piece.getColor() !== this.getColor())) {
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
    const directions = [
      {
        usedBy: ['rook', 'queen'],
        ...RIGHT
      },
      {
        usedBy: ['rook', 'queen'],
        ...LEFT
      },
      {
        usedBy: ['rook', 'queen'],
        ...UP
      },
      {
        usedBy: ['rook', 'queen'],
        ...DOWN
      },
      {
        usedBy: ['bishop', 'queen'],
        ...UP_RIGHT
      },
      {
        usedBy: ['bishop', 'queen'],
        ...UP_LEFT
      },
      {
        usedBy: ['bishop', 'queen'],
        ...DOWN_RIGHT
      },
      {
        usedBy: ['bishop', 'queen'],
        ...DOWN_LEFT
      }
    ];
    for (let i = 0; i < directions.length; i++) { //for each direction
      j = 1;
      protector = '';
      breaked = false;
      while (position[0] + j * directions[i].x > 0 && position[0] + j * directions[i].x <= 8 && position[1] + j * directions[i].y > 0 && position[1] + j * directions[i].y <= 8) { //looks the next square in that direction
        posToCheck = [position[0] + j * directions[i].x, position[1] + j * directions[i].y];
        piece = this.isOccupied(pieces, posToCheck);
        //if an allied piece is encountered and the king isn't already protected, that piece is the protector
        if (piece && piece.getColor() === this.getColor() && !protector) {
          protector = piece;
          //if an allied piece is encountered and the king already have a protector, none of these pieces can be pinned in that direction
          // or if an ennemy piece that can't target the king is encountered stop the search
        } else if (piece && (piece.getColor() === this.getColor() && protector || piece.getColor() !== this.getColor() && !directions[i].usedBy.includes(piece.getName()))) {
          if (protector && Object.keys(protector.getPinDirection()).length !== 0) {
            protector.setPinDirection([]);
          }
          if (piece.getColor() === this.getColor() && Object.keys(piece.getPinDirection()).length !== 0) {
            piece.setPinDirection([]);
          }
          break;
          // if an ennemy piece that can target the king is encountered after a protector, that protector is pinned
        } else if (piece && piece.getColor() !== this.getColor() && directions[i].usedBy.includes(piece.getName()) && protector) {
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
        }
        j++;
      }
      // if the search goes to the edge of the board, unpinned the protector
      if (!breaked && protector && Object.keys(protector.getPinDirection()).length !== 0) {
        protector.setPinDirection([]);
      }
    }
  }


  // check if the king is in check, change it's property in that case, or if he can move to the nextPos, return true or false in that case 
  isChecked(pieces, nextPos = [], kingsmove = false) {
    const position = kingsmove ? nextPos : this.getPosition();
    let piece;
    let blockingSquare;
    let posToCheck;
    let j;
    const directions = [
      {
        usedBy: ['rook', 'queen'],
        ...RIGHT
      },
      {
        usedBy: ['rook', 'queen'],
        ...LEFT
      },
      {
        usedBy: ['rook', 'queen'],
        ...UP
      },
      {
        usedBy: ['rook', 'queen'],
        ...DOWN
      },
      {
        usedBy: ['bishop', 'queen'],
        ...UP_RIGHT
      },
      {
        usedBy: ['bishop', 'queen'],
        ...UP_LEFT
      },
      {
        usedBy: ['bishop', 'queen'],
        ...DOWN_RIGHT
      },
      {
        usedBy: ['bishop', 'queen'],
        ...DOWN_LEFT
      }
    ];
    if (this.getColor() === 'white') {
      directions[4].usedBy.push('pawn');
      directions[5].usedBy.push('pawn');
    } else {
      directions[6].usedBy.push('pawn');
      directions[7].usedBy.push('pawn');
    }
    for (let i = 0; i < directions.length; i++) { //for each direction
      j = 1;
      blockingSquare = [];
      while (position[0] + j * directions[i].x > 0 && position[0] + j * directions[i].x <= 8 && position[1] + j * directions[i].y > 0 && position[1] + j * directions[i].y <= 8) { //looks the next square in that direction
        posToCheck = [position[0] + j * directions[i].x, position[1] + j * directions[i].y];
        piece = this.isOccupied(pieces, posToCheck);
        blockingSquare.push(posToCheck);
        if (piece && piece.getColor() !== this.getColor() && directions[i].usedBy.includes(piece.getName()) && (piece.getName() !== 'pawn' || piece.getName() === 'pawn' && j === 1)) {
          if (!kingsmove) {
            this.setCheckingPieces(piece.getName());
            this.setBlockingSquares(blockingSquare);
            break;
          }
          else {
            return true;
          }
        } else if (piece && (piece.getColor() === this.getColor() || !directions[i].usedBy.includes(piece.getName()))) {
          break;
        }
        j++;
      }
    }
    const knightcheck = this.knightCheck(pieces, nextPos, kingsmove);
    if (kingsmove) {
      return false || knightcheck;
    }
  }

  knightCheck(pieces, nextPos = [], kingsmove = false) {
    let posToCheck;
    let piece;
    const position = kingsmove ? nextPos : this.getPosition();
    let directions = [UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT];
    for (let i = 0; i < directions.length; i++) {
      for (let j = 0; j < 2; j++) {
        posToCheck = j === 0 ?
          [position[0] + 1 * directions[i].x, position[1] + 2 * directions[i].y] :
          [position[0] + 2 * directions[i].x, position[1] + 1 * directions[i].y];
        piece = this.isOccupied(pieces, posToCheck);
        if (posToCheck[0] > 0 && posToCheck[0] <= 8 && posToCheck[1] > 0 && posToCheck[1] <= 8 && (piece && piece.getColor() !== this.getColor() && piece.getName() === 'knight')) {
          if (!kingsmove) {
            this.setCheckingPieces('knight');
            this.setBlockingSquares([posToCheck]);
            return;
          } else {
            return true;
          }
        }
      }
    }
    return false;
  }

  getBlockingSquares() {
    return this.#blockingSquares;
  }

  getCheckingPieces() {
    return this.#checkingPieces;
  }

  setBlockingSquares(blockingSquares) {
    this.#blockingSquares = blockingSquares;
  }

  setCheckingPieces(piece) {
    this.#checkingPieces.push(piece);
  }

  resetCheck() {
    this.#checkingPieces = [];
    this.#blockingSquares = [];
  }

}
