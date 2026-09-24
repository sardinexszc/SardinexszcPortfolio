<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Admin sign in</title>
    <style>
        body{background:#f4f4f1;color:#171717;font:16px system-ui;display:grid;min-height:100vh;place-items:center;margin:0}
        main{background:#fff;border:1px solid #ddd;padding:40px;width:min(380px,calc(100% - 80px))}
        p{color:#555;line-height:1.6}
        a{align-items:center;background:#171717;color:#fff;display:flex;justify-content:center;margin-top:28px;min-height:48px;text-decoration:none}
        a:hover{background:#333}
        .error{color:#a00;font-size:14px}
    </style>
</head>
<body>
    <main>
        <p>PORTFOLIO / ADMIN</p>
        <h1>Sign in</h1>
        <p>Use the authorized GitHub account to continue.</p>
        @error('github')<p class="error" role="alert">{{ $message }}</p>@enderror
        <a href="{{ route('admin.github.redirect') }}">Continue with GitHub</a>
    </main>
</body>
</html>
