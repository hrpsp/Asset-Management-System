<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InstallmentPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'allocation_id',
        'total_amount',
        'down_payment',
        'financed_amount',
        'number_of_installments',
        'installment_amount',
        'start_date',
        'expected_end_date',
        'status',
        'completed_at',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'down_payment' => 'decimal:2',
        'financed_amount' => 'decimal:2',
        'installment_amount' => 'decimal:2',
        'start_date' => 'date',
        'expected_end_date' => 'date',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function allocation(): BelongsTo
    {
        return $this->belongsTo(Allocation::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(InstallmentSchedule::class, 'plan_id')->orderBy('installment_number');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'Completed');
    }

    // Accessors
    public function getPaidCountAttribute(): int
    {
        return $this->schedules()->where('status', 'Completed')->count();
    }

    public function getPendingCountAttribute(): int
    {
        return $this->schedules()->whereIn('status', ['Pending', 'Overdue'])->count();
    }

    public function getOverdueCountAttribute(): int
    {
        return $this->schedules()->where('status', 'Overdue')->count();
    }

    public function getProgressPercentageAttribute(): float
    {
        if ($this->number_of_installments === 0) return 0;
        return round(($this->paid_count / $this->number_of_installments) * 100, 2);
    }

    public function getPaidAmountAttribute(): float
    {
        return $this->schedules()->where('status', 'Completed')->sum('amount');
    }

    public function getRemainingAmountAttribute(): float
    {
        return $this->financed_amount - $this->paid_amount;
    }
}
