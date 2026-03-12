import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Package, Pencil, Trash2, MoreHorizontal, Eye, Folder, Wrench, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProducts, useCategories, useUnits, useCreateProduct, useDeleteProduct } from '@/modules/products/hooks/useProducts'
import { formatCurrency } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(2, 'Name required'),
  sku: z.string().optional(),
  hsn_code: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  unit_id: z.string().optional(),
  type: z.enum(['product', 'service']),
  price: z.coerce.number().min(0),
  cost_price: z.coerce.number().optional(),
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  is_active: z.boolean().default(true),
})

const categorySchema = z.object({
  name: z.string().min(2, 'Name required'),
  description: z.string().optional(),
})

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState('products')
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [unitDialog, setUnitDialog] = useState(false)

  const { data, isLoading } = useProducts({ search: search || undefined, per_page: 10, page })
  const { data: categories } = useCategories()
  const { data: units } = useUnits()
  const createProduct = useCreateProduct()
  const deleteProduct = useDeleteProduct()

  const { register: registerProduct, handleSubmit: handleProductSubmit, reset: resetProduct, formState: { errors: productErrors } } = useForm<z.infer<typeof productSchema>>({ resolver: zodResolver(productSchema), defaultValues: { type: 'product', is_active: true, tax_rate: 0 } })
  const { register: registerCategory, handleSubmit: handleCategorySubmit, reset: resetCategory, formState: { errors: categoryErrors } } = useForm<z.infer<typeof categorySchema>>({ resolver: zodResolver(categorySchema) })
  const { register: registerUnit, handleSubmit: handleUnitSubmit, reset: resetUnit } = useForm<z.infer<typeof categorySchema>>({ resolver: zodResolver(categorySchema) })

  const onProductSubmit = async (data: z.infer<typeof productSchema>) => { await createProduct.mutateAsync(data); resetProduct() }
  const onCategorySubmit = async (data: z.infer<typeof categorySchema>) => { console.log('Create category:', data); setCategoryDialog(false); resetCategory() }
  const onUnitSubmit = async (data: z.infer<typeof categorySchema>) => { console.log('Create unit:', data); setUnitDialog(false); resetUnit() }
  const handleDelete = async (id: string) => { if (confirm('Delete this product?')) { await deleteProduct.mutateAsync(id) } }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Products</h1><p className="text-muted-foreground">Manage your product catalog</p></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products"><Package className="mr-2 h-4 w-4" />Products</TabsTrigger>
          <TabsTrigger value="categories"><Folder className="mr-2 h-4 w-4" />Categories</TabsTrigger>
          <TabsTrigger value="services"><Wrench className="mr-2 h-4 w-4" />Services</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Units & More</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Products</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
                  <Button asChild><Link to="/products/new"><Plus className="mr-2 h-4 w-4" />Add Product</Link></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div> : (
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Name</TableHead><TableHead>SKU</TableHead><TableHead>HSN</TableHead><TableHead>Category</TableHead><TableHead>Type</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku || '-'}</TableCell>
                        <TableCell>{product.hsn_code || '-'}</TableCell>
                        <TableCell>{product.category?.name || '-'}</TableCell>
                        <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.type === 'service' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{product.type}</span></TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{product.is_active ? 'Active' : 'Inactive'}</span></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild><Link to={`/products/${product.id}`}><Eye className="mr-2 h-4 w-4" />View</Link></DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <Button onClick={() => setCategoryDialog(true)}><Plus className="mr-2 h-4 w-4" />Add Category</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Products</TableHead></TableRow></TableHeader>
                <TableBody>
                  {categories?.map((cat) => <TableRow key={cat.id}><TableCell className="font-medium">{cat.name}</TableCell><TableCell>{cat.description || '-'}</TableCell><TableCell>-</TableCell></TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Services</CardTitle>
                <Button onClick={() => setCategoryDialog(true)}><Plus className="mr-2 h-4 w-4" />Add Service</Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Services are non-inventory items that can be billed.</p>
              <div className="mt-4"><Button variant="outline">Create New Service</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Units of Measure</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setUnitDialog(true)}><Plus className="mr-2 h-4 w-4" />Add Unit</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Symbol</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {units?.map((unit) => <TableRow key={unit.id}><TableCell>{unit.name}</TableCell><TableCell>{unit.symbol}</TableCell></TableRow>)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Quick Add</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Quick Add Category</Label>
                  <div className="flex gap-2"><Input placeholder="New category name" /><Button>Add</Button></div>
                </div>
                <div className="space-y-2">
                  <Label>Quick Add Unit</Label>
                  <div className="flex gap-2"><Input placeholder="Unit name" /><Input placeholder="Symbol" className="w-20" /><Button>Add</Button></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
          <form onSubmit={handleCategorySubmit(onCategorySubmit)} className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input {...registerCategory('name')} /><p className="text-sm text-red-500">{categoryErrors.name?.message}</p></div>
            <div className="space-y-2"><Label>Description</Label><Input {...registerCategory('description')} /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setCategoryDialog(false)}>Cancel</Button><Button type="submit">Create</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={unitDialog} onOpenChange={setUnitDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Unit</DialogTitle></DialogHeader>
          <form onSubmit={handleUnitSubmit(onUnitSubmit)} className="space-y-4">
            <div className="space-y-2"><Label>Name *</Label><Input {...registerUnit('name')} placeholder="e.g., Kilogram" /></div>
            <div className="space-y-2"><Label>Symbol *</Label><Input {...registerUnit('description')} placeholder="e.g., kg" /></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setUnitDialog(false)}>Cancel</Button><Button type="submit">Create</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
