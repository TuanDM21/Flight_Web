import { LinkProps } from '@tanstack/react-router'

// User information for sidebar
export interface SidebarUser {
  name: string
  email: string
  avatar: string
}

// Team information for sidebar
export interface SidebarTeam {
  name: string
  logo: React.ElementType
  plan: string
}

// Base navigation item with common properties
export interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
}
type Urls = LinkProps['to']

// Navigation item that links to a specific URL
export interface NavLinkItem extends BaseNavItem {
  url: Urls
  items?: never
}

// Sub-navigation item for collapsible sections
export interface NavSubItem extends BaseNavItem {
  url: Urls
}

// Navigation item that can be collapsed/expanded with sub-items
export interface NavCollapsibleItem extends BaseNavItem {
  items: NavSubItem[]
  url?: Urls // Allow optional URL for collapsible items
}

// Union type for all navigation item types
export type NavItem = NavLinkItem | NavCollapsibleItem

// Group of navigation items
export interface NavGroup {
  title: string
  items: NavItem[]
}

// Complete sidebar data structure
export interface SidebarData {
  user: SidebarUser
  team: SidebarTeam
  navGroups: NavGroup[]
}
