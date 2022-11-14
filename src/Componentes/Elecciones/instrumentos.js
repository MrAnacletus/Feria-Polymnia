import pianoImagen from "../../logos/piano.png";
import guitarraAcustica from "../../logos/guitarra1.png";
import guitarraElectrica from "../../logos/guitarra2.png";
import bajo from "../../logos/bajo.png";
import violin from "../../logos/violin.png";
import violonchelo from "../../logos/violonchelo.png";
import viola from "../../logos/viola.png";
import contrabajo from "../../logos/contrabajo.png";
import bateria from "../../logos/bateria.png";
import flautaTraversa from "../../logos/traversa.png";

let instrumentos = [
    {
        "nombre": "Piano",
        "familia": "cuerdas",
        "imagen": pianoImagen,
        "tablatura": "no",
        "melodia": "si",
        "compatibles": []
    },
    {
        "nombre": "Guitarra acústica",
        "familia": "cuerdas",
        "imagen": guitarraAcustica,
        "tablatura": "si",
        "melodia": "si",
        "compatibles": [
            "Guitarra eléctrica","Ukelele","Bajo"]
    },
    {
        "nombre": "Guitarra eléctrica",
        "familia": "cuerdas",
        "imagen": guitarraElectrica,
        "tablatura": "si",
        "melodia": "si",
        "compatibles": [
            "Guitarra acústica","Ukelele","Bajo"]
    },
    {
        "nombre": "Bajo",
        "familia": "cuerdas",
        "imagen": bajo,
        "tablatura": "si",
        "melodia": "si",
        "compatibles": []
    },
    {
        "nombre": "Violín",
        "familia": "cuerdas",
        "imagen": violin,
        "tablatura": "no",
        "melodia": "si",
        "compatibles": []
    },
    {
        "nombre": "Violoncello",
        "familia": "cuerdas",
        "imagen": violonchelo,
        "tablatura": "no",
        "melodia": "si",
        "compatibles": []
    },
    {
        "nombre": "Viola",
        "familia": "cuerdas",
        "imagen": viola,
        "tablatura": "no",
        "melodia": "si",
        "compatibles": []
    },
    {
        "nombre": "Contrabajo",
        "familia": "cuerdas",
        "imagen": contrabajo,
        "tablatura": "no",
        "melodia": "si",
        "compatibles": []
    },{
        "nombre": "Batería",
        "familia": "percusión",
        "imagen": bateria,
        "tablatura": "no",
        "melodia": "no",
        "compatibles": []
    },{
        "nombre": "Flauta traversa",
        "familia": "viento-madera",
        "imagen": flautaTraversa,
        "tablatura": "no",
        "melodia": "si",
        "compatibles": []
    }
]

export default instrumentos;