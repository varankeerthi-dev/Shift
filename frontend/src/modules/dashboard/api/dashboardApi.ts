import api from '@/services/api'
import { DashboardStats } from '@/types'

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>('/dashboard/stats')
    return data
  },
}
