var express = require('express');
var compression = require('compression')
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
var app = express();
app.use(allowCrossDomain)
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
