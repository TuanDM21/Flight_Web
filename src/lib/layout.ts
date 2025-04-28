import { SidebarNavItem } from '~/types'

export type BreadcrumbItem = {
  title: string
  link: string
}

export function generateRouteMapping(
  navItems: SidebarNavItem[]
): Record<string, BreadcrumbItem[]> {
  const mapping: Record<string, BreadcrumbItem[]> = {}

  const traverse = (items: SidebarNavItem[], trail: BreadcrumbItem[] = []) => {
    for (const item of items) {
      const newTrail = [...trail, { title: item.title, link: item.url }]
      mapping[item.url] = newTrail
      if (item.items?.length) {
        traverse(item.items, newTrail)
      }
    }
  }

  traverse(navItems)
  return mapping
}
