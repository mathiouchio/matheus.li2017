<?php
$body = file_get_contents('php://input');
$body = json_decode($body);

// Only process POST reqeusts.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form fields and remove whitespace.
    $email = ($_POST['email']) ? $_POST['email'] : $body->email;
    print $email;
    $email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    $message = ($_POST['message']) ? $_POST['message'] : $body->message;
    print $message;
    $message = trim($message);


    // Check that data was sent to the mailer.
    if ( empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Set a 400 (bad request) response code and exit.
        http_response_code(400);
        echo "Oops! There was a problem with your submission. Please complete the form and try again.";
        exit;
    }

    // Set the recipient email address.
    $recipient = "m@matheus.li";

    // Build the email content.
    $email_content = "$message";

    // Set the email subject.
    $subject = "New message from matheus.li";

    // Build the email headers.
    $email_headers = "From: $email <$email>";

    // Send the email.
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Set a 200 (okay) response code.
        http_response_code(200);
        echo "Thank You! Your message has been sent.";
    } else {
        // Set a 500 (internal server error) response code.
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }

} else {
    // Not a POST request, set a 403 (forbidden) response code.
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
