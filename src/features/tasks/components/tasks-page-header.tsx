import { TasksPrimaryButtons } from './tasks-primary-buttons'

export function TasksPageHeader() {
  return (
    <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
        <p className='text-muted-foreground'>
          Here&apos;s a list of your tasks for this month!
        </p>
      </div>
      <TasksPrimaryButtons />
    </div>
  )
}
