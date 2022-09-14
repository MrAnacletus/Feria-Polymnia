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
        "nombre": "Violoncello",
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
    },{
        "nombre": "Batería",
        "familia": "percusión",
        "imagen": "https://www.pngitem.com/pimgs/m/146-1468479_transparent-drum-set-png-drum-set-png-download.png",
        "tablatura": "no"
    }   
]

export default instrumentos;