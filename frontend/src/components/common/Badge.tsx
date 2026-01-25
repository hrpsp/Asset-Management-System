import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export default function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  );
}

// Helper function to get badge variant based on status
export function getStatusBadgeVariant(status: string): BadgeProps['variant'] {
  const statusMap: Record<string, BadgeProps['variant']> = {
    // Asset status
    Available: 'success',
    Assigned: 'info',
    'In Repair': 'warning',
    Retired: 'default',
    Lost: 'danger',
    Transferred: 'info',
    // Employment status
    Active: 'success',
    Resigned: 'warning',
    Terminated: 'danger',
    'On Notice': 'warning',
    // Installment status
    Completed: 'success',
    Pending: 'warning',
    Overdue: 'danger',
    Waived: 'default',
    Defaulted: 'danger',
    Cancelled: 'default',
    // Priority
    Low: 'default',
    Medium: 'info',
    High: 'warning',
    Critical: 'danger',
    // Transfer status
    'In Progress': 'info',
    Escalated: 'danger',
  };

  return statusMap[status] || 'default';
}
