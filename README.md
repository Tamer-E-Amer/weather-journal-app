# Weather Journal App
The secon project demanded by Udacity 
## About the Project
**Weather Journal App** is the second project that is requested by **Udacity** - **Frontend Web professional track** which is **an application that can deal with APIs**.

## Project Criteria
The second project in the Scoolarship determine certain criteria to be applied in this project
- This application should deal with weather API of **Openweather Map**
- The Application accept 2 fildes wich are the **zip code of the city we want to search for** and **the Feelings of the user** and the **date** will be handeled automatically
- The Application get the **temperture** of this city and combine the **zip code** and **user feelings** together and send them to the server, then store them as an object in an array.
- the application return back all these data from the server again and show them all on the application Interface.

## What the Inhancements i have added to the application
- i completely change the interface from scratch. I have design it in Adobe XD [Behance](https://www.behance.net/gallery/133584709/Weather-Journal-app). I designed it using HTML and CSS as a template for the roject.
- i Have enlarged the demands so that the application accept the **user name** , **zipcode** and **email** and get all the weather data not only **temperature** but also other data such as **city name and country**, **Humidity**,**wind data such as degree and speed**, **visibility** and the **weather decription**.
- i have also added **a picture** of the city in the search. the application deals with another API of city data and extract the picture of the city from these data.
**https://api.teleport.org/api/urban_areas/slug:{city}/images/** and it inform the user if there is no picture for that city. But the image of the city appears only when you enter the **city name** not the **ZIP code**
- i add the functionality to search using either ZIP code or the city name
## technology used
- HTML
- CSS
- JS
- node JS
- express JS

## How to use the application and test it
- run this command **node server.js**. It runs on **Port:8000**
- in browser: preferable **Chrome or firefox** hit the address **127.0.0.1:8000/index.html** the application will run.

## For testing Data
# certain ZIP codes:
- 94040/ Mountain View
- 10001/ New York
- 97070/ Wilsonville
- 76050/ Grandview
- 30308/ Atlanta

# certain city names
- Berlin
- Dusseldorf
- Hmaburg
- Tokyo
- Cairo
- London
- Paris
- Alexandria



