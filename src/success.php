<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Geschenkeshop Checkout</title>
</head>

<body>

    <h1>Geschenkeshop</h1>

    Vielen Dank für Ihren Einkauf! <br>

    <?php

    session_start();

    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    // require('stripe-php-master/init.php');
    require('stripe-php-13.8.0/init.php'); //Version nochmal kontrollieren
    // require 'vendor/autoload.php';
    
    $currency = 'eur';

    $public_key_for_js = "1"; // Definition einer Variable für den public key - Verwendung ganz unten in JS
    
    $live = 0;  // Bezahle an G00 - Demo Acount -> bitte auf eigenen Stripe Account umbauen !!
    
    // #################################################################  
    // Definition der Stripe-Account-Keys
    if ($live == 1) {
        // Secret Key des Grosshändlers - ggf. ändern
        \Stripe\Stripe::setApiKey('sk_test_cFnCai0Ye9NM8Tn9CMo6k0fn00P0R9pt9u');

        $public_key_for_js = "pk_test_aLcPqdtG2FDzxPWu5N9OBNOs00Yt0nKnhS";  //  PK Großhändler - ggf. ändern
    } else {
        // Der Key des eigenen Stripe-Accounts - bitte hier einsetzen->  der nachfolgende Code ist nicht mehr gültig !!!
        \Stripe\Stripe::setApiKey('sk_test_51OMTatGS0rXKJa7Ov71YGuKBOep20M8UZNJyuRTmoeumX5VSRAv8uSzZr5BebcEDyXvLMtsi0xeAj1glAfovQCDg00jOcKU3pU');

        $public_key_for_js = "pk_test_51OMTatGS0rXKJa7OAhwefY6qhtwDrNz1G0jSzXceu1D1gH2m6Q3c5hEG5gEG0X4f3is9AKdTLZ0TVLA3K1y7co9Z00ta1vSe3a";  // PK  G17
    }
    // #################################################################
    

    $sessionId = $_GET['session_id'];
    $checkoutSession = \Stripe\Checkout\Session::retrieve($sessionId);

    $stripe = new \Stripe\StripeClient('sk_test_51OMTatGS0rXKJa7Ov71YGuKBOep20M8UZNJyuRTmoeumX5VSRAv8uSzZr5BebcEDyXvLMtsi0xeAj1glAfovQCDg00jOcKU3pU');
    $sessionData = \Stripe\Checkout\Session::allLineItems(
        $sessionId,
        []
    );
    $lineItems = $sessionData['data'];


    if (!isset($_SESSION['codeExecuted'])) {

        if ($checkoutSession->payment_status === 'paid') {

            $amount = $checkoutSession->amount_total / 100;

            echo "Zahlung erfolgreich abgeschlossen. Bitte notieren Sie sich die Stripe-SessionID für Rückfragen:" . $_GET['session_id'];


           
            $mysqli = new mysqli("localhost", "g17", "or21tan", "g17");
            if ($mysqli->connect_error) {
                die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
            }
            $insertQuery = "INSERT INTO bestellungen (Token, Datum, Wert) VALUES (?, NOW(), ?)";

            $stmt = $mysqli->prepare($insertQuery);
            $stmt->bind_param("sd", $sessionId, $amount);
            $stmt->execute();

            // Zurücksetzen der Parameter für das nächste Statement
            $stmt->reset();


            // Prepare the statement outside the loop
            $updateQuery = "UPDATE buecher SET Lagerbestand = Lagerbestand - ? WHERE PreisID = ?";
            $stmt = $mysqli->prepare($updateQuery);


            foreach ($lineItems as $item) {
                $productId = $item["price"]['id'];
                $newQuantity = $item["quantity"];
                // Bind parameters
                $stmt->bind_param("is", $newQuantity, $productId);

                // Ausführen und überprüfen, ob das Update erfolgreich war
                if ($stmt->execute()) {
                    $response = array("success" => true, "message" => "Menge erfolgreich aktualisiert.");
                } else {
                    $response = array("success" => false, "message" => "Fehler beim Aktualisieren der Menge: " . $stmt->error);
                }

                // Zurücksetzen der Parameter für das nächste Statement
                $stmt->reset();
            }

            // Statement schließen
            $stmt->close();

            $mysqli->close();


        } else {
            echo "Zahlung nicht erfolgreich.";
        }




        $_SESSION['codeExecuted'] = true;
    }






    ?>
    <hr>
    <a href="https://ivm108.informatik.htw-dresden.de/ewa/g17/EWA_Beleg/Geschenke.html">Zurück zum Shop</a>

</html>