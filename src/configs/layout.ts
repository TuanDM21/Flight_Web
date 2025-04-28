import { SidebarNavItem } from '~/types'

export const sidebarItems: SidebarNavItem[] = [
  {
    title: 'Công việc',
    url: '/tasks',
    icon: 'list',
    shortcut: ['w', 'w'],
    isActive: true,
    items: [
      {
        title: 'Danh sách công việc',
        url: '/tasks',
        icon: 'listCheck',
        items: [],
      },
      {
        title: 'Giao việc',
        url: '/tasks/assign',
        icon: 'send',
        items: [],
      },
    ],
  },
]
