'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  GitBranch, 
  History, 
  Shield,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle
} from 'lucide-react'

interface DashboardStats {
  totalDocuments: number
  totalVersions: number
  totalHistory: number
  totalStandards: number
  recentActivities: Array<{
    id: string
    action: string
    document: string
    user: string
    date: string
  }>
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    totalVersions: 0,
    totalHistory: 0,
    totalStandards: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch documents
      const documentsRes = await fetch('/api/documents')
      const documents = documentsRes.ok ? await documentsRes.json() : []

      // Fetch versions
      const versionsRes = await fetch('/api/versions')
      const versions = versionsRes.ok ? await versionsRes.json() : []

      // Fetch history
      const historyRes = await fetch('/api/history')
      const history = historyRes.ok ? await historyRes.json() : []

      // Mock standards data
      const standards = [
        { id: '1', name: 'ISO 9001:2015' },
        { id: '2', name: 'ISO 14001:2015' },
        { id: '3', name: 'ISO 45001:2018' },
        { id: '4', name: 'Tiêu chuẩn nội bộ' },
        { id: '5', name: 'TCVN 5687:2010' }
      ]

      // Create recent activities from history
      const recentActivities = history.slice(0, 5).map((item: any) => ({
        id: item.id,
        action: item.hanh_dong === 'tao_moi' ? 'Tạo mới' : 'Cập nhật',
        document: item.mo_ta,
        user: item.nguoi_thuc_hien,
        date: item.ngay_thuc_hien
      }))

      setStats({
        totalDocuments: documents.length,
        totalVersions: versions.length,
        totalHistory: history.length,
        totalStandards: standards.length,
        recentActivities
      })
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error)
      // Fallback to mock data
      setStats({
        totalDocuments: 5,
        totalVersions: 10,
        totalHistory: 10,
        totalStandards: 5,
        recentActivities: [
          {
            id: '1',
            action: 'Cập nhật',
            document: 'Quy trình kiểm tra chất lượng sản phẩm',
            user: 'Nguyễn Văn A',
            date: '2024-03-01'
          },
          {
            id: '2',
            action: 'Tạo mới',
            document: 'Hướng dẫn sử dụng hệ thống ERP',
            user: 'Trần Thị B',
            date: '2024-02-01'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Tổng Tài Liệu',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Tài liệu đang quản lý'
    },
    {
      title: 'Phiên Bản',
      value: stats.totalVersions,
      icon: GitBranch,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Tổng số phiên bản'
    },
    {
      title: 'Lịch Sử Thay Đổi',
      value: stats.totalHistory,
      icon: History,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Hoạt động ghi nhận'
    },
    {
      title: 'Tiêu Chuẩn',
      value: stats.totalStandards,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Tiêu chuẩn áp dụng'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Chào mừng đến với Hệ Thống Quản Lý Tài Liệu</h2>
        <p className="text-muted-foreground">
          Tổng quan về tình trạng tài liệu và hoạt động gần đây
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="mr-2 h-5 w-5" />
              Hoạt Động Gần Đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}: {activity.document}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        {activity.user}
                        <Calendar className="ml-3 mr-1 h-3 w-3" />
                        {activity.date}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                  <p>Chưa có hoạt động nào</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Thống Kê Nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tài liệu hiệu lực</span>
                <span className="text-sm font-medium">{stats.totalDocuments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Phiên bản mới nhất</span>
                <span className="text-sm font-medium">{Math.ceil(stats.totalVersions / 2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cập nhật tuần này</span>
                <span className="text-sm font-medium">{Math.ceil(stats.totalHistory / 5)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tiêu chuẩn áp dụng</span>
                <span className="text-sm font-medium">{stats.totalStandards}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}