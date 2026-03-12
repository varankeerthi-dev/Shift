import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/modules/products/api/productsApi'
import { useToast } from '@/hooks/use-toast'

export function useProducts(filters?: { search?: string; category_id?: string; is_active?: boolean; per_page?: number }) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  })
}

export function useActiveProducts() {
  return useQuery({
    queryKey: ['products', 'active'],
    queryFn: () => productsApi.getActiveProducts(),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: () => productsApi.getCategories(),
  })
}

export function useUnits() {
  return useQuery({
    queryKey: ['product-units'],
    queryFn: () => productsApi.getUnits(),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Success',
        description: 'Product created successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create product',
      })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').Product> }) =>
      productsApi.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update product',
      })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete product',
      })
    },
  })
}
