#code to read a midi file with music21 and output it as an musicxml file and a midi file to compare later
#this code is to test the music21 library
import music21

#read the midi file
s = music21.converter.parse('backendPython/GeneracionDePartitura/test/test.mid')

#print all elements from the midi file
s.show('text')

#write the musicxml file
s.write('musicxml', 'backendPython/GeneracionDePartitura/test/test.xml')

#write the midi file
s.write('midi', 'backendPython/GeneracionDePartitura/test/test2.mid')