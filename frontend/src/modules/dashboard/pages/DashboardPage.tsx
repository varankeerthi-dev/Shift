import { Users, Package, FileText, Quote, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard'

const stats = [
  {
    title: 'Total Clients',
    key: 'total_clients',
    icon: Users,
    color: 'text-blue-500',
  },
  {
    title: 'Total Products',
    key: 'total_products',
    icon: Package,
    color: 'text-green-500',
  },
  {
    title: 'Total Invoices',
    key: 'total_invoices',
    icon: FileText,
    color: 'text-purple-500',
  },
  {
    title: 'Total Quotations',
    key: 'total_quotations',
    icon: Quote,
    color: 'text-orange-500',
  },
  {
    title: 'Total Revenue',
    key: 'total_revenue',
    icon: DollarSign,
    color: 'text-emerald-500',
    isCurrency: true,
  },
  {
    title: 'Pending Amount',
    key: 'pending_amount',
    icon: TrendingUp,
    color: 'text-red-500',
    isCurrency: true,
  },
]

export default function DashboardPage() {
  const { data, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.isCurrency 
                  ? `$${(data?.[stat.key as keyof typeof data] as number || 0).toLocaleString()}`
                  : (data?.[stat.key as keyof typeof data] as number || 0).toLocaleString()
                }
              </div>
              <p className="text-xs text-muted-foreground">
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Monthly revenue for the current year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {data?.monthly_revenue && data.monthly_revenue.length > 0 ? (
              <RevenueChart data={data.monthly_revenue} />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No revenue data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoices by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices by Status</CardTitle>
          <CardDescription>
            Current invoice status distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data?.invoices_by_status?.map((item) => (
              <div key={item.status} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium capitalize">{item.status}</p>
                  <p className="text-2xl font-bold">{item.count}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function RevenueChart({ data }: { data: Array<{ month: string; revenue: number }> }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="month" 
          className="text-xs"
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          className="text-xs"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
        />
        <Bar 
          dataKey="revenue" 
          fill="hsl(221.2 83.2% 53.3%)" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

function FileText({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}
