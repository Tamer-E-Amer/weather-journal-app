/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
// let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

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
    const feelings = document.getElementById('feelings').value;
    console.log("Your name is", userName);
    // send data to API link
    // test get city image

    //
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
                feelings: feelings,
            })




        })
        .then(() => updateUI()
            .then(
                getCityImage(zip).then((cityData) => {
                    //The API return status of 404 only if there is no image
                    //Test if this status is not exist i.e there is a city image
                    if (!cityData.status) {
                        // test if there is a previously created image if so it will be deleted inorder to not concatinate the new created element to the existent one
                        clearImage(['imgPath', 'noImg']);
                        //////////////////////////

                        //create img HTML element
                        const imgElement = document.createElement('img');
                        //give it an id
                        imgElement.setAttribute('id', 'imgPath');
                        // append the created image to its container div
                        document.getElementById('cityImage').appendChild(imgElement);
                        //get the image pathe from API
                        const imgPath = cityData.photos[0].image.mobile;
                        // set the path to the source
                        imgElement.setAttribute('src', imgPath);

                    } else {
                        // test if there is a previously created image if so it will be deleted inorder to not concatinate the new created element to the existent one
                        clearImage(['imgPath', 'noImg']);
                        // create header
                        const imgNotFound = document.createElement('h1');
                        imgNotFound.setAttribute("id", "noImg");
                        // add it to the container div
                        document.getElementById('cityImage').appendChild(imgNotFound);
                        // set the error message
                        imgNotFound.innerHTML = "Sorry!! There is no Image for this city";
                    }
                })
            ))
}

const clearImage = (elem = []) => {
    for (let i = 0; i < elem.length; i++) {

        if (document.getElementById(elem[i])) {
            document.getElementById(elem[i]).remove();
            console.log("img deleted", elem[i]);
        }
    }
}

const getCityImage = async(city) => {
    imageURL = `https://api.teleport.org/api/urban_areas/slug:${city}/images/`;
    const imageResponse = await fetch(imageURL)
    try {
        cityData = await imageResponse.json();
        return cityData;
    } catch (error) {
        console.log("error", error);
    }
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
        if (data.cod !== 200) {
            document.getElementById('errorMsg').classList.add('active');
            setTimeout(() => {
                document.getElementById('errorMsg').classList.remove('active');
            }, 1500);

        } else {
            return data;
        }
        // console.log(data.list.main.temp);
    } catch (error) {
        console.log("this is error", error);
        // return error;
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
        console.log("temp for UI", allData.temperature);

        // test addign data to the items
        // collect all elements of the weather data in an Object
        const elements = {
                'date': allData.date,
                'showUserName': allData.userName,
                'showEmail': allData.email,
                'cityName': allData.cityName,
                'country': allData.country,
                'temp': Math.round(allData.temperature),
                'humidity': allData.humidity,
                'weatherDescription': allData.weatherDesciption,
                'visibility': allData.visibility,
                'windSpeed': allData.windSpeed,
                'windDegree': allData.windDegree,
                'showFeelings': allData.feelings,
            }
            // loop through elements object to show the object key:value on the UI
        for (const key in elements) {
            document.getElementById(key).innerHTML = elements[key];
        }

        //////
        createWeatherIcon(allData.weatherIcon);

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