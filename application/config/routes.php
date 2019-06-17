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

    'settings/change-email' => [
        'controller' => 'settings',
        'action' => 'changeEmail',
    ],

    'settings/change-username' => [
        'controller' => 'settings',
        'action' => 'changeUsername',
    ],

    'settings/change-password' => [
        'controller' => 'settings',
        'action' => 'changePassword',
    ],

    'settings/change-notif' => [
        'controller' => 'settings',
        'action' => 'changeNotif',
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