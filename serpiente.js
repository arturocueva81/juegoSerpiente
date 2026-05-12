// 1. Capturamos el canvas y su contexto de dibujo

const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;

dibujarTablero = function () {
  ctx.strokeStyle = "red";
  ctx.beginPath(); 
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 100); 
  ctx.stroke(); 
};

dibujarTablero2 = function () {
  for (let i = 0; i < canvas.width; i += TAMANIO_CELDA) {
    ctx.strokeStyle = "red";
    ctx.beginPath(); 
    ctx.moveTo(i, 0); 
    ctx.moveTo(0, i); 
    ctx.lineTo(i, canvas.height); 
    ctx.lineTo(canvas.width, i); 
    ctx.stroke();
  }

  // for (let i = 0; i < canvas.height; i += TAMANIO_CELDA) {
  //   ctx.strokeStyle = "red";
  //   ctx.beginPath(); 
  //   ctx.moveTo(0, i); 
  //   ctx.lineTo(canvas.width, i); 
  //   ctx.stroke();
  // }
}; 


dibujarTodo(); 
// =========================
// FUNCIONES DE DIBUJO
// =========================

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero2();
}
