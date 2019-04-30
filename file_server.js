/* var fs = require("fs")
var readimage = require("readimage") 
var filedata = fs.readFileSync("/home/mrunal/Desktop/js/sample_reg/public/upimage/1.png");
readimage(filedata, function (err, image) {
  if (err) {
    console.log("failed to parse the image")
    console.log(err)
  }
  console.log(image)
}) */
var Express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = Express();
 app.use(bodyParser.json());
var Storage = multer.diskStorage({
destination: function(req, file, callback) {
      callback(null, "./Images");
  },
  filename: function(req, file, callback) {
      callback(null,file.originalname);
  }
});
var upload = multer({
  storage: Storage
}).array("imgUploader", 3); //Field name and max count

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.post("/api/Upload", function(req, res) {
  upload(req, res, function(err) {
      if (err) {
          return res.end("Something went wrong!");
      }
      return res.end("File uploaded sucessfully!.");
  });
});

app.listen(2000, function(a) {
  console.log("Listening to port 2000");
});