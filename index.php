<?php

if (PHP_SAPI == 'cli-server') {
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) return false;
}

require_once 'dev.php';

use application\core\Router;


spl_autoload_register(function($class) {
    $path = __DIR__ . '/' . str_replace('\\', '/', $class.'.php');
    if (file_exists($path)) {
        require_once $path;
    }
});

session_set_cookie_params(['samesite' => 'Strict']);
session_start();

$router = New Router;
$router->run();