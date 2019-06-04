<?php

return [

    '' => [
        'controller' => 'main',
        'action' => 'index',
    ],

    'main/action' => [
        'controller' => 'main',
        'action' => 'action',
    ],

    'account/login' => [
        'controller' => 'account',
        'action' => 'login',
    ],

    'account/logout' => [
        'controller' => 'account',
        'action' => 'logout',
    ],

    'account/register' => [
        'controller' => 'account',
        'action' => 'register',
    ],

    'account/verify' => [
        'controller' => 'account',
        'action' => 'verify',
    ],

    'account/restore' => [
        'controller' => 'account',
        'action' => 'restore',
    ],

    'settings' => [
        'controller' => 'settings',
        'action' => 'show',
    ],

    'photo' => [
        'controller' => 'photo',
        'action' => 'add',
    ],

    'photo/load' => [
        'controller' => 'photo',
        'action' => 'load',
    ],
];