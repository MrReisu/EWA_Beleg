<?

$requestData = json_decode(file_get_contents('php://input'), true);

$mysqli = new mysqli("localhost", "g17", "or21tan", "g17");

// Überprüfen, ob die Verbindung erfolgreich hergestellt wurde
if ($mysqli->connect_error) {
    die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
}


//check ob name existiert
$name = $requestData['username'];
$email = $requestData['email'];
$token = generateToken(['username' => $requestData['username'], 'email' => $requestData['email']]);


$checkStmt = $mysqli->prepare("SELECT * FROM nutzer WHERE Name = ?");
$checkStmt->bind_param("s", $name);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();


if ($checkResult->num_rows > 0) {
    // Benutzername existiert bereits
    echo json_encode(['success' => false, 'message' => 'Benutzername existiert bereits']);
    $checkStmt->close();
} else {
    // Benutzername ist eindeutig, fahre mit dem Einfügen fort
    $checkStmt->close();

    // Führe das Einfügen durch
    $insertStmt = $mysqli->prepare("INSERT INTO nutzer (Name, Email, Token) VALUES (?, ?, ?)");
    $insertStmt->bind_param("sss", $name, $email, $token);

    if ($insertStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Daten erfolgreich eingefügt']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Fehler beim Einfügen der Daten']);
    }

    $insertStmt->close();
}

header('Content-Type: application/json');
echo json_encode(['token' => $token]);

function generateToken($payload) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode($payload));
    $YOUR_SECRET_KEY="test11"; 
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", '$YOUR_SECRET_KEY', true));
    // Ersetze 'YOUR_SECRET_KEY' durch deinen tatsächlichen geheimen Schlüssel
    return "$header.$payload.$signature";
}