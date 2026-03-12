import { useState } from 'react'
import { Plus, Search, ArrowRight, MoreHorizontal, Trash2, Eye, Check, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useStockTransfers, useWarehouses, useCreateStockTransfer, useApproveStockTransfer, useCompleteStockTransfer, useStockSummary } from '@/modules/stock-transfer/hooks/useStockApi'
import { formatDate } from '@/lib/utils'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-800', approved: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' }

const transferSchema = z.object({
  from_warehouse_id: z.string().min(1, 'Required'),
  to_warehouse_id: z.string().min(1, 'Required'),
  transfer_date: z.string().min(1, 'Required'),
  notes: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().min(1, 'Required'),
    quantity: z.coerce.number().min(1, 'Min 1'),
  })),
})

export default function StockTransfersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  
  const { data, isLoading } = useStockTransfers({ search: search || undefined, status: status || undefined, per_page: 10, page })
  const { data: warehouses } = useWarehouses()
  const { data: stockSummary } = useStockSummary()
  const createTransfer = useCreateStockTransfer()
  const approveTransfer = useApproveStockTransfer()
  const completeTransfer = useCompleteStockTransfer()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: { transfer_date: new Date().toISOString().split('T')[0], items: [{ product_id: '', quantity: 1 }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const onSubmit = async (data: z.infer<typeof transferSchema>) => {
    await createTransfer.mutateAsync(data)
    setOpen(false)
    reset()
  }

  const handleApprove = async (id: string) => { await approveTransfer.mutateAsync(id) }
  const handleComplete = async (id: string) => { await completeTransfer.mutateAsync(id) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Stock Transfer</h1><p className="text-muted-foreground">Transfer stock between warehouses</p></div>
        <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />New Transfer</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {['pending', 'approved', 'completed', 'cancelled'].map((s) => (
          <Card key={s} className="cursor-pointer hover:bg-muted/50" onClick={() => setStatus(status === s ? '' : s)}>
            <CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground capitalize">{s}</p><p className="text-2xl font-bold">{data?.data?.filter((t) => t.status === s).length || 0}</p></div><ArrowRight className={`h-8 w-8 ${statusColors[s].split(' ')[1]} opacity-50`} /></div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Transfers</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
              <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div> : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Transfer #</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.transfer_number}</TableCell>
                    <TableCell>{transfer.from_warehouse?.name || '-'}</TableCell>
                    <TableCell>{transfer.to_warehouse?.name || '-'}</TableCell>
                    <TableCell>{formatDate(transfer.transfer_date)}</TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[transfer.status]}`}>{transfer.status}</span></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                          {transfer.status === 'pending' && <DropdownMenuItem onClick={() => handleApprove(transfer.id)}><Check className="mr-2 h-4 w-4" />Approve</DropdownMenuItem>}
                          {transfer.status === 'approved' && <DropdownMenuItem onClick={() => handleComplete(transfer.id)}><Package className="mr-2 h-4 w-4" />Complete</DropdownMenuItem>}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>New Stock Transfer</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>From Warehouse *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('from_warehouse_id')}>
                  <option value="">Select warehouse</option>
                  {warehouses?.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="space-y-2"><Label>To Warehouse *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...register('to_warehouse_id')}>
                  <option value="">Select warehouse</option>
                  {warehouses?.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="space-y-2"><Label>Transfer Date *</Label><Input type="date" {...register('transfer_date')} /></div>
            </div>
            <div className="space-y-2"><Label>Items</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <select className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" {...register(`items.${index}.product_id` as const)}>
                    <option value="">Select product</option>
                    {stockSummary?.map((s) => <option key={s.product_id} value={s.product_id}>{s.product?.name} ({s.quantity} available)</option>)}
                  </select>
                  <Input className="w-24" type="number" placeholder="Qty" {...register(`items.${index}.quantity` as const)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ product_id: '', quantity: 1 })}><Plus className="mr-2 h-4 w-4" />Add Item</Button>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={createTransfer.isPending}>Create Transfer</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
