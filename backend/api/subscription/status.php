<?php
include("../../config/db.php");

$email = $_GET['email'];

$result = $conn->query("SELECT * FROM subscriptions WHERE user_email='$email'");

echo json_encode($result->fetch_assoc());
?>