'use client'

import * as React from 'react'
import type {
  DialogComponent,
  OpenDialog,
  OpenDialogOptions,
  CloseDialog,
} from '@/hooks/use-dialogs'
import useEventCallback from '@/hooks/use-event-callback'

export const DialogsContext = React.createContext<{
  open: OpenDialog
  close: CloseDialog
  closeAll: () => void
} | null>(null)

interface DialogStackEntry<P, R> {
  key: string
  open: boolean
  promise: Promise<R>
  Component: DialogComponent<P, R>
  payload: P
  onClose: (result: R) => Promise<void>
  resolve: (result: R) => void
}

export interface DialogProviderProps {
  children?: React.ReactNode
  unmountAfter?: number
}

/**
 * Provider for Dialog stacks. The subtree of this component can use the `useDialogs` hook to
 * access the dialogs API. The dialogs are rendered in the order they are requested.
 *
 * Demos:
 *
 * - [useDialogs](https://mui.com/toolpad/core/react-use-dialogs/)
 *
 * API:
 *
 * - [DialogsProvider API](https://mui.com/toolpad/core/api/dialogs-provider)
 */
function DialogsProvider(props: DialogProviderProps) {
  const { children, unmountAfter = 1000 } = props
  const [stack, setStack] = React.useState<DialogStackEntry<any, any>[]>([])
  const keyPrefix = React.useId()
  const nextId = React.useRef(0)
  const dialogMetadata = React.useRef(
    new WeakMap<Promise<any>, DialogStackEntry<any, any>>()
  )

  const requestDialog = useEventCallback(function open<P, R>(
    Component: DialogComponent<P, R>,
    payload: P,
    options: OpenDialogOptions<R> = {}
  ): Promise<R> {
    const { onClose = async () => {} } = options
    let resolve: ((result: R) => void) | undefined
    const promise = new Promise<R>((resolveImpl) => {
      resolve = resolveImpl
    })
    if (!resolve) {
      throw new Error('resolve function is not defined')
    }

    const key = `${keyPrefix}-${nextId.current}`
    nextId.current += 1

    const newEntry: DialogStackEntry<P, R> = {
      key,
      open: true,
      promise,
      Component,
      payload,
      onClose,
      resolve,
    }

    // Store metadata for reliable access during close
    dialogMetadata.current.set(promise, newEntry)

    setStack((prevStack) => [...prevStack, newEntry])
    return promise
  })

  const closeDialogUi = useEventCallback(function closeDialogUi<R>(
    dialog: Promise<R>
  ) {
    setStack((prevStack) =>
      prevStack.map((entry) =>
        entry.promise === dialog ? { ...entry, open: false } : entry
      )
    )
    setTimeout(() => {
      // wait for closing animation
      setStack((prevStack) =>
        prevStack.filter((entry) => entry.promise !== dialog)
      )
      // WeakMap automatically cleans up when promise is garbage collected
    }, unmountAfter)
  })

  const closeDialog = useEventCallback(async function closeDialog<R>(
    dialog: Promise<R>,
    result: R
  ) {
    const entryToClose = dialogMetadata.current.get(dialog)
    if (!entryToClose) {
      throw new Error('dialog not found')
    }

    try {
      await entryToClose.onClose(result)
    } finally {
      entryToClose.resolve(result)
      closeDialogUi(dialog)
    }
    return dialog
  })

  const closeAllDialogs = useEventCallback(function closeAllDialogs() {
    const currentStack = [...stack]
    currentStack.forEach((entry) => {
      entry.resolve(undefined)
      closeDialogUi(entry.promise)
    })
  })

  const contextValue = React.useMemo(
    () => ({
      open: requestDialog as OpenDialog,
      close: closeDialog,
      closeAll: closeAllDialogs,
    }),
    [requestDialog, closeDialog, closeAllDialogs]
  )

  return (
    <DialogsContext.Provider value={contextValue}>
      {children}
      {stack.map(({ key, open, Component, payload, promise }) => (
        <Component
          key={key}
          payload={payload}
          open={open}
          onClose={async (result) => {
            await closeDialog(promise, result)
          }}
        />
      ))}
    </DialogsContext.Provider>
  )
}

export { DialogsProvider }
