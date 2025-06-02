import { Dialog as ShadDialog } from '@/components/ui/dialog'
import {
  AppDialogInstance,
  useDialogInstance,
} from '../hooks/use-dialog-instance'

interface DialogProps {
  dialog: AppDialogInstance
  children: React.ReactNode
  modal?: boolean
}

interface DialogComponent extends React.FC<DialogProps> {
  useDialog: typeof useDialogInstance
}

export const AppDialog: DialogComponent = ({ dialog, children, modal }) => {
  const dialogInstance = useDialogInstance(dialog)

  return (
    <ShadDialog
      open={dialogInstance.isOpen}
      onOpenChange={(o) => !o && dialogInstance.close()}
      modal={modal}
    >
      {children}
    </ShadDialog>
  )
}

AppDialog.useDialog = useDialogInstance
