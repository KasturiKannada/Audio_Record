var express = require('express');
var compression = require('compression')
var app = express();
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
