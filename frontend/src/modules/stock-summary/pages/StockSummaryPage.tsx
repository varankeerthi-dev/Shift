import { Package, AlertTriangle, CheckCircle, XCircle, Warehouse } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useStockSummary, useWarehouses } from '@/modules/stock-transfer/hooks/useStockApi'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

export default function StockSummaryPage() {
  const [warehouseId, setWarehouseId] = useState('')
  const { data: warehouses } = useWarehouses()
  const { data: stocks, isLoading } = useStockSummary()

  const filteredStocks = warehouseId ? stocks?.filter(s => s.warehouse_id === warehouseId) : stocks

  const totalStock = filteredStocks?.reduce((sum, s) => sum + s.quantity, 0) || 0
  const lowStock = filteredStocks?.filter(s => s.quantity <= s.alert_quantity && s.quantity > 0).length || 0
  const outOfStock = filteredStocks?.filter(s => s.quantity === 0).length || 0
  const inStock = filteredStocks?.filter(s => s.quantity > s.alert_quantity).length || 0

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Stock Summary</h1><p className="text-muted-foreground">Inventory overview across warehouses</p></div>
        <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>
          <option value="">All Warehouses</option>
          {warehouses?.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalStock}</div><p className="text-xs text-muted-foreground">Items in stock</p></CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{inStock}</div><p className="text-xs text-muted-foreground">Above alert level</p></CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{lowStock}</div><p className="text-xs text-muted-foreground">Below alert level</p></CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{outOfStock}</div><p className="text-xs text-muted-foreground">Zero quantity</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Stock Details</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Make</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Alert Level</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStocks?.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell className="font-medium">{stock.product?.name || '-'}</TableCell>
                  <TableCell>{stock.warehouse?.name || '-'}</TableCell>
                  <TableCell>{stock.variant?.name || '-'}</TableCell>
                  <TableCell>{stock.make?.name || '-'}</TableCell>
                  <TableCell className="text-right">{stock.quantity}</TableCell>
                  <TableCell className="text-right">{stock.alert_quantity}</TableCell>
                  <TableCell className="text-right">{stock.product ? formatCurrency(stock.product.price) : '-'}</TableCell>
                  <TableCell>
                    {stock.quantity === 0 ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
                    ) : stock.quantity <= stock.alert_quantity ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">Low Stock</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
