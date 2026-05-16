// ============================================================
// CONFIGURACIÓN INICIAL
// ============================================================
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;

const MUSICAFONDO    = document.getElementById("musicaFondo");
const SONIDOCOMER    = document.getElementById("sonidoComer");
const SONIDOGAMEOVER = document.getElementById("sonidoGameOver");

let intervaloSerpiente;
let direccionActual = "derecha";
let comida = { x: 0, y: 0 };

let velocidad = 300;
let nivel = 0;
let puntajeParaSubir = 1;
let tiempoSegundos = 0;
let intervaloTiempo = null;

const SERPIENTE = [
  { x: (canvas.width / 2) / TAMANIO_CELDA,     y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 1, y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 2, y: (canvas.height / 2) / TAMANIO_CELDA },
];

generarComida();
dibujarTodo();
mostrarPantallaInicial();

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
    let color = i === 0 ? "white" : "green";
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
  if (direccion === "derecha"   && direccionActual === "izquierda") return;
  if (direccion === "izquierda" && direccionActual === "derecha")   return;
  if (direccion === "arriba"    && direccionActual === "abajo")     return;
  if (direccion === "abajo"     && direccionActual === "arriba")    return;
  direccionActual = direccion;
}

function moverSerpiente() {
  if (direccionActual == "derecha")   moverDerecha();
  if (direccionActual == "izquierda") moverIzquierda();
  if (direccionActual == "arriba")    moverArriba();
  if (direccionActual == "abajo")     moverAbajo();

  if (chocaConPared()) {
    gameOver();
    return;
  }

  if (atrapaComida()) {
    let puntajeActual = parseInt(document.getElementById("puntaje").innerText);
    puntajeActual++;
    document.getElementById("puntaje").innerText = puntajeActual;
    sonarComer();

    if (puntajeActual % puntajeParaSubir === 0) {
      subirNivel();
    }

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
  if (!intervaloSerpiente) {
    limpiarCanvas();
    dibujarTodo();
    reproducirMusica();
    iniciarTiempo();
    intervaloSerpiente = setInterval(moverSerpiente, velocidad);
  }
}

function pausarJuego() {
  detenerMusica();
  detenerTiempo();
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = null;
  document.getElementById("estado").innerText  = "Pausado";
  document.getElementById("mensaje").innerText = "Juego en pausa. Presiona Iniciar para continuar.";
}

function reiniciarJuego() {
  detenerMusica();
  detenerTiempo();
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = null;

  SERPIENTE.length = 0;
  SERPIENTE.push(
    { x: (canvas.width / 2) / TAMANIO_CELDA,     y: (canvas.height / 2) / TAMANIO_CELDA },
    { x: (canvas.width / 2) / TAMANIO_CELDA - 1, y: (canvas.height / 2) / TAMANIO_CELDA }
  );

  direccionActual = "derecha";
  nivel = 0;
  velocidad = 300;
  MUSICAFONDO.playbackRate = 1;
  tiempoSegundos = 0;

  document.getElementById("puntaje").innerText = "0";
  document.getElementById("nivel").innerText   = "0";
  document.getElementById("estado").innerText  = "Listo";
  document.getElementById("mensaje").innerText = "Presiona iniciar para comenzar.";
  document.getElementById("tiempo").innerText  = "00:00";

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
  pintarParte(comida.x, comida.y, "red");
}

function atrapaComida() {
  let cabeza = SERPIENTE[0];
  return cabeza.x === comida.x && cabeza.y === comida.y;
}

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
  sonarGameOver();
  detenerTiempo();
  clearInterval(intervaloSerpiente);
  intervaloSerpiente = null;
  document.getElementById("estado").innerText  = "💥 Game Over";
  document.getElementById("mensaje").innerText = "Chocaste con la pared. Presiona Reiniciar.";
}

