import { Search } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { Input } from '@/components/ui/input'

interface FlightSearchInputProps {
  isFiltering?: boolean
}

export function FlightSearchInput({ isFiltering }: FlightSearchInputProps) {
  const [queryFilter, setQueryFilter] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  return (
    <div className='flex items-center gap-2'>
      <Search
        className={`absolute top-2.5 left-2 h-4 w-4 ${isFiltering ? 'text-primary' : 'text-muted-foreground'}`}
      />
      <Input
        placeholder='Tìm kiếm chuyến bay...'
        className={`w-full pl-4 ${isFiltering ? 'border-primary' : ''}`}
        value={queryFilter}
        onChange={(e) => setQueryFilter(e.target.value)}
      />
    </div>
  )
}
