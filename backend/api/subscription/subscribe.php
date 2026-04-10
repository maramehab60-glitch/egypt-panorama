<?php
include("../../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$conn->query("INSERT INTO subscriptions (user_email, status)
VALUES ('".$data['email']."','active')");
?>