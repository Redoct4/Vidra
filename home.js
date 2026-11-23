/* ============================================================
   5. DATOS: aquí está tu bestiario. Para agregar una criatura,
   copia un bloque { ... }, pégalo y cambia los datos.
   Los "—" son datos que me faltan: complétalos tú.
   ============================================================ */
import { CRIATURAS } from "./datos.js";

function $ (b) {return document.querySelector(b)};

const creatureTitleSize = "10vw";

document.body.style.setProperty('--alto-pagina', document.documentElement.scrollHeight + 'px');
document.body.style.setProperty('--nombre-tamano', creatureTitleSize);

const contSlides   = document.getElementById("slides");
const contIndiceGlifos = document.getElementById("indice-glifos");
const contIndiceMostrando = document.getElementById("indice-mostrando");

/* Crea el HTML de cada slide y cada tarjeta con los datos de arriba */
CRIATURAS.forEach((c) => {
  // Cada slide es un enlace a la página de la criatura (que crearás después)
  contSlides.insertAdjacentHTML("beforeend", `
    
      <a class="slide" href="${c.id}.html" aria-label="Ver ${c.nombre}" style="--nombre-color: ${c.color1L}">
      <span class="slide-nombre">${c.nombre.toUpperCase()}</span>
      <!-- CUANDO TENGAS LA IMAGEN: reemplaza el texto de abajo por
           <img src="img/${c.id}.webp" alt="Ilustración de ${c.nombre}"> -->
      <div class="slide-imagen"><img src="img/${c.id}.webp" alt="Ilustración de ${c.nombre}"></div>
    </a>`);

  contIndiceGlifos.insertAdjacentHTML("beforeend", `

    <a href="${c.id}.html"><img src="img/iconos/${c.id}.webp"></a>

  `);

  contIndiceMostrando.insertAdjacentHTML("beforeend", `

    <a class="indice-elemento" href="${c.id}.html" aria-label="Ver ${c.nombre}" style="--nombre-color: ${c.color1L}; --secundario-color: ${c.color2L}">
      <p class="indice-titulo">${c.nombre}</p>
      <img src="img/${c.id}.webp">
      <p class="indice-cientifico">${c.cientifico}</p>
      <div class="indice-datos">
        <p id="altura">${c.altura}</p>
        <p id="peso">${c.peso}</p>
        <p id="region">${c.region}</p>
      </div>
    </a>

  `);
});

/* ============================================================
   6. LÓGICA DEL CARRUSEL
   ============================================================ */
const esTouch = window.matchMedia('(hover: none)').matches;

const slides = document.querySelectorAll(".slide");
const indiceElements = document.querySelectorAll(".indice-elemento");
const indiceGlifos = document.querySelectorAll(".indice-glifos a");

let actual = 0;

function mostrar(n) {
  // El operador % hace que al llegar al final vuelva al principio
  actual = (n + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("activa", i === actual));
  indiceElements.forEach((s, i) => s.classList.toggle("activa", i === actual));
  indiceGlifos.forEach((s, i) => s.classList.toggle("activa", i === actual));

  document.documentElement.style.setProperty("--brillo", CRIATURAS[actual].color1L);
  const anterior  = (actual - 1 + CRIATURAS.length) % CRIATURAS.length;
  const siguiente = (actual + 1) % CRIATURAS.length;
  const imgsVecinas = document.querySelectorAll(".vecina img");
  imgsVecinas.forEach((img) => (img.style.opacity = 0));     // 1. se desvanecen
  setTimeout(() => {
    $("#anterior img").src  = `img/${CRIATURAS[anterior].id}.webp`;
    $("#siguiente img").src = `img/${CRIATURAS[siguiente].id}.webp`;
    imgsVecinas.forEach((img) => (img.style.opacity = 1));   // 3. reaparecen
  }, 400);
  
}

/* ==
  CARRUSEL AUTOMATICO
== */
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

const IntervalTime = 4000;
const TimeoutTime = 9000;

let idInterval
let idTimeout

let onIndice = false

function stopAuto () {
  clearInterval(idInterval);
  clearTimeout(idTimeout);
}
function startInterval () {
  if (reducedMotion) return;

  stopAuto();
  idInterval = setInterval(() => mostrar(actual + 1), IntervalTime)
}
function startTimeout() {
  clearTimeout(idTimeout);
  idTimeout = setTimeout(() => startInterval(), TimeoutTime - IntervalTime)
}

function interactMostrar(n) {
  mostrar(n);
  if (onIndice) return;
  if (reducedMotion) return;
  stopAuto();
  startTimeout();
}

function indiceMouseEntra(on) {
  onIndice = on;
  if (on) stopAuto();
  if (!on) startTimeout();
}

startInterval();

if (!esTouch) {
  $(".indice").addEventListener("mouseenter", () => indiceMouseEntra(true))
  $(".indice").addEventListener("mouseleave", () => indiceMouseEntra(false))
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopAuto();
  } else if (!onIndice) {
    startInterval();
  }
});

/* ==
  CARRUSEL HERO
== */ 
document.getElementById("anterior").addEventListener("click", () => interactMostrar(actual - 1));
document.getElementById("siguiente").addEventListener("click", () => interactMostrar(actual + 1));

// Flechas del teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  interactMostrar(actual - 1);
  if (e.key === "ArrowRight") interactMostrar(actual + 1);
});

// Deslizar con el dedo en celular
let inicioX = 0;
const hero = $(".hero");
hero.addEventListener("touchstart", (e) => { inicioX = e.touches[0].clientX; }, { passive: true });
hero.addEventListener("touchend", (e) => {
  const diferencia = e.changedTouches[0].clientX - inicioX;
  if (Math.abs(diferencia) > 50) interactMostrar(actual + (diferencia < 0 ? 1 : -1));
});

mostrar(0);   // arranca con la primera criatura

/* ==
  INDICE CARRUSEL
== */

if (!esTouch) indiceGlifos.forEach((s, i) => s.addEventListener("mouseenter", () => mostrar(i)))
$('.indice-links').addEventListener("click", () => window.location.href = `${CRIATURAS[actual].id}.html`)

// para dispositivos touch, al dar click en glifos, solo te lleva a la página si es el activa
indiceGlifos.forEach((s, i) => s.addEventListener("click", (e) => {
  if (esTouch && !s.classList.contains('activa')) {
    e.preventDefault();
    interactMostrar(i);
  } 
}))

/* OUT ANIM */

document.querySelectorAll("a").forEach((s) => {
    s.addEventListener("click", (e) => {
        if (e.defaultPrevented) return;
        e.preventDefault();
        $("body").style.opacity = 0;
        setTimeout(() => window.location.href = s.href, 350);
    })
})


$("body").style.opacity = 1;