<?php
// Enable CORS for cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// API URL with placeholders for latitude, longitude, and API key
$url = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";

// Replace placeholders with actual values
$url = str_replace("{lat}", "24.83", $url); // Correct latitude
$url = str_replace("{lon}", "92.8", $url); // Correct longitude
$url = str_replace("{API key}", "16674eae7055034bc2857b793685e577", $url); // Replace with your API key

// Fetch data from the API
$response = file_get_contents($url);

// Check if request was successful
if ($response === false) {
    echo json_encode(array("error" => "Unable to fetch forecast data"));
} else {
    // Decode JSON response
    $data = json_decode($response, true);

    // Check if response contains forecast data
    if (isset($data['list']) && count($data['list']) > 0) {
        $forecastData = array();

        // Iterate over forecast data
        foreach ($data['list'] as $forecast) {
            // Extract relevant information (weekday name, temperature, icon)
            $timestamp = $forecast['dt'];
            $weekday = date("l", $timestamp); // Get weekday name
            $date = date("Y-m-d", $timestamp); // Get date without time
            $temperature = $forecast['main']['temp']; // Temperature in Kelvin, convert as needed
            $icon = "https://openweathermap.org/img/wn/" . $forecast['weather'][0]['icon'] . ".png"; // Weather icon URL

            // Add forecast entry to array
            // Use the date as the key to group entries by day
            $forecastData[$date] = array(
                "weekday" => $weekday,
                "temperature" => $temperature,
                "icon" => $icon
            );
        }

        // Output forecast data as JSON
        echo json_encode(array_values($forecastData)); // Convert associative array to indexed array
    } else {
        echo json_encode(array("error" => "No forecast data available"));
    }
}
?>
