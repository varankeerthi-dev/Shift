import { Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useActiveProducts } from '@/modules/products/hooks/useProducts'
import { formatCurrency } from '@/lib/utils'

export default function StockCheckPage() {
  const { data: products, isLoading } = useActiveProducts()

  const lowStock = products?.filter(p => p.quantity <= p.alert_quantity && p.quantity > 0) || []
  const outOfStock = products?.filter(p => p.quantity === 0) || []
  const inStock = products?.filter(p => p.quantity > p.alert_quantity) || []

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quick Stock Check</h1>
        <p className="text-muted-foreground">Current inventory status</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inStock.length}</div>
            <p className="text-xs text-muted-foreground">Products above alert level</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStock.length}</div>
            <p className="text-xs text-muted-foreground">Products below alert level</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStock.length}</div>
            <p className="text-xs text-muted-foreground">Products with zero quantity</p>
          </CardContent>
        </Card>
      </div>

      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Products Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outOfStock.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                  <div className="flex items-center gap-4">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">0</p>
                    <p className="text-xs text-muted-foreground">Alert at: {product.alert_quantity}</p>
                  </div>
                </div>
              ))}
              {lowStock.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-600">{product.quantity}</p>
                    <p className="text-xs text-muted-foreground">Alert at: {product.alert_quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Products Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">SKU</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Alert Level</th>
                  <th className="text-right py-3 px-4">Price</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {products?.map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{product.sku || '-'}</td>
                    <td className="py-3 px-4 text-right">{product.quantity}</td>
                    <td className="py-3 px-4 text-right">{product.alert_quantity}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(product.price)}</td>
                    <td className="py-3 px-4 text-center">
                      {product.quantity === 0 ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
                      ) : product.quantity <= product.alert_quantity ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">Low Stock</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
