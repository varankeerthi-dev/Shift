import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProduct, useCreateProduct, useUpdateProduct, useCategories, useUnits } from '@/modules/products/hooks/useProducts'

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  sku: z.string().optional(),
  category_id: z.string().optional(),
  unit_id: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  cost_price: z.coerce.number().optional(),
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  quantity: z.coerce.number().int().min(0).default(0),
  alert_quantity: z.coerce.number().int().min(0).default(10),
  is_active: z.boolean().default(true),
})

type ProductFormData = z.infer<typeof productSchema>

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const { data: product, isLoading } = useProduct(id || '')
  const { data: categories } = useCategories()
  const { data: units } = useUnits()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      is_active: true,
      tax_rate: 0,
      quantity: 0,
      alert_quantity: 10,
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEdit && id) {
        await updateProduct.mutateAsync({ id, data })
      } else {
        await createProduct.mutateAsync(data)
      }
      navigate('/products')
    } catch (error) {
      // Error handled in mutation
    }
  }

  if (isEdit && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Product' : 'New Product'}</h1>
        <p className="text-muted-foreground">
          {isEdit ? 'Update product information' : 'Add a new product to your catalog'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" {...register('sku')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <select
                  id="category_id"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('category_id')}
                >
                  <option value="">Select category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_id">Unit</Label>
                <select
                  id="unit_id"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('unit_id')}
                >
                  <option value="">Select unit</option>
                  {units?.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost_price">Cost Price</Label>
                <Input id="cost_price" type="number" step="0.01" {...register('cost_price')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input id="tax_rate" type="number" step="0.01" {...register('tax_rate')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" {...register('quantity')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert_quantity">Alert Quantity</Label>
                <Input id="alert_quantity" type="number" {...register('alert_quantity')} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('description')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/products')}>
            Cancel
          </Button>
          <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
            {createProduct.isPending || updateProduct.isPending
              ? 'Saving...'
              : isEdit
              ? 'Update Product'
              : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}
