import api from '@/services/api'
import { Project, PaginatedResponse } from '@/types'

interface ProjectFilters {
  search?: string
  status?: string
  client_id?: string
  per_page?: number
  page?: number
}

export const projectsApi = {
  getProjects: async (filters?: ProjectFilters): Promise<PaginatedResponse<Project>> => {
    const { data } = await api.get<PaginatedResponse<Project>>('/projects', { params: filters })
    return data
  },

  getProject: async (id: string): Promise<Project> => {
    const { data } = await api.get<Project>(`/projects/${id}`)
    return data
  },

  createProject: async (project: Partial<Project>): Promise<Project> => {
    const { data } = await api.post<Project>('/projects', project)
    return data
  },

  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
    const { data } = await api.put<Project>(`/projects/${id}`, project)
    return data
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`)
  },

  getProjectStats: async (): Promise<{
    total_projects: number
    active_projects: number
    completed_projects: number
    projects_by_status: { status: string; count: number }[]
  }> => {
    const { data } = await api.get('/projects/stats')
    return data
  },
}
