const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");
const TAMANIO_CELDA = 25;

let intervaloSerpiente;
let direccionActual = "derecha";
let comida = { x: 0, y: 0 };

const SERPIENTE = [
  { x: (canvas.width / 2) / TAMANIO_CELDA,     y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 1, y: (canvas.height / 2) / TAMANIO_CELDA },
  { x: (canvas.width / 2) / TAMANIO_CELDA - 2, y: (canvas.height / 2) / TAMANIO_CELDA },
  //  { x: (canvas.width / 2) / TAMANIO_CELDA - 2, y: (canvas.height / 2) / TAMANIO_CELDA + 1 },
  //{ x: (canvas.width / 2) / TAMANIO_CELDA - 3, y: (canvas.height / 2) / TAMANIO_CELDA + 1 },
  //{ x: (canvas.width / 2) / TAMANIO_CELDA - 4, y: (canvas.height / 2) / TAMANIO_CELDA + 1 },
];

generarComida();
dibujarTodo();

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

function pintarParte(lineaX, lineaY, colorRelleno="blue") {

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
    let color = i === 0 ? "orange" : "dodgerblue";
    pintarParte(elemento.x, elemento.y, color);
  }
}

function moverDerecha(){
    let cabezaActual = SERPIENTE[0];
    let nuevaCabeza={
      x:cabezaActual.x+1,
      y:cabezaActual.y
    };

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


function cambiarDireccion(direccion){
  direccionActual=direccion;
}

function moverSerpiente(){
  if (direccionActual == "derecha")   moverDerecha();
  if (direccionActual == "izquierda") moverIzquierda();
  if (direccionActual == "arriba")    moverArriba();
  if (direccionActual == "abajo")     moverAbajo();

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

function iniciarJuego(){
  intervaloSerpiente=setInterval(moverSerpiente, 500);
}

function pausarJuego(){
  clearInterval(intervaloSerpiente);
}

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