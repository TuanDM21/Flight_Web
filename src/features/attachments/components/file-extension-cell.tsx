export function FileExtensionCell({
  fileName,
}: {
  fileName: string | undefined
}) {
  if (!fileName) {
    return <span className='text-muted-foreground'>-</span>
  }

  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  if (!extension) {
    return <span className='text-muted-foreground'>-</span>
  }

  return (
    <span className='inline-flex h-6 min-w-[44px] items-center justify-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 uppercase'>
      {extension}
    </span>
  )
}
