import api from '@/services/api'
import { ClientMeeting, PaginatedResponse } from '@/types'

export const clientMeetingsApi = {
  getMeetings: async (filters?: { search?: string; status?: string; client_id?: string; meeting_type?: string; per_page?: number; page?: number }): Promise<PaginatedResponse<ClientMeeting>> => {
    const { data } = await api.get<PaginatedResponse<ClientMeeting>>('/client-meetings', { params: filters })
    return data
  },
  getMeeting: async (id: string): Promise<ClientMeeting> => {
    const { data } = await api.get<ClientMeeting>(`/client-meetings/${id}`)
    return data
  },
  createMeeting: async (meeting: Partial<ClientMeeting>): Promise<ClientMeeting> => {
    const { data } = await api.post<ClientMeeting>('/client-meetings', meeting)
    return data
  },
  updateMeeting: async (id: string, meeting: Partial<ClientMeeting>): Promise<ClientMeeting> => {
    const { data } = await api.put<ClientMeeting>(`/client-meetings/${id}`, meeting)
    return data
  },
  deleteMeeting: async (id: string): Promise<void> => {
    await api.delete(`/client-meetings/${id}`)
  },
}