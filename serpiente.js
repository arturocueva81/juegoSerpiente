// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;


// const SERPIENTE = [ //ejercicio 2, serpiente
//   { x: (canvas.width/2)/TAMANIO_CELDA, y: (canvas.height/2)/TAMANIO_CELDA },
//   {x:((canvas.width/2)/TAMANIO_CELDA)-1, y: ((canvas.height/2)/TAMANIO_CELDA) },
//   {x: ((canvas.width/2)/TAMANIO_CELDA)-2, y: ((canvas.height/2)/TAMANIO_CELDA) },
//   {x:((canvas.width/2)/TAMANIO_CELDA), y:((canvas.height/2)/TAMANIO_CELDA)+1 }
// ];

// const SERPIENTE = [// ejercicio 3, serpiente de 5 cuadros al borde izquierdo
//   { x: 0, y: 14 },
//   { x: 0, y: 13 },
//   { x: 0, y: 12 },
//   { x: 0, y: 11 },
//   { x: 0, y: 10 },
// ];

const SERPIENTE = [ // Ejercicio Final
  { x: (canvas.width / 2) / TAMANIO_CELDA, y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA, y: (canvas.height / 2) / TAMANIO_CELDA - 1 },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 1, y: (canvas.height / 2) / TAMANIO_CELDA - 1 },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 2, y: (canvas.height / 2) / TAMANIO_CELDA - 1 },
];




// Primera pintura del juego al cargar la página
dibujarTodo();

// =========================
// FUNCIONES DE DIBUJO
// =========================

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  // pintarParte(5, 5);
  // pintarParte(10, 2);
  // pintarParte(
  //   (canvas.height - TAMANIO_CELDA) / TAMANIO_CELDA,
  //   (canvas.width - TAMANIO_CELDA) / TAMANIO_CELDA,
  // );
  // pintarParte((canvas.height - TAMANIO_CELDA) / TAMANIO_CELDA, 10);
  // pintarParte(0, (canvas.width - TAMANIO_CELDA) / TAMANIO_CELDA);
  // pintarParte((canvas.height - TAMANIO_CELDA) / TAMANIO_CELDA, 0);
  pintarSerpiente();
}

function dibujarTablero() {
  ctx.strokeStyle = "green";
  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function pintarParte(lineaX, lineaY, colorRelleno="red") {
  let valorX = lineaX * TAMANIO_CELDA;
  let valorY = lineaY * TAMANIO_CELDA;

  ctx.fillStyle = colorRelleno;
  ctx.fillRect(valorX, valorY, TAMANIO_CELDA, TAMANIO_CELDA);

  ctx.strokeStyle = "black";
  ctx.strokeRect(valorX, valorY, TAMANIO_CELDA, TAMANIO_CELDA);
}

function pintarSerpiente(){
  for(let i = 0; i < SERPIENTE.length; i++){
    let elemento = SERPIENTE[i];
    const color = i === 0 ? "yellow" : "red";
    pintarParte(elemento.x,elemento.y, color);
  }
}
