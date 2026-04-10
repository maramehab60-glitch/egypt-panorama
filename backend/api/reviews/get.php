<?php
include("../../config/db.php");

$company_id = $_GET['company_id'];

$result = $conn->query("SELECT * FROM reviews WHERE company_id=$company_id");

$data = [];
while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>