// ============================================================
// CONFIGURACIÓN INICIAL
// ============================================================
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;

let intervaloSerpiente;
let direccionActual = "derecha";
let comida = { x: 0, y: 0 };

let velocidad = 300;

const SERPIENTE = [
  { x: (canvas.width / 2) / TAMANIO_CELDA,     y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 1, y: (canvas.height / 2) / TAMANIO_CELDA }
  //{ x: (canvas.width / 2) / TAMANIO_CELDA - 2, y: (canvas.height / 2) / TAMANIO_CELDA + 1 },
  //{ x: (canvas.width / 2) / TAMANIO_CELDA - 3, y: (canvas.height / 2) / TAMANIO_CELDA + 1 },
  //{ x: (canvas.width / 2) / TAMANIO_CELDA - 4, y: (canvas.height / 2) / TAMANIO_CELDA + 1 },
];

generarComida();
dibujarTodo();

// ============================================================
// DIBUJO DEL TABLERO
// ============================================================
function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  pintarComida();
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

// ============================================================
// DIBUJO DE LA SERPIENTE
// ============================================================
function pintarParte(lineaX, lineaY, colorRelleno = "blue") {
  let valorX = lineaX * TAMANIO_CELDA;
  let valorY = lineaY * TAMANIO_CELDA;

  ctx.fillStyle = colorRelleno;
  ctx.fillRect(valorX, valorY, TAMANIO_CELDA, TAMANIO_CELDA);

  ctx.strokeStyle = "black";
  ctx.strokeRect(valorX, valorY, TAMANIO_CELDA, TAMANIO_CELDA);
}

function pintarSerpiente() {
  for (let i = 0; i < SERPIENTE.length; i++) {
    let elemento = SERPIENTE[i];
    let color = i === 0 ? "orange" : "dodgerblue";
    pintarParte(elemento.x, elemento.y, color);
  }
}

// ============================================================
// MOVIMIENTO DE LA SERPIENTE
// ============================================================
function moverDerecha() {
  let cabezaActual = SERPIENTE[0];
  let nuevaCabeza = { x: cabezaActual.x + 1, y: cabezaActual.y };
  SERPIENTE.unshift(nuevaCabeza);
  SERPIENTE.pop();
}

function moverIzquierda() {
  let cabezaActual = SERPIENTE[0];
  let nuevaCabeza = { x: cabezaActual.x - 1, y: cabezaActual.y };
  SERPIENTE.unshift(nuevaCabeza);
  SERPIENTE.pop();
}

function moverArriba() {
  let cabezaActual = SERPIENTE[0];
  let nuevaCabeza = { x: cabezaActual.x, y: cabezaActual.y - 1 };
  SERPIENTE.unshift(nuevaCabeza);
  SERPIENTE.pop();
}

function moverAbajo() {
  let cabezaActual = SERPIENTE[0];
  let nuevaCabeza = { x: cabezaActual.x, y: cabezaActual.y + 1 };
  SERPIENTE.unshift(nuevaCabeza);
  SERPIENTE.pop();
}

function cambiarDireccion(direccion) {
  direccionActual = direccion;
}

function moverSerpiente() {
  if (direccionActual == "derecha")   moverDerecha();
  if (direccionActual == "izquierda") moverIzquierda();
  if (direccionActual == "arriba")    moverArriba();
  if (direccionActual == "abajo")     moverAbajo();

  if (chocaConPared()) { // VALIDACION A CHOCAR PARED
    gameOver();
    return;
  }
  
  if (atrapaComida()) {
    let puntajeActual = parseInt(document.getElementById("puntaje").innerText);
    document.getElementById("puntaje").innerText = puntajeActual + 1;

    let cola = SERPIENTE[SERPIENTE.length - 1];
    if (direccionActual == "derecha")   SERPIENTE.push({ x: cola.x - 1, y: cola.y });
    if (direccionActual == "izquierda") SERPIENTE.push({ x: cola.x + 1, y: cola.y });
    if (direccionActual == "arriba")    SERPIENTE.push({ x: cola.x,     y: cola.y + 1 });
    if (direccionActual == "abajo")     SERPIENTE.push({ x: cola.x,     y: cola.y - 1 });

    generarComida();
  }
  dibujarTodo();
}

// ============================================================
// CONTROL DEL JUEGO
// ============================================================
function iniciarJuego() {
  if (!intervaloSerpiente) { //validacion de la variable velocidad
    intervaloSerpiente = setInterval(moverSerpiente, velocidad);
  }
}

function pausarJuego() {
  clearInterval(intervaloSerpiente);
}

function reiniciarJuego() { // REINICIO DEL JUEGO RESET DE TODAS LAS VARIABLES Y ELEMENTOS
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = null;

  SERPIENTE.length = 0;
  SERPIENTE.push(
    { x: (canvas.width / 2) / TAMANIO_CELDA,     y: (canvas.height / 2) / TAMANIO_CELDA },
    { x: (canvas.width / 2) / TAMANIO_CELDA - 1, y: (canvas.height / 2) / TAMANIO_CELDA }
  );

  direccionActual = "derecha";
  document.getElementById("puntaje").innerText = "0";
  document.getElementById("estado").innerText  = "Listo";
  document.getElementById("mensaje").innerText = "Presiona iniciar para comenzar.";

  generarComida();
  dibujarTodo();
}

// ============================================================
// COMIDA
// ============================================================
function generarComida() {
  comida.x = Math.floor(Math.random() * (canvas.width / TAMANIO_CELDA));
  comida.y = Math.floor(Math.random() * (canvas.height / TAMANIO_CELDA));
}

function pintarComida() {
  pintarParte(comida.x, comida.y, "lime");
}

function atrapaComida() {
  let cabeza = SERPIENTE[0];
  return cabeza.x === comida.x && cabeza.y === comida.y;
}

//*************************************************************
// ============================================================
// GAME OVER
// ============================================================

function chocaConPared() {
  const CABEZA = SERPIENTE[0];
  const COLUMNAS = canvas.width / TAMANIO_CELDA;
  const FILAS = canvas.height / TAMANIO_CELDA;
  return (
    CABEZA.x < 0 ||
    CABEZA.x >= COLUMNAS ||
    CABEZA.y < 0 ||
    CABEZA.y >= FILAS
  );
}

function gameOver() {
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = null;
  document.getElementById("estado").innerText  = "💥 Game Over";
  document.getElementById("mensaje").innerText = "Chocaste con la pared. Presiona Reiniciar.";
}