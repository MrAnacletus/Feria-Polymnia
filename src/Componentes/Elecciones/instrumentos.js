import pianoImagen from "../../logos/piano.png";
import guitarraAcustica from "../../logos/guitarra1.png";
import guitarraElectrica from "../../logos/guitarra2.png";
import bajo from "../../logos/bajo.png";
import violin from "../../logos/violin.png";
import violonchelo from "../../logos/violonchelo.png";
import viola from "../../logos/viola.png";
import contrabajo from "../../logos/contrabajo.png";
import bateria from "../../logos/bateria.png";

let instrumentos = [
    {
        "nombre": "Piano",
        "familia": "cuerdas",
        "imagen": pianoImagen,
        "tablatura": "no",
        "compatibles": []
    },
    {
        "nombre": "Guitarra acústica",
        "familia": "cuerdas",
        "imagen": guitarraAcustica,
        "tablatura": "si",
        "compatibles": [
            "Guitarra eléctrica","Ukelele"]
    },
    {
        "nombre": "Guitarra eléctrica",
        "familia": "cuerdas",
        "imagen": guitarraElectrica,
        "tablatura": "si",
        "compatibles": [
            "Guitarra acústica","Ukelele"]
    },
    {
        "nombre": "Bajo",
        "familia": "cuerdas",
        "imagen": bajo,
        "tablatura": "si",
        "compatibles": []
    },
    {
        "nombre": "Violín",
        "familia": "cuerdas",
        "imagen": violin,
        "tablatura": "no",
        "compatibles": []
    },
    {
        "nombre": "Violoncello",
        "familia": "cuerdas",
        "imagen": violonchelo,
        "tablatura": "no",
        "compatibles": []
    },
    {
        "nombre": "Viola",
        "familia": "cuerdas",
        "imagen": viola,
        "tablatura": "no",
        "compatibles": []
    },
    {
        "nombre": "Contrabajo",
        "familia": "cuerdas",
        "imagen": contrabajo,
        "tablatura": "no",
        "compatibles": []
    },{
        "nombre": "Batería",
        "familia": "percusión",
        "imagen": bateria,
        "tablatura": "no",
        "compatibles": []
    }   
]

export default instrumentos;