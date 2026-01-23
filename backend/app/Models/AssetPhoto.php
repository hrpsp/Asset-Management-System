<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetPhoto extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'asset_id',
        'photo_type',
        'file_path',
        'caption',
        'uploaded_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    // Relationships
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    // Accessors
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }
}
