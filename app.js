const forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?';
const endBaseURL = '&units=imperial&appid=35b0242376c730106a1ead757ba5708a';
let forecastDisplay = $("#forecast-div");


function searchCity(city, lat, lng) {
  let queryURL =
    forecastURL +
    (city ? `q=${city}` : `lat=${lat}&lon=${lng}`) +
    endBaseURL;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    // conditions: response.list[0].weather[0].description,
    
    
  // NEED to get local DATE and TIME

    // Might need to use different API to link to UV index using above information for coordinates to search uv api

    // let searchCityCoordinates = response.coord;

    displayCityInfo(response);
    displayForecast(response);
    cityStorage(response.city.name);
  });
};

function cityStorage(cityName) {
  let cityList = localStorage.getItem("key")
    ? JSON.parse(localStorage.getItem("key"))
    : [];

  cityList = cityList.concat(cityName);

  localStorage.setItem("key", JSON.stringify(cityList));
};

function displayCityInfo(response) {
  let createDiv = $(
    `<h2>
      ${response.city.name}
    </h2>
    <div>
      Temperature: ${response.list[0].main.temp}°F
    </div>
    <div>
      Humidity: ${response.list[0].main.humidity}%
    </div>
    <div>
      Wind: ${response.list[0].wind.speed}MPH
    </div>`
  );
  $("#searched-city-info").html(createDiv);
  console.log('CREAT', createDiv);
};

function displayForecast(response) {
  
  for(i = 5; i < response.list.length; i += 8) {
    forecastDiv = $(
    `<div class="forecast-box shadow-light">
        <h2>
          ${response.city.name}
        </h2>
        <div>
          Temperature: ${response.list[i].main.temp}°F
        </div>
        <div>
          Humidity: ${response.list[i].main.humidity}%
        </div>
        <div>
          Wind: ${response.list[i].wind.speed}MPH
        </div>
    </div>`
    );
    forecastDisplay.append(forecastDiv);
    console.log('forecast', forecastDiv);
  }
};
  

$("#city-search").on("click", function() {
  let city = $(":text").val();
forecastDisplay.html('');
  searchCity(city);
});

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    searchCity(null, position.coords.latitude, position.coords.longitude);
  });
} else {
  console.log("this browser does not support geolocation");
};
