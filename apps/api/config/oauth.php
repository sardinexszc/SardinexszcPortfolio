<?php

return [
    'github' => [
        'client_id' => env('GITHUB_OAUTH_CLIENT_ID'),
        'client_secret' => env('GITHUB_OAUTH_CLIENT_SECRET'),
        // Numeric GitHub user ID, obtained from https://api.github.com/users/YOUR_LOGIN.
        'allowed_user_id' => env('GITHUB_ALLOWED_USER_ID'),
        // Email of the existing, seeded Laravel admin account.
        'admin_email' => env('ADMIN_EMAIL'),
    ],
];
