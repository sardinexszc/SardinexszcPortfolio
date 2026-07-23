<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimelineEntry extends Model
{
    protected $fillable = ['type', 'organization', 'role', 'description', 'start_date', 'end_date', 'sort_order'];
}