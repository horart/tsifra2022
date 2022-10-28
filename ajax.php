<?php
$db = new PDO('mysql:host=localhost;dbname='.$DB_NAME, $DB_USER, $DB_PASS);
$type = $_POST['type'];
switch ($type) {
    case 'reg':
        
        break;
    
    default:
        # code...
        break;
}
?>