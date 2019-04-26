var fs = require("fs")
var readimage = require("readimage") 
var filedata = fs.readFileSync("/home/mrunal/Desktop/js/sample_reg/public/upimage/1.png");
readimage(filedata, function (err, image) {
  if (err) {
    console.log("failed to parse the image")
    console.log(err)
  }
  console.log(image)
})