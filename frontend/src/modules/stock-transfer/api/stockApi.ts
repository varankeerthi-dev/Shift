import api from '@/services/api'
import { StockTransfer, PaginatedResponse, Warehouse, WarehouseStock } from '@/types'

export const stockApi = {
  getWarehouses: async (): Promise<Warehouse[]> => {
    const { data } = await api.get<Warehouse[]>('/products/warehouses')
    return data
  },

  createWarehouse: async (warehouse: Partial<Warehouse>): Promise<Warehouse> => {
    const { data } = await api.post<Warehouse>('/products/warehouses', warehouse)
    return data
  },

  getWarehouseStocks: async (warehouseId?: string): Promise<WarehouseStock[]> => {
    const { data } = await api.get<WarehouseStock[]>('/products/warehouse-stocks', { params: { warehouse_id: warehouseId } })
    return data
  },

  getStockSummary: async (): Promise<WarehouseStock[]> => {
    const { data } = await api.get<WarehouseStock[]>('/products/stock-summary')
    return data
  },

  getStockTransfers: async (filters?: { search?: string; status?: string; per_page?: number }): Promise<PaginatedResponse<StockTransfer>> => {
    const { data } = await api.get<PaginatedResponse<StockTransfer>>('/products/stock-transfers', { params: filters })
    return data
  },

  getStockTransfer: async (id: string): Promise<StockTransfer> => {
    const { data } = await api.get<StockTransfer>(`/products/stock-transfers/${id}`)
    return data
  },

  createStockTransfer: async (transfer: Partial<StockTransfer>): Promise<StockTransfer> => {
    const { data } = await api.post<StockTransfer>('/products/stock-transfers', transfer)
    return data
  },

  approveStockTransfer: async (id: string): Promise<StockTransfer> => {
    const { data } = await api.post<StockTransfer>(`/products/stock-transfers/${id}/approve`)
    return data
  },

  completeStockTransfer: async (id: string): Promise<StockTransfer> => {
    const { data } = await api.post<StockTransfer>(`/products/stock-transfers/${id}/complete`)
    return data
  },
}
