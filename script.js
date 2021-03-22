var searchBar = $('#searchBar')
var cityList = $('#cityList')
var fiveDay = $('#fiveDay')
var currentWeather = $('#currentWeather')
var searchButton =$('#button-addon2')
var locStore = JSON.parse(localStorage.getItem("locStore"))
var whatDayIsIt = moment().format('ll')

var coord;

if (locStore === null) {
    locStore = [];
}

propagateCityList();

searchButton.on("click", function(){ 
    console.log("hello")
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

function propagateCityList() {
    cityList.empty();
    locStore.forEach(function(object, i){
        cityList.append($(`<button>`).attr("id", i).addClass("cityButton p-4 btn btn-outline-info col-12").text(object))        
    });
}

function displayWeather(index) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locStore[index]}&units=imperial&appid=2c6c728ab0cbd0494e7080e56cf9711b`)
    .then(function(response) {
        if (response.status === 200) {               
            return response.json()
        } 
    })

    .then(function (data) {
        currentWeather.empty()
        console.log(data)
        coord = [data.coord.lon, data.coord.lat]
        currentWeather
            .append($("<h1 class='text-center mb-4'>").text(data.name + ": " + whatDayIsIt))
            .append($("<img class='rounded mx-auto d-block'>").attr("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`))
            .append($("<p class='text-center'>").text("Temperature: " + data.main.temp + "F"))
            .append($("<p class='text-center'>").text("Humidity: " + data.main.humidity))
            .append($("<p class='text-center'>").text("Wind Speed: " + data.wind.speed +"mph"))
            //.append($("<p class='text-center'>").text("Description: " + data.weather[0].main))
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord[0]}&lon=${coord[1]}&exclude=minutely,hourly,alerts&appid=2c6c728ab0cbd0494e7080e56cf9711b`)
    })

    .then ( function(coordinatecall) {
        return coordinatecall.json()
    })

    .then (function(coordinatecall){
        console.log(coordinatecall.current.uvi)
        currentWeather.append($("<p id='uv' class='text-center text-white w-25 p-1 mx-auto rounded-pill'>").text("UV Index: " + coordinatecall.current.uvi ))
        var uvIndex = $('#uv');
            if (coordinatecall.current.uvi <= 2){
                uvIndex.addClass("bg-success")
            }
            else if (coordinatecall.current.uvi <= 5){
                uvIndex.addClass("bg-warning")
            }
            else {
                uvIndex.addClass("bg-danger")
            }

    })


    // .then (function (coord)){
    // fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly,alerts&appid=2c6c728ab0cbd0494e7080e56cf9711b`)
    // .then(function(response) {
    //     if (response.status === 200) { 
    //         console.log(response)              
    //         return response.json()
    //     } 
    // })
}

function displayForecast(index) {
    fetch(`https:api.openweathermap.org/data/2.5/forecast?q=${locStore[index]}&units=imperial&appid=2c6c728ab0cbd0494e7080e56cf9711b`)
    .then(function(response) {
        if (response.status === 200) {               
            return response.json()
        } 
    })

    .then(function (data){
         fiveDay.empty()
         console.log(data)
         for (var i = 5; i < 39; i += 8 ) {
            var tile = $("<div class='mx-auto card col-2 mx-md-2 bg-info text-white'><div class='card-body'></div></div>")
            var temperature = $("<p class='text-center'>")
            var humidity = $("<p class='text-center'>")
            var icon = $("<img class='text-center'>")

            icon.attr("src", `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`)
            temperature.text(data.list[i].main.temp + "F")
            humidity.text("Humidity: " + data.list[i].main.humidity)

            //tile.append(day)
            tile.append(icon)
            tile.append(temperature)
            tile.append(humidity)

            fiveDay.append(tile)
        }
    })    
}

cityList.on("click", ".cityButton", function() {
    //use $(this) to grab city, populate current weather and forecast
    console.log($(this).attr("id"))
    displayWeather($(this).attr("id"));
    displayForecast($(this).attr("id"))
});