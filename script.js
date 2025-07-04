const apiKey = "Your_API_Key_Here";
const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");
const weatherIcon = document.getElementById("weather-icon");
const tempDisplay = document.getElementById("temp");
const descriptionDisplay = document.getElementById("description");
const windDisplay = document.getElementById("wind");
const humidityDisplay = document.getElementById("humidity");
const hourlyDiv = document.getElementById("hourlyForecast");
const weeklyDiv = document.getElementById("weeklyForecast");

// Optional: If you add <p id="errorMsg"></p> near your search bar
// const errorMsg = document.getElementById("errorMsg");

// Get user's location on page load
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  }
});

searchBtn.addEventListener("click", () => {
  const location = locationInput.value.trim();
  if (location) {
    fetchWeatherByCity(location);
  }
});

function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function fetchWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function fetchWeather(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "200") {
        updateWeather(data);
        // if (errorMsg) errorMsg.innerText = ""; // Clear error if using error message
      } else {
        alert("Location not found.");
        // if (errorMsg) errorMsg.innerText = "Location not found.";
      }
    })
    .catch(err => {
      alert("Error fetching weather data.");
      // if (errorMsg) errorMsg.innerText = "Error fetching weather data.";
    });
}

function updateWeather(data) {
  const current = data.list[0];
  tempDisplay.innerText = `${Math.round(current.main.temp)}°C`;
  descriptionDisplay.innerText = current.weather[0].description;
  windDisplay.innerText = `${current.wind.speed} km/h`;
  humidityDisplay.innerText = `${current.main.humidity}%`;

  const iconUrl = getCustomIcon(current.weather[0].main);
  weatherIcon.innerHTML = `<img src="${iconUrl}" alt="Weather Icon">`;

  const condition = current.weather[0].main.toLowerCase();
  setBackground(condition);

  displayHourly(data.list);
  displayWeekly(data.list);
}

function getCustomIcon(condition) {
  condition = condition.toLowerCase();
  if (condition.includes("clear")) return "https://cdn-icons-png.flaticon.com/512/869/869869.png";
  if (condition.includes("cloud")) return "https://cdn-icons-png.flaticon.com/512/414/414825.png";
  if (condition.includes("rain")) return "https://cdn-icons-png.flaticon.com/512/414/414974.png";
  if (condition.includes("snow")) return "https://cdn-icons-png.flaticon.com/512/642/642102.png";
  return "https://cdn-icons-png.flaticon.com/512/869/869869.png";
}

function setBackground(condition) {
  const body = document.body;

  if (condition.includes("clear")) {
    body.style.background = "linear-gradient(to right, #87CEEB, #f7d358)";
  } else if (condition.includes("cloud")) {
    body.style.background = "#555";
  } else if (condition.includes("rain")) {
    body.style.background = "#34495e";
  } else if (condition.includes("snow")) {
    body.style.background = "#f0f8ff";
  } else if (condition.includes("thunderstorm")) {
    body.style.background = "#2c3e50";
  } else if (condition.includes("mist") || condition.includes("fog")) {
    body.style.background = "#888";
  } else {
    body.style.background = "#1c1c1c";
  }
}

function displayHourly(list) {
  let hourlyHTML = "";
  for (let i = 0; i < 6; i++) {
    const hourData = list[i];
    const time = new Date(hourData.dt * 1000).getHours();
    hourlyHTML += `
      <div class="hourly-item">
        <p>${time}:00</p>
        <p>${Math.round(hourData.main.temp)}°C</p>
      </div>`;
  }
  hourlyDiv.innerHTML = hourlyHTML;
}

function displayWeekly(list) {
  const dailyData = [];
  for (let i = 0; i < list.length; i += 8) {
    dailyData.push(list[i]);
  }

  let weeklyHTML = "";
  dailyData.forEach(day => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    weeklyHTML += `
      <div class="day-item">
        <p>${dayName}</p>
        <p>${Math.round(day.main.temp)}°C</p>
      </div>`;
  });
  weeklyDiv.innerHTML = weeklyHTML;
}
