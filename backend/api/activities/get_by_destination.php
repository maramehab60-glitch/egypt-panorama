<?php
include("../../config/db.php");

$destination = $_GET['destination'];

$sql = "SELECT * FROM activities 
JOIN destinations ON activities.destination_id = destinations.id
WHERE destinations.name = '$destination'";

$result = $conn->query($sql);

$data = [];
while($row = $result->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>