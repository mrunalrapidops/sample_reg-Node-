/* var fs =require('fs');
var readme = fs.readFileSync('./Externalfile/data.txt','utf-8');*/
//var cors = require("cors");
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var DateOnly = require('mongoose-dateonly')(mongoose);
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var cookies = require('browser-cookies');
//var formidable = require('formidable');
const fileUpload = require('express-fileupload');
mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/reg_new",{ useNewUrlParser: true });
var Schema = new mongoose.Schema({
    Name: String,
    lastName: String,
    midelname: String,
    birthday: DateOnly,
    Address1: String,
    zipcode: String,
    city: String,
    Country :String,
    code:Number,
    Mobile_Number :Number,
    Gender: String, 
    Hobby: Object,//array
    Email:String,
    Password: String,
    image: String,
    Interest:Object,//array   
    roal: String,
    Blood_Group: String,
    Branch: String,
    message: String,
    dateofjoin:DateOnly
   });
mongoose.set('useFindAndModify', false);
var User = mongoose.model("User", Schema);
var port = 3000;
var app = express();
app.set('view engine','ejs');
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(cookieParser());
//check cookies enable or not
//app.use(cookies.set('firstName', 'Lisa', {expires: 365},{secure: true, domain: 'www.example.org'}),(cookies.get('firstName')))

app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
 app.use((req, res, next) => {
  if (!req.cookies.user_sid && req.session.item) {
    console.log('user_sid'+" is clear")
      res.clearCookie('user_sid');        
  }
  next();
}); 


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.item && req.cookies.user_sid){
    console.log("1");
    //res.redirect('/getdata');
    next();
  }
  else {
    console.log("from sessionChecker no");
    console.log("2");
    res.redirect('/login');
    //next();
}   
};

app.get("/",(req, res) => {
  res.render('welcome');
});

 app.get("/reg",(req, res) => {
  res.render('reg');
}); 

/* app.get("/login", sessionChecker,(req, res) => {
  res.render('login');
}); */

// route for user Login
app.route('/login')
    .get((req, res) => {
      //res.render('login');
      res.render(__dirname + '/views/login.ejs');
      //console.log(__dirname + '/views/login.ejs'); 
    })
    .post((req, res) => {
        var email = req.body.email, password = req.body.psw;
        /* console.log("email:- " + email);
        console.log("pass:-" + password); */
        User.findOne({ "Email": email,"Password":password }).then(function(data){
         /*  console.log(data); */
          if (!data) {
            res.redirect('/login');
        } else{
          //req.session.item = data.id;
          req.session.item = data;
          console.log("::req.session.item::"+typeof(req.session.item));
          console.log("req.session.item"+req.session.item);
          if(typeof req.session.item !== "undefined" || req.session.item === true){console.log("session set successfully after login");}
          else{console.log("session not set after login");}
          res.redirect('/getdata');
        }
        })
       }); 

        app.get('/logout', (req, res) => {
          if (req.session.item && req.cookies.user_sid) {
              res.clearCookie('user_sid');
              res.redirect('/');
          } else {
              res.redirect('/login');
          }
      });
      

app.use(bodyParser.json())

//app.post("/onlydatadisplay", (req, res) => {
app.post("/page2", (req, res) => {  
  res.render('page2',{ body: req.body});
  /*res.send('name: ' + req.query['name']); */
  /* console.log("req.body.pic:",req.body.pic);//get req
  console.log("req.query:",req.query);//get req
  console.log("req.body:",req.body);// post req
  console.log("typeof req.body:",typeof req.body);// post req type
  console.log("req.params:",req.params);
 */
});
app.get("/page2", (req, res) => {  
  /* res.render('page2',{ body: req.body}); */
  //res.send('name: ' + req.query['fname']); 
  res.send('page2',{'Fname': req.query['fname']});
  //res.render('page2',{'Fname': req.query['fname'], 'pic': req.query['pic']});
  console.log("req.query:",req.query);//get req
});

app.get("/getdata",sessionChecker, (req, res) => { 
  //res.render('getdata');  
  //var data;
  User.find({}, function(err, data){
    //res.json(data);
    //data = data;
   // console.log(">>>> " + data );
    res.render('getdata',{"data" :data});
    }); 
});

app.post("/getdatapost", (req, res) => { 
  User.find({}, function(err, data){
  res.json(data);
  console.log(">>>> " + data );
  });
});

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

app.post("/addemp", (req, res) => {
 /*  res.render('page2',{ body: req.body}); */
      var myData = new User({
        Name: req.body.name,
        lastName: req.body.last,
        midelname: req.body.middle,
        birthday: req.body.bday,
        Address1: req.body.Address1,
        zipcode: req.body.ZipCode ,
        city: req.body.city,
        Country :req.body.Country,
        code: req.body.code,
        Mobile_Number :req.body.Mobile_Number,
        Gender: req.body.gender,
        Hobby: req.body.Hobby,
        Email:req.body.email,
        Password: req.body.psw,
        image: req.body.pictext,
        message:req.body.message,
        dateofjoin:req.body.doj,
        Interest:req.body.Interest,   
        roal: req.body.roal,
        Blood_Group: req.body.bg,
        Branch: req.body.Branch
    });
    myData.save()
    .then(item => {
    //res.render('getdata');
    req.session.item = myData;
    //console.log("myData Values" + myData);
    if(typeof req.session.item !== "undefined" || req.session.item === true){console.log("session set successfully");}
    else{console.log("session not set");}
    res.redirect('getdata');
    //res.render('getdata');
    //res.render('page2',{ body: req.body});
    //res.json({msg:"item saved to database"});  
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

//upload file code comment
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

//login
/*  User.findOne({ where: { username: username } }).then(function (user) {*/
            /* else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/dashboard');
            } */
//update
  //var myData = new User(req.body);
/*   console.log("update req.body.id",req.body.id);
  console.log("update req.params.id",req.params.id); */