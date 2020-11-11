<?php
$sqlFileToExecute = 'db.sql';

$config = array_merge([
    'user'      => null,
    'password'  => null,
    'port'      => null
], require __DIR__ . '/application/config/db.php');

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    $link = mysqli_connect($config["host"], $config["user"], $config["password"], null, $config['port']);
    if (! $link) {
        throw new Exception();
    }
} catch (Exception $e) {
    die("Unfortunately, the details you entered for connection are incorrect! Check a configuration file.\n");
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
      break;
    }
  }
}
if ($result) {
  echo "Script is executed succesfully!\n";
} else {
  echo "An error occured during installation!\n";
  echo mysqli_error($link);
  echo "Statement:\n $stmt\n";
}