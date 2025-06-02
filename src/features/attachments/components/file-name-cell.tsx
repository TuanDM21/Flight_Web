import { useFileIconType } from '@/hooks/use-file-icon-type'

export function FileNameCell({ fileName }: { fileName: string | undefined }) {
  const { getFileIcon } = useFileIconType()

  return (
    <div className='flex w-full items-center gap-2'>
      {fileName ? getFileIcon(fileName) : <div className='h-4 w-4' />}
      <span className='flex-1 truncate font-medium'>
        {fileName || 'Unknown file'}
      </span>
    </div>
  )
}
