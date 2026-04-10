<?php
include("../../config/db.php");

$result = $conn->query("SELECT * FROM companies");

$data = [];
while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>