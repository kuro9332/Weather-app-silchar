
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

// Establish database connection
$con = new mysqli("sql201.infinityfree.com", "if0_35939199", "j7n7jL6uTm8", "if0_35939199_weather");

// Check connection
if ($con->connect_error) {
    $response = array("error" => "Connection failed: " . $con->connect_error);
    echo json_encode($response);
    exit; // Terminate script execution
}

// Fetch weather data from the database for the past seven days
$city = isset($_GET['city']) ? $_GET['city'] : 'Silchar';

// Calculate the date seven days ago
$dateSevenDaysAgo = date('Y-m-d', strtotime('-7 days'));

// Prepare and execute the SELECT query to fetch data for the past seven days
$stmt = $con->prepare("SELECT * FROM weather WHERE city = ? AND date >= ? ORDER BY date ASC");
$stmt->bind_param("ss", $city, $dateSevenDaysAgo);
$stmt->execute();

// Check for query execution error
if ($stmt->errno) {
    $response = array("error" => "Query execution error: " . $stmt->error);
    echo json_encode($response);
    $stmt->close();
    $con->close();
    exit; // Terminate script execution
}

$result = $stmt->get_result();

// Prepare response data
$response = array();

if ($result->num_rows > 0) {
    // Data found, fetch and add to response
    while ($row = $result->fetch_assoc()) {
        $entry = array(
            'date' => $row['date'],
            'temperature' => $row['temperature'],
            'humidity' => $row['humidity'],
            'pressure' => $row['pressure'],
            'description' => $row['description'],
            'wind_speed' => $row['wind_speed']
        );
        $response['forecast'][] = $entry;
    }
} else {
    // No data found for the specified city
    $response['error'] = "No weather data found for the past seven days for the specified city.";
}

// Close statement and connection
$stmt->close();
$con->close();

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
