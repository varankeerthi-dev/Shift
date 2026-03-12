import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Toaster } from '@/components/ui/toaster'
import DashboardLayout from '@/modules/layout/components/DashboardLayout'
import LoginPage from '@/modules/auth/pages/LoginPage'
import RegisterPage from '@/modules/auth/pages/RegisterPage'
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage'
import DashboardPage from '@/modules/dashboard/pages/DashboardPage'
import ClientsPage from '@/modules/clients/pages/ClientsPage'
import ClientFormPage from '@/modules/clients/pages/ClientFormPage'
import ProductsPage from '@/modules/products/pages/ProductsPage'
import ProductFormPage from '@/modules/products/pages/ProductFormPage'
import StockCheckPage from '@/modules/products/pages/StockCheckPage'
import InvoicesPage from '@/modules/invoices/pages/InvoicesPage'
import InvoiceFormPage from '@/modules/invoices/pages/InvoiceFormPage'
import QuotationsPage from '@/modules/quotations/pages/QuotationsPage'
import QuotationFormPage from '@/modules/quotations/pages/QuotationFormPage'
import ProjectsPage from '@/modules/projects/pages/ProjectsPage'
import UpdatesPage from '@/modules/updates/pages/UpdatesPage'
import SubcontractsPage from '@/modules/subcontracts/pages/SubcontractsPage'
import RolesPage from '@/modules/roles/pages/RolesPage'
import TeamTasksPage from '@/modules/team-tasks/pages/TeamTasksPage'
import DeliveryChallansPage from '@/modules/delivery-challans/pages/DeliveryChallansPage'
import SettingsPage from '@/modules/settings/pages/SettingsPage'
import StockTransfersPage from '@/modules/stock-transfer/pages/StockTransfersPage'
import StockSummaryPage from '@/modules/stock-summary/pages/StockSummaryPage'
import SiteVisitsPage from '@/modules/site-visits/pages/SiteVisitsPage'
import SiteVisitFormPage from '@/modules/site-visits/pages/SiteVisitFormPage'
import ClientMeetingsPage from '@/modules/client-meetings/pages/ClientMeetingsPage'
import ClientMeetingFormPage from '@/modules/client-meetings/pages/ClientMeetingFormPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/new" element={<ClientFormPage />} />
          <Route path="clients/:id" element={<ClientFormPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id" element={<ProductFormPage />} />
          <Route path="products/stock-check" element={<StockCheckPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="invoices/new" element={<InvoiceFormPage />} />
          <Route path="invoices/:id" element={<InvoiceFormPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="quotations/new" element={<QuotationFormPage />} />
          <Route path="quotations/:id" element={<QuotationFormPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="updates" element={<UpdatesPage />} />
          <Route path="subcontracts" element={<SubcontractsPage />} />
          <Route path="team-tasks" element={<TeamTasksPage />} />
          <Route path="delivery-challans" element={<DeliveryChallansPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="stock-transfer" element={<StockTransfersPage />} />
          <Route path="stock-summary" element={<StockSummaryPage />} />
          <Route path="site-visits" element={<SiteVisitsPage />} />
          <Route path="site-visits/new" element={<SiteVisitFormPage />} />
          <Route path="site-visits/:id" element={<SiteVisitFormPage />} />
          <Route path="site-visits/:id/edit" element={<SiteVisitFormPage />} />
          <Route path="client-meetings" element={<ClientMeetingsPage />} />
          <Route path="client-meetings/new" element={<ClientMeetingFormPage />} />
          <Route path="client-meetings/:id" element={<ClientMeetingFormPage />} />
          <Route path="client-meetings/:id/edit" element={<ClientMeetingFormPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}
