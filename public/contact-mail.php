<?php
// FILE: public/contact-mail.php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// 1. Load PHPMailer
require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// 2. Security Headers & JSON Support
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// 3. SMTP Credentials
// $smtp_host = 'smtp.hostinger.com';
// $smtp_user = 'website@sukan-m.com';
// $smtp_pass = 'Wb@9102@#12'; 
// $receiver_email = 'info@sukan-m.com';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 4. READ JSON INPUT
    // Since the contact form sends JSON, we use php://input instead of $_POST
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $name    = $data['name'] ?? 'Guest';
    $email   = $data['email'] ?? '';
    $phone   = $data['phone'] ?? 'N/A';
    $message = $data['message'] ?? '';

    // Validate
    if (empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(["error" => "Email and Message are required"]);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Server Settings
        $mail->isSMTP();
        $mail->Host       = $smtp_host;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp_user;
        $mail->Password   = $smtp_pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        // Email Headers
        $mail->setFrom($smtp_user, 'Sukan Contact Form');
        $mail->addAddress($receiver_email); // Sends to info@sukan-m.com
        $mail->addReplyTo($email, $name);   // Reply goes to the customer

        // Email Content
        $mail->isHTML(true); // Use HTML for a nicer contact email
        $mail->Subject = "New Contact Enquiry from $name";
        
        $mail->Body    = "
            <h3>New Contact Enquiry Received!</h3>
            <p><strong>Name:</strong> $name</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Email:</strong> $email</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
        ";
        
        // Plain text version for non-HTML email clients
        $mail->AltBody = "Name: $name\nPhone: $phone\nEmail: $email\n\nMessage:\n$message";

        $mail->send();
        echo json_encode(["success" => true, "message" => "Message sent successfully!"]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to send message", "details" => $mail->ErrorInfo]);
    }
} else {
    echo json_encode(["message" => "Contact API Ready"]);
}
?>