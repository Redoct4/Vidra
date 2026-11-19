/* ============================================================
   5. DATOS: aquí está tu bestiario. Para agregar una criatura,
   copia un bloque { ... }, pégalo y cambia los datos.
   Los "—" son datos que me faltan: complétalos tú.
   ============================================================ */
const CRIATURAS = [
  { id: "brassela",             nombre: "Brassela",             cientifico: "Pantacefalis bulbogena",           altura: "120 cm", peso: "30 kg",   region: "Karteos",       brillo: "#98db06", nombreColor: "#98db06ff"},
  { id: "tortuga-baotilena",    nombre: "T. Baotilena",    cientifico: "Chelosidania bitelensis",          altura: "250 cm", peso: "6000 kg", region: "Guéfide",       brillo: "#ed9b33", nombreColor: "#ed9b33ff"},
  { id: "drasque",              nombre: "Drasque",              cientifico: "Titanophaga resonans",             altura: "150 m",  peso: "890 T",   region: "Yxi",           brillo: "#da6ba3", nombreColor: "#da6ba3ff"},
  { id: "neteapirio",           nombre: "Neteapirio",           cientifico: "Pereathoro laceon",                altura: "28 cm",  peso: "12 kg",   region: "Karteos, Yxi",  brillo: "#a487f0", nombreColor: "#a487f0ff"},
  { id: "kantah",               nombre: "Kantah",               cientifico: "Echoalatus deceptrix",             altura: "250 cm", peso: "80 kg",   region: "Guéfide, Yxi",  brillo: "#3fd0e8", nombreColor: "#3fd0e8ff"},
  { id: "vemufla",              nombre: "Vémufla",              cientifico: "Camoureflectere heliphostoris",    altura: "350 cm", peso: "1450 kg", region: "Guéfide",       brillo: "#9678d3", nombreColor: "#9678d3ff"}
];

const creatureTitleSize = "10vw";

const contSlides   = document.getElementById("slides");
const contTarjetas = document.getElementById("indice-tarjetas");

/* Crea el HTML de cada slide y cada tarjeta con los datos de arriba */
CRIATURAS.forEach((c) => {
  // Cada slide es un enlace a la página de la criatura (que crearás después)
  contSlides.insertAdjacentHTML("beforeend", `
    
      <a class="slide" href="${c.id}.html" aria-label="Ver ${c.nombre}"
       style="--nombre-tamano: ${creatureTitleSize}; --nombre-color: ${c.nombreColor}">
      <span class="slide-nombre">${c.nombre.toUpperCase()}</span>
      <!-- CUANDO TENGAS LA IMAGEN: reemplaza el texto de abajo por
           <img src="img/${c.id}.webp" alt="Ilustración de ${c.nombre}"> -->
      <div class="slide-imagen"><img src="img/${c.id}.webp" alt="Ilustración de ${c.nombre}"></div>
    </a>`);

  contTarjetas.insertAdjacentHTML("beforeend", `
    <a class="tarjeta" href="${c.id}.html">
      <div class="tarjeta-cabecera">
        <img class="tarjeta-icono" src="img/iconos/${c.id}.webp" alt="">
        <div>
          <h3>${c.nombre}</h3>
          <em>${c.cientifico}</em>
        </div>
      </div>
      <dl>
        <dt>Altura</dt><dd>${c.altura}</dd>
        <dt>Peso</dt><dd>${c.peso}</dd>
        <dt>Región</dt><dd>${c.region}</dd>
      </dl>
    </a>`);
});

/* ============================================================
   6. LÓGICA DEL CARRUSEL
   ============================================================ */
const slides = document.querySelectorAll(".slide");
let actual = 0;

function mostrar(n) {
  // El operador % hace que al llegar al final vuelva al principio
  actual = (n + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("activa", i === actual));
  document.documentElement.style.setProperty("--brillo", CRIATURAS[actual].brillo);
  const anterior  = (actual - 1 + CRIATURAS.length) % CRIATURAS.length;
  const siguiente = (actual + 1) % CRIATURAS.length;
  const imgsVecinas = document.querySelectorAll(".vecina img");
  imgsVecinas.forEach((img) => (img.style.opacity = 0));     // 1. se desvanecen
  setTimeout(() => {
    document.querySelector("#anterior img").src  = `img/${CRIATURAS[anterior].id}.webp`;
    document.querySelector("#siguiente img").src = `img/${CRIATURAS[siguiente].id}.webp`;
    imgsVecinas.forEach((img) => (img.style.opacity = 1));   // 3. reaparecen
  }, 400);
}

document.getElementById("anterior").addEventListener("click", () => mostrar(actual - 1));
document.getElementById("siguiente").addEventListener("click", () => mostrar(actual + 1));

// Flechas del teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft")  mostrar(actual - 1);
  if (e.key === "ArrowRight") mostrar(actual + 1);
});

// Deslizar con el dedo en celular
let inicioX = 0;
const hero = document.querySelector(".hero");
hero.addEventListener("touchstart", (e) => { inicioX = e.touches[0].clientX; }, { passive: true });
hero.addEventListener("touchend", (e) => {
  const diferencia = e.changedTouches[0].clientX - inicioX;
  if (Math.abs(diferencia) > 50) mostrar(actual + (diferencia < 0 ? 1 : -1));
});

mostrar(0);   // arranca con la primera criatura