<?php
include("../../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];
$company_id = $data['company_id'];
$review = $data['review'];
$rating = $data['rating'];

$conn->query("INSERT INTO reviews (user_id, company_id, review, rating)
VALUES ('$user_id','$company_id','$review','$rating')");

echo json_encode(["message" => "Review added"]);
?>