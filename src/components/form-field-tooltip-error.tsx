import { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface FormFieldTooltipErrorProps {
  /**
   * The children to use as the tooltip trigger
   */
  children: ReactNode
  /**
   * Custom error message to display
   */
  message: string
  /**
   * Whether to show the error or not
   */
  showError: boolean
}

/**
 * A component that displays form field validation errors as a tooltip
 */
export function FormFieldTooltipError({
  children,
  message,
  showError,
}: FormFieldTooltipErrorProps) {
  const errorMessage = message
  const shouldShowError = showError

  if (!shouldShowError || !errorMessage) {
    return children
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{errorMessage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
