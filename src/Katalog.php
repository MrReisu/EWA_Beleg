<?php
// Datenbankverbindung herstellen
$host = "localhost";
$user = "g17"; // Anpassen nach Ihren Datenbankeinstellungen
$password = "or21tan";
$database = "g17";

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Verbindung zur Datenbank fehlgeschlagen: " . $conn->connect_error);
}

// Überprüfen, ob ein Detail-ID-Parameter gesetzt ist
if (isset($_GET['produktid'])) {
    $detailid = intval($_GET['produktid']); // Sicherheitsmaßnahme gegen SQL-Injection

    // SQL-Abfrage, um Details zum Buch abzurufen
    $sql = "SELECT * FROM buecher WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $detailid);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $buch = $result->fetch_assoc();
        echo "<h1>Details zum Buch</h1>";
        echo "<p><strong>Titel:</strong> " . htmlspecialchars($buch['produkttitel']) . "</p>";
        echo "<p><strong>Autor:</strong> " . htmlspecialchars($buch['autorname']) . "</p>";
        echo "<p><strong>Beschreibung:</strong> " . htmlspecialchars($buch['kurzinhalt']) . "</p>";
        echo "<p><strong>Preis:</strong> " . htmlspecialchars($buch['preisbrutto']) . " €</p>";
        echo "<a href='katalog.php'>Zurück zum Katalog</a>";
    } else {
        echo "<p>Buch nicht gefunden.</p>";
        echo "<a href='katalog.php'>Zurück zum Katalog</a>";
    }
} else {
    // Standardkatalogansicht
    $sql = "SELECT produktid, produkttitel, autorname FROM buecher";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "<h1>Bücherkatalog</h1>";
        echo "<table border='1' cellpadding='10' cellspacing='0'>";
        echo "<tr><th>Title</th><th>Autor</th><th>Detailansicht</th></tr>";

        while ($row = $result->fetch_assoc()) {
            $title = htmlspecialchars($row['produkttitel']);
            $autor = htmlspecialchars($row['autorname']);
            $id = intval($row['produktid']);

            echo "<tr>";
            echo "<td>$title</td>";
            echo "<td>$autor</td>";
            echo "<td><a href='katalog.php?detailid=$id'>Details ansehen</a></td>";
            echo "</tr>";
        }

        echo "</table>";
    } else {
        echo "<p>Keine Bücher gefunden.</p>";
    }
}

$conn->close();
?>
