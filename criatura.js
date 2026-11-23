import { CRIATURAS } from "./datos.js";

function $ (b) {return document.querySelector(b)};
function a (b) {return document.querySelectorAll(b)};

/* siguiente y anterior links */

const criaturaId = window.location.pathname.split('/').pop().replace('.html', '');
const Criatura = CRIATURAS.find((s) => s.id === criaturaId);
const CriaturaN = CRIATURAS.findIndex((s) => s.id === criaturaId);

$("body").style = `
    --Creature-color: ${Criatura.color1L};
    --Creature-dark-color: ${Criatura.color1D};
    --Creature-colorB: ${Criatura.color2L};
    --Creature-dark-colorB: ${Criatura.color2D};
`

$(".Nav").insertAdjacentHTML("beforeend", `
        <a href="index.html" class="icon"><img src="img/iconos/${criaturaId}.webp" alt=""></a> 
        <nav class="NavegacionBarra">
            <a href="index.html">INICIO</a>
            <a href="index.html#indice">CRIATURAS</a>
            <a href="contacto-vidra.html">CONTACTO</a>
        </nav>
    `)

$(".intro h1 span").textContent = Criatura.nombreLargo;
$(".intro h4").textContent = Criatura.cientifico;

$(".creature-data").insertAdjacentHTML("beforeend", `
        <h5>${Criatura.altura}</h5>
        <h5>${Criatura.peso}</h5>
        <h5>${Criatura.region}</h5>
    `)

$(".marco-criatura img").src = `img/${criaturaId}.webp`
$(".marco-criatura img").alt = Criatura.nombreLargo

/* previous y next */
const criaturaNext = CRIATURAS[(CriaturaN + 1) % CRIATURAS.length];
const criaturaPrev = CRIATURAS[(CriaturaN - 1 + CRIATURAS.length) % CRIATURAS.length];

$(".notcarrusel").style = `--prevColor: ${criaturaPrev.color1L}; --nextColor: ${criaturaNext.color1L}`
/* portrait arrows */
$('.notcarrusel').insertAdjacentHTML("beforeend", `
        <div class="portrait-arrows">
            <a class="criaprev">
                <span>&larr; </span>
                <img>
            </a>
            <a class="crianext">
                <img>
                <span> &rarr;</span>
            </a>
        </div>
    `)
a(".crianext img").forEach((s) => s.src = `img/iconos/${criaturaNext.id}.webp`);
a(".criaprev img").forEach((s) => s.src = `img/iconos/${criaturaPrev.id}.webp`);

a(".crianext").forEach((s) => s.href = `${criaturaNext.id}.html`);
a(".criaprev").forEach((s) => s.href = `${criaturaPrev.id}.html`);

/* mini indice inferior */

CRIATURAS.forEach((s) => {
    $(".minindice").insertAdjacentHTML("beforeend", `
        <a href="${s.id}.html"><img src="img/iconos/${s.id}.webp"></a>
    `)
})

document.querySelectorAll("a").forEach((s) => {
    s.addEventListener("click", (e) => {
        e.preventDefault();
        $("body").style.opacity = 0;
        setTimeout(() => window.location.href = s.href, 350);
    })
})

$("body").style.opacity = 1;

// PARA QUE SE MUEVA EL ICONO
function revisar() {
  $('.Nav .icon').classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.05);
}
window.addEventListener('scroll', revisar, { passive: true });
revisar();   // una vez al cargar