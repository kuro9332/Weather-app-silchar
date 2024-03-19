<?php
// Enable CORS for cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

// Function to fetch weather data from OpenWeatherMap API
function fetchWeatherData($city) {
    // API key for accessing OpenWeatherMap API
    $apiKey = "16674eae7055034bc2857b793685e577";
    // API URL for fetching weather data based on city name
    $apiURL = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=$city&appid=$apiKey";
    // Fetch weather data from the API
    $data = file_get_contents($apiURL);

    // Check if data retrieval was successful
    if ($data === false) {
        return array("error" => "Failed to fetch weather data from the API.");
    }

    // Decode the JSON response into an associative array
    $weatherData = json_decode($data, true);

    // Check if the JSON response is valid
    if ($weatherData === null) {
        return array("error" => "Invalid JSON response from the API.");
    }

    // Check if the city is not found in the API response
    if (isset($weatherData['message']) && $weatherData['message'] === 'city not found') {
        return array("error" => "City not found: $city");
    }

    // Fetch the weather icon code and construct the icon URL
    $iconCode = $weatherData['weather'][0]['icon'];
    $iconURL = "https://openweathermap.org/img/wn/$iconCode.png";
    $weatherData['weather'][0]['icon'] = $iconURL; // Replace icon code with icon URL

    // Return the weather data
    return $weatherData;
}

// Function to insert weather data into the database
function insertWeatherData($weatherData) {
    // Extract weather data for database insertion
    $cityName = $weatherData['name'];
    $temperature = $weatherData['main']['temp'];
    $humidity = $weatherData['main']['humidity'];
    $pressure = $weatherData['main']['pressure'];
    $description = $weatherData['weather'][0]['description'];
    $windSpeed = isset($weatherData['wind']['speed']) ? $weatherData['wind']['speed'] : null;
    $date = date('Y-m-d');

    // Connect to the database
    $con = new mysqli("sql201.infinityfree.com", "if0_35939199", "j7n7jL6uTm8", "if0_35939199_weather");
    // Check for database connection error
    if ($con->connect_error) {
        return array("error" => "Connection failed: " . $con->connect_error);
    }

    // Check if data for the same city and date already exists in the database
    $stmt = $con->prepare("SELECT COUNT(*) FROM weather WHERE city = ? AND date = ?");
    $stmt->bind_param("ss", $cityName, $date);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    // If data already exists, return without inserting
    if ($count > 0) {
        $con->close();
        return array("error" => "Data for $cityName on $date already exists in the database.");
    }

    // Insert new data into the database
    $stmt = $con->prepare("INSERT INTO weather (city, temperature, humidity, pressure, description, wind_speed, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sidisss", $cityName, $temperature, $humidity, $pressure, $description, $windSpeed, $date);

    // Check for insertion error
    if (!$stmt->execute()) {
        return array("error" => "Error inserting data: " . $stmt->error);
    }

    // Close database connection
    $stmt->close();
    $con->close();

    // Return true upon successful insertion
    return true;
}

// Main script to fetch weather data and insert into the database
$city = isset($_GET['city']) ? $_GET['city'] : 'Silchar';
$weatherData = fetchWeatherData($city);

// If there is an error in fetching weather data, return the error message
if (isset($weatherData['error'])) {
    echo json_encode($weatherData);
} else {
    // If weather data is fetched successfully, encode and return the data
    echo json_encode($weatherData);
    // Insert weather data into the database
    insertWeatherData($weatherData);
}


?>
