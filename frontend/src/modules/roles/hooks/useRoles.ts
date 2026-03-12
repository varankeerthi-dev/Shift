import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rolesApi } from '@/modules/roles/api/rolesApi'
import { useToast } from '@/hooks/use-toast'

export function useRoles() {
  return useQuery({ queryKey: ['roles'], queryFn: () => rolesApi.getRoles() })
}

export function useRole(id: string) {
  return useQuery({ queryKey: ['role', id], queryFn: () => rolesApi.getRole(id), enabled: !!id })
}

export function usePermissions() {
  return useQuery({ queryKey: ['permissions'], queryFn: () => rolesApi.getPermissions() })
}

export function useCreateRole() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: rolesApi.createRole,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['roles'] }); toast({ title: 'Success', description: 'Role created' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').Role> }) => rolesApi.updateRole(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['roles'] }); toast({ title: 'Success', description: 'Role updated' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: rolesApi.deleteRole,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['roles'] }); toast({ title: 'Success', description: 'Role deleted' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useAssignRole() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) => rolesApi.assignRole(userId, roleId),
    onSuccess: () => { toast({ title: 'Success', description: 'Role assigned' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}
