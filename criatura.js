import { CRIATURAS } from "./datos.js";

/* siguiente y anterior links */

const [CriaturaDatos, CriaturaN] = () => {
    CRIATURAS.forEach((s, i) => {

        const criatura = window.location.pathname.split('/').pop().replace('.html', '');

        if (s.id === criatura) return [s, i];
    });
}

const criaturaNext = CRIATURAS[CriaturaN + 1];
const criaturaPrev = CRIATURAS[CriaturaN - 1];

document.querySelector(".crianext").href = `${criaturaNext.id}.html`;
document.querySelector(".crianprev").href = `${criaturaPrev.id}.html`;