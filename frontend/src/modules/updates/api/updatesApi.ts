import api from '@/services/api'
import { ProjectUpdate, PaginatedResponse, Project } from '@/types'

interface UpdateFilters {
  search?: string
  type?: string
  project_id?: string
  per_page?: number
  page?: number
}

export const updatesApi = {
  getUpdates: async (filters?: UpdateFilters): Promise<PaginatedResponse<ProjectUpdate>> => {
    const { data } = await api.get<PaginatedResponse<ProjectUpdate>>('/updates', { params: filters })
    return data
  },

  getUpdate: async (id: string): Promise<ProjectUpdate> => {
    const { data } = await api.get<ProjectUpdate>(`/updates/${id}`)
    return data
  },

  createUpdate: async (update: Partial<ProjectUpdate>): Promise<ProjectUpdate> => {
    const { data } = await api.post<ProjectUpdate>('/updates', update)
    return data
  },

  updateUpdate: async (id: string, update: Partial<ProjectUpdate>): Promise<ProjectUpdate> => {
    const { data } = await api.put<ProjectUpdate>(`/updates/${id}`, update)
    return data
  },

  deleteUpdate: async (id: string): Promise<void> => {
    await api.delete(`/updates/${id}`)
  },
}
