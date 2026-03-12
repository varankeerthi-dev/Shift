import api from '@/services/api'
import { User, Organization } from '@/types'

interface LoginResponse {
  token: string
  user: User
  organizations: Organization[]
  current_organization_id: string
  is_new_user?: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  organization_name?: string
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password })
    return data
  },

  register: async (registerData: RegisterData): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/register', registerData)
    return data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  googleLogin: async (googleToken: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/google-login', { google_token: googleToken })
    return data
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token: string, email: string, password: string, passwordConfirmation: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>('/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation
    })
    return data
  },

  me: async (): Promise<{
    user: User
    organizations: Organization[]
    current_organization_id: string
  }> => {
    const { data } = await api.get('/auth/me')
    return data
  },

  switchOrganization: async (organizationId: string): Promise<{ organization: Organization }> => {
    const { data } = await api.post('/auth/switch-organization', { organization_id: organizationId })
    return data
  },
}
