import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { useQuotation, useCreateQuotation, useUpdateQuotation } from '@/modules/quotations/hooks/useQuotations'
import { useActiveClients } from '@/modules/clients/hooks/useClients'
import { useActiveProducts } from '@/modules/products/hooks/useProducts'
import { formatCurrency, calculateTotals } from '@/lib/utils'

const quotationItemSchema = z.object({
  product_id: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  unit_price: z.coerce.number().min(0, 'Price must be positive'),
  tax_rate: z.coerce.number().min(0).max(100).default(0),
  discount: z.coerce.number().min(0).default(0),
})

const quotationSchema = z.object({
  client_id: z.string().min(1, 'Client is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  valid_until: z.string().min(1, 'Valid until date is required'),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed']).optional(),
  discount_value: z.coerce.number().optional(),
  items: z.array(quotationItemSchema).min(1, 'At least one item is required'),
})

type QuotationFormData = z.infer<typeof quotationSchema>

export default function QuotationFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const { data: quotation, isLoading } = useQuotation(id || '')
  const { data: clients } = useActiveClients()
  const { data: products } = useActiveProducts()
  const createQuotation = useCreateQuotation()
  const updateQuotation = useUpdateQuotation()

  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState(0)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      issue_date: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedItems = watch('items')

  useEffect(() => {
    if (quotation && isEdit) {
      setValue('client_id', quotation.client_id)
      setValue('issue_date', quotation.issue_date)
      setValue('valid_until', quotation.valid_until)
      setValue('reference_number', quotation.reference_number || '')
      setValue('notes', quotation.notes || '')
      setValue('terms', quotation.terms || '')
      setDiscountType(quotation.discount_type || 'percentage')
      setDiscountValue(quotation.discount_value || 0)
      if (quotation.items && quotation.items.length > 0) {
        setValue('items', quotation.items.map(item => ({
          product_id: item.product_id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate,
          discount: item.discount,
        })))
      }
    }
  }, [quotation, isEdit, setValue])

  const handleProductSelect = (index: number, productId: string) => {
    const product = products?.find(p => p.id === productId)
    if (product) {
      setValue(`items.${index}.description`, product.name)
      setValue(`items.${index}.unit_price`, product.price)
      setValue(`items.${index}.tax_rate`, product.tax_rate)
    }
  }

  const totals = calculateTotals(watchedItems.map(item => ({
    quantity: item.quantity || 0,
    unit_price: item.unit_price || 0,
    tax_rate: item.tax_rate || 0,
    discount: item.discount || 0,
  })))

  const finalTotal = discountType === 'percentage'
    ? totals.total - (totals.subtotal * (discountValue / 100))
    : totals.total - discountValue

  const onSubmit = async (data: QuotationFormData) => {
    try {
      const quotationData = {
        ...data,
        discount_type: discountType,
        discount_value: discountValue,
        subtotal: totals.subtotal,
        discount_amount: totals.discountAmount,
        tax_amount: totals.taxAmount,
        total: Math.max(0, finalTotal),
      }

      if (isEdit && id) {
        await updateQuotation.mutateAsync({ id, data: quotationData })
      } else {
        await createQuotation.mutateAsync(quotationData)
      }
      navigate('/quotations')
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Quotation' : 'Create Quotation'}</h1>
        <p className="text-muted-foreground">
          {isEdit ? 'Update quotation details' : 'Create a new quotation'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quotation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="client_id">Client *</Label>
                    <select
                      id="client_id"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...register('client_id')}
                    >
                      <option value="">Select client</option>
                      {clients?.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    {errors.client_id && (
                      <p className="text-sm text-red-500">{errors.client_id.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference_number">Reference Number</Label>
                    <Input id="reference_number" {...register('reference_number')} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue_date">Issue Date *</Label>
                    <Input id="issue_date" type="date" {...register('issue_date')} />
                    {errors.issue_date && (
                      <p className="text-sm text-red-500">{errors.issue_date.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valid_until">Valid Until *</Label>
                    <Input id="valid_until" type="date" {...register('valid_until')} />
                    {errors.valid_until && (
                      <p className="text-sm text-red-500">{errors.valid_until.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start">
                      <div className="flex-1 grid gap-2">
                        <select
                          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          onChange={(e) => handleProductSelect(index, e.target.value)}
                        >
                          <option value="">Select product (optional)</option>
                          {products?.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - {formatCurrency(product.price)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Description"
                          {...register(`items.${index}.description`)}
                        />
                        {errors.items?.[index]?.description && (
                          <p className="text-sm text-red-500">{errors.items[index]?.description?.message}</p>
                        )}
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="Qty"
                          {...register(`items.${index}.quantity`)}
                        />
                      </div>
                      <div className="w-28">
                        <Input
                          type="number"
                          placeholder="Price"
                          step="0.01"
                          {...register(`items.${index}.unit_price`)}
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          placeholder="Tax %"
                          {...register(`items.${index}.tax_rate`)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ description: '', quantity: 1, unit_price: 0, tax_rate: 0, discount: 0 })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('notes')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <textarea
                    id="terms"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('terms')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(totals.taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-{formatCurrency(totals.discountAmount)}</span>
                </div>
                <div className="space-y-2">
                  <Label>Additional Discount</Label>
                  <div className="flex gap-2">
                    <select
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">Fixed</option>
                    </select>
                    <Input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(Math.max(0, finalTotal))}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" size="lg" disabled={createQuotation.isPending || updateQuotation.isPending}>
                {createQuotation.isPending || updateQuotation.isPending
                  ? 'Saving...'
                  : isEdit
                  ? 'Update Quotation'
                  : 'Create Quotation'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/quotations')}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
