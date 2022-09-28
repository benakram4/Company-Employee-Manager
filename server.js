var express = require("express"); // Include express.js module
var app = express();

var path = require("path"); // include moduel path to use __dirname, and function path.join()
var data = require("./data-service.js");

var HTTP_PORT = process.env.PORT || 8080;  // || : or

// call this function after the http server starts listening for requests
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"))
});

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"))
});

app.get("/employees", function(req, res){
    var text = "<h3>TODO emp</h3>"
    res.send(text);
});

app.get("/managers", function(req, res){
    var text = "<h3>TODO man</h3>"
    res.send(text);
});

app.get("/departments", function(req, res){
    var text = "<h3>TODO dept</h3>"
    res.send(text);
});

app.listen(HTTP_PORT, onHttpStart());