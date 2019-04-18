var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 8000;
var multer = require('multer'); // v1.0.5
/* var file = require('/home/mrunal/Desktop/js/sample_reg/file_upload/view/file.html'); */
var storage =  multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
  }
});
var upload = multer({ storage : storage}).single('fileUpload');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req,res){
  res.sendFile('/home/mrunal/Desktop/js/sample_reg/file_upload/view/index.html');
});

app.post('/api/upload',function(req,res){
    console.log(req.body);
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.listen(port, function () {
    console.log('Express server inizializzato sulla porta ' + port);
});