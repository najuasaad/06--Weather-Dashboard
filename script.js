var searchBar = $('#searchBar')
var cityList = $('#cityList')
var fiveDay = $('#fiveDay')
var currentWeather = $('#currentWeather')
var searchButton =$('#button-addon2')
var locStore = JSON.parse(localStorage.getItem("locStore"))

var key = "&appid=2c6c728ab0cbd0494e7080e56cf9711b"
var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + + "&appid=2c6c728ab0cbd0494e7080e56cf9711b";

if (locStore === null) {
    locStore = [];
}

propagateCityList();

searchButton.on("click", "#button-addon2", function(){ 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchBar.val()}&appid=2c6c728ab0cbd0494e7080e56cf9711b`)
    .then(function (response) {
        if (response.status === 200) {    
            return response.json()
        }
    })

    .then(function (data) {
        locStore.push(data.name);
        localStorage.setItem("locStore", JSON.stringify(locStore))
        locStore = JSON.parse(localStorage.getItem("locStore"))
        propagateCityList();
    })
});

//text-capitalize Makes The Text Like This

function propagateCityList() {
    cityList.empty();
    locStore.forEach(function(object, i){
        cityList.append($(`<button>`).attr("id", i).addClass("cityButton p-4 btn btn-outline-info col-12").text(object))        
    });
}

function displayWeather(index) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locStore[index]}&appid=2c6c728ab0cbd0494e7080e56cf9711b`)
    .then(function(response) {
        if (response.status === 200) {               
            return response.json()
        } 
    })

    .then(function (data) {
        currentWeather.empty()
        currentWeather
            .append($("<h2>").text(data.name))
            .append($("<p>").text("Temperature: " + data.main.temp))
            .append($("<p>").text("Humidity: " + data.main.humidity))
            .append($("<p>").text("Wind Speed: " + data.wind.speed))
            .append($("<p>").text("Description: " + data.weather[0].main))
    })
}

function displayForecast(index) {
    fetch(`https:api.openweathermap.org/data/2.5/forecast?q=${locStore[index]}&appid=2c6c728ab0cbd0494e7080e56cf9711b`)
    .then(function(response) {
        if (response.status === 200) {               
            return response.json()
        } 
    })

    .then(function (data){
        fiveDay.empty()
        console.log(data)
        for (var i = 5; i < 39; i+8 ) {
            fiveDay
                .append($("<div>").text("Temperature: " + data.list[i].main.temp))
        }

    })
    
}

cityList.on("click", ".cityButton", function() {
    //use $(this) to grab city, populate current weather and forecast
    console.log($(this).attr("id"))
    displayWeather($(this).attr("id"));
    displayForecast($(this).attr("id"))
});

console.log(locStore)