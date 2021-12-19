// Setup empty JS object to act as endpoint for all routes
projectData = [];
// 1- setting Environment and running server start/////
// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cours = require('cors');
app.use(cours());
// Initialize the main project folder
//app.use(express.static('website'));
app.use(express.static('website'));

// Setup Server
//port
const port = 8000;
app.listen(port, appListenFunction);

function appListenFunction() {
    console.log(`server is running on port ${port}`);
}
// setting Environment and running server end/////

// 2- setting get and post routes start /////////////////////////////

//post route
app.post('/addData', addData);
/**
 * @descritopn this function send data that is input by the user to the server
 * @param {} req - holds the user input data
 * @param {} res - holds the data from teh server to the client
 */
function addData(req, res) {
    projectData = [];
    newProjectData = {
        date: req.body.date,
        temperature: req.body.temperature,
        feel: req.body.feel,
    };

    projectData.push(newProjectData);

    console.log(projectData);


}
// get route
app.get('/getalldata', getAllData);
/**
 * @description this function will ask the server to send the temperature to the client
 * @param {} //TODO:determine the data type of get request arguments
 * @param {json} res - temperature data returned from the server
 */
function getAllData(req, res) {
    //console.log(req);
    res.send(projectData);
}


// setting get and post routes end /////////////////////////////