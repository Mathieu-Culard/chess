import { resize } from "./Utils/utils.js";
import { Game } from "./Models/Game.js";

let app = {

  init: () => {
    const game = new Game();
    window.addEventListener('resize',()=>resize(game.getChessBoard()));
    resize(game.chessBoard);
  },

}

document.addEventListener('DOMContentLoaded', app.init);