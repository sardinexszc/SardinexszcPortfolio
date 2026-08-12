<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Skill;
use App\Models\TimelineEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function login(): mixed { return view('admin.login'); }
    public function authenticate(Request $request): mixed { $credentials = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]); if (Auth::attempt($credentials, $request->boolean('remember'))) { $request->session()->regenerate(); return redirect()->route('admin.dashboard'); } return back()->withErrors(['email' => 'Those credentials could not be verified.'])->onlyInput('email'); }
    public function logout(Request $request): mixed { Auth::logout(); $request->session()->invalidate(); $request->session()->regenerateToken(); return redirect()->route('admin.login'); }
    public function dashboard(): mixed { return view('admin.dashboard', ['projects' => Project::orderBy('sort_order')->get(), 'skills' => Skill::orderBy('sort_order')->get(), 'timeline' => TimelineEntry::orderByDesc('start_date')->get()]); }
    public function storeProject(Request $request): mixed { Project::create($this->projectData($request)); return back()->with('status', 'Project added.'); }
    public function updateProject(Request $request, Project $project): mixed { $project->update($this->projectData($request)); return back()->with('status', 'Project updated.'); }
    public function destroyProject(Project $project): mixed { $project->delete(); return back()->with('status', 'Project deleted.'); }
    public function storeSkill(Request $request): mixed { Skill::create($request->validate(['name' => 'required|string|max:100', 'proficiency' => 'required|integer|min:0|max:100', 'icon' => 'nullable|string|max:20', 'sort_order' => 'nullable|integer'])); return back()->with('status', 'Skill added.'); }
    public function updateSkill(Request $request, Skill $skill): mixed { $skill->update($request->validate(['name' => 'required|string|max:100', 'proficiency' => 'required|integer|min:0|max:100', 'icon' => 'nullable|string|max:20', 'sort_order' => 'nullable|integer'])); return back()->with('status', 'Skill updated.'); }
    public function destroySkill(Skill $skill): mixed { $skill->delete(); return back()->with('status', 'Skill deleted.'); }
    public function storeTimeline(Request $request): mixed { TimelineEntry::create($this->timelineData($request)); return back()->with('status', 'Entry added.'); }
    public function updateTimeline(Request $request, TimelineEntry $timelineEntry): mixed { $timelineEntry->update($this->timelineData($request)); return back()->with('status', 'Entry updated.'); }
    public function destroyTimeline(TimelineEntry $timelineEntry): mixed { $timelineEntry->delete(); return back()->with('status', 'Entry deleted.'); }
    private function projectData(Request $request): array { $data = $request->validate(['title' => 'required|string|max:160', 'description' => 'required|string', 'role_summary' => 'nullable|string|max:1000', 'outcome' => 'nullable|string|max:1000', 'highlights' => 'nullable|string|max:2000', 'image_url' => 'nullable|url|max:500', 'tech_stack' => 'required|string', 'live_url' => 'nullable|url|max:500', 'github_url' => 'nullable|url|max:500', 'featured' => 'nullable|boolean', 'sort_order' => 'nullable|integer']); $data['tech_stack'] = array_values(array_filter(array_map('trim', explode(',', $data['tech_stack'])))); $data['highlights'] = array_values(array_filter(array_map('trim', explode("\n", $data['highlights'] ?? '')))); $data['featured'] = $request->boolean('featured'); return $data; }
    private function timelineData(Request $request): array { return $request->validate(['type' => 'required|in:experience,education', 'organization' => 'required|string|max:160', 'role' => 'required|string|max:160', 'description' => 'required|string', 'start_date' => 'required|string|max:30', 'end_date' => 'nullable|string|max:30', 'sort_order' => 'nullable|integer']); }
}
