<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['title', 'description', 'role_summary', 'outcome', 'highlights', 'image_url', 'tech_stack', 'live_url', 'github_url', 'featured', 'sort_order'];
    protected function casts(): array { return ['tech_stack' => 'array', 'highlights' => 'array', 'featured' => 'boolean']; }
}
