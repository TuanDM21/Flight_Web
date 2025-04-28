import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div>
      <h1>Authenticated</h1>
      <p>This is a protected route.</p>
    </div>
  )
}
