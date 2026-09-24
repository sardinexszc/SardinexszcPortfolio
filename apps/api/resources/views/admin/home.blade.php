<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dashboard · Portfolio admin</title>
<style>
:root{font:16px system-ui;color:#181818}*{box-sizing:border-box}body{margin:0;background:#f5f5f1}
.shell{max-width:1100px;margin:auto;padding:28px 24px}header{display:flex;justify-content:space-between;align-items:center;gap:20px;border-bottom:1px solid #d8d8d2;padding-bottom:20px}
.brand{font-weight:700;letter-spacing:.08em;font-size:12px}nav{display:flex;align-items:center;gap:18px}a{color:inherit}button{background:#181818;color:#fff;border:0;padding:10px 16px;cursor:pointer}
main{padding:52px 0}h1{font-size:clamp(32px,5vw,54px);font-weight:500;margin:0 0 12px}p{line-height:1.6;color:#555}.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:36px}
.tile{background:white;border:1px solid #deded8;padding:24px;min-height:170px;text-decoration:none}.tile h2{font-size:19px;margin:0 0 12px}.tile span{font-size:13px;color:#555}
@media(max-width:700px){header{align-items:flex-start;flex-direction:column}.tiles{grid-template-columns:1fr}main{padding:32px 0}}
</style>
</head>
<body><div class="shell">
<header><div class="brand">PORTFOLIO / ADMIN</div><nav><span>{{ auth()->user()->name }}</span><form method="post" action="{{ route('admin.logout') }}">@csrf<button type="submit">Sign out</button></form></nav></header>
<main><h1>Dashboard</h1><p>Welcome back. Your dashboard is ready for the modules we will add next.</p>
<div class="tiles"><a class="tile" href="{{ route('admin.content') }}"><h2>Portfolio content</h2><span>Manage projects, skills, and experience →</span></a>
<div class="tile"><h2>Future module</h2><span>Coming soon</span></div><div class="tile"><h2>Future module</h2><span>Coming soon</span></div></div>
</main></div></body></html>
