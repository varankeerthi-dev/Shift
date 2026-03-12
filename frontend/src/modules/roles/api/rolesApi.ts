import api from '@/services/api'
import { Role, Permission, PaginatedResponse } from '@/types'

export const rolesApi = {
  getRoles: async (): Promise<Role[]> => {
    const { data } = await api.get<Role[]>('/roles')
    return data
  },
  getRole: async (id: string): Promise<Role> => {
    const { data } = await api.get<Role>(`/roles/${id}`)
    return data
  },
  createRole: async (role: Partial<Role>): Promise<Role> => {
    const { data } = await api.post<Role>('/roles', role)
    return data
  },
  updateRole: async (id: string, role: Partial<Role>): Promise<Role> => {
    const { data } = await api.put<Role>(`/roles/${id}`, role)
    return data
  },
  deleteRole: async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`)
  },
  getPermissions: async (): Promise<Permission[]> => {
    const { data } = await api.get<Permission[]>('/roles/permissions')
    return data
  },
  assignRole: async (userId: string, roleId: string): Promise<void> => {
    await api.post('/roles/assign', { user_id: userId, role_id: roleId })
  },
}
