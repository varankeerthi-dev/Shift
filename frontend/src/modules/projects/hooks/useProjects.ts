import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/modules/projects/api/projectsApi'
import { useToast } from '@/hooks/use-toast'

export function useProjects(filters?: { search?: string; status?: string; client_id?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.getProjects(filters),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
  })
}

export function useProjectStats() {
  return useQuery({
    queryKey: ['project-stats'],
    queryFn: () => projectsApi.getProjectStats(),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast({ title: 'Success', description: 'Project created successfully' })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to create project' })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').Project> }) =>
      projectsApi.updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      toast({ title: 'Success', description: 'Project updated successfully' })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to update project' })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast({ title: 'Success', description: 'Project deleted successfully' })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to delete project' })
    },
  })
}
