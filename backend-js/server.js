const express = require('express'); //Line 1

// const fileupload = require("express-fileupload");
const cors = require("cors");
// const bodyParser = require('body-parser');

const app = express(); //Line 2
const port = process.env.PORT || 8000; //Line 3

app.use(cors());
// app.use(fileupload());
// app.use(express.static("files"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.post("/upload", (req, res) => {
  console.log(req.files.archivo); // the uploaded file object
});
// const newpath = __dirname + "/files/";
//   const file = req.files.file;
//   const filename = file.name;
 
//   file.mv(`${newpath}${filename}`, (err) => {
//     if (err) {
//       res.status(500).send({ message: "File upload failed", code: 200 });
//     }
//     res.status(200).send({ message: "File Uploaded", code: 200 });
//   });

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// // create a GET route
// app.get('/express_backend', (req, res) => { //Line 9
//   res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
//   console.log('YOUR EXPRESS BACKEND IS CONNECTED TO REACT') //Line 10
// }); //Line 11