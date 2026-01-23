<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'contract_reference',
        'primary_contact_name',
        'primary_contact_email',
        'primary_contact_phone',
        'sla_document_path',
        'tor_document_path',
        'asset_policies',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'asset_policies' => 'array',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(Allocation::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Accessors
    public function getActiveEmployeeCountAttribute(): int
    {
        return $this->employees()->where('employment_status', 'Active')->count();
    }

    public function getActiveAssetCountAttribute(): int
    {
        return $this->allocations()->where('is_active', true)->count();
    }
}
