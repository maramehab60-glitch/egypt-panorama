<?php
include("../../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$conn->query("INSERT INTO activities (name,type,destination_id)
VALUES ('".$data['name']."','".$data['type']."','".$data['destination_id']."')");
?>