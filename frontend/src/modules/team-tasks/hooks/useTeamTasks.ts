import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamTasksApi } from '@/modules/team-tasks/api/teamTasksApi'
import { useToast } from '@/hooks/use-toast'

export function useTeamTasks(filters?: { search?: string; status?: string; priority?: string; per_page?: number }) {
  return useQuery({ queryKey: ['team-tasks', filters], queryFn: () => teamTasksApi.getTasks(filters) })
}

export function useTeamTask(id: string) {
  return useQuery({ queryKey: ['team-task', id], queryFn: () => teamTasksApi.getTask(id), enabled: !!id })
}

export function useCreateTeamTask() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: teamTasksApi.createTask,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['team-tasks'] }); toast({ title: 'Success', description: 'Task created' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useUpdateTeamTask() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').TeamTask> }) => teamTasksApi.updateTask(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['team-tasks'] }); toast({ title: 'Success', description: 'Task updated' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useDeleteTeamTask() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: teamTasksApi.deleteTask,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['team-tasks'] }); toast({ title: 'Success', description: 'Task deleted' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}
