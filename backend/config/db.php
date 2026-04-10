<?php
$conn = new mysqli("localhost", "root", "", "panorama_misr");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>