from PyPDF2 import PdfFileWriter, PdfFileReader
import io
import shutil
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def generar_partitura(path_to_midi, title, composer, instrument):

    path_to_pdf = title + "_temp.pdf"

    res = os.system("mscore3 -o " + path_to_pdf + " " + path_to_midi) 

    shutil.copyfile(path_to_pdf, "temp.pdf")

    packet = io.BytesIO()

    # do whatever writing you want to do
    can = canvas.Canvas(packet)
    can.setFont('Times-Roman', 20)
    can.drawString(250, 810, title)
    can.setFont('Times-Roman', 12)
    can.drawString(30, 805, instrument)
    can.drawString(500, 805, composer)
    can.save()



    #move to the beginning of the StringIO buffer
    packet.seek(0)
    new_pdf = PdfFileReader(packet)
    # read your existing PDF
    existing_pdf = PdfFileReader(open(path_to_pdf, "rb"))
    output = PdfFileWriter()
    # add the "watermark" (which is the new pdf) on the existing page
    page = new_pdf.getPage(0)
    page.mergePage(existing_pdf.getPage(0))
    output.addPage(page)




    # finally, write "output" to a real file
    outputStream = open("./backend-js/temp/"+title+".pdf", "wb")
    output.write(outputStream)
    outputStream.close()

    if os.path.exists(path_to_pdf):
        os.remove(path_to_pdf)

    if os.path.exists("temp.pdf"):
        os.remove("temp.pdf")

    return title + ".pdf"