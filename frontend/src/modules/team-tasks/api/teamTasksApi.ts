import api from '@/services/api'
import { TeamTask, PaginatedResponse } from '@/types'

export const teamTasksApi = {
  getTasks: async (filters?: { search?: string; status?: string; priority?: string; assigned_to?: string; per_page?: number }): Promise<PaginatedResponse<TeamTask>> => {
    const { data } = await api.get<PaginatedResponse<TeamTask>>('/team-tasks', { params: filters })
    return data
  },
  getTask: async (id: string): Promise<TeamTask> => {
    const { data } = await api.get<TeamTask>(`/team-tasks/${id}`)
    return data
  },
  createTask: async (task: Partial<TeamTask>): Promise<TeamTask> => {
    const { data } = await api.post<TeamTask>('/team-tasks', task)
    return data
  },
  updateTask: async (id: string, task: Partial<TeamTask>): Promise<TeamTask> => {
    const { data } = await api.put<TeamTask>(`/team-tasks/${id}`, task)
    return data
  },
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/team-tasks/${id}`)
  },
}
