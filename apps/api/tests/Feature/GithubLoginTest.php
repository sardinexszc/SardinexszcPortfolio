<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GithubLoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'oauth.github.client_id' => 'client-id',
            'oauth.github.client_secret' => 'client-secret',
            'oauth.github.allowed_user_id' => '123456',
            'app.url' => 'http://localhost',
        ]);
    }

    public function test_login_page_offers_github_only_and_admin_redirects_to_it(): void
    {
        $this->get('/loginauthentication')->assertOk()->assertSee('Continue with GitHub')->assertDontSee('password');
        $this->get('/admin')->assertRedirect('/loginauthentication');
    }

    public function test_github_redirect_stores_state_and_uses_the_registered_callback(): void
    {
        $response = $this->get('/admin/auth/github');

        $response->assertRedirect();
        $this->assertNotEmpty(session('github_oauth_state'));
        $this->assertStringContainsString('/admin/auth/github/callback', urldecode((string) parse_url($response->headers->get('Location'), PHP_URL_QUERY)));
    }

    public function test_callback_rejects_invalid_state(): void
    {
        $this->withSession(['github_oauth_state' => 'expected-state'])
            ->get('/admin/auth/github/callback?state=wrong&code=code')
            ->assertRedirect('/loginauthentication');
    }

    public function test_callback_rejects_github_accounts_outside_the_allowlist(): void
    {
        Http::fake([
            'https://github.com/login/oauth/access_token' => Http::response(['access_token' => 'access-token']),
            'https://api.github.com/user' => Http::response(['id' => 987, 'login' => 'other-user']),
        ]);

        $this->withSession(['github_oauth_state' => 'valid-state'])
            ->get('/admin/auth/github/callback?state=valid-state&code=code')
            ->assertRedirect('/loginauthentication')
            ->assertGuest();
    }

    public function test_allowlisted_github_account_is_signed_into_the_admin_session(): void
    {
        Http::fake([
            'https://github.com/login/oauth/access_token' => Http::response(['access_token' => 'access-token']),
            'https://api.github.com/user' => Http::response(['id' => 123456, 'login' => 'portfolio-owner']),
        ]);

        $this->withSession(['github_oauth_state' => 'valid-state'])
            ->get('/admin/auth/github/callback?state=valid-state&code=code')
            ->assertRedirect('/admin')
            ->assertAuthenticated();

        $this->assertDatabaseHas('users', ['email' => 'github-123456@users.invalid', 'name' => 'portfolio-owner']);
    }
}
