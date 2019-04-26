<?php

require_once 'dev.php';

use application\core\Router;


spl_autoload_register(function($class) {
    $path = str_replace('\\', '/', $class.'.php');
    if (file_exists($path)) {
        require $path;
    }
});

session_start();

$router = New Router;
$router->run();