import api from '@/services/api'
import { Client, PaginatedResponse } from '@/types'

interface ClientFilters {
  search?: string
  is_active?: boolean
  per_page?: number
  page?: number
}

export const clientsApi = {
  getClients: async (filters?: ClientFilters): Promise<PaginatedResponse<Client>> => {
    const { data } = await api.get<PaginatedResponse<Client>>('/clients', { params: filters })
    return data
  },

  getClient: async (id: string): Promise<Client> => {
    const { data } = await api.get<Client>(`/clients/${id}`)
    return data
  },

  createClient: async (client: Partial<Client>): Promise<Client> => {
    const { data } = await api.post<Client>('/clients', client)
    return data
  },

  updateClient: async (id: string, client: Partial<Client>): Promise<Client> => {
    const { data } = await api.put<Client>(`/clients/${id}`, client)
    return data
  },

  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`)
  },

  getActiveClients: async (): Promise<Client[]> => {
    const { data } = await api.get<Client[]>('/clients/active')
    return data
  },
}
