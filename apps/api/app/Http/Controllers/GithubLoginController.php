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
            return redirect()->route('login')->withErrors([
                'github' => 'GitHub sign-in is not configured yet.',
            ]);
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
        $expectedState = $request->session()->pull('github_oauth_state');
        $returnedState = $request->query('state');
        $code = $request->query('code');

        if (! $this->configured()
            || ! is_string($expectedState)
            || ! is_string($returnedState)
            || ! hash_equals($expectedState, $returnedState)
            || ! is_string($code)
            || $code === '') {
            return $this->deny();
        }

        try {
            $tokenResponse = Http::asForm()
                ->acceptJson()
                ->withUserAgent(config('app.name', 'Portfolio Admin'))
                ->timeout(10)
                ->post('https://github.com/login/oauth/access_token', [
                    'client_id' => config('oauth.github.client_id'),
                    'client_secret' => config('oauth.github.client_secret'),
                    'code' => $code,
                    'redirect_uri' => route('admin.github.callback'),
                ]);

            $accessToken = $tokenResponse->successful() ? $tokenResponse->json('access_token') : null;
            if (! is_string($accessToken) || $accessToken === '') {
                return $this->deny();
            }

            $githubResponse = Http::withToken($accessToken)
                ->acceptJson()
                ->withUserAgent(config('app.name', 'Portfolio Admin'))
                ->timeout(10)
                ->get('https://api.github.com/user');

            $githubId = $githubResponse->successful() ? $githubResponse->json('id') : null;
            $allowedId = (string) config('oauth.github.allowed_user_id');

            if (! ctype_digit($allowedId) || (string) $githubId !== $allowedId) {
                return $this->deny();
            }

            $githubLogin = $githubResponse->json('login');
            $admin = User::firstOrCreate(
                ['email' => 'github-'.$allowedId.'@users.invalid'],
                [
                    'name' => is_string($githubLogin) ? $githubLogin : 'Portfolio Admin',
                    'password' => Str::random(64),
                ],
            );

            Auth::login($admin);
            $request->session()->regenerate();

            return redirect()->intended(route('admin.dashboard'));
        } catch (\Throwable $exception) {
            report($exception);

            return $this->deny();
        }
    }

    private function configured(): bool
    {
        return filled(config('oauth.github.client_id'))
            && filled(config('oauth.github.client_secret'))
            && ctype_digit((string) config('oauth.github.allowed_user_id'));
    }

    private function deny(): RedirectResponse
    {
        return redirect()->route('login')->withErrors([
            'github' => 'GitHub sign-in could not be verified or this account is not authorized.',
        ]);
    }
}
