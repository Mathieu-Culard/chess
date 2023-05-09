import { Piece } from './Piece.js';
import {
  UP,
  DOWN,
  RIGHT,
  LEFT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
  KNIGHT_UP_LEFT,
  KNIGHT_UP_RIGHT,
  KNIGHT_DOWN_LEFT,
  KNIGHT_DOWN_RIGHT,
  KNIGHT_RIGHT_UP,
  KNIGHT_RIGHT_DOWN,
  KNIGHT_LEFT_UP,
  KNIGHT_LEFT_DOWN
} from '../Utils/directions.js';

export class King extends Piece {
  #alreadyMoved = false;// used to check if castle is possible
  #isChecked = false;
  #checkingPieces = [];
  #blockingSquares = [];
  constructor(id, position, color, game) {
    super(id, 'king', position, color, game, [UP, DOWN, RIGHT, LEFT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT]);
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
    game.setKings(kings);
    return kings;
  }


  /* 
  generates an array of possible moves for the kings
  */
  calculateMoves(pieces) {
    const moves = [];
    const position = this.position;
    const directions = this.directions;
    let piece;
    let posToCheck;
    for (const direction of directions) {
      posToCheck = [position[0] + 1 * direction.x, position[1] + 1 * direction.y];
      piece = this.isOccupied(pieces, posToCheck);
      if (this.isInBoard(posToCheck) && (!piece || piece && piece.color !== this.color) && !this.isCheck(posToCheck, pieces)) {
        moves.push(posToCheck);
      }
    }
    this.moves = moves;
  }

  isCheck(position, pieces) {
    if (this.isKnightOrPawnCheck(pieces, position, 'knight') || this.isKnightOrPawnCheck(pieces, position, 'pawn')) {
      return true;
    }
    const directions = this.directions
    let i;
    let posToCheck;
    let piece;
    for (const direction of directions) {
      i = 1;
      posToCheck = [position[0] + i * direction.x, position[1] + i * direction.y];
      while (this.isInBoard(posToCheck)) {
        piece = this.isOccupied(pieces, posToCheck);
        if (piece && piece.color !== this.color && piece.hasDirection(direction) && piece.name !== 'pawn' && piece.name !== 'king') {
          return true;
        }
        if (piece && (piece.color === this.color && piece.id !== this.id || piece.color !== this.color && !piece.hasDirection(direction))) {
          break;
        }
        i++;
        posToCheck = [position[0] + i * direction.x, position[1] + i * direction.y];
      }
    }
    return false;
  }

  isKnightOrPawnCheck(pieces, position, pieceName) {
    let posToCheck;
    let piece;
    const pawnDirections = this.color === 'white' ? [UP_LEFT, UP_RIGHT] : [DOWN_LEFT, DOWN_RIGHT];
    const knightDirections = [
      KNIGHT_UP_LEFT,
      KNIGHT_UP_RIGHT,
      KNIGHT_DOWN_LEFT,
      KNIGHT_DOWN_RIGHT,
      KNIGHT_RIGHT_UP,
      KNIGHT_RIGHT_DOWN,
      KNIGHT_LEFT_UP,
      KNIGHT_LEFT_DOWN
    ];
    const directions = pieceName === 'pawn' ? pawnDirections : knightDirections;
    for (const direction of directions) {
      posToCheck = [position[0] + direction.x, position[1] + direction.y];
      piece = this.isOccupied(pieces, posToCheck);
      if (piece && piece.color !== this.color && piece.name === pieceName) {
        return true;
      }
    }
    return false;
  }

  check(direction, pieces, checkingPiece) {
    this.isChecked = true;
    this.checkingPieces = checkingPiece;
    let position = this.position;
    let reversedDirection = {
      x: direction.x * -1,
      y: direction.y * -1,
    }
    let piece;
    let i = 1;
    let posToCheck = [position[0] + i * reversedDirection.x, position[1] + i * reversedDirection.y];
    if (checkingPiece.name === 'pawn' || checkingPiece.name === 'knight') {
      this.blockingSquares = [position[0] + reversedDirection.x, position[1] + reversedDirection.y];
      return;
    }
    while (this.isInBoard(posToCheck)) {
      piece = this.isOccupied(pieces, posToCheck);
      if (piece) {
        this.blockingSquares = posToCheck;
        return;
      }
      this.blockingSquares = posToCheck;
      i++;
      posToCheck = [position[0] + i * reversedDirection.x, position[1] + i * reversedDirection.y];
    }
  }



  resetCheck() {
    if (this.isChecked) {
      this.isChecked = false;
      this.#checkingPieces = [];
      this.#blockingSquares = [];
    }
  }

  /**
   * @param {boolean} check
   */
  set isChecked(check) {
    this.#isChecked = check;
    if (check) {
      this.HTMLElement.classList.add('checked');
    } else {
      this.HTMLElement.classList.remove('checked');
    }
  }

  get isChecked() {
    return this.#isChecked;
  }

  get blockingSquares() {
    return this.#blockingSquares;
  }

  /**
   * @param {Array} position
   */
  set blockingSquares(position) {
    this.#blockingSquares.push(position);
  }

  get checkingPieces() {
    return this.#checkingPieces;
  }

  /**
   * @param {any} piece
   */
  set checkingPieces(piece) {
    this.#checkingPieces.push(piece);
  }
}

