const express = require('express'); //Line 1
const bodyParser = require('body-parser');
// const multer = require('multer');
const cors = require("cors");
const fileupload = require("express-fileupload");

const app = express(); //Line 2

app.use(cors());
app.use(fileupload());
app.use(express.static("temp"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || 8000; //Line 3

app.post("/upload",  (req, respuesta) => {
  console.log(req.files.file.name); // the uploaded file object
  const newpath = __dirname + "/temp/";
  const UploadedFile = req.files.file;
  const filename = req.files.file.name;
  UploadedFile.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      respuesta.status(500).send({ message: "File upload failed", code: 200 });
    }
    respuesta.status(200).send({ message: `${newpath}${filename}`, code: 200 });
  });
});

app.get('/single',function(req,res) {
  console.log('single file');
  const folderPath = __dirname+'/temp/';
  console.log(folderPath+'IMG_8818.JPG')
  // Download function provided by express
  res.download(folderPath+'IMG_8818.JPG', function(err) {
      if(err) {
          console.log(err);
      }
  })
})

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6
