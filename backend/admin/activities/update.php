<?php
include("../../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$name = $data['name'];

$conn->query("UPDATE activities SET name='$name' WHERE id=$id");
?>