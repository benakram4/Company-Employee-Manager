/********************************************************************************* 
 *  BTI325 – Assignment 2 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.   
 *  No part of this assignment has been copied manually or electronically from any other source 
 *  (including web sites) or distributed to other students.
 * 
 *  Name: Ben Akram Student ID: 158523217 Date: 5/10/2022 *
 *  Online (Cyclic) URL:  
 * *  https://glamorous-goat-slacks.cyclic.app/ *
  ********************************************************************************/  

var express = require("express"); // Include express.js module
var app = express();
app.use(express.json()); // parse incoming JSON requests and place them in req.body
app.use(express.urlencoded({ extended: true })); // parse incoming urlencoded form data and place it in req.body

var path = require("path"); // include module path to use __dirname, and function path.join()
var data = require("./data-service.js");

var multer = require("multer"); // include file handling module
var fs = require("fs");  //includes writing to a file 

app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;
// call this function after the http server starts listening for requests
function onHttpStart(){
    console.log("Express http server listening on port: " + HTTP_PORT);
};

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//home route
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"))
});

//about page route
app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"))
    
});

// images route
app.get("/images", function(req, res){
    //return all images in the images folder
    fs.readdir("./public/images/uploaded", (err, images) =>{
        if(err){
            console.log("Error reading images");
        }
        else{
            res.json(images);
        }
    });
});


//employees/add route
app.get("/employees/add", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"))
});

//images/add route
app.get("/images/add", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});


//employees route and employee related queries
app.get("/employees", function(req, res){

    if(req.query.status){ //query with employees status
        console.log("this is req.query.status: " + req.query.status);
        data.getEmployeesByStatus(req.query.status)
        .then((data) => res.json(data))
        .catch((err) => res.json({message: err}))
        console.log("getting emp : getEmployeesByStatus()");
    }   
    else if(req.query.department){ //query with employees department
        console.log("this is req.query.department: " + req.query.department);
        data.getEmployeesByDepartment(req.query.department)
        .then((data) => res.json(data))
        .catch((err) => res.json({message: err}))
    }
    else if(req.query.manager){ //query with employees manager id
        console.log("this is req.query.manager: " + req.query.manager);
        data.getEmployeesByManager(req.query.manager)
        .then((data) => res.json(data))
        .catch((err) => res.json({message: err}))
    }
    else{
        data.getAllEmployees() // without query 
        .then((data) => res.json(data))
        .catch((err) => res.json({message: err}))
        console.log("getting all employees : getAllEmployees()");
    }
});

//managers route
app.get("/managers", function(req, res){
    data.getManagers()
    .then((data) => {res.json(data)})
    .catch((err) => {console.log(`${err}`)});
    console.log("getting managers : getManagers()");
});

//departments route
app.get("/departments", function(req, res){
    data.getDepartments()
    .then((data) => {res.json(data)})
    .catch((err) => {console.log(`${err}`)});
    console.log("getting dep : getDepartments()");
});

//upload image function
app.post("/images/add",upload.single("imageFile") ,function(req, res){
    fs.readdir("./public/images/uploaded", (err, files) => {
        console.log("Uploading Image");
        if(err){
            console.log(err);
            console.log("Failed to upload Image");
        }
        else{
            console.log("Image Uploaded successfully");
            res.json({images:files});
        }
     });
     
});

//add employee function
app.post("/employees/add",(req,res) =>{
    data.addEmployee(req.body)
    .then(() => {res.redirect("/employees")})
    .catch((err) => {console.log(`Error adding emp${err}`)});
    console.log("adding emp");
})

//get employee by emp number function
app.get("/employee/:value", (req, res) =>{
    data.getEmployeeByNum(req.params.value)
    .then((data) => {res.json(data)})
    .catch((err) => {console.log(`Error getting employees by value: ${err}`)});
    console.log("getting employees by value : getEmployeeByNum()");
    
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views/error404.html"));
});
  
data.initialize().then(app.listen(HTTP_PORT, onHttpStart));
//app.listen(HTTP_PORT, onHttpStart());