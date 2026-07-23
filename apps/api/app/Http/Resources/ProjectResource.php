<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array { return ['id' => $this->id, 'title' => $this->title, 'description' => $this->description, 'image_url' => $this->image_url, 'tech_stack' => $this->tech_stack, 'live_url' => $this->live_url, 'github_url' => $this->github_url, 'featured' => $this->featured]; }
}