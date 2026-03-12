import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, FileText, Send, MoreHorizontal, Trash2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useQuotations, useDeleteQuotation, useSendQuotation, useConvertToInvoice } from '@/modules/quotations/hooks/useQuotations'
import { formatDate, formatCurrency } from '@/lib/utils'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  viewed: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-orange-100 text-orange-800',
  converted: 'bg-purple-100 text-purple-800',
}

export default function QuotationsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const deleteQuotation = useDeleteQuotation()
  const sendQuotation = useSendQuotation()
  const convertToInvoice = useConvertToInvoice()

  const { data, isLoading } = useQuotations({ 
    search: search || undefined, 
    status: status || undefined,
    per_page: 10,
    page 
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      try {
        await deleteQuotation.mutateAsync(id)
      } catch (error) {
        // Error handled in mutation
      }
    }
  }

  const handleSend = async (id: string) => {
    try {
      await sendQuotation.mutateAsync(id)
    } catch (error) {
      // Error handled in mutation
    }
  }

  const handleConvert = async (id: string) => {
    try {
      const result = await convertToInvoice.mutateAsync(id)
      navigate(`/invoices/${result.invoice_id}`)
    } catch (error) {
      // Error handled in mutation
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotations</h1>
          <p className="text-muted-foreground">Manage your quotations</p>
        </div>
        <Button asChild>
          <Link to="/quotations/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Quotation
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Quotations</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search quotations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium">{quotation.quotation_number}</TableCell>
                      <TableCell>{quotation.client?.name || '-'}</TableCell>
                      <TableCell>{formatDate(quotation.issue_date)}</TableCell>
                      <TableCell>{formatDate(quotation.valid_until)}</TableCell>
                      <TableCell>{formatCurrency(quotation.total)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[quotation.status]}`}>
                          {quotation.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/quotations/${quotation.id}`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            {quotation.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handleSend(quotation.id)}>
                                <Send className="mr-2 h-4 w-4" />
                                Send
                              </DropdownMenuItem>
                            )}
                            {(quotation.status === 'accepted' || quotation.status === 'sent') && (
                              <DropdownMenuItem onClick={() => handleConvert(quotation.id)}>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Convert to Invoice
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(quotation.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data?.data?.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 gap-4 text-muted-foreground">
                  <FileText className="h-8 w-8" />
                  <p>No quotations found</p>
                </div>
              )}

              {data && data.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {((data.current_page - 1) * data.per_page) + 1} to{' '}
                    {Math.min(data.current_page * data.per_page, data.total)} of{' '}
                    {data.total} results
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === data.last_page}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
