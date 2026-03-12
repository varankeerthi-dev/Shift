import api from '@/services/api'
import { DeliveryChallan, PaginatedResponse } from '@/types'

export const deliveryChallansApi = {
  getChallans: async (filters?: { search?: string; status?: string; per_page?: number }): Promise<PaginatedResponse<DeliveryChallan>> => {
    const { data } = await api.get<PaginatedResponse<DeliveryChallan>>('/delivery-challans', { params: filters })
    return data
  },
  getChallan: async (id: string): Promise<DeliveryChallan> => {
    const { data } = await api.get<DeliveryChallan>(`/delivery-challans/${id}`)
    return data
  },
  createChallan: async (challan: Partial<DeliveryChallan>): Promise<DeliveryChallan> => {
    const { data } = await api.post<DeliveryChallan>('/delivery-challans', challan)
    return data
  },
  updateChallan: async (id: string, challan: Partial<DeliveryChallan>): Promise<DeliveryChallan> => {
    const { data } = await api.put<DeliveryChallan>(`/delivery-challans/${id}`, challan)
    return data
  },
  deleteChallan: async (id: string): Promise<void> => {
    await api.delete(`/delivery-challans/${id}`)
  },
}
