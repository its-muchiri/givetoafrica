import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Megaphone, DollarSign, FileText, Settings,
  Search, Download, Plus, Edit, Trash2, TrendingUp,
  TrendingDown, Eye, MoreHorizontal, Check, X, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'donors', label: 'Donors', icon: Users },
  { id: 'financial', label: 'Financial Reports', icon: DollarSign },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

const recentDonations = [
  { name: 'James Okonkwo', email: 'james@email.com', amount: 250, campaign: 'Education', date: '2026-07-26', status: 'completed' },
  { name: 'Maria Santos', email: 'maria@email.com', amount: 100, campaign: 'Clean Water', date: '2026-07-26', status: 'completed' },
  { name: 'David Chen', email: 'david@email.com', amount: 500, campaign: 'Healthcare', date: '2026-07-25', status: 'completed' },
  { name: 'Amina Bello', email: 'amina@email.com', amount: 75, campaign: 'Food Security', date: '2026-07-25', status: 'pending' },
  { name: 'Sarah Johnson', email: 'sarah@email.com', amount: 1000, campaign: 'General Fund', date: '2026-07-24', status: 'completed' },
]

const campaigns = [
  { title: 'Build a School in Tanzania', goal: 200000, raised: 127500, status: 'active', donors: 1847 },
  { title: 'Clean Water for Rural Kenya', goal: 150000, raised: 98000, status: 'active', donors: 1203 },
  { title: 'Healthcare Clinic Lagos', goal: 100000, raised: 100000, status: 'completed', donors: 892 },
  { title: 'Food Security in Ghana', goal: 75000, raised: 32000, status: 'active', donors: 456 },
  { title: 'Emergency Relief Sudan', goal: 300000, raised: 185000, status: 'active', donors: 2341 },
]

const donors = [
  { name: 'James Okonkwo', email: 'james@email.com', total: 4250, lastDonation: '2026-07-26', status: 'active' },
  { name: 'Sarah Johnson', email: 'sarah@email.com', total: 8900, lastDonation: '2026-07-24', status: 'active' },
  { name: 'Maria Santos', email: 'maria@email.com', total: 1200, lastDonation: '2026-07-26', status: 'active' },
  { name: 'David Chen', email: 'david@email.com', total: 6500, lastDonation: '2026-07-25', status: 'recurring' },
  { name: 'Amina Bello', email: 'amina@email.com', total: 750, lastDonation: '2026-07-25', status: 'inactive' },
]

const blogPosts = [
  { title: 'How Your Donations Built 12 Schools in 2025', status: 'published', date: '2026-07-20' },
  { title: 'Meet Grace: A Story of Transformation', status: 'published', date: '2026-07-15' },
  { title: 'Q2 2026 Impact Report', status: 'draft', date: '2026-07-10' },
  { title: 'Clean Water Initiative: Year in Review', status: 'published', date: '2026-06-28' },
]

