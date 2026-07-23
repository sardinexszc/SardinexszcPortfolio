<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\SkillResource;
use App\Http\Resources\TimelineResource;
use App\Models\Project;
use App\Models\Skill;
use App\Models\TimelineEntry;
use App\Http\Controllers\Controller;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PortfolioController extends Controller
{
    public function projects(): AnonymousResourceCollection { return ProjectResource::collection(Project::query()->where('featured', true)->orderBy('sort_order')->get()); }
    public function skills(): AnonymousResourceCollection { return SkillResource::collection(Skill::query()->orderBy('sort_order')->get()); }
    public function timeline(): AnonymousResourceCollection { return TimelineResource::collection(TimelineEntry::query()->orderByDesc('start_date')->orderBy('sort_order')->get()); }
}