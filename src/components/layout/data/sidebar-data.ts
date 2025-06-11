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
  IconUsers,
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
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Documents',
          url: '/documents',
          icon: IconFileTypeDoc,
        },
        {
          title: 'Attachments',
          url: '/attachments',
          icon: IconPaperclip,
          items: [
            {
              title: 'My Attachments',
              url: '/attachments',
            },
            {
              title: 'Shared With Me',
              url: '/attachments/shared-with-me',
            },
          ],
        },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
