<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GithubLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_and_content_require_authentication(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->get('/admin/content')->assertRedirect('/admin/login');
    }

    public function test_only_the_configured_github_id_can_sign_in_as_existing_admin(): void
    {
        config()->set('oauth.github', [
            'client_id' => 'client',
            'client_secret' => 'secret',
            'allowed_user_id' => '144799651',
            'admin_email' => 'admin@example.com',
        ]);
        $admin = User::factory()->create(['email' => 'admin@example.com']);
        Http::fake([
            'github.com/login/oauth/access_token' => Http::response(['access_token' => 'fake-token']),
            'api.github.com/user' => Http::response(['id' => 99, 'login' => 'someone-else']),
        ]);

        $this->withSession(['github_oauth_state' => 'good-state'])
            ->get('/admin/auth/github/callback?state=good-state&code=fake-code')
            ->assertRedirect('/admin/login');
        $this->assertGuest();

        Http::fake([
            'github.com/login/oauth/access_token' => Http::response(['access_token' => 'fake-token']),
            'api.github.com/user' => Http::response(['id' => 144799651, 'login' => 'owner']),
        ]);
        $this->withSession(['github_oauth_state' => 'new-state'])
            ->get('/admin/auth/github/callback?state=new-state&code=fake-code')
            ->assertRedirect('/admin');
        $this->assertAuthenticatedAs($admin);
        $this->get('/admin')->assertOk()->assertSee('Future module');
    }

    public function test_invalid_state_cannot_sign_in(): void
    {
        config()->set('oauth.github', [
            'client_id' => 'client', 'client_secret' => 'secret',
            'allowed_user_id' => '144799651', 'admin_email' => 'admin@example.com',
        ]);
        $this->withSession(['github_oauth_state' => 'expected'])
            ->get('/admin/auth/github/callback?state=wrong&code=fake-code')
            ->assertRedirect('/admin/login');
        $this->assertGuest();
        Http::assertNothingSent();
    }
}
