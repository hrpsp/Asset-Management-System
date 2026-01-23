<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'allocation_id',
        'reported_by',
        'reported_date',
        'issue_description',
        'issue_category',
        'priority',
        'status',
        'assigned_to',
        'diagnosis_notes',
        'repair_vendor',
        'sent_date',
        'received_date',
        'repair_description',
        'repair_cost',
        'is_warranty_claim',
        'warranty_claim_status',
        'spare_asset_id',
        'closed_date',
        'resolution_notes',
    ];

    protected $casts = [
        'reported_date' => 'date',
        'sent_date' => 'date',
        'received_date' => 'date',
        'closed_date' => 'date',
        'repair_cost' => 'decimal:2',
        'is_warranty_claim' => 'boolean',
    ];

    // Relationships
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function allocation(): BelongsTo
    {
        return $this->belongsTo(Allocation::class);
    }

    public function assignedToUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function spareAsset(): BelongsTo
    {
        return $this->belongsTo(Asset::class, 'spare_asset_id');
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->whereNotIn('status', ['Closed', 'Cannot Repair']);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('issue_category', $category);
    }

    // Accessors
    public function getIsOpenAttribute(): bool
    {
        return !in_array($this->status, ['Closed', 'Cannot Repair']);
    }

    public function getDaysOpenAttribute(): int
    {
        $endDate = $this->closed_date ?? now();
        return $this->reported_date->diffInDays($endDate);
    }

    public function getTurnaroundDaysAttribute(): ?int
    {
        if (!$this->sent_date || !$this->received_date) return null;
        return $this->sent_date->diffInDays($this->received_date);
    }
}