// ============================================================
// PANTALLA INICIAL
// ============================================================
function mostrarPantallaInicial() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("🦖 Yoshi Snake", canvas.width / 2, 100);

  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 120);
  ctx.lineTo(canvas.width - 60, 120);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "18px Arial";
  ctx.fillText("🎯 Come las manzanas para crecer y sumar puntos", canvas.width / 2, 170);
  ctx.fillText("💀 No choques con los bordes del tablero",         canvas.width / 2, 210);
  ctx.fillText("🔄 No puedes retroceder sobre ti mismo",           canvas.width / 2, 250);

  ctx.fillStyle = "#facc15";
  ctx.font = "bold 20px Arial";
  ctx.fillText("Controles", canvas.width / 2, 310);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "18px Arial";
  ctx.fillText("⬆️(W) ⬇️(S) ⬅️(A) ➡️(D), usa el mouse o las teclas direccionales", canvas.width / 2, 350);
  ctx.fillText("▶️  Iniciar  —  ⏸️  Pausar",          canvas.width / 2, 390);
  ctx.fillText("🔁  Reiniciar para nueva partida",     canvas.width / 2, 430);

  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 22px Arial";
  ctx.fillText("¡Presiona Iniciar para jugar!", canvas.width / 2, 510);
}

// ============================================================
// SONIDOS
// ============================================================


function reproducirMusica() {
  MUSICAFONDO.volume = 0.4;
  MUSICAFONDO.currentTime = 0;
  MUSICAFONDO.play();
}

function detenerMusica() {
  MUSICAFONDO.pause();
  MUSICAFONDO.currentTime = 0;
}

function sonarComer() {
  SONIDOCOMER.volume = 0.2;
  SONIDOCOMER.currentTime = 0;
  SONIDOCOMER.play();
}

function sonarGameOver() {
  detenerMusica();
  SONIDOGAMEOVER.currentTime = 0;
  SONIDOGAMEOVER.play();
}

// ============================================================
// SUBIR DE NIVEL
// ============================================================
function subirNivel() {
  nivel++;
  velocidad = Math.max(30, velocidad - 30);

  clearInterval(intervaloSerpiente);
  intervaloSerpiente = setInterval(moverSerpiente, velocidad);

  let nuevaVelocidad = Math.min(2.5, 1 + nivel * 0.15);
  MUSICAFONDO.playbackRate = nuevaVelocidad;

  document.getElementById("nivel").innerText   = nivel;
  document.getElementById("mensaje").innerText = "⚡ ¡Nivel " + nivel + "! Velocidad aumentada.";
}

// ============================================================
// CONTROL DE TIEMPO
// ============================================================
function iniciarTiempo() {
  if (intervaloTiempo) return;
  intervaloTiempo = setInterval(() => {
    tiempoSegundos++;
    let minutos = Math.floor(tiempoSegundos / 60);
    let segundos = tiempoSegundos % 60;
    let formato = (minutos < 10 ? "0" : "") + minutos + ":" +
                  (segundos < 10 ? "0" : "") + segundos;
    document.getElementById("tiempo").innerText = formato;
  }, 1000);
}

function detenerTiempo() {
  clearInterval(intervaloTiempo);
  intervaloTiempo = null;
}

// ============================================================
// CONTROLES DE TECLADO
// ============================================================
document.addEventListener("keydown", function(evento) {
  evento.preventDefault();

  let direccion = null;

  switch (evento.key) {
    case "ArrowUp":    direccion = "arriba";    break;
    case "ArrowDown":  direccion = "abajo";     break;
    case "ArrowLeft":  direccion = "izquierda"; break;
    case "ArrowRight": direccion = "derecha";   break;
    case "w": case "W": direccion = "arriba";    break;
    case "s": case "S": direccion = "abajo";     break;
    case "a": case "A": direccion = "izquierda"; break;
    case "d": case "D": direccion = "derecha";   break;
    case " ":
      if (intervaloSerpiente) pausarJuego();
      else iniciarJuego();
      return;
  }

  if (direccion) {
    cambiarDireccion(direccion);

    const emojiBoton = {
      "arriba":    "⬆️",
      "abajo":     "⬇️",
      "izquierda": "⬅️",
      "derecha":   "➡️",
    };

    document.querySelectorAll(".controles button").forEach(btn => {
      if (btn.textContent.trim() === emojiBoton[direccion]) {
        btn.classList.add("activo");
        setTimeout(() => btn.classList.remove("activo"), 150);
      }
    });
  }
});