import { Dialog as ShadDialog } from '@/components/ui/dialog'
import {
  AppDialogInstance,
  useDialogInstance,
} from '../hooks/use-dialog-instance'

interface DialogProps {
  dialog: AppDialogInstance
  children: React.ReactNode
}

interface DialogComponent extends React.FC<DialogProps> {
  useDialog: typeof useDialogInstance
}

export const AppDialog: DialogComponent = ({ dialog, children }) => {
  const dialogInstance = useDialogInstance(dialog)

  return (
    <ShadDialog
      open={dialogInstance.isOpen}
      onOpenChange={(o) => !o && dialogInstance.close()}
    >
      {children}
    </ShadDialog>
  )
}

AppDialog.useDialog = useDialogInstance
