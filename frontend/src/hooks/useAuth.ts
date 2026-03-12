import { useState, useEffect } from 'react'
import { User, Organization } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  currentOrganization: Organization | null
  organizations: Organization[]
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    currentOrganization: null,
    organizations: [],
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const orgId = localStorage.getItem('current_organization_id')
    const orgsStr = localStorage.getItem('organizations')

    if (token && userStr) {
      const user = JSON.parse(userStr)
      const organizations = orgsStr ? JSON.parse(orgsStr) : []
      const currentOrganization = orgId 
        ? organizations.find((o: Organization) => o.id === orgId) 
        : organizations[0] || null

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        currentOrganization,
        organizations,
      })
    } else {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = (user: User, token: string, organizations: Organization[], currentOrganizationId?: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('organizations', JSON.stringify(organizations))
    
    const currentOrganization = currentOrganizationId 
      ? organizations.find((o: Organization) => o.id === currentOrganizationId)
      : organizations[0]
    
    if (currentOrganization) {
      localStorage.setItem('current_organization_id', currentOrganization.id)
    }

    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      currentOrganization,
      organizations,
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('organizations')
    localStorage.removeItem('current_organization_id')

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      currentOrganization: null,
      organizations: [],
    })
  }

  const switchOrganization = (organization: Organization) => {
    localStorage.setItem('current_organization_id', organization.id)
    setState(prev => ({ ...prev, currentOrganization: organization }))
  }

  return {
    ...state,
    login,
    logout,
    switchOrganization,
  }
}
