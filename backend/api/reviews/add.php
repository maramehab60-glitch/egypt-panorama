<?php
include("../../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$conn->query("INSERT INTO reviews (company_id, review, rating)
VALUES ('".$data['company_id']."','".$data['review']."','".$data['rating']."')");
?>