import { Piece } from "./Piece.js";

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
  getMoves(pieces) {
    const moves = [];
    const position = this.getPosition();
    const whiteMoves = [ // possible moves for each color
      {
        type: 'move',
        move: [position[0], position[1] + 1]
      },
      {
        type: 'take',
        move: [position[0] + 1, position[1] + 1]
      },
      {
        type: 'take',
        move: [position[0] - 1, position[1] + 1]
      },
      {
        type: 'first-move',
        move: [[position[0], position[1] + 1], [position[0], position[1] + 2]]
      }
    ];

    const blackMoves = [
      {
        type: 'move',
        move: [position[0], position[1] - 1]
      },
      {
        type: 'take',
        move: [position[0] + 1, position[1] - 1]
      },
      {
        type: 'take',
        move: [position[0] - 1, position[1] - 1]
      },
      {
        type: 'first-move',
        move: [[position[0], position[1] - 1], [position[0], position[1] - 2]]
      }
    ];

    const usedMoves = this.getColor() === 'white' ? whiteMoves : blackMoves;
    for (let i = 0; i < usedMoves.length; i++) {  //check which moves among the possible moves arrays are valids
      if (usedMoves[i].type === 'move' && !this.isOccupied(pieces, usedMoves[i].move)) {
        moves.push(usedMoves[i].move);
      } else if (usedMoves[i].type === 'take') {
        const piece = this.isOccupied(pieces, usedMoves[i].move);
        if (piece && piece.getColor() !== this.getColor()) {
          moves.push(usedMoves[i].move);
        }
      } else if (!this.#alreadyMoved && usedMoves[i].type === 'first-move' && !this.isOccupied(pieces, usedMoves[i].move[0]) && !this.isOccupied(pieces, usedMoves[i].move[1])) {
        moves.push(usedMoves[i].move[1]);
      }
    }
    return moves;
  }

  setAlreadyMove() {
    this.#alreadyMoved = true;
  }
}