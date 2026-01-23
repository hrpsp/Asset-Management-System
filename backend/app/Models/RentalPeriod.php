<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_id',
        'period_month',
        'status',
        'notes',
    ];

    // Relationships
    public function rental(): BelongsTo
    {
        return $this->belongsTo(RentalAgreement::class, 'rental_id');
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
}
