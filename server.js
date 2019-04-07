require('./models/db');
const multer  = require('multer');
const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');
const bodyparser = require('body-parser');

const employeeController = require('./controllers/employeeController');

var app = express();
//to static content
app.use('/public',express.static(__dirname+'/public'));
//app.use(express.static(path.join(__dirname, 'public/')));

//to recive form data in body
app.use(bodyparser.urlencoded({
    extended:true
}));
app.use(bodyparser.json());


//to set view engine
app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',exhbs({
    extname : 'hbs',
    defaultLayout : 'mainLayout',
    layoutsDir : __dirname + '/views/layouts/'
}));
app.set('view engine', 'hbs');

//start the server
app.listen(3030,()=>{
    console.log('Express is running on port number : <a href="localhost:3030/employee"> localhost:3030/employee </a>');
});

//use middelware employee controller to handel all requiest /employee
app.use('/employee',employeeController);