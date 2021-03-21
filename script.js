var searchBar = $('#searchBar')
var cityList = $('#cityList')
var fiveDay = $('#fiveDay')
var currentWeather = $('#currentWeather')
var searchButton =$('#button-addon2')
var locStore = JSON.parse(localStorage.getItem("locStore"))

if (locStore === null) {
    locStore = [];
}

searchButton.on("click", function(){ 
    var objPush = {};
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchBar.val()}&appid=2c6c728ab0cbd0494e7080e56cf9711b`)
    .then(function(response) {
        if (response.status === 200) {               
            objPush.cityName = searchBar.val();
            objPush.weather = JSON.stringify(response)
        } 
        fetch(`https:api.openweathermap.org/data/2.5/forecast?q=${searchBar.val()}&appid=2c6c728ab0cbd0494e7080e56cf9711b`)
        .then(function(response) {
            if (response.status === 200) {               
                objPush.forecast = JSON.stringify(response)
                locStore.push(objPush);
                localStorage.setItem("locStore", JSON.stringify(locStore))
                locStore = JSON.parse(localStorage.getItem("locStore"))
            };
        });  
    });  
});





//api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={API key}
//https://api.openweathermap.org/data/2.5/forecast?q={cityname}&appid=2c6c728ab0cbd0494e7080e56cf9711b