<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Validate form data
if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['message'])) {
    echo "Please fill all required fields.";
    exit;
}

$name = htmlspecialchars($_POST['name']);
$email = htmlspecialchars($_POST['email']);
$message = htmlspecialchars($_POST['message']);

// PHPMailer instance
$mail = new PHPMailer(true);

try {
    // SMTP settings
    $mail->isSMTP();
    $mail->Host       = 'smtp-relay.brevo.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = '9d42dd001@smtp-brevo.com'; // your Brevo login
    $mail->Password   = 'YOUR_BREVO_API_KEY';       // replace with your API key
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Sender and recipient
    $mail->setFrom('noreply@reteshthapa.com.np', 'Website Contact');
    $mail->addAddress('reteshthapakaji@gmail.com'); // your personal email

    // Email content
    $mail->isHTML(true);
    $mail->Subject = "New Contact Message from $name";
    $mail->Body    = "
        <b>Name:</b> $name <br>
        <b>Email:</b> $email <br>
        <b>Message:</b><br>$message
    ";

    $mail->send();
    echo "success";
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>
