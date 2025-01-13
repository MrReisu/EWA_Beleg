<?php
 
$requestData = json_decode(file_get_contents('php://input'), true);
//$requestData = [
//    'username' => 'Muster',
//    'password' => 'max123'
//];


$name = $requestData['username'];
$passwordHash = sha1($requestData['password']);

$mysqli = new mysqli("localhost", "g17", "or21tan", "g17");
if ($mysqli->connect_error) {
    die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
}

$checkStmt = $mysqli->prepare("SELECT * FROM nutzer WHERE Name = ? AND Password = ?");
$checkStmt->bind_param("ss", $name, $passwordHash);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {

    $row = $checkResult->fetch_assoc();
    $token = $row['Token'];
    header('Content-Type: application/json');
    //ggf. neuer Token nötig
    if ($token === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwiZW1haWwiOiJub2VtYWlsQGdtYWlsLmNvbSJ9.0c+R54DXl76EX2vJF06MNPUCLAN2Il32iy9Blsw/+Ok=') {
        $Stmt = $mysqli->prepare("SELECT * FROM bestellungen");
        $Stmt->execute();
        $result = $Stmt->get_result();

        $data = array();

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                // Erstelle ein assoziatives Array für jedes Produkt
                $order = array(
                    "token" => $row["Token"],
                    "datum" => $row["Datum"],
                    "wert" => $row["Wert"],
                );

                // Füge das Produkt zum Daten-Array hinzu
                $data["orders"][] = $order;
            }
        }

        $data["token"] = $token;
        echo json_encode($data);
    } else {
        echo json_encode(['token' => $token]);
    }

} else {

    $checkStmt->close();
    echo json_encode(['success' => false, 'message' => 'Benutzername oder Passwort falsch']);
}



function generateToken($payload)
{
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode($payload));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", 'YOUR_SECRET_KEY', true));
    // Ersetze 'YOUR_SECRET_KEY' durch deinen tatsächlichen geheimen Schlüssel
    return "$header.$payload.$signature";
}
