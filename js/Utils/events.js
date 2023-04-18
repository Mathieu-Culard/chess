import { Pawn } from '../Models/Pawn.js';
import { Game } from '../Models/Game.js';

export const drop = (e, game) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text');
  const piece = game.getPiece(id); // gets the mouved piece instance by the id of its dom element
  const pieces = game.getPieces()
  const moves = piece.getMoves(pieces); // gets an array of possible movement for this piece
  const targetEl = document.getElementById(e.target.id); // get the id of the arrival square
  if (piece.getColor() === game.getTurn()) {
    if (targetEl.classList.contains('piece')) { // if the arrival square contains a piece, check if the capture is valid and update the in game pieces array
      piece.capture(game.getPiece(e.target.id), pieces, moves, game);
    } else {
      piece.move(e.target.id, moves, game);
    }
    game.setTurn();
  }
  console.log(document.querySelectorAll('.highlight'));
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
  // const piece = game.getPiece(e.target.id); // gets the mouved piece instance by the id of its dom element
  if (e.which === 1 && piece.getColor() === game.getTurn()) {
    const moves = piece.getMoves(game.getPieces());
    const ids = moves.map(coords => coords.join(''));
    console.log(ids);
    ids.forEach(id => document.getElementById(id).classList.add('highlight'));
  }
  // console.log(el);
}

export const mouseUp = (e) => {
  document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
}
