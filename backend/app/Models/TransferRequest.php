<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransferRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'allocation_id',
        'transfer_type',
        'trigger_reason',
        'reason_details',
        'initiated_date',
        'initiated_by',
        'deadline_date',
        'assigned_to',
        'status',
        'completion_date',
        'checklist',
        'notes',
    ];

    protected $casts = [
        'initiated_date' => 'date',
        'deadline_date' => 'date',
        'completion_date' => 'date',
        'checklist' => 'array',
    ];

    // Default checklist structure
    public static function getDefaultChecklist(): array
    {
        return [
            'asset_recovered' => false,
            'condition_assessed' => false,
            'photos_taken' => false,
            'data_wiped' => false,
            'outstanding_dues_calculated' => false,
            'deposit_processed' => false,
            'asset_status_updated' => false,
            'allocation_closed' => false,
        ];
    }

    // Relationships
    public function allocation(): BelongsTo
    {
        return $this->belongsTo(Allocation::class);
    }

    public function initiatedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiated_by');
    }

    public function assignedToUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->whereIn('status', ['Pending', 'In Progress']);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Accessors
    public function getIsOverdueAttribute(): bool
    {
        return $this->deadline_date && $this->deadline_date->isPast() && $this->status !== 'Completed';
    }

    public function getChecklistProgressAttribute(): int
    {
        if (empty($this->checklist)) return 0;
        $total = count($this->checklist);
        $completed = count(array_filter($this->checklist));
        return $total > 0 ? round(($completed / $total) * 100) : 0;
    }
}
