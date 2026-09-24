<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GithubLoginController extends Controller
{
    public function redirect(Request $request): RedirectResponse
    {
        if (! $this->configured()) {
            return redirect()->route('admin.login')->withErrors(['github' => 'GitHub sign-in is not configured.']);
        }

        $state = Str::random(64);
        $request->session()->put('github_oauth_state', $state);

        return redirect()->away('https://github.com/login/oauth/authorize?'.http_build_query([
            'client_id' => config('oauth.github.client_id'),
            'redirect_uri' => route('admin.github.callback'),
            'state' => $state,
        ]));
    }

    public function callback(Request $request): RedirectResponse
    {
        $expected = $request->session()->pull('github_oauth_state');

        if (! $this->configured() || ! is_string($expected) || ! is_string($request->query('state'))
            || ! hash_equals($expected, $request->query('state')) || ! is_string($request->query('code'))) {
            return $this->deny();
        }

        try {
            $tokenResponse = Http::asForm()->acceptJson()->timeout(10)->post('https://github.com/login/oauth/access_token', [
                'client_id' => config('oauth.github.client_id'),
                'client_secret' => config('oauth.github.client_secret'),
                'code' => $request->query('code'),
                'redirect_uri' => route('admin.github.callback'),
            ]);

            $token = $tokenResponse->successful() ? $tokenResponse->json('access_token') : null;
            if (! is_string($token) || $token === '') {
                return $this->deny();
            }

            $userResponse = Http::withToken($token)->acceptJson()->timeout(10)->get('https://api.github.com/user');
            $githubId = $userResponse->successful() ? $userResponse->json('id') : null;
            $allowedId = (string) config('oauth.github.allowed_user_id');
            $adminEmail = config('oauth.github.admin_email');
            $admin = is_string($adminEmail) ? User::where('email', $adminEmail)->first() : null;

            // Check the immutable GitHub account ID. Never grant admin access to arbitrary OAuth users.
            if (! ctype_digit($allowedId) || (string) $githubId !== $allowedId || ! $admin) {
                return $this->deny();
            }

            Auth::login($admin);
            $request->session()->regenerate();

            return redirect()->route('admin.dashboard');
        } catch (\Throwable $exception) {
            report($exception);

            return $this->deny();
        }
    }

    private function configured(): bool
    {
        return filled(config('oauth.github.client_id'))
            && filled(config('oauth.github.client_secret'))
            && ctype_digit((string) config('oauth.github.allowed_user_id'))
            && filled(config('oauth.github.admin_email'));
    }

    private function deny(): RedirectResponse
    {
        return redirect()->route('admin.login')->withErrors(['github' => 'GitHub sign-in could not be verified or this account is not authorized.']);
    }
}
