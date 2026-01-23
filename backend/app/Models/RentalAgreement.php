<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RentalAgreement extends Model
{
    use HasFactory;

    protected $fillable = [
        'allocation_id',
        'monthly_rental',
        'billing_day',
        'security_deposit',
        'rental_start_date',
        'minimum_period_months',
        'status',
        'termination_date',
        'deposit_status',
        'notes',
    ];

    protected $casts = [
        'monthly_rental' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'rental_start_date' => 'date',
        'termination_date' => 'date',
    ];

    // Relationships
    public function allocation(): BelongsTo
    {
        return $this->belongsTo(Allocation::class);
    }

    public function periods(): HasMany
    {
        return $this->hasMany(RentalPeriod::class, 'rental_id')->orderBy('period_month');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    // Accessors
    public function getMonthsActiveAttribute(): int
    {
        $endDate = $this->termination_date ?? now();
        return $this->rental_start_date->diffInMonths($endDate);
    }

    public function getTotalRentalPaidAttribute(): float
    {
        return $this->periods()->where('status', 'Completed')->count() * $this->monthly_rental;
    }

    public function getCanTerminateAttribute(): bool
    {
        return $this->months_active >= $this->minimum_period_months;
    }
}
