<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Skill;
use App\Models\TimelineEntry;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => env('ADMIN_EMAIL', 'admin@example.com')], ['name' => 'Portfolio Admin', 'password' => env('ADMIN_PASSWORD', 'change-me-now')]);
        Project::query()->delete(); Skill::query()->delete(); TimelineEntry::query()->delete();
        Project::create(['title' => 'Northstar Commerce', 'description' => 'A focused commerce platform that turns complex catalog data into a calm buying experience.', 'tech_stack' => ['Next.js', 'Laravel', 'PostgreSQL'], 'live_url' => 'https://example.com', 'github_url' => 'https://github.com', 'featured' => true, 'sort_order' => 1]);
        Project::create(['title' => 'Field Notes', 'description' => 'A lightweight knowledge system for collecting observations, references, and useful connections.', 'tech_stack' => ['React', 'TypeScript', 'SQLite'], 'live_url' => 'https://example.com', 'github_url' => 'https://github.com', 'featured' => true, 'sort_order' => 2]);
        foreach ([['name' => 'Product design', 'proficiency' => 92, 'icon' => '✦'], ['name' => 'TypeScript', 'proficiency' => 88, 'icon' => 'TS'], ['name' => 'React / Next.js', 'proficiency' => 90, 'icon' => 'R'], ['name' => 'Laravel / PHP', 'proficiency' => 78, 'icon' => 'L']] as $index => $skill) { Skill::create([...$skill, 'sort_order' => $index]); }
        TimelineEntry::create(['type' => 'experience', 'organization' => 'Independent practice', 'role' => 'Product designer & developer', 'description' => 'Helping teams turn uncertain product ideas into clear, useful digital tools.', 'start_date' => '2021', 'sort_order' => 1]);
        TimelineEntry::create(['type' => 'education', 'organization' => 'Design and technology', 'role' => 'Continuous study', 'description' => 'A practical, lifelong curriculum across interaction design, systems, and software craft.', 'start_date' => '2018', 'end_date' => '2021', 'sort_order' => 2]);
    }
}