import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { PencilIcon, UserSearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDocuments } from '../context'
import { DocumentItem } from '../types'

interface DocumentRowActionsProps<TData extends DocumentItem> {
  row: Row<TData>
}

export function DocumentRowActions<TData extends DocumentItem>({
  row,
}: DocumentRowActionsProps<TData>) {
  const document = row.original
  const navigate = useNavigate()
  const { setOpen, setCurrentDocumentId } = useDocuments()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[220px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentDocumentId(document.id!)
          }}
        >
          View attachments
          <DropdownMenuShortcut>
            <UserSearchIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigate({
              to: '/documents/$document-id/edit',
              params: { 'document-id': String(document.id!) },
            })
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <PencilIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentDocumentId(document.id!)
            setOpen('delete')
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <IconTrash />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
