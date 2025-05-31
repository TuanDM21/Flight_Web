import {
  AppDialogInstance,
  useDialogInstance,
} from '../hooks/use-dialog-instance'
import { AlertDialog } from './ui/alert-dialog'

interface ConfirmDialogProps {
  dialog?: AppDialogInstance
  children?: React.ReactNode
}

export const AppConfirmDialog = ({ dialog, children }: ConfirmDialogProps) => {
  const dialogInstance = useDialogInstance(dialog)

  return (
    <AlertDialog
      open={dialogInstance.isOpen}
      onOpenChange={(o) => !o && dialogInstance.close()}
    >
      {children}
    </AlertDialog>
  )
}
AppConfirmDialog.useDialog = useDialogInstance
