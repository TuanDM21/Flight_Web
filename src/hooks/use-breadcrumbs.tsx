'use client'

import { useMemo } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { sidebarItems } from '~/configs/layout'
import { generateRouteMapping } from '~/lib/layout'

export function useBreadcrumbs() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const routeMapping = generateRouteMapping(sidebarItems)

  const breadcrumbs = useMemo(() => {
    if (!pathname) return []

    if (routeMapping[pathname]) {
      return routeMapping[pathname]
    }

    const segments = pathname.split('/').filter(Boolean)
    return segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/')
      return {
        title: decodeURIComponent(
          segment.charAt(0).toUpperCase() + segment.slice(1)
        ),
        link: path,
      }
    })
  }, [pathname, routeMapping])

  return breadcrumbs
}
