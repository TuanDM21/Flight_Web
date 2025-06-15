import {
  IconChecklist,
  IconFileTypeDoc,
  IconHelp,
  IconLayoutDashboard,
  IconNotification,
  IconPalette,
  IconPaperclip,
  IconSettings,
  IconTool,
  IconUserCog,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Flight Admin',
    email: 'flight@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  team: {
    name: 'Flight',
    logo: Command,
    plan: 'Flight',
  },
  navGroups: [
    {
      title: 'Tổng quan',
      items: [
        {
          title: 'Bảng điều khiển',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Công việc',
          url: '/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Tài liệu',
          url: '/documents',
          icon: IconFileTypeDoc,
        },
        {
          title: 'Tệp đính kèm',
          url: '/attachments',
          icon: IconPaperclip,
          items: [
            {
              title: 'Tệp của tôi',
              url: '/attachments',
            },
            {
              title: 'Được chia sẻ với tôi',
              url: '/attachments/shared-with-me',
            },
          ],
        },
      ],
    },
    {
      title: 'Khác',
      items: [
        {
          title: 'Cài đặt',
          icon: IconSettings,
          items: [
            {
              title: 'Hồ sơ',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Tài khoản',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Giao diện',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Thông báo',
              url: '/settings/notifications',
              icon: IconNotification,
            },
          ],
        },
        {
          title: 'Trung tâm trợ giúp',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
