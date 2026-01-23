<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Allocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'employee_id',
        'client_id',
        'allocation_type',
        'allocation_date',
        'handover_condition',
        'handover_document_path',
        'handover_notes',
        'is_active',
        'return_date',
        'return_condition',
        'return_notes',
        'created_by',
    ];

    protected $casts = [
        'allocation_date' => 'date',
        'return_date' => 'date',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(AllocationPhoto::class);
    }

    public function handoverPhotos(): HasMany
    {
        return $this->hasMany(AllocationPhoto::class)->where('photo_type', 'Handover');
    }

    public function returnPhotos(): HasMany
    {
        return $this->hasMany(AllocationPhoto::class)->where('photo_type', 'Return');
    }

    public function installmentPlan(): HasOne
    {
        return $this->hasOne(InstallmentPlan::class);
    }

    public function rentalAgreement(): HasOne
    {
        return $this->hasOne(RentalAgreement::class);
    }

    public function transferRequests(): HasMany
    {
        return $this->hasMany(TransferRequest::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('allocation_type', $type);
    }

    public function scopeByClient($query, $clientId)
    {
        return $query->where('client_id', $clientId);
    }

    // Accessors
    public function getIsInstallmentAttribute(): bool
    {
        return $this->allocation_type === 'Installment';
    }

    public function getIsRentalAttribute(): bool
    {
        return $this->allocation_type === 'Rental';
    }

    public function getDurationDaysAttribute(): ?int
    {
        if (!$this->return_date) {
            return $this->allocation_date->diffInDays(now());
        }
        return $this->allocation_date->diffInDays($this->return_date);
    }
}
