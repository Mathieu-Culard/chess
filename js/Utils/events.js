import { Pawn } from '../Models/Pawn.js';
import { Game } from '../Models/Game.js';

export const drop = (e, game) => {
  e.preventDefault();
  // console.log(e);
  const id = e.dataTransfer.getData('text');
  let moved;
  const piece = game.getPiece(id); // gets the mouved piece instance by the id of its dom element
  let pieces = game.getPieces();
  const moves = piece.getMoves(pieces); // gets an array of possible movement for this piece
  const targetEl = document.getElementById(e.target.id); // get the id of the arrival square
  if (piece.getColor() === game.getTurn()) {
    if (targetEl.classList.contains('piece')) { // if the arrival square contains a piece, check if the capture is valid and update the in game pieces array
      moved = piece.capture(game.getPiece(e.target.id), pieces, moves, game);
      pieces = game.getPieces();
    } else {
      moved = piece.move(e.target.id, moves, game);
    }
  }
  if (moved) {
    if (piece.getName() === 'king') {
      for (let i = 0; i < pieces.length; i++) {
        pieces[i].setPinDirection([]);
      }
    }
    for (let i = 0; i < 2; i++) {
      game.getPiece(`king-${i}`).setPinnedPieces(pieces);
    }
    game.setTurn();
  }
  document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight')); // remove highligh 
}

export const dragover = (e) => {
  e.preventDefault();
}

export const dragstart = (e) => {
  e.dataTransfer.setData("text/plain", e.target.id);
}

export const dragend = (e) => {
  e.preventDefault();
}

/* 
highlighs the squares where a piece can move when it's clicked
*/
export const mouseDown = (e, piece, game) => {
  if (e.which === 1 && piece.getColor() === game.getTurn()) {
    const moves = piece.getMoves(game.getPieces());
    const ids = moves.map(coords => coords.join(''));
    ids.forEach(id => document.getElementById(id).classList.add('highlight'));
  }


}

export const mouseUp = (e) => {
  document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
}
