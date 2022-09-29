var employees = [];
var departments = [];
var managers = [];
var fs = require("fs");

exports.initialize = () => {
 return new Promise( (resolve, reject) =>{
    fs.readFile("./data/employees.json", (err, data) =>{
        if(err){
            reject("Error when reading employees data");
        }
        else{
            employees = JSON.parse(data);
            fs.readFile("./data/departments.json", (err, data) =>{
                if(err){
                    reject("Error when reading deparments data");
                }
                else{
                    departments = JSON.parse(data);
                    resolve();
                }
            });
        }
    });
 });
}

exports.getAllEmployees = () =>{
    return new Promise ((resolve, reject) =>{
        if(employees.length == 0){
            reject("No Employees in the Data");
        }
        resolve(employees);
    });
}

exports.getDepartments = () =>{
    return new Promise ((resolve, reject) =>{
        if(departments.length == 0){
            reject("No Departments in the Data");
        }
        resolve(departments);
    });
}

exports.getManagers = () =>{
    return new Promise ((resolve, reject) =>{
        if(employees.length == 0){
            reject("No Employees in the Data");
        }

        for(let m in employees){
            //console.log("lalal");
            if(employees[m].isManager == true){
                managers.push(employees[m]);
            }
        }
        resolve(managers);
    });
}