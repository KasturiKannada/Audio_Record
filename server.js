var express = require('express');
var compression = require('compression')
var app = express();
app.use(compression())
app.use(express.static("TLG")); // myApp will be the same folder name.
app.get('/', function (req, res,next) {
 res.redirect('/'); 
});
app.listen(9090, '127.0.0.1');
console.log("MyProject Server is Listening on port 9090");
