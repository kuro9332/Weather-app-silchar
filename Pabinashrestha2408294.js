// DOM Element References
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const dateTimeElement = document.getElementById("dateContainer");
const errorElement = document.querySelector(".error");
const forecastContainer = document.getElementById("forecast-container");
const futurecontainer = document.getElementById("future-forecast");

// Function to save city to localStorage
function saveCityToLocalStorage(city) {
    try {
        localStorage.setItem('city', city);
    } catch (error) {
        console.error('Error saving city to localStorage:', error);
    }
}

// Function to fetch city from localStorage
function getCityFromLocalStorage() {
    try {
        const city = localStorage.getItem('city');
        return city || "Silchar"; // Default to "Silchar" if no city is stored
    } catch (error) {
        console.error('Error fetching city from localStorage:', error);
        return "Silchar"; // Default to "Silchar" in case of error
    }
}

// Function to update the date and time
function updateDateTime() {
    const currentDate = new Date();

    // Get local time zone offset in milliseconds
    const timezoneOffsetMilliseconds = currentDate.getTimezoneOffset() * 1000;

    // Convert current time to UTC by subtracting the offset
    const utcTimeMilliseconds = currentDate.getTime() - timezoneOffsetMilliseconds;

    // Create a new Date object with the adjusted UTC time
    const localTime = new Date(utcTimeMilliseconds);

    // Format the date
    const options = {
        weekday: 'short', // Specify the full name of the day
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };

    // Format the date including the day of the week
    const formattedDate = localTime.toLocaleDateString('en-US', options);
    dateTimeElement.textContent = formattedDate;
}

// Call the function to update the date and time when the page loads
updateDateTime();

// Event listener for search button
searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    saveCityToLocalStorage(city); // Save the searched city to localStorage
    fetchWeather(city);
});

// Event listener for Enter key press in search box
searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const city = searchBox.value;
        saveCityToLocalStorage(city); // Save the searched city to localStorage
        fetchWeather(city);
    }
});

// Event listener for the show forecast button
const showForecastBtn = document.getElementById("showForecastBtn");
showForecastBtn.addEventListener("click", () => {
    if (forecastContainer.style.display === "none") {
        forecastContainer.style.display = "block";
        showForecastBtn.textContent = "Hide Past 7 Days Forecast ";
    } else {
        forecastContainer.style.display = "none";
        showForecastBtn.textContent = "Show Past 7 Days Forecast ";
    }
});

// Function to fetch current and past 7 days weather data
async function fetchWeather(city) {
    try {
        // Clear any previous error message
        errorElement.textContent = "";
        errorElement.style.display = 'none';

        const [currentWeatherResponse, pastWeatherResponse] = await Promise.all([
            fetch(`https://2408294pabinashresthaa.42web.io/weather/home.php?city=${city}`),
            fetch(`https://2408294pabinashresthaa.42web.io/weather/fetch.php?city=${city}`)
        ]);

        let currentWeatherData;
        try {
            currentWeatherData = await currentWeatherResponse.json();
        } catch (error) {
            throw new Error("Failed to parse current weather data. Invalid JSON response from server.");
        }

        saveCurrentWeatherToLocalStorage(currentWeatherData); // Save current weather data to localStorage

        displayWeather(currentWeatherData);

        let pastWeatherData;
        try {
            pastWeatherData = await pastWeatherResponse.json();
        } catch (error) {
            throw new Error("Failed to parse past 7 days weather data. Invalid JSON response from server.");
        }

        displayForecast(pastWeatherData);

        // Display future forecast only when the page loads, not after each search
        if (city === "Silchar") {
            fetchFutureForecast();
        } else {
            // Hide the future forecast container
            futurecontainer.innerHTML = "";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        handleError(error.message);
    }
}

// Function to save current weather data to localStorage
function saveCurrentWeatherToLocalStorage(currentWeatherData) {
    try {
        localStorage.setItem('currentWeatherData', JSON.stringify(currentWeatherData));
    } catch (error) {
        console.error('Error saving current weather data to localStorage:', error);
    }
}

// Function to handle errors
function handleError(errorMessage) {
    // Clear any previous error message
    errorElement.textContent = "";

    // Hide the error element
    errorElement.style.display = 'none';

    // Check if the error message indicates an invalid city
    if (errorMessage === "Failed to parse current weather data. Invalid JSON response from server.") {
        // Clear the content of the forecast container
        forecastContainer.innerHTML = "";

        // Display the specific error message for an invalid city
        errorElement.textContent = "Invalid city. Please try again.";
        errorElement.style.display = 'block';

    } else {
        // Display the general error message in the console
        console.error(errorMessage);
        
        // Display the error message to the user
        errorElement.textContent = "An error occurred while fetching data. Please try again later.";
        errorElement.style.display = 'block';
    }
}

// Function to display current weather data
function displayWeather(data) {
    const city = data.name;
    const country = data.sys.country;
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const pressure = data.main.pressure;

    // Update DOM elements with weather data
    document.querySelector(".city").textContent = `${city}, ${country}`;
    document.querySelector(".condition").textContent = weatherDescription;
    document.querySelector(".temp").textContent = `${temperature}°C`;
    document.querySelector(".humidity").textContent = `${humidity}% Humidity`;
    document.querySelector(".wind").textContent = `${windSpeed} m/s Wind Speed`;
    document.querySelector(".pressure").textContent = `${pressure} hPa Pressure`;
    weatherIcon.src = data.weather[0].icon;
}

// Function to display past 7 days weather data
function displayForecast(data) {
    forecastContainer.innerHTML = ""; // Clear previous forecast data

    if (data.forecast && data.forecast.length > 0) {
        const table = document.createElement("table");
        table.classList.add("forecast-table");

        // Create table header
        const tableHeader = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Date</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Pressure (hPa)</th>
            <th>Description</th>
            <th>Wind Speed (m/s)</th>
        `;
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        // Create table body
        const tableBody = document.createElement("tbody");
        data.forecast.forEach(entry => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.temperature}</td>
                <td>${entry.humidity}</td>
                <td>${entry.pressure}</td>
                <td>${entry.description}</td>
                <td>${entry.wind_speed}</td>
            `;
            tableBody.appendChild(row);
        });
        table.appendChild(tableBody);

        forecastContainer.appendChild(table);
    }
}

// Function to fetch future forecast data
async function fetchFutureForecast() {
    try {
        const response = await fetch("https://2408294pabinashresthaa.42web.io/weather/future.php"); // Assuming future.php is the endpoint to fetch forecast data
        if (!response.ok) {
            throw new Error("Failed to fetch forecast data");
        }
        const forecastData = await response.json();
        displayFutureForecast(forecastData);
    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

// Function to display future forecast data
function displayFutureForecast(forecastData) {
    // Clear previous future forecast data
    futurecontainer.innerHTML = "";

    // Check if forecastData is an array
    if (Array.isArray(forecastData)) {
        forecastData.forEach(entry => {
            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card");

            forecastCard.innerHTML = `
                <p>${entry.weekday}</p>
                <img src="${entry.icon}" alt="Weather Icon">
                <p>${Math.round(entry.temperature - 273.15)}°C</p>
            `;

            futurecontainer.appendChild(forecastCard);
        });
    } else {
        // If forecastData is not an array, log an error or handle it appropriately
        console.error("Forecast data is not in the expected format:", forecastData);
    }
}

// Initial fetch using the city from localStorage or defaulting to "Silchar"
fetchWeather(getCityFromLocalStorage());

// Initial fetch for future forecast
fetchFutureForecast();
