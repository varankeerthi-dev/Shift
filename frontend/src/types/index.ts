export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar_path?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  tax_number?: string
  logo_path?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  organization_id: string
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  tax_number?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  organization_id: string
  name: string
  description?: string
}

export interface ProductUnit {
  id: string
  organization_id: string
  name: string
  symbol: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
}

export interface ProductMake {
  id: string
  product_id: string
  name: string
}

export interface Warehouse {
  id: string
  organization_id: string
  name: string
  address?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface WarehouseStock {
  id: string
  organization_id: string
  warehouse_id: string
  warehouse?: Warehouse
  product_id: string
  product?: Product
  variant_id?: string
  variant?: ProductVariant
  make_id?: string
  make?: ProductMake
  quantity: number
  alert_quantity: number
}

export interface Product {
  id: string
  organization_id: string
  name: string
  description?: string
  sku?: string
  hsn_code?: string
  category_id?: string
  category?: ProductCategory
  unit_id?: string
  unit?: ProductUnit
  type: 'product' | 'service'
  price: number
  cost_price?: number
  tax_rate: number
  quantity: number
  alert_quantity: number
  is_active: boolean
  variants?: ProductVariant[]
  makes?: ProductMake[]
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  product_id?: string
  product?: Product
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  tax_amount: number
  discount: number
  total: number
}

export interface Invoice {
  id: string
  organization_id: string
  client_id: string
  client?: Client
  invoice_number: string
  reference_number?: string
  issue_date: string
  due_date: string
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'partial' | 'overdue' | 'cancelled'
  subtotal: number
  discount_type?: 'percentage' | 'fixed'
  discount_value?: number
  discount_amount: number
  tax_amount: number
  total: number
  notes?: string
  terms?: string
  is_recurring: boolean
  recurring_frequency?: string
  sent_at?: string
  viewed_at?: string
  items?: InvoiceItem[]
  created_at: string
  updated_at: string
}

export interface QuotationItem {
  id: string
  quotation_id: string
  product_id?: string
  product?: Product
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  tax_amount: number
  discount: number
  total: number
}

export interface Quotation {
  id: string
  organization_id: string
  client_id: string
  client?: Client
  quotation_number: string
  reference_number?: string
  issue_date: string
  valid_until: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted'
  subtotal: number
  discount_type?: 'percentage' | 'fixed'
  discount_value?: number
  discount_amount: number
  tax_amount: number
  total: number
  notes?: string
  terms?: string
  converted_to_invoice_id?: string
  sent_at?: string
  viewed_at?: string
  items?: QuotationItem[]
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface StockTransferItem {
  id: string
  stock_transfer_id: string
  product_id: string
  product?: Product
  variant_id?: string
  variant?: ProductVariant
  make_id?: string
  make?: ProductMake
  quantity: number
}

export interface StockTransfer {
  id: string
  organization_id: string
  transfer_number: string
  from_warehouse_id: string
  from_warehouse?: Warehouse
  to_warehouse_id: string
  to_warehouse?: Warehouse
  transfer_date: string
  status: 'pending' | 'approved' | 'completed' | 'cancelled'
  notes?: string
  approved_by?: string
  approved_at?: string
  items?: StockTransferItem[]
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_clients: number
  total_products: number
  total_invoices: number
  total_quotations: number
  total_revenue: number
  pending_amount: number
  invoices_by_status: {
    status: string
    count: number
  }[]
  monthly_revenue: {
    month: string
    revenue: number
  }[]
}

// Project Types
export interface Project {
  id: string
  organization_id: string
  name: string
  description?: string
  client_id?: string
  client?: Client
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
  start_date?: string
  end_date?: string
  budget?: number
  progress: number
  manager_id?: string
  manager?: User
  location?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Project Updates Types
export interface ProjectUpdate {
  id: string
  organization_id: string
  project_id: string
  project?: Project
  type: 'site_visit' | 'daily_update' | 'progress' | 'issue'
  title: string
  description?: string
  location?: string
  visited_by?: string
  visitor?: User
  visited_at?: string
  images?: string[]
  status: string
  created_at: string
  updated_at: string
}

// Subcontract Types
export interface Subcontract {
  id: string
  organization_id: string
  project_id?: string
  project?: Project
  contractor_name: string
  contractor_email?: string
  contractor_phone?: string
  contractor_address?: string
  work_description?: string
  contract_value?: number
  start_date?: string
  end_date?: string
  status: 'draft' | 'active' | 'completed' | 'terminated'
  payment_terms?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Role & Permission Types
export interface Role {
  id: string
  organization_id: string
  name: string
  description?: string
  permissions: string[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  name: string
  slug: string
  description?: string
  module?: string
  created_at: string
  updated_at: string
}

// Team Task Types
export interface TeamTask {
  id: string
  organization_id: string
  project_id?: string
  project?: Project
  title: string
  description?: string
  assigned_to?: string
  assignee?: User
  assigned_by?: string
  assigner?: User
  due_date?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  estimated_hours?: number
  actual_hours?: number
  created_at: string
  updated_at: string
}

// Delivery Challan Types
export interface DeliveryChallanItem {
  id: string
  delivery_challan_id: string
  product_id?: string
  product?: Product
  description: string
  quantity: number
  unit?: string
  remarks?: string
}

export interface DeliveryChallan {
  id: string
  organization_id: string
  challan_number: string
  invoice_id?: string
  invoice?: Invoice
  project_id?: string
  project?: Project
  client_id?: string
  client?: Client
  issue_date: string
  transport_name?: string
  vehicle_number?: string
  driver_name?: string
  driver_phone?: string
  destination?: string
  status: 'pending' | 'dispatched' | 'delivered' | 'cancelled'
  notes?: string
  items?: DeliveryChallanItem[]
  created_at: string
  updated_at: string
}

// Settings Types
export interface DocumentSetting {
  id: string
  organization_id: string
  key: string
  value: Record<string, unknown> | null
  type: string
  created_at: string
  updated_at: string
}

// Stock Check
export interface StockCheck {
  product_id: string
  product: Product
  current_stock: number
  alert_quantity: number
  status: 'ok' | 'low' | 'out_of_stock'
}

// Site Visit Types
export interface SiteVisit {
  id: string
  organization_id: string
  client_id?: string
  client?: Client
  project_id?: string
  project?: Project
  visit_date: string
  visit_time?: string
  location?: string
  purpose?: string
  visited_by?: string
  visitor?: User
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  remarks?: string
  images?: string[]
  next_action?: string
  follow_up_date?: string
  created_at: string
  updated_at: string
}

// Client Meeting Types
export interface ClientMeeting {
  id: string
  organization_id: string
  client_id?: string
  client?: Client
  meeting_title: string
  meeting_type: 'initial' | 'follow_up' | 'discussion' | 'presentation' | 'negotiation' | 'other'
  meeting_date: string
  meeting_time?: string
  location?: string
  agenda?: string
  attendees?: string[]
  attendees_list?: User[]
  organized_by?: string
  organizer?: User
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled'
  notes?: string
  outcome?: string
  action_items?: string[]
  follow_up_required: boolean
  follow_up_date?: string
  created_at: string
  updated_at: string
}

export interface PrintTemplate {
  id: string
  name: string
  type: 'invoice' | 'quotation' | 'delivery_challan' | 'proforma_invoice' | 'credit_note' | 'debit_note'
  is_default: boolean
  preview_url?: string
  created_at: string
  updated_at: string
}

export interface TemplateSettings {
  templates: PrintTemplate[]
  selected_template_id?: string
  default_template_id?: string
}
