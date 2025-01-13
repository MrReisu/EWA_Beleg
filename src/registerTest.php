<?php
// Hier würdest du normalerweise eine Verbindung zu deiner Datenbank herstellen und die Registrierungslogik implementieren
// Zum Testen verwenden wir hier statische Daten

$requestData = json_decode(file_get_contents('php://input'), true);

// Hier könntest du Validierungen und Überprüfungen durchführen

// Für dieses Beispiel geben wir einen festen Token zurück
$token = generateToken(['username' => $requestData['username'], 'email' => $requestData['email']]);
$name = $requestData['username'];
$email = $requestData['email'];
$passwordHash = sha1($requestData['password']);


//Datenbank
$mysqli = new mysqli("localhost", "g17", "or21tan", "g17");
if ($mysqli->connect_error) {
    die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
}

$checkStmt = $mysqli->prepare("SELECT * FROM nutzer WHERE Name = ?");
$checkStmt->bind_param("s", $name);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();


if ($checkResult->num_rows > 0) {
     // Benutzername existiert bereits
     echo json_encode(['success' => false, 'message' => 'Benutzername existiert bereits']);
     $checkStmt->close();
}
else {
    $insertStmt = $mysqli->prepare("INSERT INTO nutzer (Name, Email, Token, Password) VALUES (?, ?, ?, ?)");
    $insertStmt->bind_param("ssss", $name, $email, $token, $passwordHash);
    $insertStmt->execute();

    $insertStmt->close();
    header('Content-Type: application/json');
    echo json_encode(['token' => $token]);
}



function generateToken($payload) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode($payload));
    $YOUR_SECRET_KEY="test11"; 
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", '$YOUR_SECRET_KEY', true));
    // Ersetze 'YOUR_SECRET_KEY' durch deinen tatsächlichen geheimen Schlüssel
    return "$header.$payload.$signature";
}
