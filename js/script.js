import { resize } from "./Utils/utils.js";
import { Game } from "./Models/Game.js";

let app = {

  // chessboard: document.getElementById('chess-board'),

  init: () => {
    const game = new Game();
    window.addEventListener('resize',()=>resize(game.getChessBoard()));
    resize(game.getChessBoard());
  },

}

document.addEventListener('DOMContentLoaded', app.init);