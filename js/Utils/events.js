
export const drop = (e, game) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text');
  const squareId = e.target.id;
  game.play(id, squareId);
}

export const dragover = (e) => {
  e.preventDefault();
}

export const dragstart = (e) => {
  e.dataTransfer.setData("text/plain", e.target.id);
}

export const dragend = (e) => {
  e.preventDefault();
  document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight')); // remove highligh 
}

/* 
highlighs the squares where a piece can move when it's clicked
*/
export const mouseDown = (e, piece, game) => {
  if (e.which === 1 && piece.color === game.turn) {
    const moves = piece.moves;
    const ids = moves.map(coords => coords.join(''));
    ids.forEach(id => document.getElementById(id).classList.add('highlight'));
  }
}

export const click = (e, pawn, game, prevPos) => {
  pawn.promote(e,game,prevPos);
}
