import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  Quote, 
  Settings, 
  LogOut,
  ChevronDown,
  Building2,
  Menu,
  Folder,
  ClipboardList,
  Truck,
  Shield,
  CheckSquare,
  Search,
  MapPin,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Quotations', href: '/quotations', icon: Quote },
  { name: 'Projects', href: '/projects', icon: Folder },
  { name: 'Updates', href: '/updates', icon: ClipboardList },
  { name: 'Team Tasks', href: '/team-tasks', icon: CheckSquare },
  { name: 'Subcontracts', href: '/subcontracts', icon: Shield },
  { name: 'Delivery Challans', href: '/delivery-challans', icon: Truck },
  { name: 'Site Visits', href: '/site-visits', icon: MapPin },
  { name: 'Client Meetings', href: '/client-meetings', icon: Calendar },
  { name: 'Roles & Permissions', href: '/roles', icon: Shield },
  { name: 'Stock Check', href: '/products/stock-check', icon: Search },
]

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, currentOrganization, logout, organizations, switchOrganization } = useAuth()
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {sidebarOpen && (
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="font-bold text-lg">Uni Invoice</span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-2">
          <Link
            to="/settings"
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100",
              location.pathname.startsWith('/settings') && "bg-gray-100"
            )}
          >
            <Settings className="h-5 w-5" />
            {sidebarOpen && <span>Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              {/* Organization Selector */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                  className="flex items-center space-x-2"
                >
                  <Building2 className="h-4 w-4" />
                  <span>{currentOrganization?.name || 'Select Organization'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {showOrgDropdown && organizations.length > 1 && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border py-1 z-50">
                    {organizations.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => {
                          switchOrganization(org)
                          setShowOrgDropdown(false)
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-100",
                          org.id === currentOrganization?.id && "bg-gray-100 font-medium"
                        )}
                      >
                        {org.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
