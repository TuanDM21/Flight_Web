import { z } from 'zod'
import { formatFileSize } from '@/lib/format'
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '@/constants/file'

export const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    (file) => ({
      message: `File "${file.name}" is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`,
    })
  )
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    (file) => ({
      message: `File "${file.name}" has an unsupported format. Allowed formats: ${ACCEPTED_FILE_TYPES.join(', ')}`,
    })
  )
