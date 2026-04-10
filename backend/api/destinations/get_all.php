<?php
include("../../config/db.php");

$result = $conn->query("SELECT * FROM destinations");

$data = [];
while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>