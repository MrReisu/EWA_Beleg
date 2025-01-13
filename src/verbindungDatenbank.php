<?php
// Verbindung zur MariaDB herstellen
$mysqli = mysqli_connect("localhost", "g17", "or21tan", "g17")  or
 die(mysql_error());

$query_String = "SELECT ProduktID, Produkttitel, Lagerbestand, PreisNetto, PreisID, ImageLink FROM buecher;";

$result = $mysqli->query ($query_String);

$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Erstelle ein Array für jedes Produkt
        $product = array(
            "id" => $row["ProduktID"],
            "quantity" => $row["Lagerbestand"],
            "name" => $row["Produkttitel"],
            "preis" => $row["PreisNetto"],
            "priceid" => $row["PreisID"],
            "imageLink" => $row["ImageLink"]
        );

        // Füge das Produkt zum Daten-Array hinzu
        $data["products"][] = $product;
    }
}

echo json_encode($data);

?>