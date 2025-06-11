import { Users } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AttachmentItem } from '../types'
import {
  getBadgeClasses,
  getIconSize,
  getTooltipText,
} from '../utils/attachments'

interface SharedCountCellProps {
  isLoading?: boolean
  attachment?: AttachmentItem
  onViewDetails?: (attachment: AttachmentItem) => void
}

export function SharedCountCell({
  attachment,
  onViewDetails,
}: SharedCountCellProps) {
  const hardcodedSharedCount = attachment?.id ? attachment.id % 6 : 0
  const actualSharedCount = hardcodedSharedCount

  const handleClick = () => {
    if (attachment && onViewDetails && actualSharedCount > 0) {
      onViewDetails(attachment)
    }
  }

  return (
    <div className='flex items-center justify-center'>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            disabled={actualSharedCount === 0}
            className={getBadgeClasses(actualSharedCount)}
            aria-label={getTooltipText(actualSharedCount)}
          >
            <Users className={getIconSize(actualSharedCount)} />
            <span>{actualSharedCount}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side='top' className='font-medium'>
          <p>{getTooltipText(actualSharedCount)}</p>
          {actualSharedCount > 0 && (
            <p className='text-muted-foreground mt-1 text-xs'>
              Click to view details
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
