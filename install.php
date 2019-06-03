<?php
$sqlFileToExecute = 'db.sql';

$config = require 'application/config/db.php';

$link = mysqli_connect($config["host"], $config["user"], $config["password"]);
if (!$link) {
  #die ("MySQL Connection error");
  echo mysqli_error($config["host"]);
  echo mysqli_errno($config["host"]);
}

$sql = "CREATE DATABASE IF NOT EXISTS " . $config["dbname"];
mysqli_query($link, $sql);
mysqli_select_db($link, $config["dbname"]) or die ("Wrong MySQL Database");

// read the sql file
$f = fopen($sqlFileToExecute,"r+");
$sqlFile = fread($f, filesize($sqlFileToExecute));
$sqlArray = explode(';',$sqlFile);
foreach ($sqlArray as $stmt) {
  if (strlen($stmt)>3 && substr(ltrim($stmt),0,2)!='/*') {
    $result = mysqli_query($link, $stmt);
    if (!$result) {
      $sqlStmt = $stmt;
      break;
    }
  }
}
if ($sqlErrorCode == 0) {
  echo "Script is executed succesfully!\n<br>";
} else {
  echo "An error occured during installation!\n<br>";
  echo "Error code: $sqlErrorCode\n<br>";
  echo "Error text: $sqlErrorText\n<br>";
  echo "Statement:\n<br> $sqlStmt\n<br>";
}

?>