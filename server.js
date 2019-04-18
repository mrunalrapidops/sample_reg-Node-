/* var fs =require('fs');
var readme = fs.readFileSync('./Externalfile/data.txt','utf-8');*/
//var cors = require("cors");
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var DateOnly = require('mongoose-dateonly')(mongoose);
//var formidable = require('formidable');
const fileUpload = require('express-fileupload');


mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/reg_new",{ useNewUrlParser: true });
var Schema = new mongoose.Schema({
    Name: String,
    lastName: String,
    midelname: String,
    birthday: DateOnly,
    Address1: String,
    Address2: String,
    city: String,
    Country :String,
    Mobile_Number :Number,
    Gender: String, 
    /* Hobby: String, => not working besause of array is object  */
    Hobby: Object,
    Email:String,
    Password: String,
    image: String,
    Interest:Object,   
    Roal: String,
    Blood_Group: String,
    Branch: String,
    message: String,
    roal: String
   });
mongoose.set('useFindAndModify', false);
var User = mongoose.model("User", Schema);

var app = express();
app.set('view engine','ejs');
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var port = 3000;

 app.get("/", (req, res) => {
    res.render('reg');
});
app.use(bodyParser.json())

//app.post("/onlydatadisplay", (req, res) => {
app.post("/page2", (req, res) => {  
  res.render('page2',{ body: req.body});
  /*res.send('name: ' + req.query['name']); */
  console.log("req.body.pic:",req.body.pic);//get req
  console.log("req.query:",req.query);//get req
  console.log("req.body:",req.body);// post req
  console.log("typeof req.body:",typeof req.body);// post req type
  console.log("req.params:",req.params);

});
app.get("/page2", (req, res) => {  
  /* res.render('page2',{ body: req.body}); */
  //res.send('name: ' + req.query['fname']); 
  res.send('page2',{'Fname': req.query['fname']});
  //res.render('page2',{'Fname': req.query['fname'], 'pic': req.query['pic']});
  console.log("req.query:",req.query);//get req
});
app.get("/getdata", (req, res) => { 
    User.find({}, function(err, data){
    res.json(data);
    console.log(">>>> " + data );
    });
});

/* app.post('/upload', function(req, res) {
 */  /* if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  }); */
// console.log(__dirname + '/image'); 
 app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;
  if (Object.keys(req.files).length == 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  console.log('req.files >>>', req.files); // eslint-disable-line
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/uploads/' + sampleFile.name;
  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('File uploaded to ' + uploadPath);
  });
});

/* }); */


app.post("/addemp", (req, res) => {//can list of emp
 /*  console.log("req.body:",req.body);// post req 
  console.log("typeof req.body:",typeof req.body);// post req type */
      var myData = new User({
        Name: req.body.name,
        lastName: req.body.last,
        midelname: req.body.middle,
        birthday: req.body.bday,
        Address1: req.body.Address1,
        Address2: req.body.ZipCode ,
        city: req.body.city,
        Country :req.body.Country,
        Mobile_Number :req.body.Mobile_Number,
        Gender: req.body.gender,
        Hobby: req.body.Hobby,
        Email:req.body.email,
        Password: req.body.psw,
        image: req.body.image,
        Interest:req.body.Interest,   
        Roal: req.body.Roal,
        Blood_Group: req.body.Blood_Group,
        Branch: req.body.Branch
    });
    myData.save()
    .then(item => {
    res.json({msg:"item saved to database"});  
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    }); 
   });
  
/*    app.use('/upload', router); */

 
  app.delete("/delete/:id", (req, res) => {
   User.findOneAndDelete({ _id: req.params.id}, function(err) {
      if (!err) {
         // res.send("item delete from database");
          res.json({msg:"item saved to database"});  
      }
      else {
          //res.send("item not delete from database");
          res.json({msg:"item not saved to database"});
      }
    });
  });

  app.put("/update/:id", (req, res) => {
  //var myData = new User(req.body);
/*   console.log("update req.body.id",req.body.id);
  console.log("update req.params.id",req.params.id); */
    User.findOneAndUpdate({ _id: req.params.id},{$set: { Name: req.body.Name,lastName: req.body.lastName,midelname: req.body.midelname,birthday: req.body.birthday,Address1: req.body.Address1,Address2: req.body.Address2,city: req.body.city,Country :req.body.Country,Mobile_Number :req.body.Mobile_Number,Gender: req.body.Gender,Hobby: req.body.Hobby,Email:req.body.Email,Password: req.body.Password,image: req.body.image, Roal: req.body.Roal}}, function(err) {
    if (!err) {
        res.send("item update in database");
      }
      else {
          res.send("item not update in database");
      }
    });
  });

app.listen(port, () => {
 console.log("Server listening on port " + port);
});                                                                                                          