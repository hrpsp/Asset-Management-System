<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstallmentSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'installment_number',
        'due_date',
        'amount',
        'status',
        'completed_date',
        'marked_by',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'completed_date' => 'date',
    ];

    // Relationships
    public function plan(): BelongsTo
    {
        return $this->belongsTo(InstallmentPlan::class, 'plan_id');
    }

    public function markedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'Pending');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'Overdue');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'Completed');
    }

    // Accessors
    public function getIsOverdueAttribute(): bool
    {
        return $this->status === 'Pending' && $this->due_date->isPast();
    }
}
