<?php
include("../../config/db.php");

$id = $_GET['id'];

$conn->query("DELETE FROM activities WHERE id=$id");
?>