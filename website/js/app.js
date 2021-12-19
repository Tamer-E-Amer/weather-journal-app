/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
// let newDate = `${d.getDay+1}/${d.getMonth}/${d.getFullYear} `;
// let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

// https://api.openweathermap.org/data/2.5/weather?zip=94040,us&appid=05243c7fd6f466f59ff18ff2ada62d84    // complete API link
// api  data
const watherForcastAPIURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "05243c7fd6f466f59ff18ff2ada62d84";

document.querySelector('#generate').addEventListener('click', performAction);

function performAction(e) {
    // console.log('this is the getWeather function');
    // data entery for API
    const zip = document.querySelector('#zip').value;
    //user response
    const feel = document.getElementById('feelings').value;
    console.log("userResponse is", feel);
    // send data to API link
    getWeather(watherForcastAPIURL, zip, apiKey)
        .then(function(data) {
            console.log("temp from api", data.main.temp);
            console.log("data from api", data);
            postData('/addData', {
                date: newDate,
                temperature: data.main.temp,
                feel: feel,

            });
            updateUI();
        });


}

const getWeather = async(url, zip, key) => {
    absoluteURL = `${url}${zip}&appid=${key}`;
    //console.log(absoluteURL);
    const response = await fetch(absoluteURL)
    try {
        const data = await response.json();
        // console.log("data from the API:",data);
        return data;
        // console.log(data.list.main.temp);
    } catch (error) {
        console.log("error", error);
    }

}

//post Data

const postData = async(url = '', data = {}) => {
    console.log("data sent to server is", data);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // string casting to the data sent to the server 
    });
    console.log('response in post data is', response);
    try {
        console.log('************************');
        const newData = await response.json();
        console.log("new data is", newData);
        return newData;
    } catch (error) {
        console.log("error", error);
    }
};

// showing data on the page
const updateUI = async() => {
    const request = await fetch('/getalldata');

    try {
        const allData = await request.json();
        console.log("allData on UI", allData);
        console.log("temp for UI", allData[0].temperature);

        // document.getElementById('date').innerHTML = allData.date;
        // document.getElementById('temp').innerHTML = allData.temperature;
        document.getElementById('content').innerHTML = allData[0].feel;
    } catch (error) {
        console.log("erros", error);
    }
};