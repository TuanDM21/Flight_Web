import { Sheet as ShadSheet } from '@/components/ui/sheet'
import {
  AppDialogInstance,
  useDialogInstance,
} from '../hooks/use-dialog-instance'

interface SheetProps {
  dialog?: AppDialogInstance
  children?: React.ReactNode
}

export const AppSheet = ({ dialog, children }: SheetProps) => {
  const dialogInstance = useDialogInstance(dialog)

  return (
    <ShadSheet
      open={dialogInstance.isOpen}
      onOpenChange={(o) => !o && dialogInstance.close()}
    >
      {children}
    </ShadSheet>
  )
}

AppSheet.useDialog = useDialogInstance
