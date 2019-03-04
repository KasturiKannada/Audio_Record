var express = require('express');
var compression = require('compression')
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});
app.use(compression())
app.use(express.static("TLG")); // myApp will be the same folder name.
app.get('/', function (req, res,next) {
 res.redirect('/'); 
});
app.listen(process.env.PORT || 8080);
// app.listen(3000, 'https://kasturikannada.herokuapp.com');
// app.listen(3000,() => {
// console.log("Server running at port on port 3000");
// });
// console.log("MyProject Server is Listening on port 9090");
