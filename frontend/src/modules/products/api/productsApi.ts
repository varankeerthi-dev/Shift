import api from '@/services/api'
import { Product, ProductCategory, ProductUnit, PaginatedResponse } from '@/types'

interface ProductFilters {
  search?: string
  category_id?: string
  is_active?: boolean
  per_page?: number
  page?: number
}

export const productsApi = {
  getProducts: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<PaginatedResponse<Product>>('/products', { params: filters })
    return data
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`)
    return data
  },

  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const { data } = await api.post<Product>('/products', product)
    return data
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const { data } = await api.put<Product>(`/products/${id}`, product)
    return data
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`)
  },

  getCategories: async (): Promise<ProductCategory[]> => {
    const { data } = await api.get<ProductCategory[]>('/products/categories')
    return data
  },

  getUnits: async (): Promise<ProductUnit[]> => {
    const { data } = await api.get<ProductUnit[]>('/products/units')
    return data
  },

  getActiveProducts: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('/products/active')
    return data
  },
}
