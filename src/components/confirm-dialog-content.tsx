import { cn } from '@/lib/utils'
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogContentProps {
  title: React.ReactNode
  desc: React.JSX.Element | string
  disabled?: boolean
  cancelBtnText?: string
  confirmText?: React.ReactNode
  destructive?: boolean
  handleConfirm: () => void
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}

export function ConfirmDialogContent(props: ConfirmDialogContentProps) {
  const {
    title,
    desc,
    children,
    className,
    confirmText,
    cancelBtnText,
    destructive,
    isLoading,
    disabled = false,
    handleConfirm,
  } = props

  return (
    <AlertDialogContent className={cn(className)}>
      <AlertDialogHeader className='text-left'>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription asChild>{desc}</AlertDialogDescription>
      </AlertDialogHeader>

      {children}

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>
          {cancelBtnText ?? 'Cancel'}
        </AlertDialogCancel>
        <Button
          variant={destructive ? 'destructive' : 'default'}
          onClick={handleConfirm}
          disabled={disabled || isLoading}
        >
          {confirmText ?? 'Continue'}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
