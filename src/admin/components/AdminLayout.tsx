import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Image, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function AdminLayout() {
  const { profile, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/articles', icon: FileText, label: 'Articles' },
    { to: '/admin/media', icon: Image, label: 'Media' },
  ]

  // Close sidebar on route change
  const handleNavClick = () => setSidebarOpen(false)

  return (
    <div className="h-screen flex bg-gray-50 font-display overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0
        transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-brand-red font-bold text-lg tracking-tight">TGIP</h1>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">Admin Portal</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-gray-400 hover:text-brand-black md:hidden"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-red text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-brand-black'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="text-sm font-medium text-brand-black mb-1">{profile?.full_name}</div>
          <button onClick={signOut} className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider hover:text-brand-red transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-brand-black"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-brand-red font-bold text-base tracking-tight">TGIP</h1>
        </div>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
