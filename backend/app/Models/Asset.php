<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Asset extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'asset_tag',
        'asset_type',
        'brand',
        'model',
        'serial_number',
        'specifications',
        'purchase_date',
        'purchase_price',
        'vendor',
        'warranty_expiry',
        'status',
        'condition_status',
        'current_location',
        'notes',
    ];

    protected $casts = [
        'specifications' => 'array',
        'purchase_date' => 'date',
        'purchase_price' => 'decimal:2',
        'warranty_expiry' => 'date',
    ];

    // Relationships
    public function photos(): HasMany
    {
        return $this->hasMany(AssetPhoto::class);
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(Allocation::class);
    }

    public function activeAllocation(): HasOne
    {
        return $this->hasOne(Allocation::class)->where('is_active', true);
    }

    public function repairs(): HasMany
    {
        return $this->hasMany(RepairRequest::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'Available');
    }

    public function scopeAssigned($query)
    {
        return $query->where('status', 'Assigned');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('asset_type', $type);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByClient($query, $clientId)
    {
        return $query->whereHas('activeAllocation', function ($q) use ($clientId) {
            $q->where('client_id', $clientId);
        });
    }

    public function scopeWarrantyExpiringSoon($query, $days = 30)
    {
        return $query->whereNotNull('warranty_expiry')
            ->whereBetween('warranty_expiry', [now(), now()->addDays($days)]);
    }

    // Accessors
    public function getCurrentHolderAttribute()
    {
        return $this->activeAllocation?->employee;
    }

    public function getCurrentClientAttribute()
    {
        return $this->activeAllocation?->client;
    }

    public function getIsUnderWarrantyAttribute(): bool
    {
        return $this->warranty_expiry && $this->warranty_expiry->isFuture();
    }

    public function getDisplayNameAttribute(): string
    {
        return "{$this->brand} {$this->model} ({$this->asset_tag})";
    }
}
