<?php
include("../../config/db.php");

$result = $conn->query("SELECT * FROM activities");

$data = [];
while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>