import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FlightsPrimaryButtons() {
  return (
    <div className='flex items-center gap-2'>
      <Link to='/flights/create'>
        <Button size='sm'>
          <Plus className='h-4 w-4' />
          Thêm chuyến bay
        </Button>
      </Link>
    </div>
  )
}
