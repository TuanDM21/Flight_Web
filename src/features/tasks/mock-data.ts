import { Task } from '@/types/task'
import { faker } from '@faker-js/faker'

/**
 * Mock tasks data for development
 */
export const mockTasks: Task[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  content: faker.lorem.sentence(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  created_by: {
    id: faker.number.int({ min: 1, max: 10 }),
    name: faker.person.fullName(),
  },
  assignments: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
    () => {
      const status = faker.helpers.arrayElement([0, 1, 2])
      return {
        recipient_id: faker.number.int({ min: 1, max: 100 }),
        recipient_type: faker.helpers.arrayElement(['user', 'team', 'unit']),
        status,
        assigned_at: faker.date.past().toISOString(),
        due_at: faker.date.future().toISOString(),
        completed_at:
          status === 2 ? faker.date.recent().toISOString() : undefined,
        completed_by:
          status === 2 ? faker.number.int({ min: 1, max: 10 }) : undefined,
      }
    }
  ),
}))
