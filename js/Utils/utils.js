export const resize = (chessboard) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (height > width) {
    chessboard.classList.remove('size-by-height');
    chessboard.classList.add('size-by-width');
  } else {
    chessboard.classList.remove('size-by-width');
    chessboard.classList.add('size-by-height');
  }
}