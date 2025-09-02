'use client'

import { 
  FileText, 
  History, 
  Settings, 
  BarChart3,
  Home,
  FolderOpen,
  Users,
  Shield,
  LogOut,
  User
} from 'lucide-react'
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ToastProvider } from '@/components/ui/toast'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Tổng Quan',
    icon: Home,
    description: 'Thống kê và báo cáo tổng quan'
  },
  {
    id: 'documents',
    label: 'Quản Lý Tài Liệu',
    icon: FileText,
    description: 'Danh sách và quản lý tài liệu'
  },
  {
    id: 'versions',
    label: 'Phiên Bản',
    icon: FolderOpen,
    description: 'Quản lý phiên bản tài liệu'
  },
  {
    id: 'history',
    label: 'Lịch Sử',
    icon: History,
    description: 'Lịch sử thay đổi tài liệu'
  },
  {
    id: 'standards',
    label: 'Tiêu Chuẩn',
    icon: Shield,
    description: 'Quản lý tiêu chuẩn áp dụng'
  },
  {
    id: 'users',
    label: 'Người Dùng',
    icon: Users,
    description: 'Quản lý người dùng hệ thống'
  },
  {
    id: 'reports',
    label: 'Báo Cáo',
    icon: BarChart3,
    description: 'Báo cáo và thống kê'
  },
  {
    id: 'settings',
    label: 'Cài Đặt',
    icon: Settings,
    description: 'Cấu hình hệ thống'
  }
]

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <ToastProvider>
      <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="flex items-center space-x-2 px-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">QL Tài Liệu</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={currentPage === item.id}
                      onClick={() => onPageChange(item.id)}
                      tooltip={item.description}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-sidebar-border" />
            <h1 className="text-lg font-semibold">
              {navigationItems.find(item => item.id === currentPage)?.label || 'Hệ Thống Quản Lý Tài Liệu'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">{user?.department} - {user?.position}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ToastProvider>
  )
}