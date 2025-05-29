import { useNavigate } from '@tanstack/react-router'
import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export function TasksPrimaryButtons() {
  const navigate = useNavigate()

  return (
    <div className='flex gap-2'>
      <Button variant='outline' className='space-x-1'>
        <span>Import</span> <IconDownload size={18} />
      </Button>
      <Button
        className='space-x-1'
        onClick={() => {
          void navigate({ to: '/tasks/create' })
        }}
      >
        <span>Create</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
