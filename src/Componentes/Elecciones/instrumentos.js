import pianoImagen from "../../logos/piano.png";
import guitarraAcustica from "../../logos/guitarra1.png";
import guitarraElectrica from "../../logos/guitarra2.png";
import bajo from "../../logos/bajo.png";
import violin from "../../logos/violin.png";
import violonchelo from "../../logos/violonchelo.png";
import viola from "../../logos/viola.png";
import contrabajo from "../../logos/contrabajo.png";

let instrumentos = [
    {
        "nombre": "Piano",
        "familia": "cuerdas",
        "imagen": pianoImagen,
        "tablatura": "no"
    },
    {
        "nombre": "Guitarra acústica",
        "familia": "cuerdas",
        "imagen": guitarraAcustica,
        "tablatura": "si"
    },
    {
        "nombre": "Guitarra eléctrica",
        "familia": "cuerdas",
        "imagen": guitarraElectrica,
        "tablatura": "si"
    },
    {
        "nombre": "Bajo",
        "familia": "cuerdas",
        "imagen": bajo,
        "tablatura": "si"
    },
    {
        "nombre": "Violín",
        "familia": "cuerdas",
        "imagen": violin,
        "tablatura": "no"
    },
    {
        "nombre": "Violonchelo",
        "familia": "cuerdas",
        "imagen": violonchelo,
        "tablatura": "no"
    },
    {
        "nombre": "Viola",
        "familia": "cuerdas",
        "imagen": viola,
        "tablatura": "no"
    },
    {
        "nombre": "Contrabajo",
        "familia": "cuerdas",
        "imagen": contrabajo,
        "tablatura": "no"
    },   
]

export default instrumentos;