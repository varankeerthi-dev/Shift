import api from '@/services/api'
import { Invoice, InvoiceItem, PaginatedResponse } from '@/types'

interface InvoiceFilters {
  search?: string
  status?: string
  client_id?: string
  per_page?: number
  page?: number
}

export const invoicesApi = {
  getInvoices: async (filters?: InvoiceFilters): Promise<PaginatedResponse<Invoice>> => {
    const { data } = await api.get<PaginatedResponse<Invoice>>('/invoices', { params: filters })
    return data
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const { data } = await api.get<Invoice>(`/invoices/${id}`)
    return data
  },

  createInvoice: async (invoice: Partial<Invoice>): Promise<Invoice> => {
    const { data } = await api.post<Invoice>('/invoices', invoice)
    return data
  },

  updateInvoice: async (id: string, invoice: Partial<Invoice>): Promise<Invoice> => {
    const { data } = await api.put<Invoice>(`/invoices/${id}`, invoice)
    return data
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await api.delete(`/invoices/${id}`)
  },

  sendInvoice: async (id: string): Promise<void> => {
    await api.post(`/invoices/${id}/send`)
  },

  markAsPaid: async (id: string): Promise<void> => {
    await api.post(`/invoices/${id}/mark-paid`)
  },

  downloadPdf: async (id: string): Promise<Blob> => {
    const { data } = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' })
    return data
  },
}
