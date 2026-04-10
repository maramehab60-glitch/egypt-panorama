<?php
include("../../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];

$conn->query("INSERT INTO subscriptions (user_id, status)
VALUES ('$user_id','active')");

echo json_encode(["message" => "Subscribed"]);
?>