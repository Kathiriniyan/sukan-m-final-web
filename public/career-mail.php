<?php
// FILE: public/career-mail.php

// 1. Load PHPMailer (Make sure you copied the PHPMailer folder to public/PHPMailer)
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// 2. Security Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// 3. YOUR CREDENTIALS (I have filled these in for you)
// $smtp_host = 
// $smtp_user =
// $smtp_pass = 
// $receiver_email =

// 4. Handle the Request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mail = new PHPMailer(true);

    try {
        // Server Settings
        $mail->isSMTP();
        $mail->Host       = $smtp_host;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp_user;
        $mail->Password   = $smtp_pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL
        $mail->Port       = 465;

        // Get Form Data
        $fullName = $_POST['fullName'] ?? 'Applicant';
        $email    = $_POST['email'] ?? '';
        $phone    = $_POST['phone'] ?? '';
        $role     = $_POST['role'] ?? 'Job Application';
        $cover    = $_POST['coverLetter'] ?? '';

        // Email From/To
        $mail->setFrom($smtp_user, 'Sukan Careers');
        $mail->addAddress($receiver_email); // Sends to info@sukan-m.com
        $mail->addReplyTo($email, $fullName); // Reply goes to applicant

        // Attachment Handling (CV)
        if (isset($_FILES['cv']) && $_FILES['cv']['error'] == UPLOAD_ERR_OK) {
            $mail->addAttachment($_FILES['cv']['tmp_name'], $_FILES['cv']['name']);
        } else {
            // Optional: Fail if no CV is attached
            // throw new Exception("CV upload failed");
        }

        // Email Content
        $mail->isHTML(false);
        $mail->Subject = "New Job Application: $role - $fullName";
        $mail->Body    = "New Application Received!\n\n" .
                         "Role: $role\n" .
                         "Name: $fullName\n" .
                         "Email: $email\n" .
                         "Phone: $phone\n\n" .
                         "Cover Letter:\n$cover\n";

        $mail->send();
        echo json_encode(["success" => true, "message" => "Application sent successfully"]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Message could not be sent.", "details" => $mail->ErrorInfo]);
    }
} else {
    echo json_encode(["message" => "Ready to receive data"]);
}
?>