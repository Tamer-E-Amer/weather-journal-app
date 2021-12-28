/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
// let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

// api  data
const watherForcastAPIURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "05243c7fd6f466f59ff18ff2ada62d84";

document.querySelector('#generate').addEventListener('click', performAction);
/**
 * @description This function hold what all happend when we click the get weather button i.e the weather data and city image with many different tests.
 * @param {object} event
 */
function performAction(e) {
    // data entery for API
    const zip = document.querySelector('#zip').value;
    //user name
    const userName = document.getElementById('userName').value;
    //email
    const email = document.getElementById('email').value;
    const feelings = document.getElementById('feelings').value;
    // send data to API link
    getWeather(watherForcastAPIURL, zip, apiKey)
        .then(function(data) {
            //post form data to the Express Server
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
                // get all data from the server and show it on the UI
                .then(() => updateUI())
                // the getCityImage is performed directly after the updateUI in order to not be executed when there is no weather data.
                .then(
                    // get the city of the image
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
                );
        });
}

/**
 * @description this function aim to clear image city from teh image city div container in order to not concatinate a new image with another previously created one.
 * @param {array} elem - array of HTML elements that we want to delete i.e: img and H1
 */
const clearImage = (elem = []) => {
        //loop through the array
        for (let i = 0; i < elem.length; i++) {
            if (document.getElementById(elem[i])) {
                document.getElementById(elem[i]).remove();
            }
        }
    }
    /**
     * @description this function aim to get the image of the city
     * @param {string} city - city name
     */
const getCityImage = async(city) => {
    // img data API
    imageURL = `https://api.teleport.org/api/urban_areas/slug:${city}/images/`;
    const imageResponse = await fetch(imageURL)
    try {
        cityData = await imageResponse.json();
        return cityData;
    } catch (error) {
        console.log("error", error);
    }
}

/**
 * @description this function aim to get the weather data from the API
 * @param {string} watherForcastAPIURL - the URL of the API
 * @param {string/number} ZIP - ZIP code of teh city or its name
 * @param {string} key - the developer Key for the API
 */
const getWeather = async(url, zip, key) => {
    //units=metric this is for celsius // imperial for Fahrenheit and default for Kelvin
    //check the input ZIP to search by ZIP or city name
    (isNaN(zip)) ? url = "https://api.openweathermap.org/data/2.5/weather?q=": url = url;
    absoluteURL = `${url}${zip}&units=metric&appid=${key}`;
    const response = await fetch(absoluteURL)
    try {
        const data = await response.json();
        if (data.cod !== 200) {
            document.getElementById('errorMsg').classList.add('active');
            setTimeout(() => {
                document.getElementById('errorMsg').classList.remove('active');
            }, 1500);

        } else {
            return data;
        }
    } catch (error) {
        console.log("this is error", error);
        // return error;
    }

}

/**
 * @description this function aim to add the form data to an object on the server
 * @param {string} url - path of the add function on the server
 * @param {object} data - data which is the collection of user data form and weather data that we have from the API
 */
const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // string casting to the data sent to the server 
    });
    try {
        // const newData = await response.json();
        //response is already a parsed JSON object so this response.json() is not necessary : we use instead
        const newData = await response;
        return newData;
    } catch (error) {
        console.log("error", error);
    }
};

/**
 * @description this function aim to get the data from the server and then show it on the UI of the Application
 */
const updateUI = async() => {
    // get the data from the server
    const response = await fetch('http://127.0.0.1:8000/getalldata');

    try {
        const allData = await response.json();
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

        //create and show the icon related to the weather status
        createWeatherIcon(allData.weatherIcon);

    } catch (error) {
        console.log("erros", error);
    }
};

/**
 * @description this function aim to create and show the icon related to the weather status
 * @param {string} icon - the icon code of the weather status returned from the weather API data
 */
function createWeatherIcon(icon) {
    // test if there is an img element in the image container : if exist remove it
    //in order to not concatinate the new icon with the previously created img.
    if (document.getElementById('geratedIcon')) {
        document.getElementById('geratedIcon').remove();
    }
    //create img element
    const weatherIcon = document.createElement('img');
    // add it to the container div i.e:weatherDescription div
    document.getElementById('weatherDescription').insertAdjacentElement('beforebegin', weatherIcon);
    //setting img attributes
    weatherIcon.setAttribute('src', `http://openweathermap.org/img/w/${icon}.png`);
    weatherIcon.setAttribute('id', 'geratedIcon');


}