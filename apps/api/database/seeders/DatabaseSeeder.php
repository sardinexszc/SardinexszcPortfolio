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
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@example.com')],
            ['name' => 'Portfolio Admin', 'password' => env('ADMIN_PASSWORD', 'change-me-now')]
        );

        Project::query()->delete();
        Skill::query()->delete();
        TimelineEntry::query()->delete();

        $projects = [
            [
                'title' => 'Crops and Resources Research and Development Center',
                'description' => 'A centralized web platform for research, extension, personnel, and administrative records, supporting institutional information access and operational workflows.',
                'tech_stack' => ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Vercel', 'GitHub'],
                'live_url' => 'https://crrdc.vercel.app/',
                'github_url' => null,
                'featured' => true,
            ],
            [
                'title' => 'Strengthening the M&E Capacity of CLAARRDEC in R&D through Database Management and Real Time Monitoring System (RTMS)',
                'description' => 'A centralized monitoring and evaluation system for CLAARRDEC reporting, research and development project tracking, data management, and oversight workflows across member institutions.',
                'tech_stack' => ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'GitHub'],
                'live_url' => 'https://rtms.clsu.edu.ph/',
                'github_url' => null,
                'featured' => true,
            ],
            [
                'title' => 'CLAARRDEC',
                'description' => 'A content management and e-library platform for public information delivery, authenticated access, library functions, administration, and visitor and user usage reporting.',
                'tech_stack' => ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'GitHub'],
                'live_url' => 'https://claarrdec.clsu.edu.ph/',
                'github_url' => null,
                'featured' => true,
            ],
        ];

        foreach ($projects as $index => $project) {
            Project::create([...$project, 'image_url' => null, 'sort_order' => $index + 1]);
        }

        $technologies = ['PHP', 'JavaScript', 'TypeScript', 'SQL', 'Java', 'React', 'Next.js', 'Laravel', 'MySQL', 'PostgreSQL', 'Supabase', 'n8n', 'REST APIs', 'Git', 'GitHub', 'Vercel', 'ESP32', 'Arduino', 'PlatformIO', 'ArcGIS', 'QGIS'];
        foreach ($technologies as $index => $technology) {
            Skill::create(['name' => $technology, 'proficiency' => 0, 'icon' => null, 'sort_order' => $index + 1]);
        }

        $timeline = [
            ['type' => 'experience', 'organization' => 'Independent and collaborative product work', 'role' => 'Full-Stack Web Developer', 'description' => 'Building web applications, APIs, databases, and n8n automation workflows using Next.js, Laravel, React, and Supabase.', 'start_date' => '2026', 'end_date' => null],
            ['type' => 'experience', 'organization' => 'Central Luzon State University', 'role' => 'Researcher, Instructor, and Information Systems Developer', 'description' => 'Led and co-developed institutional research and monitoring systems while serving as project lead or technical lead on government-funded initiatives. Coordinated with 3-5 person project teams, researchers, and institutional stakeholders (DOST-PCAARRD, DA-BPI, CHED-British Council) to translate operational requirements into scalable software solutions. Conducted project planning, requirements gathering, and regular team coordination meetings. Delivered research information platforms, monitoring and evaluation systems, content management, and smart agriculture applications. Also taught undergraduate programming and supervised capstone projects.', 'start_date' => '2019', 'end_date' => '2026'],
            ['type' => 'experience', 'organization' => 'Central Luzon State University', 'role' => 'Project Technical Staff', 'description' => 'Provided technical and administrative support for institutional operations and government-funded research projects. Contributed to requirements analysis, documentation, and technical coordination for multi-disciplinary project teams. Managed project records, technical reports, and stakeholder communications to support project planning, risk assessment, and reporting workflows.', 'start_date' => '2017', 'end_date' => '2019'],
            ['type' => 'education', 'organization' => 'Nueva Ecija University of Science and Technology', 'role' => 'Master of Science in Information Technology, Major in Data Science', 'description' => 'Graduate study in Information Technology with a major in Data Science.', 'start_date' => '2026', 'end_date' => null],
            ['type' => 'education', 'organization' => 'Central Luzon State University', 'role' => 'Bachelor of Science in Information Technology, Major in Systems Development', 'description' => 'Undergraduate degree in Information Technology with a major in Systems Development.', 'start_date' => '2013', 'end_date' => '2017'],
        ];

        foreach ($timeline as $index => $entry) {
            TimelineEntry::create([...$entry, 'sort_order' => $index + 1]);
        }
    }
}
