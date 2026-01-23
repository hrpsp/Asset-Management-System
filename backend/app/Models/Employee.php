<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_code',
        'name',
        'cnic',
        'email',
        'phone',
        'client_id',
        'department',
        'designation',
        'employment_status',
        'joining_date',
        'exit_date',
    ];

    protected $casts = [
        'joining_date' => 'date',
        'exit_date' => 'date',
    ];

    // Relationships
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(Allocation::class);
    }

    public function activeAllocation(): HasOne
    {
        return $this->hasOne(Allocation::class)->where('is_active', true);
    }

    public function activeAllocations(): HasMany
    {
        return $this->hasMany(Allocation::class)->where('is_active', true);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('employment_status', 'Active');
    }

    public function scopeByClient($query, $clientId)
    {
        return $query->where('client_id', $clientId);
    }

    public function scopeExited($query)
    {
        return $query->whereIn('employment_status', ['Resigned', 'Terminated']);
    }

    // Accessors
    public function getActiveAssetCountAttribute(): int
    {
        return $this->allocations()->where('is_active', true)->count();
    }

    public function getFullDetailsAttribute(): string
    {
        return "{$this->name} ({$this->employee_code}) - {$this->client?->name}";
    }
}
