import api from '@/services/api'
import { SiteVisit, PaginatedResponse } from '@/types'

export const siteVisitsApi = {
  getVisits: async (filters?: { search?: string; status?: string; client_id?: string; project_id?: string; per_page?: number; page?: number }): Promise<PaginatedResponse<SiteVisit>> => {
    const { data } = await api.get<PaginatedResponse<SiteVisit>>('/site-visits', { params: filters })
    return data
  },
  getVisit: async (id: string): Promise<SiteVisit> => {
    const { data } = await api.get<SiteVisit>(`/site-visits/${id}`)
    return data
  },
  createVisit: async (visit: Partial<SiteVisit>): Promise<SiteVisit> => {
    const { data } = await api.post<SiteVisit>('/site-visits', visit)
    return data
  },
  updateVisit: async (id: string, visit: Partial<SiteVisit>): Promise<SiteVisit> => {
    const { data } = await api.put<SiteVisit>(`/site-visits/${id}`, visit)
    return data
  },
  deleteVisit: async (id: string): Promise<void> => {
    await api.delete(`/site-visits/${id}`)
  },
}