const monthlyRevenue = [
  { month: 'Jan', amount: 32000 },
  { month: 'Feb', amount: 28000 },
  { month: 'Mar', amount: 41000 },
  { month: 'Apr', amount: 35000 },
  { month: 'May', amount: 39000 },
  { month: 'Jun', amount: 44000 },
  { month: 'Jul', amount: 47500 },
]

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.amount))

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [donorSearch, setDonorSearch] = useState('')
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [googleConfigured, setGoogleConfigured] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      navigate('/admin/login')
      return
    }
    try {
      const parsed = JSON.parse(session)
      if (parsed.role !== 'admin') {
        navigate('/admin/login')
        return
      }
      setAdminUser(parsed.user)
    } catch {
      navigate('/admin/login')
    }
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('admin_session')
    navigate('/admin/login')
  }

  useEffect(() => {
    fetch('/api/search-console/status')
      .then((r) => r.json())
      .then((data) => setGoogleConfigured(data.configured))
      .catch(() => setGoogleConfigured(false))
  }, [])

  async function handleNotifyGoogle() {
    setGoogleSubmitting(true)
    try {
      const res = await fetch('/api/search-console/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://givetoafrica.net/blog' }),
      })
      const data = await res.json()
      if (data.ok) {
        alert(`Submitted ${data.submitted} URL(s) to Google for indexing`)
      } else {
        alert(`Failed: ${data.error}`)
      }
    } catch {
      alert('Failed to submit URLs to Google')
    } finally {
      setGoogleSubmitting(false)
    }
  }

  const filteredDonors = donors.filter(
    (d) => d.name.toLowerCase().includes(donorSearch.toLowerCase()) || d.email.toLowerCase().includes(donorSearch.toLowerCase())
  )

  if (!adminUser) return null

  return (
    <div className="flex min-h-screen bg-parchment">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-ink/12 bg-white lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-ink/8 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ochre-dark text-sm font-bold text-white">
            GF
          </div>
          <span className="font-display text-sm font-bold text-ink">Admin Panel</span>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                activeTab === item.id
                  ? 'bg-ochre/5 text-ochre-dark ring-1 ring-ochre/8'
                  : 'text-ink-soft hover:bg-parchment hover:text-ink'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-ink/8 p-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ochre/10 text-xs font-bold text-ochre-dark">
              {adminUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{adminUser.name}</p>
              <p className="text-xs text-ink-soft truncate">{adminUser.email}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 text-ink-soft hover:text-red-500 transition-colors" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-2 border-b border-ink/12 bg-white px-4 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ochre text-sm font-bold text-white">
          GF
        </div>
        <span className="font-display text-sm font-bold text-ink">Admin</span>
        <div className="ml-auto flex gap-1">
          {sidebarItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'rounded-lg p-2 transition-all',
                activeTab === item.id
                  ? 'bg-ochre/5 text-ochre-dark'
                  : 'text-ink-soft hover:text-ink-soft'
              )}
            >
              <item.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="font-display text-2xl font-medium text-ink">Dashboard</h1>
              <p className="mt-1 text-sm text-ink-soft">Overview of your platform performance.</p>

              {/* KPI Cards */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Total Raised This Month', value: '$47,500', change: '+12%', up: true, icon: DollarSign, color: 'text-savanna bg-savanna/5' },
                    { label: 'New Donors', value: '234', change: '+8%', up: true, icon: Users, color: 'text-ochre-dark bg-ochre/5' },
                    { label: 'Active Campaigns', value: '5', change: '0', up: true, icon: Megaphone, color: 'text-ochre-dark bg-ochre/5' },
                  { label: 'Donor Retention', value: '68%', change: '-2%', up: false, icon: TrendingUp, color: 'text-ink-soft bg-parchment' },
                ].map((kpi) => (
                  <div key={kpi.label} className="card">
                    <div className="flex items-start justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.color}`}>
                        <kpi.icon className="h-5 w-5" />
                      </div>
                      <span className={cn(
                        'flex items-center gap-1 text-xs font-semibold',
                        kpi.up ? 'text-savanna' : 'text-red-500'
                      )}>
                        {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {kpi.change}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="font-display text-2xl font-medium text-ink">{kpi.value}</div>
                      <div className="text-xs text-ink-soft">{kpi.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Donations */}
              <div className="mt-8 card overflow-hidden p-0">
                <div className="border-b border-ink/8 px-6 py-4">
                  <h2 className="font-display text-lg font-medium text-ink">Recent Donations</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink/8 bg-parchment/50">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Donor</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Campaign</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/8">
                      {recentDonations.map((d, i) => (
                        <tr key={i} className="hover:bg-parchment/50 transition-colors">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ochre/5 text-xs font-bold text-ochre-dark">
                                {d.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-ink">{d.name}</div>
                                <div className="text-xs text-ink-soft">{d.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-ink">${d.amount}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-ink-soft">{d.campaign}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-ink-soft">{d.date}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
                              d.status === 'completed'
                                ? 'bg-savanna/5 text-savanna-dark ring-savanna/8'
                                : 'bg-ochre/5 text-ochre-dark ring-ochre/8'
                            )}>
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Campaign Progress */}
              <div className="mt-8 card">
                <h2 className="font-display text-lg font-medium text-ink">Campaign Progress</h2>
                <div className="mt-4 space-y-4">
                  {campaigns.filter((c) => c.status === 'active').map((c) => {
                    const progress = Math.round((c.raised / c.goal) * 100)
                    return (
                      <div key={c.title}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-ink-soft">{c.title}</span>
                          <span className="text-xs text-ink-soft">{progress}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/8">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-ochre-light to-ochre transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-ink-soft">
                          <span>${(c.raised / 1000).toFixed(0)}K raised</span>
                          <span>Goal: ${(c.goal / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-medium text-ink">Campaigns</h1>
                  <p className="mt-1 text-sm text-ink-soft">Manage your fundraising campaigns.</p>
                </div>
                <button className="btn-primary">
                  <Plus className="h-4 w-4" />
                  Create Campaign
                </button>
              </div>

              <div className="mt-6 card overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink/8 bg-parchment/50">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Campaign</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Goal</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Raised</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/8">
                      {campaigns.map((c, i) => {
                        const progress = Math.round((c.raised / c.goal) * 100)
                        return (
                          <tr key={i} className="hover:bg-parchment/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-ink">{c.title}</div>
                              <div className="text-xs text-ink-soft">{c.donors} donors</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-ink-soft">${c.goal.toLocaleString()}</td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="font-medium text-ink">${c.raised.toLocaleString()}</div>
                              <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-ink/8">
                                <div
                                  className={cn(
                                    'h-full rounded-full',
                                     c.status === 'completed' ? 'bg-savanna' : 'bg-ochre-dark'
                                  )}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <span className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
                                c.status === 'active'
                                  ? 'bg-savanna/5 text-savanna-dark ring-savanna/8'
                                  : 'bg-ink/8 text-ink-soft ring-ink/12'
                              )}>
                                {c.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="flex items-center gap-1">
                                <button className="rounded-lg p-1.5 text-ink-soft hover:bg-ink/8 hover:text-ink-soft">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="rounded-lg p-1.5 text-ink-soft hover:bg-ink/8 hover:text-ink-soft">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Donors Tab */}
          {activeTab === 'donors' && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-medium text-ink">Donors</h1>
                  <p className="mt-1 text-sm text-ink-soft">View and manage your donor base.</p>
                </div>
                <button className="btn-outline">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>

              <div className="relative mt-6">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  type="text"
                  placeholder="Search donors by name or email..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              <div className="mt-4 card overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink/8 bg-parchment/50">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Donor</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Total Donated</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Last Donation</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/8">
                      {filteredDonors.map((d, i) => (
                        <tr key={i} className="hover:bg-parchment/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ochre/5 text-xs font-bold text-ochre-dark">
                                {d.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-ink">{d.name}</div>
                                <div className="text-xs text-ink-soft">{d.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold text-ink">${d.total.toLocaleString()}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-ink-soft">{d.lastDonation}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
                              d.status === 'active' && 'bg-savanna/5 text-savanna-dark ring-savanna/8',
                              d.status === 'recurring' && 'bg-ochre/5 text-ochre-dark ring-ochre/8',
                              d.status === 'inactive' && 'bg-ink/8 text-ink-soft ring-ink/12'
                            )}>
                              {d.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <button className="rounded-lg p-1.5 text-ink-soft hover:bg-ink/8 hover:text-ink-soft">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Financial Reports Tab */}
          {activeTab === 'financial' && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-medium text-ink">Financial Reports</h1>
                  <p className="mt-1 text-sm text-ink-soft">Revenue overview and financial summaries.</p>
                </div>
                <button className="btn-outline">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>

              {/* Monthly Revenue Chart */}
              <div className="mt-6 card">
                <h2 className="font-display text-lg font-medium text-ink">Monthly Revenue</h2>
                <div className="mt-6 flex items-end gap-3 h-48">
                  {monthlyRevenue.map((m) => {
                    const height = (m.amount / maxRevenue) * 100
                    return (
                      <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                        <span className="text-xs font-semibold text-ink-soft">${(m.amount / 1000).toFixed(0)}K</span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-ochre to-ochre-light transition-all duration-500"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-ink-soft">{m.month}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Income vs Expenses */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-savanna/5 text-savanna">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-ink-soft">Total Income</div>
                      <div className="font-display text-xl font-bold text-ink">$266,500</div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-ink-soft">Total Expenses</div>
                      <div className="font-display text-xl font-bold text-ink">$42,640</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-ink-soft">Net Revenue</div>
                    <div className="font-display text-2xl font-medium text-savanna">$223,860</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-ink-soft">Program Allocation</div>
                    <div className="font-display text-2xl font-medium text-ink">84%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-medium text-ink">Content</h1>
                  <p className="mt-1 text-sm text-ink-soft">Manage blog posts and updates.</p>
                </div>
                <button className="btn-primary">
                  <Plus className="h-4 w-4" />
                  New Post
                </button>
              </div>

              {/* Google Search Console */}
              <div className="mt-6 card">
                <h2 className="font-display text-lg font-medium text-ink">Google Search Console</h2>
                <p className="mt-1 text-sm text-ink-soft">Auto-submit new blog posts for indexing.</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className={cn(
                    'inline-flex h-2 w-2 rounded-full',
                    googleConfigured ? 'bg-savanna' : 'bg-red-500'
                  )} />
                  <span className="text-sm text-ink-soft">
                    {googleConfigured ? 'API configured — posts auto-submitted on build' : 'API not configured — add GOOGLE_INDEXING_API_CLIENT_EMAIL and GOOGLE_INDEXING_API_PRIVATE_KEY'}
                  </span>
                </div>
  <button className="mt-3 btn-secondary text-sm" disabled={googleSubmitting} onClick={handleNotifyGoogle}>
    Resubmit All Blog Posts
  </button>
              </div>

              <div className="mt-6 card overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink/8 bg-parchment/50">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/8">
                      {blogPosts.map((post, i) => (
                        <tr key={i} className="hover:bg-parchment/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-ink">{post.title}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
                              post.status === 'published'
                                ? 'bg-savanna/5 text-savanna-dark ring-savanna/8'
                                : 'bg-ochre/5 text-ochre-dark ring-ochre/8'
                            )}>
                              {post.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-ink-soft">{post.date}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button className="rounded-lg p-1.5 text-ink-soft hover:bg-ink/8 hover:text-ink-soft">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h1 className="font-display text-2xl font-medium text-ink">Settings</h1>
              <p className="mt-1 text-sm text-ink-soft">Manage your admin profile and platform settings.</p>

              {/* Admin Profile */}
              <div className="mt-6 card">
                <h2 className="font-display text-lg font-medium text-ink">Admin Profile</h2>
                <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-text">Full Name</label>
                      <input type="text" defaultValue="Admin User" className="input-field" />
                    </div>
                    <div>
                      <label className="label-text">Email</label>
                      <input type="email" defaultValue="admin@givetoafrica.net" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="label-text">Role</label>
                    <input type="text" defaultValue="Super Admin" disabled className="input-field bg-parchment text-ink-soft" />
                  </div>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>

              {/* Payment Providers */}
              <div className="mt-6 card">
                <h2 className="font-display text-lg font-medium text-ink">Payment Providers</h2>
                <p className="mt-1 text-sm text-ink-soft">Status of connected payment gateways.</p>
                <div className="mt-4 space-y-3">
                  {[
                    { name: 'Stripe', status: 'connected', desc: 'Cards, Apple Pay, Google Pay' },
                    { name: 'PayPal', status: 'connected', desc: 'PayPal balance, cards, Venmo' },
                    { name: 'NOWPayments', status: 'connected', desc: 'Cryptocurrency (BTC, ETH, USDT)' },
                    { name: 'Bank Wire', status: 'connected', desc: 'Manual wire transfers' },
                  ].map((provider) => (
                    <div key={provider.name} className="flex items-center justify-between rounded-xl border border-ink/8 p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg',
                               provider.status === 'connected' ? 'bg-savanna/5 text-savanna' : 'bg-ink/8 text-ink-soft'
                        )}>
                          {provider.status === 'connected' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-ink">{provider.name}</div>
                          <div className="text-xs text-ink-soft">{provider.desc}</div>
                        </div>
                      </div>
                      <span className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
                        provider.status === 'connected'
                          ? 'bg-savanna/5 text-savanna-dark ring-savanna/8'
                          : 'bg-ink/8 text-ink-soft ring-ink/12'
                      )}>
                        {provider.status === 'connected' ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
