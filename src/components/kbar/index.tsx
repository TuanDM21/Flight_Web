'use client'

import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from 'kbar'
import { sidebarItems } from '~/configs/layout'
import RenderResults from './render-result'
import useThemeSwitching from './use-theme-switching'

export default function KBar({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  // These action are for the navigation
  const actions = useMemo(() => {
    // Define navigateTo inside the useMemo callback to avoid dependency array issues
    const navigateTo = (url: string) => {
      navigate({ to: url })
    }

    return sidebarItems.flatMap((sidebarItem) => {
      // Only include base action if the navItem has a real URL and is not just a container
      const baseAction =
        sidebarItem.url !== '#'
          ? {
              id: `${sidebarItem.title.toLowerCase()}Action`,
              name: sidebarItem.title,
              shortcut: sidebarItem.shortcut,
              keywords: sidebarItem.title.toLowerCase(),
              section: 'Navigation',
              subtitle: `Go to ${sidebarItem.title}`,
              perform: () => navigateTo(sidebarItem.url),
            }
          : null

      // Map child items into actions
      const childActions =
        sidebarItem.items?.map((childItem) => ({
          id: `${childItem.title.toLowerCase()}Action`,
          name: childItem.title,
          shortcut: childItem.shortcut,
          keywords: childItem.title.toLowerCase(),
          section: sidebarItem.title,
          subtitle: `Go to ${childItem.title}`,
          perform: () => navigateTo(childItem.url),
        })) ?? []

      // Return only valid actions (ignoring null base actions for containers)
      return baseAction ? [baseAction, ...childActions] : childActions
    })
  }, [navigate])

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  )
}
const KBarComponent = ({ children }: { children: React.ReactNode }) => {
  useThemeSwitching()

  return (
    <>
      <KBarPortal>
        <KBarPositioner className='bg-background/80 fixed inset-0 z-99999 p-0! backdrop-blur-sm'>
          <KBarAnimator className='bg-card text-card-foreground relative mt-64! w-full max-w-[600px] -translate-y-12! overflow-hidden rounded-lg border shadow-lg'>
            <div className='bg-card border-border sticky top-0 z-10 border-b'>
              <KBarSearch className='bg-card w-full border-none px-6 py-4 text-lg outline-hidden focus:ring-0 focus:ring-offset-0 focus:outline-hidden' />
            </div>
            <div className='max-h-[400px]'>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  )
}
