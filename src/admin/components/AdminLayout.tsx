import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, FileText, Image, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function AdminLayout() {
  const { profile, signOut } = useAuth()

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/articles', icon: FileText, label: 'Articles' },
    { to: '/admin/media', icon: Image, label: 'Media' },
  ]

  return (
    <div className="h-screen flex bg-gray-50 font-display overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-screen sticky top-0">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-brand-red font-bold text-lg tracking-tight">TGIP</h1>
          <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">Admin Portal</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
