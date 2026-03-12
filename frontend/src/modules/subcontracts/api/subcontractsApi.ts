import api from '@/services/api'
import { Subcontract, PaginatedResponse } from '@/types'

export const subcontractsApi = {
  getSubcontracts: async (filters?: { search?: string; status?: string; per_page?: number }): Promise<PaginatedResponse<Subcontract>> => {
    const { data } = await api.get<PaginatedResponse<Subcontract>>('/subcontracts', { params: filters })
    return data
  },
  getSubcontract: async (id: string): Promise<Subcontract> => {
    const { data } = await api.get<Subcontract>(`/subcontracts/${id}`)
    return data
  },
  createSubcontract: async (subcontract: Partial<Subcontract>): Promise<Subcontract> => {
    const { data } = await api.post<Subcontract>('/subcontracts', subcontract)
    return data
  },
  updateSubcontract: async (id: string, subcontract: Partial<Subcontract>): Promise<Subcontract> => {
    const { data } = await api.put<Subcontract>(`/subcontracts/${id}`, subcontract)
    return data
  },
  deleteSubcontract: async (id: string): Promise<void> => {
    await api.delete(`/subcontracts/${id}`)
  },
}
