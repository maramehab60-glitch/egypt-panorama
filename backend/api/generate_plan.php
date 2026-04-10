<?php
include("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

$days = $data['days'];
$destination = $data['destination'];

$sql = "SELECT * FROM activities 
        JOIN destinations ON activities.destination_id = destinations.id
        WHERE destinations.name = '$destination'";

$result = $conn->query($sql);

$activities = [];
while ($row = $result->fetch_assoc()) {
    $activities[] = $row;
}

shuffle($activities);

$plan = [];
$index = 0;

for ($i = 1; $i <= $days; $i++) {
    $plan["Day $i"] = array_slice($activities, $index, 2);
    $index += 2;
}

echo json_encode($plan);
?>