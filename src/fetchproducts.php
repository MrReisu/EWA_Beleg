<?php
header("Content-Type: application/json");
// Datenbankverbindung
$host = "localhost";
$user = "g17";
$password = "or21tan";
$database = "g17";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Daten anfragen
$sql = "SELECT produktid, produktname, lagerbestand FROM buecher";
$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products);

$conn->close();
?>
