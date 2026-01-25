// Base types
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// User & Auth
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'IT Manager' | 'IT Support' | 'HR Operations' | 'Viewer';
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Client
export interface Client {
  id: number;
  name: string;
  code: string;
  contract_reference: string | null;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  sla_document_path: string | null;
  tor_document_path: string | null;
  asset_policies: AssetPolicies | null;
  notes: string | null;
  is_active: boolean;
  active_employee_count?: number;
  active_asset_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AssetPolicies {
  allowed_asset_types?: string[];
  approved_brands?: string[];
  max_asset_value?: number;
  replacement_policy?: string;
  data_wipe_required?: boolean;
  insurance_required?: boolean;
}

// Employee
export interface Employee {
  id: number;
  employee_code: string;
  name: string;
  cnic: string | null;
  email: string | null;
  phone: string | null;
  client_id: number | null;
  department: string | null;
  designation: string | null;
  employment_status: 'Active' | 'Resigned' | 'Terminated' | 'On Notice';
  joining_date: string | null;
  exit_date: string | null;
  full_details: string;
  active_asset_count: number;
  client?: Client;
  active_allocations?: Allocation[];
  created_at: string;
  updated_at: string;
}

// Asset
export type AssetType = 'Laptop' | 'Tablet' | 'Mobile' | 'Accessory';
export type AssetStatus = 'Available' | 'Assigned' | 'In Repair' | 'Retired' | 'Lost' | 'Transferred';
export type ConditionStatus = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface AssetSpecifications {
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  os?: string;
  color?: string;
  connectivity?: string;
  [key: string]: string | undefined;
}

export interface AssetPhoto {
  id: number;
  photo_type: 'Front' | 'Back' | 'Tag' | 'Damage' | 'Other';
  file_path: string;
  url: string;
  caption: string | null;
  uploaded_at: string;
}

export interface Asset {
  id: number;
  asset_tag: string;
  asset_type: AssetType;
  brand: string;
  model: string;
  serial_number: string | null;
  specifications: AssetSpecifications | null;
  purchase_date: string | null;
  purchase_price: number | null;
  vendor: string | null;
  warranty_expiry: string | null;
  is_under_warranty: boolean;
  status: AssetStatus;
  condition_status: ConditionStatus;
  current_location: string | null;
  notes: string | null;
  display_name: string;
  photos?: AssetPhoto[];
  current_holder?: Employee;
  current_client?: Client;
  active_allocation?: Allocation;
  allocations_count?: number;
  repairs_count?: number;
  created_at: string;
  updated_at: string;
}

// Allocation
export type AllocationType = 'Installment' | 'Rental';

export interface Allocation {
  id: number;
  asset_id: number;
  employee_id: number;
  client_id: number;
  allocation_type: AllocationType;
  allocation_date: string;
  handover_condition: ConditionStatus | null;
  handover_document_path: string | null;
  handover_notes: string | null;
  is_active: boolean;
  return_date: string | null;
  return_condition: ConditionStatus | null;
  return_notes: string | null;
  is_installment: boolean;
  is_rental: boolean;
  duration_days: number | null;
  asset?: Asset;
  employee?: Employee;
  client?: Client;
  installment_plan?: InstallmentPlan;
  rental_agreement?: RentalAgreement;
  created_at: string;
  updated_at: string;
}

// Installment
export type InstallmentStatus = 'Active' | 'Completed' | 'Defaulted' | 'Cancelled';
export type ScheduleStatus = 'Pending' | 'Completed' | 'Overdue' | 'Waived';

export interface InstallmentSchedule {
  id: number;
  plan_id: number;
  installment_number: number;
  due_date: string;
  amount: number;
  status: ScheduleStatus;
  completed_date: string | null;
  notes: string | null;
  is_overdue: boolean;
}

export interface InstallmentPlan {
  id: number;
  allocation_id: number;
  total_amount: number;
  down_payment: number;
  financed_amount: number;
  number_of_installments: number;
  installment_amount: number;
  start_date: string;
  expected_end_date: string;
  status: InstallmentStatus;
  completed_at: string | null;
  notes: string | null;
  paid_count: number;
  pending_count: number;
  overdue_count: number;
  progress_percentage: number;
  paid_amount: number;
  remaining_amount: number;
  schedules?: InstallmentSchedule[];
  allocation?: Allocation;
  created_at: string;
  updated_at: string;
}

// Rental
export type RentalStatus = 'Active' | 'Terminated';
export type DepositStatus = 'Held' | 'Returned' | 'Forfeited' | 'Adjusted';

export interface RentalPeriod {
  id: number;
  rental_id: number;
  period_month: string;
  status: 'Active' | 'Completed';
  notes: string | null;
}

export interface RentalAgreement {
  id: number;
  allocation_id: number;
  monthly_rental: number;
  billing_day: number;
  security_deposit: number;
  rental_start_date: string;
  minimum_period_months: number;
  status: RentalStatus;
  termination_date: string | null;
  deposit_status: DepositStatus;
  notes: string | null;
  months_active: number;
  total_rental_paid: number;
  can_terminate: boolean;
  periods?: RentalPeriod[];
  allocation?: Allocation;
  created_at: string;
  updated_at: string;
}

// Transfer
export type TransferType = 'Recovery' | 'Client Transfer' | 'Upgrade' | 'Replacement';
export type TriggerReason = 'Resignation' | 'Termination' | 'Client Change' | 'Asset Issue' | 'Other';
export type TransferStatus = 'Pending' | 'In Progress' | 'Completed' | 'Escalated' | 'Cancelled';

export interface TransferChecklist {
  asset_recovered: boolean;
  condition_assessed: boolean;
  photos_taken: boolean;
  data_wiped: boolean;
  outstanding_dues_calculated: boolean;
  deposit_processed: boolean;
  asset_status_updated: boolean;
  allocation_closed: boolean;
}

export interface TransferRequest {
  id: number;
  allocation_id: number;
  transfer_type: TransferType;
  trigger_reason: TriggerReason | null;
  reason_details: string | null;
  initiated_date: string;
  initiated_by: number;
  deadline_date: string | null;
  assigned_to: number | null;
  status: TransferStatus;
  completion_date: string | null;
  checklist: TransferChecklist | null;
  notes: string | null;
  is_overdue: boolean;
  checklist_progress: number;
  allocation?: Allocation;
  initiated_by_user?: User;
  assigned_to_user?: User;
  created_at: string;
  updated_at: string;
}

// Repair
export type IssueCategory = 'Hardware' | 'Software' | 'Physical Damage' | 'Battery' | 'Screen' | 'Other';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type RepairStatus = 'Reported' | 'Diagnosed' | 'Sent for Repair' | 'Repaired' | 'Closed' | 'Cannot Repair';
export type WarrantyClaimStatus = 'N/A' | 'Claimed' | 'Approved' | 'Rejected';

export interface RepairRequest {
  id: number;
  asset_id: number;
  allocation_id: number | null;
  reported_by: string;
  reported_date: string;
  issue_description: string;
  issue_category: IssueCategory;
  priority: Priority;
  status: RepairStatus;
  assigned_to: number | null;
  diagnosis_notes: string | null;
  repair_vendor: string | null;
  sent_date: string | null;
  received_date: string | null;
  repair_description: string | null;
  repair_cost: number | null;
  is_warranty_claim: boolean;
  warranty_claim_status: WarrantyClaimStatus;
  spare_asset_id: number | null;
  closed_date: string | null;
  resolution_notes: string | null;
  is_open: boolean;
  days_open: number;
  turnaround_days: number | null;
  asset?: Asset;
  allocation?: Allocation;
  assigned_to_user?: User;
  spare_asset?: Asset;
  created_at: string;
  updated_at: string;
}

// Dashboard
export interface DashboardStats {
  assets: {
    total: number;
    available: number;
    assigned: number;
    in_repair: number;
    retired: number;
  };
  allocations: {
    active: number;
    installments: number;
    rentals: number;
  };
  by_type: Record<AssetType, number>;
  clients: number;
  employees: number;
  pending_repairs: number;
  pending_transfers: number;
  overdue_installments: number;
}
