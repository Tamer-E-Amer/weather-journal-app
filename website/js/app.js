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
    //user name
    const userName = document.getElementById('userName').value;
    //email
    const email = document.getElementById('email').value;
    console.log("Your name is", userName);
    // send data to API link
    getWeather(watherForcastAPIURL, zip, apiKey)
        .then(function(data) {
            console.log("temp from api", data.main.temp);
            console.log("weather description is", data.weather[0].description);
            console.log("city name is", data.name);
            console.log("data from api", data);

            postData('http://127.0.0.1:8000/addData', {
                date: newDate,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                weatherDesciption: data.weather[0].description,
                cityName: data.name,
                country: data.sys.country,
                visibility: data.visibility,
                windSpeed: data.wind.speed,
                windDegree: data.wind.deg,
                weatherIcon: data.weather[0].icon,
                userName: userName,
                email: email,

            });
            updateUI();
        });


}

const getWeather = async(url, zip, key) => {
    //units=metric this is for celsius // imperial for Fahrenheit and default for Kelvin
    //check the input ZIP to search by ZIP or city name
    (isNaN(zip)) ? url = "https://api.openweathermap.org/data/2.5/weather?q=": url = url;
    absoluteURL = `${url}${zip}&units=metric&appid=${key}`;
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
    try {
        console.log('************************');
        // const newData = await response.json();
        //test solution
        //response is already a parsed JSON object so this response.json() is not necessary : we use instead
        const newData = await response;
        console.log("new data is", newData);
        return newData;
    } catch (error) {
        console.log("error", error);
    }
};

// showing data on the page
const updateUI = async() => {
    const request = await fetch('http://127.0.0.1:8000/getalldata');

    try {
        const allData = await request.json();
        console.log("allData on UI", allData);
        console.log("temp for UI", allData[0].temperature);

        document.getElementById('date').innerHTML = allData[0].date;
        document.getElementById('temp').innerHTML = Math.round(allData[0].temperature);
        document.getElementById('showUserName').innerHTML = allData[0].userName;
        document.getElementById('humidity').innerHTML = allData[0].humidity;
        document.getElementById('weatherDescription').innerHTML = allData[0].weatherDesciption;
        document.getElementById('cityName').innerHTML = allData[0].cityName;
        document.getElementById('country').innerHTML = allData[0].country;
        document.getElementById('visibility').innerHTML = allData[0].visibility;
        document.getElementById('windSpeed').innerHTML = allData[0].windSpeed;
        document.getElementById('windDegree').innerHTML = allData[0].windDegree;
        // document.getElementById('weatherIcon').innerHTML = allData[0].weatherIcon;
        createWeatherIcon(allData[0].weatherIcon);
        document.getElementById('showEmail').innerHTML = allData[0].email;
    } catch (error) {
        console.log("erros", error);
    }
};

function createWeatherIcon(icon) {

    if (document.getElementById('geratedIcon')) {
        document.getElementById('geratedIcon').remove();
    }
    const weatherIcon = document.createElement('img');

    // document.getElementById('weatherConclusion').appendChild(weatherIcon);
    // document.getElementById('weatherConclusion').insertBefore(weatherIcon, document.getElementById('weatherConclusion').childNodes[0]);
    document.getElementById('weatherDescription').insertAdjacentElement('beforebegin', weatherIcon);
    weatherIcon.setAttribute('src', `http://openweathermap.org/img/w/${icon}.png`);
    weatherIcon.setAttribute('id', 'geratedIcon');


}