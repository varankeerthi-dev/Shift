import api from '@/services/api'
import { Quotation, PaginatedResponse } from '@/types'

interface QuotationFilters {
  search?: string
  status?: string
  client_id?: string
  per_page?: number
  page?: number
}

export const quotationsApi = {
  getQuotations: async (filters?: QuotationFilters): Promise<PaginatedResponse<Quotation>> => {
    const { data } = await api.get<PaginatedResponse<Quotation>>('/quotations', { params: filters })
    return data
  },

  getQuotation: async (id: string): Promise<Quotation> => {
    const { data } = await api.get<Quotation>(`/quotations/${id}`)
    return data
  },

  createQuotation: async (quotation: Partial<Quotation>): Promise<Quotation> => {
    const { data } = await api.post<Quotation>('/quotations', quotation)
    return data
  },

  updateQuotation: async (id: string, quotation: Partial<Quotation>): Promise<Quotation> => {
    const { data } = await api.put<Quotation>(`/quotations/${id}`, quotation)
    return data
  },

  deleteQuotation: async (id: string): Promise<void> => {
    await api.delete(`/quotations/${id}`)
  },

  sendQuotation: async (id: string): Promise<void> => {
    await api.post(`/quotations/${id}/send`)
  },

  convertToInvoice: async (id: string): Promise<{ invoice_id: string }> => {
    const { data } = await api.post<{ invoice_id: string }>(`/quotations/${id}/convert`)
    return data
  },
}
