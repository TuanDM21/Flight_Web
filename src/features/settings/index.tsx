import { Outlet } from '@tanstack/react-router'
import {
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import SidebarNav from './components/sidebar-nav'

export default function Settings() {
  return (
    <>
      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Cài đặt
          </h1>
          <p className='text-muted-foreground'>
            Quản lý cài đặt tài khoản và thiết lập tùy chọn email.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Hồ sơ',
    icon: <IconUser size={18} />,
    href: '/settings',
  },
  {
    title: 'Tài khoản',
    icon: <IconTool size={18} />,
    href: '/settings/account',
  },
  {
    title: 'Giao diện',
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
  {
    title: 'Thông báo',
    icon: <IconNotification size={18} />,
    href: '/settings/notifications',
  },
]
